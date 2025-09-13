/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Storybook.css';

const Storybook = () => {
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
    document.body.classList.add('book-theme');

    return () => {
      document.body.classList.remove('book-theme');
    };
  }, []);

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

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) handleNext();
      if (touchEndX > touchStartX + 50) handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPageIndex, pages]);

  return (
    <div>
      <header className="app-header">
        <Link to="/" className="logo-link">
          <div className="logo-section">
            <img src="/kidlit-logo.png" alt="logo" className="logo-icon" />
            <h1 className="logo-text">KidLit Ai</h1>
          </div>
        </Link>
        <Link to="/AboutUs" className="about-btn">About Us</Link>
      </header>

      <div className="main-body">
        <div className="robot-section">
          <div className="bubble">
            {isLastPage ? (
              <>
                🎉 Yay! We finished the story.<br />
                Come back soon for more adventures! 📚
              </>
            ) : (
              <>
                Hey there!👋 I’m <strong>KidLit AI</strong><br />
                Let's enjoy your story<br />together buddy! 🫂
              </>
            )}
          </div>
          <img
            src={isLastPage ? "/kidlitrobot.png" : "/kidlit_robot.png"}
            alt="Robot"
            className="robot-img"
          />
        </div>
          <div 
            className={`story-box 
              ${currentPageIndex === 0 ? 'story-first-page' : ''} 
              ${pages[currentPageIndex] === '' ? 'story-last-page' : ''}`}
          >
            <div className={`story-content ${fade ? 'fade-in' : 'fade-out'}`}>
              {currentPageIndex === 0 ? (
                <h2 className="story-title">{pages[0]}</h2>
              ) : pages[currentPageIndex] === '' ? (
                <h2 className="story-end">{pages[currentPageIndex]}</h2>
              ) : (
                <p className="story-text">{pages[currentPageIndex] || ''}</p>
              )}
            </div>
          </div>


        <div className="audio-button-container">
          <div className="btn-wrapper">
            <button onClick={goToQuiz} className="quiz-button">
              <img src="/quiz-logo.png" alt="quiz" className="quiz-icon" />
            </button>
            <span className="tooltip">Take a fun quiz!</span>
          </div>

          <div className="btn-wrapper">
            <button onClick={goToAud} className="aud-button">
              <img src="/aud-logo.png" alt="aud" className="aud-icon" />
            </button>
            <span className="tooltip2">Listen to the story!</span>
          </div>

          <div className="btn-wrapper">
            <button onClick={goToDownload} className="download-button">
              <img src="/download-logo.png" alt="download" className="download-icon" />
            </button>
            <span className="tooltip3">Download your story!</span>
          </div>
        </div>
      </div>

      <div className="page-controls">
        <button onClick={handlePrev} disabled={currentPageIndex === 0}>&lt;</button>
        <button onClick={handleNext} disabled={isLastPage}>&gt;</button>
      </div>

      <div
        ref={hiddenRef}
        className="story-text measure"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          zIndex: -1,
          width: '600px',
          padding: '2rem',
          fontSize: '1.3rem',
          fontFamily: "'Fredoka', sans-serif",
          lineHeight: '1.7',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      ></div>
    </div>
  );
};

export default Storybook;
