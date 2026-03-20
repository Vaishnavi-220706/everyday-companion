// src/pages/StudentDashboard.js

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

const StudentDashboard = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({ total: 0, urgent: 0, dueToday: 0 });
  const [recentDeadlines, setRecentDeadlines] = useState([]);

  useEffect(() => {

    const fetchStats = async () => {
      try {

        const res = await API.get("/deadlines");

        const deadlines = res.data.filter(d => !d.completed);

        const now = new Date();

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const urgent = deadlines.filter(d => {
          const days = Math.ceil((new Date(d.dueDate) - now) / (1000 * 60 * 60 * 24));
          return days <= 2;
        });

        const dueToday = deadlines.filter(
          d => new Date(d.dueDate) <= today
        );

        setStats({
          total: deadlines.length,
          urgent: urgent.length,
          dueToday: dueToday.length
        });

        setRecentDeadlines(deadlines.slice(0, 4));

      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();

  }, []);



  const getDaysLeft = (dueDate) => {
    const now = new Date();
    const diff = Math.ceil((new Date(dueDate) - now) / (1000 * 60 * 60 * 24));
    return diff;
  };


  const getUrgencyClass = (days) => {
    if (days < 0) return "badge badge-red";
    if (days === 0) return "badge badge-orange";
    if (days <= 2) return "badge badge-yellow";
    return "badge badge-green";
  };


  const getUrgencyText = (days) => {
    if (days < 0) return "Overdue!";
    if (days === 0) return "Due Today!";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };


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

      <div className="dashboard-hero">
        <h1>Welcome back, {user?.name}! 🎓</h1>
        <p>Let's make today productive. Here's your overview.</p>
      </div>



      {/* STAT CARDS */}

      <div className="grid-3" style={{ marginBottom: "28px" }}>

        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Pending Deadlines</div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: "#e53e3e" }}>
            {stats.urgent}
          </div>
          <div className="stat-label">Urgent (≤2 days)</div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: "#d69e2e" }}>
            {stats.dueToday}
          </div>
          <div className="stat-label">Due Today</div>
        </div>

      </div>



      {/* FEATURE TOOLS */}

      <div className="section-title">Your Tools</div>

      <div className="grid-2" style={{ marginBottom: "28px" }}>

        {[
          {
            to: "/student/deadlines",
            icon: "📚",
            title: "Deadline Tracker",
            desc: "Track assignments & get email reminders before deadlines"
          },
          {
            to: "/student/planner",
            icon: "📅",
            title: "Study Planner",
            desc: "Create daily timetables with study sessions & breaks"
          },
          {
            to: "/student/timer",
            icon: "⏱️",
            title: "Focus Timer",
            desc: "Pomodoro-style timer to stay focused while studying"
          }
        ].map(item => (

          <Link key={item.to} to={item.to} style={{ textDecoration: "none" }}>

            <div
              className="card"
              style={{
                cursor: "pointer",
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

              <div style={{ fontSize: "32px", marginBottom: "10px" }}>
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



      {/* UPCOMING DEADLINES */}

      {recentDeadlines.length > 0 && (

        <div>

          <div className="section-title">Upcoming Deadlines</div>

          {recentDeadlines.map(d => {

            const days = getDaysLeft(d.dueDate);

            return (

              <div
                key={d._id}
                className={`card urgency-${
                  days < 0
                    ? "overdue"
                    : days === 0
                    ? "today"
                    : days <= 2
                    ? "soon"
                    : "normal"
                }`}

                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >

                <div>
                  <div style={{ fontWeight: 600 }}>
                    {d.taskName}
                  </div>

                  <div style={{ color: "#718096", fontSize: "13px" }}>
                    {d.subject} · {new Date(d.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <span className={getUrgencyClass(days)}>
                  {getUrgencyText(days)}
                </span>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );

};

export default StudentDashboard;