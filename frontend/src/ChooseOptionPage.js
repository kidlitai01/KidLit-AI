import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ChooseOptionPageMobile from "./ChooseOptionPageMobile";
import "./ChooseOptionPage.css";

const ChooseOptionPage = () => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width:1024px)").matches
  );

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(
        window.matchMedia("(max-width:1024px)").matches
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    return <ChooseOptionPageMobile />;
  }

  const handleSelect = (type) => {
    navigate(`/create/${type}`);
  };

  return (
    <><div className="app-container">
          <header className="app-header">
              <Link to="/" className="logo-link">
                  <div className="logo-section">
                      <img src="/kidlit-logo.png" alt="logo" className="logo-icon" />
                      <h1 className="logo-text">KidLit Ai</h1>
                  </div>
              </Link>
              <Link to="/AboutUs" className="about-btn">About Us</Link>
          </header>
      </div><div className="content-containerp">
              <div className="image-section">
                  <img src="/kidlit-story.png" alt="Robot with Story Elements" className="main-art" />
              </div>

              <div className="options-section">
                  <h2 className='chooseoption'>Choose Option</h2>

                  <button className="storybook-btn" onClick={() => handleSelect("storybook")}>
                      Storybook
                  </button>

                  <button className="picturebook-btn" onClick={() => handleSelect("picturebook")}>
                      Picture Book
                  </button>
                
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{marginLeft:"5px", marginTop: "10px", width: "100%", maxWidth: "650px" }}
                    >
                    <source src="/robot.mp4" type="video/mp4" />
                    </video>

                  <p className="objective">
                      With KidLit AI, you can create magical storybooks and delightful picture books!
                      Pick your favorite format to begin your adventure.
                  </p>
                    

              </div>
          </div></>
    
  );
};

export default ChooseOptionPage;
