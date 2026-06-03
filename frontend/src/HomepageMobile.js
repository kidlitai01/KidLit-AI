import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomepageMobile.css";
import MobileHeader from "./MobileHeader";

function HomepageMobile() {
const navigate = useNavigate();

return ( <div className="mobile-home">


  {/* HEADER */}
<MobileHeader />

  {/* ROBOT HERO */}
  <img
    src="/kidlit-robot.png"
    alt="KidLit AI Robot"
    className="mobile-robot"
  />

  {/* WELCOME CARD */}
  <div className="welcome-card">

    <h2>
      Welcome To
      <br />
      KidLit AI
    </h2>

  </div>

  {/* FEATURE PILLS */}
  <div className="feature-pills">

    <div className="feature-pill">
      ✨ Storybooks (AI Stories)
    </div>

    <div className="feature-pill">
      📖 Picture Books
    </div>

    <div className="feature-pill">
      🎤 Voice Narration
    </div>

    <div className="feature-pill">
      ❓ Quizes
    </div>

  </div>

  {/* DESCRIPTION CARD */}
  <div className="description-card">

    <p>
      At KidLit AI, we believe every child has a story to imagine.
      Whether it’s a brave dragon, a curious robot, or a jungle
      adventure, we turn your ideas into beautiful,
      personalized tales!
    </p>

  </div>

  {/* CTA BUTTON */}
  <button
    className="start-btn"
    onClick={() => navigate("/ChooseOptionPage")}
  >
    Get Started 🚀
  </button>

</div>


);
}

export default HomepageMobile;
