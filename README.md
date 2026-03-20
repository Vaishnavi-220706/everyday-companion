🌟 Everyday Companion
<p align="center"> <b>A Full-Stack Web App for Students & Elders</b><br/> Manage productivity, health, and daily routines in one place 💙 </p>
🚀 Tech Stack
<p> <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react"/> <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js"/> <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb"/> <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge"/> <img src="https://img.shields.io/badge/Email-Nodemailer-red?style=for-the-badge"/> </p>
✨ Features
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
│   ├── config/        # DB & Mail config
│   ├── controllers/   # Business logic
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Auth middleware
│   ├── jobs/          # Cron jobs
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.js
⚙️ Installation & Setup
🔹 Clone the Repository
git clone https://github.com/YOUR_USERNAME/everyday-companion.git
cd everyday-companion
🔹 Backend Setup
cd backend
npm install

Create .env file:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
🔹 Frontend Setup
cd frontend
npm install
▶️ Run the App
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start
🔐 Authentication

JWT-based authentication

Password hashing using bcrypt

Role-based access (Student / Elder)

📧 Email Reminders

⏰ Deadlines → 2 days before

💊 Medicines → real-time alerts

🏥 Appointments → 24 hours before

🚀 Future Enhancements

📱 Mobile App (React Native)

🔔 Push Notifications

🤖 AI-based schedule suggestions

👩‍💻 Author

Developed as a full-stack academic project ❤️
