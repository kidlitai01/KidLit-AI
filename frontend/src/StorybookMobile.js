/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StorybookMobile.css';
import MobileHeader from "./MobileHeader";

const StorybookMobile = () => {
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [title, setTitle] = useState("My Story");   // ✅ store title in state
  const [story, setStory] = useState("");           // ✅ store story in state
  const hiddenRef = useRef(null);
  const navigate = useNavigate();

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      const next = currentPageIndex + 1;
      if (next < pages.length) {
        setCurrentPageIndex(next);
      }
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setFade(false);
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev - 1);
        setFade(true);
      }, 300);
    }
  };

  const goToQuiz = () => {
    navigate('/quiz', { state: { story } });
  };

  const goToAud = () => {
    navigate('/Audio', { state: { story, title } });
  };

const goToDownload = () => {
  navigate("/download-story", {
    state: { story, title },
  });
};




  useEffect(() => {
    const savedTitle = localStorage.getItem('generatedTitle') || 'My Story';
    const storyText = localStorage.getItem('generatedStory') || '';

    setTitle(savedTitle);
    setStory(storyText);

    const paragraphList = storyText
      .replace(/\n+/g, ' ')
      .split(/(?<=[.!?])\s+/g)
      .filter((p) => p.trim().length > 0);

    const hiddenDiv = hiddenRef.current;
    let pagesTemp = [];
    let currentPage = '';

    // First page = title
    pagesTemp.push(savedTitle);

    paragraphList.forEach((sentence, index) => {
      hiddenDiv.innerText = currentPage + ' ' + sentence;

      if (hiddenDiv.offsetHeight > 350) {
        if (currentPage.trim().length > 0) {
          pagesTemp.push(currentPage.trim());
        }
        currentPage = sentence;
      } else {
        currentPage += ' ' + sentence;
      }

      if (index === paragraphList.length - 1 && currentPage.trim().length > 0) {
        pagesTemp.push(currentPage.trim());
      }
    });

    pagesTemp.push('');
    setPages(pagesTemp);
  }, []);

  const isLastPage = currentPageIndex === pages.length - 1;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowRight') handleNext();
      if (e.code === 'ArrowLeft') handlePrev();
    };


    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPageIndex, pages]);





 return (
  <div className="storybook-mobile-home">

<MobileHeader />

    <div
      className={`story-reading-card
        ${currentPageIndex === 0 ? "story-first-page-mobile" : ""}
        ${pages[currentPageIndex] === "" ? "story-last-page-mobile" : ""}
      `}
    >
    

      <div
        className={`mobile-story-content ${
          fade ? "fade-in" : "fade-out"
        }`}
      >

        {currentPageIndex === 0 ? (

          <h2 className="mobile-story-title">
            {pages[0]}
          </h2>

        ) : pages[currentPageIndex] === '' ? (

          <h2 className="mobile-story-end">
          </h2>

        ) : (

          <p className="mobile-story-text">
            {pages[currentPageIndex] || ''}
          </p>

        )}

      </div>

    </div>

    <div className="mobile-action-grid">

      <button
        className="mobile-action-btn"
        onClick={goToQuiz}
      >
        <img src="/quiz-logo.png" alt="" />
        Quiz
      </button>

      <button
        className="mobile-action-btn"
        onClick={goToAud}
      >
        <img src="/aud-logo.png" alt="" />
        Read
      </button>

      <button
        className="mobile-action-btn"
        onClick={goToDownload}
      >
        <img src="/download-logo.png" alt="" />
        PDF
      </button>

    </div>

    <div className="page-indicator">
      Page {currentPageIndex + 1} of {pages.length}
    </div>

    <div className="mobile-page-controls">

      <button
        onClick={handlePrev}
        disabled={currentPageIndex === 0}
      >
        ←
      </button>

      <button
        onClick={handleNext}
        disabled={isLastPage}
      >
        →
      </button>

    </div>

    <div
      ref={hiddenRef}
      className="story-text1 measure"
      style={{
        position: 'absolute',
        visibility: 'hidden',
        zIndex: -1,
        width: '90vw',
        padding: 0,
        margin: 0,
        fontSize: '1rem',
        lineHeight: '3.3',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}
    />

  </div>
);
}

export default StorybookMobile;