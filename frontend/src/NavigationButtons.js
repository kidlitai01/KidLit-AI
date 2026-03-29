import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavigationButtons.css";

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on homepage
  if (location.pathname === "/") return null;

  return (
    <div className="nav-buttons">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <button className="forward-btn" onClick={() => navigate(1)}>
        →
      </button>
    </div>
  );
};

export default NavigationButtons;