import React from "react";
import { Link } from "react-router-dom";
import "./MobileHeader.css";

function MobileHeader() {
  return (
    <header className="mobile-app-header">

      <Link
        to="/"
        className="mobile-logo-link"
      >

        <div className="mobile-logo-section">

          <img
            src="/kidlit-logo.png"
            alt="logo"
            className="mobile-logo-icon"
          />

          <h1 className="mobile-logo-text">
            KidLit Ai
          </h1>

        </div>

      </Link>

      <Link
        to="/AboutUs"
        className="mobile-about-btn"
      >
        About Us
      </Link>

    </header>
  );
}

export default MobileHeader;