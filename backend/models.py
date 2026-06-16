from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, CheckConstraint, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="user", lazy="selectin")


class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True)
    department = Column(String(20), nullable=False, index=True)
    type = Column(String(10), nullable=False)

    __table_args__ = (
        CheckConstraint("id BETWEEN 101 AND 999", name="valid_room_id"),
        CheckConstraint("type IN ('lab', 'general')", name="valid_room_type"),
    )

    bookings = relationship("Booking", back_populates="room", lazy="selectin")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)
    hour = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(1), nullable=False)  # 'B' = book, 'C' = cancel
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        CheckConstraint("day_of_week BETWEEN 0 AND 6", name="valid_day"),
        CheckConstraint("hour BETWEEN 0 AND 23", name="valid_hour"),
        CheckConstraint("action IN ('B', 'C')", name="valid_action"),
        Index("idx_booking_slot", "room_id", "day_of_week", "hour", "created_at"),
    )

    user = relationship("User", back_populates="bookings")
    room = relationship("Classroom", back_populates="bookings")