# 📚 Slot-Map

**Classroom Availability Checker and Booking System**

Originally built in **C** as a console application and reimagined as a modern **full-stack web application** with secure authentication, classroom search, and booking management.

---

## 🏗️ System Architecture

```text
┌──────────────┐       REST API (JSON)      ┌──────────────┐
│   Frontend   │  ←──────────────────────→  │   Backend    │
│ React + Vite │      JWT Authentication    │   FastAPI    │
└──────────────┘                            └──────────────┘
         │                                           │
         └───────────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   SQLAlchemy    │
                    └─────────────────┘
```

---

## ✨ Features

| Feature | Description |
|----------|-------------|
| 🔐 User Authentication | Secure registration and login using JWT tokens |
| 👥 Role-Based Access | Separate Admin and User permissions |
| 🔍 Search Classrooms | Filter by department, day, time, and room type |
| 📅 Book Slots | Real-time classroom availability and booking |
| ❌ Cancel Bookings | Users cancel their own bookings, admins can cancel any |
| 📜 Booking History | Full audit trail of bookings and cancellations |
| 🛠️ Admin Dashboard | Manage classrooms and system bookings |
| 🌙 Dark Mode | Light/Dark theme support with persistence |
| 📱 Responsive Design | Works on desktop, tablet, and mobile devices |

---

## 🧰 Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Lucide Icons |
| Backend | FastAPI, Python |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Authentication | JWT, bcrypt |
| Deployment | Vercel, Netlify, Railway, Render |

---

## 📁 Project Structure

```text
slotmap/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SearchForm.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── BookingModal.jsx
│   │   │   └── BookingList.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   ├── AdminRoomsPage.jsx
│   │   │   └── AdminAllBookingsPage.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useBookings.js
│   │   │
│   │   ├── utils/
│   │   │   └── timeParser.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── rooms.py
│   │   └── bookings.py
│   │
│   └── requirements.txt
│
└── README.md
```

---

## 📋 Prerequisites

Before running the project, ensure you have:

- Node.js 18+
- npm
- Python 3.10+
- PostgreSQL 14+

---

## 🚀 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

---

## ⚙️ Backend Setup

```bash
cd backend

python -m venv venv
```

### Activate Virtual Environment

#### Linux / macOS

```bash
source venv/bin/activate
```

#### Windows

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Create Database

```bash
createdb slotmap
```

### Create Environment File

```env
DATABASE_URL=postgresql://user:password@localhost/slotmap
SECRET_KEY=your-secret-key-here
```

### Start Development Server

```bash
uvicorn main:app --reload --port 8000
```

Backend runs at:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/slotmap
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 🔌 API Endpoints

### Authentication

| Endpoint | Method | Description | Auth |
|-----------|---------|-------------|------|
| `/api/auth/register` | POST | Register new user | ❌ |
| `/api/auth/login` | POST | Login and receive JWT | ❌ |

### Rooms

| Endpoint | Method | Description | Auth |
|-----------|---------|-------------|------|
| `/api/rooms` | GET | Search classrooms | ❌ |
| `/api/rooms` | POST | Add classroom | ✅ Admin |

### Bookings

| Endpoint | Method | Description | Auth |
|-----------|---------|-------------|------|
| `/api/bookings` | POST | Create booking | ✅ |
| `/api/bookings/{room_id}` | DELETE | Cancel booking | ✅ |
| `/api/bookings/me` | GET | View my bookings | ✅ |
| `/api/bookings` | GET | View all bookings | ✅ Admin |

---

## 👤 Default Users

Sample users are seeded during initial setup.

| Username | Password | Role |
|-----------|-----------|------|
| admin | admin123 | Admin |
| faculty | faculty123 | User |

---

## 🏫 Room ID Format

Room IDs use a three-digit numbering scheme:

```text
Floor + Room Number
```

Examples:

| Room ID | Meaning |
|----------|---------|
| 101 | Floor 1, Room 01 |
| 205 | Floor 2, Room 05 |
| 323 | Floor 3, Room 23 |

---

## ⏰ Time Format

Supported formats:

```text
9AM
9 AM
9am
2PM
2 PM
2pm
12AM
12PM
```

Internally converted to 24-hour format.

| Input | Internal |
|---------|----------|
| 9 AM | 09 |
| 2 PM | 14 |
| 12 AM | 00 |
| 12 PM | 12 |

---

## 🎨 Frontend Features

- JWT-based authentication
- Auto-login using stored token
- Role-based UI rendering
- Protected routes
- Classroom search filters
- Booking modal system
- Booking history page
- Responsive navigation
- 🌙 Dark Mode with LocalStorage persistence
- Automatic theme restoration on refresh
- Tailwind CSS utility-first styling
- Mobile-friendly interface

---

## 🛠️ Development

### Frontend

```bash
cd frontend

npm run dev
npm run build
npm run preview
```

### Backend

```bash
cd backend

uvicorn main:app --reload --port 8000
```

---

## 🚀 Deployment

### Frontend (Vercel / Netlify)

```bash
cd frontend

npm run build
```

Deploy the generated `dist/` folder.

---

### Backend (Railway / Render / Heroku)

```bash
cd backend

gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

Set all required environment variables in your hosting dashboard.

---

## 📜 Original C Version

Slot-Map originally started as a console-based application written in C featuring:

- File-based persistence
- Windows console UI
- Manual memory management
- Sequential file scanning
- Text-file storage

### Modern Enhancements

The web version adds:

- Responsive web interface
- Multi-user support
- PostgreSQL database
- Secure JWT authentication
- Password hashing with bcrypt
- Faster indexed queries
- Cross-platform support

---

## 👨‍💻 Author

**Masud Ibn Musa**

Originally developed in C and reimagined as a modern full-stack web application using React, FastAPI, and PostgreSQL.
Orginal version : https://github.com/masudibnmusa/slotmap.git

---

## 📜 License

Licensed under the **MIT License**.

Feel free to use, modify, and distribute this project.
