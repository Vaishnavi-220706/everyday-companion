🌟 Everyday Companion
A Full-Stack Web Application for Students & Elders

A comprehensive productivity and care management platform designed for students and elderly users.
It helps manage deadlines, study plans, health routines, and reminders in a single unified system.

🚀 Tech Stack

Frontend: React.js, Context API, Axios

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT (JSON Web Tokens)

Email Service: Nodemailer (Gmail SMTP)

Scheduler: node-cron

✨ Key Features
🎓 Student Module

📅 Deadline Tracker with smart reminders

📚 Study Planner (daily timetable management)

⏱️ Focus Timer (productivity sessions)

👵 Elder Module

💊 Medicine Reminder with email alerts

🍽️ Food Checklist & water tracking

🏥 Appointment Tracker with notifications

📁 Project Structure

everyday-companion/
│
├── backend/
│   ├── config/        # DB & Mail configuration
│   ├── controllers/   # Business logic
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Authentication middleware
│   ├── jobs/          # Cron jobs for reminders
│   ├── server.js      # Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── api.js
    │   └── App.js
    └── package.json
⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/Vaishnavi-220706/everyday-companion.git
cd everyday-companion

2️⃣ Backend Setup
cd backend
npm install

Create .env file:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000

3️⃣ Frontend Setup

cd ../frontend
npm install

4️⃣ Run the Application

Backend:

cd backend
npm start

Frontend:

cd frontend
npm start

🔐 Authentication Flow

User registers with role (student / elder)

Password is hashed using bcrypt

JWT token is generated on login

Protected routes use middleware for verification

📧 Email Reminder System

⏰ Deadlines: Daily reminders (2 days before)

💊 Medicine: Real-time (every minute check)

🏥 Appointments: Daily reminder (24 hours before)

🌐 API Overview
| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| POST   | `/api/auth/register` | Register        |
| POST   | `/api/auth/login`    | Login           |
| GET    | `/api/auth/me`       | Current user    |
| GET    | `/api/deadlines`     | Get deadlines   |
| POST   | `/api/deadlines`     | Create deadline |
| GET    | `/api/medicines`     | Get medicines   |
| POST   | `/api/appointments`  | Add appointment |


MongoDB error: Ensure DB is running or use Atlas

Email not working: Use Gmail App Password

Port issue: Change .env PORT

CORS issue: Verify CLIENT_URL

📌 Future Enhancements

Mobile application (React Native)

Push notifications

AI-based schedule optimization

Voice assistant for elderly users

👩‍💻 Author

P.Vaishnavi
