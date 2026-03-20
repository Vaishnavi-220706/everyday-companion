import React from "react";
import { useNavigate } from "react-router-dom";

const SelectSection = () => {

  const navigate = useNavigate();

  const selectRole = (role) => {

    sessionStorage.setItem("selectedRole", role);

    if (role === "student") navigate("/student");
    if (role === "elder") navigate("/elder");

  };

  return (

    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#f6f8ff",
        position: "relative",
        overflow: "hidden"
      }}
    >

      {/* Colorful background blobs */}

      <div style={{
        position: "absolute",
        width: "500px",
        height: "500px",
        background: "#6366f1",
        borderRadius: "50%",
        filter: "blur(120px)",
        top: "-150px",
        left: "-150px",
        opacity: 0.3
      }} />

      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "#10b981",
        borderRadius: "50%",
        filter: "blur(120px)",
        bottom: "-150px",
        right: "-150px",
        opacity: 0.3
      }} />


      {/* TITLE */}

      <div style={{ textAlign: "center", marginBottom: "50px", zIndex: 1 }}>

        <h1 style={{
          fontSize: "40px",
          fontWeight: "700",
          color: "#1f2937"
        }}>
          🌟 Everyday Companion
        </h1>

        <p style={{
          fontSize: "18px",
          color: "#6b7280"
        }}>
          What would you like to manage today?
        </p>

      </div>



      {/* CARDS */}

      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 1
        }}
      >

        {/* STUDENT */}

        <div
          onClick={() => selectRole("student")}
          style={{
            width: "280px",
            padding: "40px",
            borderRadius: "18px",
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            color: "white",
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            transition: "0.25s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >

          <div style={{ fontSize: "50px", marginBottom: "12px" }}>
            🎓
          </div>

          <h2 style={{ marginBottom: "10px" }}>
            Student Tools
          </h2>

          <p style={{ fontSize: "14px", opacity: 0.9 }}>
            Plan studies, track deadlines and stay productive.
          </p>

        </div>



        {/* ELDER */}

        <div
          onClick={() => selectRole("elder")}
          style={{
            width: "280px",
            padding: "40px",
            borderRadius: "18px",
            background: "linear-gradient(135deg,#10b981,#059669)",
            color: "white",
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            transition: "0.25s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >

          <div style={{ fontSize: "50px", marginBottom: "12px" }}>
            👴
          </div>

          <h2 style={{ marginBottom: "10px" }}>
            Elder Care
          </h2>

          <p style={{ fontSize: "14px", opacity: 0.9 }}>
            Track medicines, meals and doctor appointments.
          </p>

        </div>

      </div>

    </div>

  );

};

export default SelectSection;