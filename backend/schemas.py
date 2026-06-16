from pydantic import BaseModel, Field, field_validator
from typing import Literal, Optional
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)


class UserRegister(UserBase):
    password: str = Field(..., min_length=6)
    is_admin: bool = False


class UserLogin(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_admin: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Room schemas
class RoomBase(BaseModel):
    id: int = Field(..., ge=101, le=999)
    department: str = Field(..., min_length=1, max_length=20)
    type: Literal["lab", "general"]


class RoomCreate(RoomBase):
    pass


class RoomResponse(RoomBase):
    is_booked: bool = False
    booked_by: Optional[str] = None

    class Config:
        from_attributes = True


# Search schemas
class RoomSearch(BaseModel):
    department: str
    day: str
    hour: str
    type: Literal["lab", "general"]

    @field_validator("day")
    @classmethod
    def validate_day(cls, v):
        days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        if v not in days:
            raise ValueError(f"Day must be one of: {days}")
        return v

    @field_validator("hour")
    @classmethod
    def validate_hour(cls, v):
        # Parse AM/PM format
        cleaned = v.replace(" ", "").upper().strip()
        import re
        match = re.match(r'^(\d{1,2})(AM|PM)$', cleaned)
        if not match:
            raise ValueError("Invalid time format. Use '9AM', '2 PM', '12AM'")
        
        hour = int(match.group(1))
        period = match.group(2)
        
        if hour < 1 or hour > 12:
            raise ValueError("Hour must be between 1 and 12")
        
        if period == "AM":
            return 0 if hour == 12 else hour
        else:
            return 12 if hour == 12 else hour + 12


# Booking schemas
class BookingRequest(BaseModel):
    room_id: int = Field(..., ge=101, le=999)
    day: str
    hour: int = Field(..., ge=0, le=23)

    @field_validator("day")
    @classmethod
    def validate_day(cls, v):
        days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        if v not in days:
            raise ValueError(f"Day must be one of: {days}")
        return v


class BookingResponse(BaseModel):
    id: int
    room_id: int
    day_of_week: int
    hour: int
    action: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class MyBookingResponse(BaseModel):
    id: int
    room_id: int
    day: int
    hour: int
    department: Optional[str] = None
    username: Optional[str] = None
    action: Optional[str] = None

    class Config:
        from_attributes = True