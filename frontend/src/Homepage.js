import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HomepageMobile from "./HomepageMobile";
import "./Homepage.css";

function Homepage() {
const navigate = useNavigate();

const [isMobile, setIsMobile] = useState(
window.matchMedia("(max-width: 1024px)").matches
);

useEffect(() => {


const handleResize = () => {
  setIsMobile(
    window.matchMedia("(max-width: 1024px)").matches
  );
};

window.addEventListener("resize", handleResize);

return () => {
  window.removeEventListener("resize", handleResize);
};


}, []);

if (isMobile) {
return <HomepageMobile />;
}

return ( <div className="app-container"> <header className="app-header"> <Link to="/" className="logo-link"> <div className="logo-section"> <img
           src="/kidlit-logo.png"
           alt="logo"
           className="logo-icon"
         /> <h1 className="logo-text">
KidLit Ai </h1> </div> </Link>


    <Link
      to="/AboutUs"
      className="about-btn"
    >
      About Us
    </Link>
  </header>

  <main className="app-main">
    <div className="left-column">
      <h2 className="welcome-text">
        Welcome To KidLit Ai
      </h2>

      <p className="intro-text2">
        At KidLit AI, we believe every child has a story to imagine.
        Whether it’s a brave dragon, a curious robot, or a jungle
        adventure, we turn your ideas into beautiful,
        personalized tales!
      </p>

      <button
        className="get-started-btn"
        onClick={() => navigate("/ChooseOptionPage")}
      >
        Get Started
      </button>
    </div>

    <div className="right-column">
      <div className="speech-bubble">
        Hi there!👋
        <br />
        I'm KidLit AI
        <br />
        your friendly story buddy!
      </div>

      <img
        src="/kidlit-robot.png"
        alt="robot buddy"
        className="robot-image"
      />
    </div>
  </main>
</div>


);
}

export default Homepage;
