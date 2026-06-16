from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from database import get_db
from models import Classroom, Booking
from schemas import RoomCreate, RoomResponse, RoomSearch
from dependencies import get_current_user, require_admin

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("", response_model=List[RoomResponse])
async def search_rooms(
    department: str = Query(...),
    day: str = Query(...),
    hour: int = Query(..., ge=0, le=23),
    type: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    # Validate day
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    if day not in days:
        raise HTTPException(status_code=400, detail=f"Invalid day. Must be one of: {days}")
    
    day_index = days.index(day)
    
    # Validate type
    room_type = type.lower()
    if room_type not in ["lab", "general"]:
        raise HTTPException(status_code=400, detail="Type must be 'lab' or 'general'")
    
    # Get all matching rooms
    result = await db.execute(
        select(Classroom).where(
            and_(
                Classroom.department == department.upper(),
                Classroom.type == room_type
            )
        )
    )
    rooms = result.scalars().all()
    
    # Check booking status for each room at this slot
    room_responses = []
    for room in rooms:
        # Get latest booking action for this slot
        booking_result = await db.execute(
            select(Booking).where(
                and_(
                    Booking.room_id == room.id,
                    Booking.day_of_week == day_index,
                    Booking.hour == hour
                )
            ).order_by(Booking.created_at.desc()).limit(1)
        )
        latest_booking = booking_result.scalar_one_or_none()
        
        is_booked = False
        booked_by = None
        
        if latest_booking and latest_booking.action == 'B':
            is_booked = True
            # Get username
            user_result = await db.execute(
                select(Booking).where(Booking.id == latest_booking.id)
            )
            booking_with_user = user_result.scalar_one_or_none()
            if booking_with_user and booking_with_user.user:
                booked_by = booking_with_user.user.username
        
        room_responses.append(RoomResponse(
            id=room.id,
            department=room.department,
            type=room.type,
            is_booked=is_booked,
            booked_by=booked_by
        ))
    
    return room_responses


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_room(
    room: RoomCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    # Check if room exists
    result = await db.execute(select(Classroom).where(Classroom.id == room.id))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Room with this ID already exists")
    
    new_room = Classroom(
        id=room.id,
        department=room.department.upper(),
        type=room.type.lower()
    )
    db.add(new_room)
    await db.commit()
    
    return {"message": "Classroom added successfully", "room_id": room.id}