# 🌟 Everyday Companion  

Welcome to the **Everyday Companion** – a full-stack web application designed to assist **students and elderly users** in managing daily activities, productivity, and health routines.

This project was developed as part of an academic full-stack project to demonstrate how technology can solve real-world problems through intelligent task management and reminder systems.

---

## 📌 Table of Contents  

- 🧠 About the Project  
- 🚀 Features  
- 🛠️ Tech Stack  
- 📁 Project Structure  
- 💡 How It Works  
- ▶️ Running the Project  
- 📧 Reminder System  
- 🔮 Future Scope  
- 👩‍💻 Author  

---

## 🧠 About the Project  

The **Everyday Companion** supports two types of users:

- 🎓 **Students** – manage deadlines, study plans, and productivity  
- 👵 **Elderly Users** – manage medicines, food habits, and appointments  

It uses a full-stack architecture with email reminders to ensure users never miss important tasks.

---

## 🚀 Features  

### 🎓 Student Module  
- 📅 Deadline Tracker with smart reminders  
- 📚 Study Planner (daily timetable management)  
- ⏱️ Focus Timer for productivity sessions  

### 👵 Elder Module  
- 💊 Medicine Reminder with email alerts  
- 🍽️ Food Checklist & water tracking  
- 🏥 Appointment Tracker with notifications  

---

## 🛠️ Tech Stack  

| Component | Technology |
|----------|-----------|
| Frontend | React.js, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT (JSON Web Tokens) |
| Email Service | Nodemailer (Gmail SMTP) |
| Scheduler | node-cron |

---

## 📁 Project Structure  


everyday-companion/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── jobs/
│ └── server.js
│
└── frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ └── App.js


---

## 💡 How It Works  

- Users register and log in based on their role (student / elder)  
- JWT authentication secures user sessions  
- Data is stored in MongoDB  
- Users interact through a React-based interface  
- Background cron jobs check for reminders  
- Email notifications are sent using Nodemailer  

---

## ▶️ Running the Project  

### Step 1: Clone the Repository  

```bash
git clone https://github.com/YOUR_USERNAME/everyday-companion.git
cd everyday-companion
```
### Step 2: Backend Setup  

```bash
cd backend
npm install
```

Create a .env file and add:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000

###Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

### Step 4: Run the Application

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

---

📧 Reminder System

⏰ Deadline reminders → 2 days before

💊 Medicine reminders → every minute check

🏥 Appointment reminders → 24 hours before

---

🔮 Future Scope

📱 Mobile application

🔔 Push notifications

🤖 AI-based scheduling

🌐 Healthcare integrations

---

👩‍💻 Author

Pallagani Vaishnavi

📍 India

---

⭐ Acknowledgment

This project was developed as part of an academic initiative to demonstrate full-stack development with real-world applications.
