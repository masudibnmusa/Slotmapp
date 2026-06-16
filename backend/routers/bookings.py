from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc
from typing import List
from database import get_db
from models import Booking, Classroom, User
from schemas import BookingRequest, BookingResponse, MyBookingResponse
from dependencies import get_current_user, require_admin

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def book_slot(
    request: BookingRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    day_index = days.index(request.day)
    
    # Check room exists
    result = await db.execute(select(Classroom).where(Classroom.id == request.room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Check if already booked (latest action is 'B')
    booking_result = await db.execute(
        select(Booking).where(
            and_(
                Booking.room_id == request.room_id,
                Booking.day_of_week == day_index,
                Booking.hour == request.hour
            )
        ).order_by(desc(Booking.created_at)).limit(1)
    )
    latest = booking_result.scalar_one_or_none()
    
    if latest and latest.action == 'B':
        # Get booker username
        user_result = await db.execute(select(User).where(User.id == latest.user_id))
        booker = user_result.scalar_one_or_none()
        raise HTTPException(
            status_code=409,
            detail=f"Slot already booked by {booker.username if booker else 'unknown'}"
        )
    
    # Create booking
    new_booking = Booking(
        room_id=request.room_id,
        day_of_week=day_index,
        hour=request.hour,
        user_id=current_user.id,
        action='B'
    )
    db.add(new_booking)
    await db.commit()
    
    return {
        "message": "Booking successful",
        "room_id": request.room_id,
        "day": request.day,
        "hour": request.hour,
        "floor": request.room_id // 100
    }


@router.delete("/{room_id}")
async def cancel_booking(
    room_id: int,
    day: str,
    hour: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    if day not in days:
        raise HTTPException(status_code=400, detail="Invalid day")
    
    day_index = days.index(day)
    
    # Check room exists
    result = await db.execute(select(Classroom).where(Classroom.id == room_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Check if slot is booked
    booking_result = await db.execute(
        select(Booking).where(
            and_(
                Booking.room_id == room_id,
                Booking.day_of_week == day_index,
                Booking.hour == hour
            )
        ).order_by(desc(Booking.created_at)).limit(1)
    )
    latest = booking_result.scalar_one_or_none()
    
    if not latest or latest.action != 'B':
        raise HTTPException(status_code=400, detail="Slot is not currently booked")
    
    # Check ownership (admin can cancel any)
    if not current_user.is_admin:
        if latest.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only cancel your own bookings")
    
    # Create cancellation record
    cancel_record = Booking(
        room_id=room_id,
        day_of_week=day_index,
        hour=hour,
        user_id=current_user.id,
        action='C'
    )
    db.add(cancel_record)
    await db.commit()
    
    return {"message": "Cancellation successful"}


@router.get("/me", response_model=List[MyBookingResponse])
async def my_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all active bookings (latest action is 'B') for this user
    from sqlalchemy import func
    
    # Subquery: find latest booking id per slot
    subq = select(
        Booking.room_id,
        Booking.day_of_week,
        Booking.hour,
        func.max(Booking.created_at).label("max_created")
    ).group_by(
        Booking.room_id,
        Booking.day_of_week,
        Booking.hour
    ).subquery()
    
    # Get bookings where latest action is 'B' and user is the booker
    result = await db.execute(
        select(Booking).join(
            subq,
            and_(
                Booking.room_id == subq.c.room_id,
                Booking.day_of_week == subq.c.day_of_week,
                Booking.hour == subq.c.hour,
                Booking.created_at == subq.c.max_created
            )
        ).where(
            and_(
                Booking.action == 'B',
                Booking.user_id == current_user.id
            )
        )
    )
    
    bookings = result.scalars().all()
    
    # Get room details
    responses = []
    for booking in bookings:
        room_result = await db.execute(
            select(Classroom).where(Classroom.id == booking.room_id)
        )
        room = room_result.scalar_one_or_none()
        
        responses.append(MyBookingResponse(
            id=booking.id,
            room_id=booking.room_id,
            day=booking.day_of_week,
            hour=booking.hour,
            department=room.department if room else None,
            username=current_user.username,
            action='B'
        ))
    
    return responses


@router.get("", response_model=List[MyBookingResponse])
async def all_bookings(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    # Get all active bookings in system
    from sqlalchemy import func
    
    subq = select(
        Booking.room_id,
        Booking.day_of_week,
        Booking.hour,
        func.max(Booking.created_at).label("max_created")
    ).group_by(
        Booking.room_id,
        Booking.day_of_week,
        Booking.hour
    ).subquery()
    
    result = await db.execute(
        select(Booking).join(
            subq,
            and_(
                Booking.room_id == subq.c.room_id,
                Booking.day_of_week == subq.c.day_of_week,
                Booking.hour == subq.c.hour,
                Booking.created_at == subq.c.max_created
            )
        ).where(Booking.action == 'B')
    )
    
    bookings = result.scalars().all()
    
    responses = []
    for booking in bookings:
        room_result = await db.execute(
            select(Classroom).where(Classroom.id == booking.room_id)
        )
        room = room_result.scalar_one_or_none()
        
        user_result = await db.execute(
            select(User).where(User.id == booking.user_id)
        )
        user = user_result.scalar_one_or_none()
        
        responses.append(MyBookingResponse(
            id=booking.id,
            room_id=booking.room_id,
            day=booking.day_of_week,
            hour=booking.hour,
            department=room.department if room else None,
            username=user.username if user else None,
            action='B'
        ))
    
    return responses
