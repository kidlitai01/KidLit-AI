import React from "react";
import "./AudioMobile.css";
import MobileHeader from "./MobileHeader";

function AudioMobile({
  title,
  page,
  totalPages,
  currentPageSentences,
  currentSentenceIndex,
  speaking,
  paused,
  handleToggle,
  handleStop,
  setPage
}) {
  return (
    <div className="audio-mobile-home">

    <MobileHeader />

      {/* Title Card */}

      <div className="audio-title-card">
        <h2>{title}</h2>
      </div>

      {/* Story Card */}

      <div className="audio-story-card">

        <div className="audio-story-content">

          {currentPageSentences.map((sentence, index) => {

            const globalIndex =
              page * 10 + index;

            return (
              <div
                key={globalIndex}
                className={`audio-sentence ${
                  globalIndex === currentSentenceIndex
                    ? "active-sentence-mobile"
                    : ""
                }`}
              >
                {sentence}
              </div>
            );
          })}

        </div>

      </div>

      {/* Audio Controls */}

      <div className="audio-controls-card">

        <button
          className="audio-control-btn"
          onClick={handleToggle}
        >
          {speaking && !paused
            ? "⏸ Pause"
            : "▶ Play"}
        </button>

        <button
          className="audio-control-btn"
          onClick={handleStop}
        >
          ⏹ Stop
        </button>

      </div>

      {/* Page Indicator */}

      <div className="audio-page-indicator">
        Page {page + 1} of {totalPages}
      </div>

      {/* Navigation */}

      <div className="audio-page-controls">

        <button
          onClick={() =>
            setPage((p) =>
              Math.max(p - 1, 0)
            )
          }
          disabled={page === 0}
        >
          ←
        </button>

        <button
          onClick={() =>
            setPage((p) =>
              Math.min(
                p + 1,
                totalPages - 1
              )
            )
          }
          disabled={page === totalPages - 1}
        >
          →
        </button>

      </div>

    </div>
  );
}

export default AudioMobile;