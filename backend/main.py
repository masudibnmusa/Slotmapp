from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db,seed_data
from routers import auth, rooms, bookings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await seed_data() 
    yield
    # Shutdown


app = FastAPI(
    title="Slot-Map API",
    description="Classroom Availability Checker and Booking System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(rooms.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "Slot-Map API",
        "docs": "/docs",
        "version": "1.0.0"
    }