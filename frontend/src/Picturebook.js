import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Picturebook.css";

const Picturebook = () => {
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [error, setError] = useState("");


  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  useEffect(() => {
    // ✅ Fetch story from localStorage
    const data = localStorage.getItem("picturebookStory");
    if (!data) {
      setError("No story found. Please generate a story first.");
      return;
    }

    const storyData = JSON.parse(data);
    let formattedPages = [];

    // Cover page
    if (storyData.title) {
      formattedPages.push({ type: "cover", title: storyData.title });
    }

    // Story pages
    if (Array.isArray(storyData.pages)) {
      storyData.pages.forEach((p) => {
        formattedPages.push({
          type: "story",
          text: p.text,
          image: p.image || null,
          layout: "left-img",
        });
      });
    }

    // End page
    formattedPages.push({ type: "end", text: "" });

    setPages(formattedPages);
  }, []);

  const handleNext = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      setFade(false);
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev + 1);
        setFade(true);
      }, 300);
    }
  }, [currentPageIndex, pages]);

  const handlePrev = useCallback(() => {
    if (currentPageIndex > 0) {
      setFade(false);
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev - 1);
        setFade(true);
      }, 300);
    }
  }, [currentPageIndex]);

  // ✅ Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  if (error) return <div className="errorp">{error}</div>;
  if (pages.length === 0) return <div className="loadingp">📚 Loading your picturebook...</div>;

  const currentPage = pages[currentPageIndex] || {};
  const isLastPage = currentPage.type === "end";

  return (
       <div>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      {/* Sidebar toggle button */}
      <button 
        className="sidebar-toggle" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>
      
      {/* Sidebar menu */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="btn-wrapper">
      
                          <Link to="/AboutUs" className="about-btns">
                          <img src="/about.png" alt="about" className="about-iconp" />
                  </Link>
                                          <span className="tooltips4">About us</span>
                  </div>
                  </div>
    
    <div>
      <header className="app-headerp">
        <Link to="/" className="logo-link">
          <div className="logo-section">
            <img src="/kidlit-logo.png" alt="logo" className="logo-icon" />
            <h1 className="logo-text">KidLit Ai</h1>
          </div>
        </Link>
      </header>

      <div className="main-bodyp">
        <div className="robot-sectionp">
          <div className="bubblep">
            {isLastPage ? (
              <>🎉 Yay! We finished the story.<br />Come back soon for more adventures! 📚</>
            ) : (
              <>Hi buddy 👋 I’m <strong>KidLit AI</strong>!<br />Let’s read your picturebook 📖✨</>
            )}
          </div>
          <img
            src={isLastPage ? "/kidlitrobot.png" : "/kidlit_robot.png"}
            alt="Robot"
            className="robot-imgp"
          />
        </div>

        <div
          className={`story-boxp ${fade ? "fade-in" : "fade-out"} ${
            currentPage.type === "cover"
              ? "cover1-bg"
              : currentPage.type === "story"
              ? "story-bg"
              : "end-bg"
          }`}
        >
          <div className="story-contentp">
            {currentPage.type === "cover" && <h2 className="story-titlep">{currentPage.title}</h2>}
            {currentPage.type === "story" && (
              <div className="page-layoutp left-img-layout">
                {currentPage.image && <img src={currentPage.image} alt="story" className="page-imgp" />}
                <p className="story-textp">{currentPage.text}</p>
              </div>
            )}
            {currentPage.type === "end" && <h2 className="story-endp">{currentPage.text}</h2>}
          </div>
        </div>
      </div>

      <div className="page-controlsp">
        <button onClick={handlePrev} disabled={currentPageIndex === 0}>&lt;</button>
        <button onClick={handleNext} disabled={isLastPage}>&gt;</button>
      </div>
    </div>
    </div>
  );
};

export default Picturebook;
