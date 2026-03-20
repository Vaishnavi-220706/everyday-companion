import React from "react";
import { useNavigate } from "react-router-dom";

const SelectRole = () => {
  const navigate = useNavigate();

  const chooseRole = (role) => {
    sessionStorage.setItem("selectedRole", role);

    if (role === "student") {
      navigate("/student");
    } else {
      navigate("/elder");
    }
  };

  return (
    <div className="role-container">

      <div className="role-card-container">

        <h1 className="role-title">Choose Your Workspace</h1>
        <p className="role-subtitle">
          Select the section you want to manage today
        </p>

        <div className="role-cards">

          {/* Student Card */}
          <div className="role-card student-card"
               onClick={() => chooseRole("student")}>
            <div className="role-icon">🎓</div>
            <h2>Student</h2>
            <p>
              Manage study plans, deadlines and focus sessions
            </p>
          </div>

          {/* Elder Card */}
          <div className="role-card elder-card"
               onClick={() => chooseRole("elder")}>
            <div className="role-icon">👴</div>
            <h2>Elder Care</h2>
            <p>
              Track medicines, meals and doctor appointments
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SelectRole;