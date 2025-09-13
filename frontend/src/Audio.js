import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./Audio.css";

const LINES_PER_PAGE = 10; 
const WORDS_PER_LINE = 12;

const Audio = () => {
  const location = useLocation();
  const { story = "", title = "My Story" } = location.state || {};

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(0);

  // 🔹 Split story into "pages" of max 10 lines
  useEffect(() => {
    if (story) {
      const words = story.split(/\s+/);
      let lines = [];
      let line = [];

      words.forEach((word) => {
        line.push(word);
        if (line.length >= WORDS_PER_LINE) {
          lines.push(line.join(" "));
          line = [];
        }
      });
      if (line.length > 0) lines.push(line.join(" "));

      // Now split lines into pages of 10 lines each
      const allPages = [];
      for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
        allPages.push(lines.slice(i, i + LINES_PER_PAGE));
      }

      setPages(allPages);
      setPage(0);
      setCurrentSentenceIndex(0);
    }
  }, [story]);

  const totalPages = pages.length;
  const currentPageSentences = pages[page] || [];

  // 🔹 Speak one "line"
  const speakSentence = useCallback(
    (index) => {
      const flatSentences = pages.flat();
      if (!flatSentences[index]) return;

      const u = new SpeechSynthesisUtterance(flatSentences[index]);
      u.lang = "hi-IN";

      const voices = speechSynthesis.getVoices();
      const hindiVoice = voices.find(
        (v) => v.lang === "hi-IN" && v.name.includes("Google")
      );
      if (hindiVoice) u.voice = hindiVoice;

      u.onend = () => {
        setTimeout(() => {
          setCurrentSentenceIndex((prev) => {
            if (prev < flatSentences.length - 1) {
              return prev + 1;
            } else {
              setSpeaking(false);
              setPaused(false);
              return prev;
            }
          });
        }, 50);
      };

      speechSynthesis.speak(u);
    },
    [pages]
  );

  // 🔹 Play / Pause toggle
  const handleToggle = useCallback(() => {
    const flatSentences = pages.flat();
    if (!speaking && flatSentences.length > 0) {
      setSpeaking(true);
      setPaused(false);
      setCurrentSentenceIndex(0);
      setPage(0);
      speakSentence(0);
    } else if (speaking && !paused) {
      speechSynthesis.pause();
      setPaused(true);
    } else if (speaking && paused) {
      speechSynthesis.resume();
      setPaused(false);
    }
  }, [speaking, paused, pages, speakSentence]);

  // 🔹 Stop completely
  const handleStop = useCallback(() => {
    speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    setCurrentSentenceIndex(0);
    setPage(0);
  }, []);

  // 🔹 Auto-continue + Auto page flip
  useEffect(() => {
    const flatSentences = pages.flat();
    if (speaking && !paused && currentSentenceIndex < flatSentences.length) {
      if (!speechSynthesis.speaking) {
        speakSentence(currentSentenceIndex);
      }
    }

    const currentPageStart = page * LINES_PER_PAGE;
    const currentPageEnd = currentPageStart + LINES_PER_PAGE - 1;

    if (
      speaking &&
      currentSentenceIndex > currentPageEnd &&
      page < totalPages - 1
    ) {
      setPage((p) => p + 1);
    }
  }, [
    currentSentenceIndex,
    speaking,
    paused,
    pages,
    speakSentence,
    page,
    totalPages,
  ]);

      useEffect(() => {
      document.body.classList.add('audio-theme');
  
      return () => {
        document.body.classList.remove('audio-theme');
      };
    }, []);

  // 🔹 Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleToggle();
      } else if (e.code === "ArrowLeft") {
        setPage((p) => Math.max(p - 1, 0));
      } else if (e.code === "ArrowRight") {
        setPage((p) => Math.min(p + 1, totalPages - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggle, totalPages]);

  return (
    <div>
      <header className="app-header">
        <Link to="/" className="logo-link">
          <div className="logo-section">
            <img src="/kidlit-logo.png" alt="logo" className="logo-icon" />
            <h1 className="logo-text">KidLit Ai</h1>
          </div>
        </Link>
        <Link to="/AboutUs" className="about-btn">
          About Us
        </Link>
      </header>

      <div className="audio-wrapper">
<div className="story-card">
  <div className="story-head">
    <h2 className="story-heading">{title}</h2>
  </div>

  {/* Story text */}
  <div className="story-paragraph">
    {currentPageSentences.map((sentence, index) => {
      const globalIndex = page * LINES_PER_PAGE + index;
      return (
        <motion.div
          key={globalIndex}
          className={`sentence ${
            globalIndex === currentSentenceIndex ? "active-sentence" : ""
          }`}
          initial={{ opacity: globalIndex === currentSentenceIndex ? 0 : 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {sentence}
        </motion.div>
      );
    })}
  </div>
  </div>

  {/* Pagination / Page Controls */}
  <div className="page-control">
    <button
      className="page-btn"
      onClick={() => setPage((p) => Math.max(p - 1, 0))}
      disabled={page === 0}
    >
      &lt;
    </button>

    <div className="controls">
      <button className="play-btn" onClick={handleToggle}>
        {speaking && !paused ? (
          <img src="/pause-icon.png" alt="Pause" className="control-icon" />
        ) : (
          <img src="/play-icon.png" alt="Play" className="control-icon" />
        )}
      </button>
    </div>

    <button
      className="page-btn"
      onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
      disabled={page === totalPages - 1}
    >
      &gt;
    </button>

    <div className="reset">
      <button className="reset-btn" onClick={handleStop} disabled={!speaking}>
        <img src="/reset.png" alt="reset" className="reset-icon" />
      </button>
    </div>
  </div>
</div>

      <div>
</div>

    </div>
  );
};

export default Audio;
