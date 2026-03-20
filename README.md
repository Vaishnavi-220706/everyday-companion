🌟 Everyday Companion

Welcome to the Everyday Companion – a full-stack web application designed to assist students and elderly users in managing their daily activities, productivity, and health routines.

This project was developed as part of an academic full-stack project to demonstrate how modern web technologies can solve real-world problems through intelligent task management and reminder systems.

📌 Table of Contents

🧠 About the Project

🚀 Features

🛠️ Tech Stack

📁 Project Structure

💡 How It Works

▶️ Running the Project

📧 Reminder System

🔮 Future Scope

👩‍💻 Author

🧠 About the Project

The Everyday Companion is designed to support two types of users:

🎓 Students – to manage deadlines, study plans, and productivity

👵 Elderly Users – to manage medicines, food habits, and doctor appointments

The system uses a full-stack architecture with real-time reminders and email notifications to ensure users never miss important tasks.

🚀 Features
🎓 Student Module

📅 Deadline Tracker with smart reminders

📚 Study Planner (daily timetable management)

⏱️ Focus Timer for productivity sessions

👵 Elder Module

💊 Medicine Reminder with email alerts

🍽️ Food Checklist & water tracking

🏥 Appointment Tracker with notifications

🛠️ Tech Stack
Component	Technology
Frontend	React.js, Context API
Backend	Node.js, Express.js
Database	MongoDB (Mongoose)
Authentication	JWT (JSON Web Tokens)
Email Service	Nodemailer (Gmail SMTP)
Scheduler	node-cron
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
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── StudentDashboard.js
    │   │   ├── ElderDashboard.js
    │   │   ├── DeadlineTracker.js
    │   │   ├── StudyPlanner.js
    │   │   ├── FocusTimer.js
    │   │   ├── MedicineReminder.js
    │   │   ├── FoodChecklist.js
    │   │   └── AppointmentTracker.js
    │   ├── context/
    │   └── App.js
💡 How It Works

Users register and log in based on their role (student / elder)

JWT authentication secures user sessions

Data is stored in MongoDB

Users interact with features through a React-based UI

Background cron jobs continuously check for reminders

Email notifications are sent using Nodemailer

▶️ Running the Project
Step 1: Clone the Repository
git clone https://github.com/YOUR_USERNAME/everyday-companion.git
cd everyday-companion
Step 2: Backend Setup
cd backend
npm install

Create .env file and add:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
Step 3: Frontend Setup
cd ../frontend
npm install
Step 4: Run the Application

Backend:

cd backend
npm start

Frontend:

cd frontend
npm start
📧 Reminder System

⏰ Deadline Reminders → Sent 2 days before due date

💊 Medicine Reminders → Checked every minute

🏥 Appointment Reminders → Sent 24 hours before

🔮 Future Scope

📱 Mobile application development

🔔 Push notifications

🤖 AI-based personalized scheduling

🌐 Integration with healthcare APIs

👩‍💻 Author

Pallagani Vaishnavi
📍 India

⭐ Acknowledgment

This project was developed as part of an academic initiative to demonstrate the integration of full-stack development with real-world problem solving.
