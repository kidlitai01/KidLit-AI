import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseOptionPageMobile.css";
import MobileHeader from "./MobileHeader";

function ChooseOptionPageMobile() {

const navigate = useNavigate();

return ( <div className="choice-mobile-home">


<MobileHeader />

  <img
    src="/kidlit-story.png"
    alt="KidLit AI"
    className="choice-mobile-robot"
  />

  <div className="choice-card-title">
    <h2>
      Choose Your
      <br />
      Adventure
    </h2>
  </div>

  <div
    className="option-card"
    onClick={() => navigate("/create/storybook")}
  >
    <h3>✨ Storybook</h3>

    <p>
      Create magical AI stories
      with voice narration
    </p>
  </div>

  <div
    className="option-card"
    onClick={() => navigate("/create/picturebook")}
  >
    <h3>📖 Picture Book</h3>

    <p>
      Interactive picture
      adventures for kids
    </p>
  </div>

  <div className="description-card">
    <p>
      Choose your favorite way to
      explore magical stories and
      adventures with KidLit AI.
    </p>
  </div>

</div>


);
}

export default ChooseOptionPageMobile;
