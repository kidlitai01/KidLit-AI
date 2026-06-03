import React from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import "./PicturebookMobile.css";

function PicturebookMobile({
  pages = [],
  currentPageIndex = 0,
  fade,
  handleNext,
  handlePrev,
  isLastPage
}) {

  const navigate = useNavigate();

  if (!pages.length) {
    return null;
  }

  const currentPage =
    pages[currentPageIndex] || {};

  return (
    <div className="picturebook-mobile-home">

      <MobileHeader />

      <div
        className={`mobile-picture-card
          ${fade ? "fade-in" : "fade-out"}
          ${
            currentPage.type === "cover"
              ? "mobile-cover-bg"
              : currentPage.type === "story"
              ? "mobile-story-bg"
              : "mobile-end-bg"
          }
        `}
      >

        {currentPage.type === "cover" && (

          <div className="mobile-cover-content">

            <h2 className="mobile-picture-title">
              {currentPage.title}
            </h2>

          </div>

        )}

        {currentPage.type === "story" && (

          <div className="mobile-story-layout">

            {currentPage.image && (

              <img
                src={currentPage.image}
                alt="story"
                className="mobile-picture-image"
              />

            )}

            <div className="mobile-story-text-box">

              <p className="mobile-picture-text">
                {currentPage.text}
              </p>

            </div>

          </div>

        )}

        {currentPage.type === "end" && (

          <div className="mobile-end-content">

            <h2 className="mobile-end-title">
              
            </h2>

          </div>

        )}

      </div>

      <div className="mobile-page-indicator">

        Page {currentPageIndex + 1}
        {" "}of{" "}
        {pages.length}

      </div>

      <div className="mobile-picture-controls">

        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
        >
          ←
        </button>

        <button
          className="mobile-download-btn"
          onClick={() =>
            navigate(
              "/download-picturebook",
              {
                state: {
                  picturebook:
                    JSON.parse(
                      localStorage.getItem(
                        "picturebookStory"
                      )
                    ),
                },
              }
            )
          }
        >
          <img
            src="/download-logo.png"
            alt="download"
          />
        </button>

        <button
          onClick={handleNext}
          disabled={isLastPage}
        >
          →
        </button>

      </div>

    </div>
  );
}

export default PicturebookMobile;