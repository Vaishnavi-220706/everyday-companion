// src/pages/ElderDashboard.js

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

const ElderDashboard = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [medCount, setMedCount] = useState(0);
  const [apptCount, setApptCount] = useState(0);
  const [todayFood, setTodayFood] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });

  const [upcomingAppts, setUpcomingAppts] = useState([]);



  useEffect(() => {

    const today = new Date().toISOString().split("T")[0];


    // Fetch medicines
    API.get("/medicines")
      .then(r => setMedCount(r.data.length))
      .catch(() => {});


    // Fetch appointments
    API.get("/appointments")
      .then(r => {

        const upcoming = r.data.filter(
          a => !a.completed && new Date(a.appointmentDate) >= new Date()
        );

        setApptCount(upcoming.length);
        setUpcomingAppts(upcoming.slice(0, 3));

      })
      .catch(() => {});


    // Fetch today's food
    API.get(`/food/${today}`)
      .then(r => {

        setTodayFood({
          breakfast: r.data.breakfast?.eaten || false,
          lunch: r.data.lunch?.eaten || false,
          dinner: r.data.dinner?.eaten || false
        });

      })
      .catch(() => {});

  }, []);



  const mealsEaten = [
    todayFood.breakfast,
    todayFood.lunch,
    todayFood.dinner
  ].filter(Boolean).length;



  return (

    <div className="container">


      {/* BACK BUTTON */}

      <button
        onClick={() => navigate("/select-role")}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          background: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        ⬅ Back
      </button>



      {/* HERO SECTION */}

      <div
        className="dashboard-hero"
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
      >
        <h1 style={{ fontSize: "28px" }}>
          Good day, {user?.name}! 🌸
        </h1>

        <p>
          Here's your health and wellness summary for today.
        </p>
      </div>



      {/* STAT CARDS */}

      <div className="grid-3" style={{ marginBottom: "28px" }}>

        <div className="stat-card" style={{ borderTop: "4px solid #e53e3e" }}>
          <div className="stat-number" style={{ color: "#e53e3e" }}>
            {medCount}
          </div>
          <div className="stat-label">
            Medicine Reminders
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: "4px solid #38a169" }}>
          <div className="stat-number" style={{ color: "#38a169" }}>
            {mealsEaten}/3
          </div>
          <div className="stat-label">
            Meals Today
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: "4px solid #4f46e5" }}>
          <div className="stat-number" style={{ color: "#4f46e5" }}>
            {apptCount}
          </div>
          <div className="stat-label">
            Upcoming Appointments
          </div>
        </div>

      </div>



      {/* TODAY'S MEALS */}

      <div className="card" style={{ marginBottom: "24px" }}>

        <div
          className="section-title"
          style={{ borderBottom: "none", marginBottom: "12px" }}
        >
          🍽️ Today's Meals
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >

          {[
            { meal: "breakfast", icon: "🌅", label: "Breakfast", eaten: todayFood.breakfast },
            { meal: "lunch", icon: "☀️", label: "Lunch", eaten: todayFood.lunch },
            { meal: "dinner", icon: "🌙", label: "Dinner", eaten: todayFood.dinner }
          ].map(m => (

            <div
              key={m.meal}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "16px",
                borderRadius: "10px",
                background: m.eaten ? "#c6f6d5" : "#f7fafc",
                border: `2px solid ${m.eaten ? "#38a169" : "#e2e8f0"}`,
                textAlign: "center"
              }}
            >

              <div style={{ fontSize: "28px" }}>
                {m.icon}
              </div>

              <div
                style={{
                  fontWeight: 600,
                  marginTop: "6px",
                  color: m.eaten ? "#276749" : "#718096"
                }}
              >
                {m.label}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: m.eaten ? "#38a169" : "#a0aec0"
                }}
              >
                {m.eaten ? "✓ Eaten" : "Not yet"}
              </div>

            </div>

          ))}

        </div>


        <Link
          to="/elder/food"
          style={{
            display: "inline-block",
            marginTop: "14px",
            color: "#4f46e5",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          Update food checklist →
        </Link>

      </div>



      {/* HEALTH TOOLS */}

      <div className="section-title">
        Your Health Tools
      </div>

      <div className="grid-2" style={{ marginBottom: "28px" }}>

        {[
          {
            to: "/elder/medicine",
            icon: "💊",
            title: "Medicine Reminder",
            desc: "Set daily medicine reminders with email alerts"
          },
          {
            to: "/elder/food",
            icon: "🍽️",
            title: "Food Checklist",
            desc: "Track your breakfast, lunch & dinner daily"
          },
          {
            to: "/elder/appointments",
            icon: "🏥",
            title: "Appointment Tracker",
            desc: "Never miss a doctor visit with scheduled reminders"
          }
        ].map(item => (

          <Link key={item.to} to={item.to} style={{ textDecoration: "none" }}>

            <div
              className="card"
              style={{
                cursor: "pointer",
                borderTop: "4px solid",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}

              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}

              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}

            >

              <div style={{ fontSize: "36px", marginBottom: "10px" }}>
                {item.icon}
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "6px",
                  color: "#1a202c"
                }}
              >
                {item.title}
              </div>

              <div style={{ color: "#718096", fontSize: "14px" }}>
                {item.desc}
              </div>

            </div>

          </Link>

        ))}

      </div>



      {/* UPCOMING APPOINTMENTS */}

      {upcomingAppts.length > 0 && (

        <div>

          <div className="section-title">
            Upcoming Appointments
          </div>

          {upcomingAppts.map(a => (

            <div
              key={a._id}
              className="card"
              style={{
                borderLeft: "4px solid #4f46e5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >

              <div>

                <div style={{ fontWeight: 700, fontSize: "16px" }}>
                  🏥 {a.title}
                </div>

                {a.doctorName && (
                  <div style={{ color: "#718096", fontSize: "14px" }}>
                    Dr. {a.doctorName}
                  </div>
                )}

                <div
                  style={{
                    color: "#4f46e5",
                    fontSize: "13px",
                    marginTop: "4px"
                  }}
                >
                  📅 {new Date(a.appointmentDate).toLocaleDateString(
                    "en-IN",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  )}
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default ElderDashboard;