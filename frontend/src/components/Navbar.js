import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = sessionStorage.getItem("selectedRole");


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const studentLinks = [
    { to: "/student", label: "🏠 Home" },
    { to: "/student/deadlines", label: "📚 Deadlines" },
    { to: "/student/planner", label: "📅 Planner" },
    { to: "/student/timer", label: "⏱️ Timer" }
  ];


  const elderLinks = [
    { to: "/elder", label: "🏠 Home" },
    { to: "/elder/medicine", label: "💊 Medicine" },
    { to: "/elder/food", label: "🍽️ Food" },
    { to: "/elder/appointments", label: "🏥 Appointments" }
  ];


  // Determine current route type
  const isRolePage = location.pathname === "/select-role";
  const isStudent = location.pathname.startsWith("/student");
  const isElder = location.pathname.startsWith("/elder");


  let links = [];

  if (isStudent) links = studentLinks;
  if (isElder) links = elderLinks;


  const brandRedirect =
    isStudent ? "/student" :
    isElder ? "/elder" :
    "/select-role";


  return (
    <nav className="navbar">

      <Link to={brandRedirect} className="navbar-brand">
        🌟 Everyday Companion
      </Link>

      <div className="navbar-links">

        {/* Hide module links on role selection page */}
        {!isRolePage && links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              background:
                location.pathname === link.to
                  ? "rgba(255,255,255,0.25)"
                  : undefined,
              color: "white"
            }}
          >
            {link.label}
          </Link>
        ))}

        <span className="navbar-user">
          👤 {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="btn btn-sm"
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "white"
          }}
        >
          Logout
        </button>

      </div>

    </nav>
  );
};

export default Navbar;