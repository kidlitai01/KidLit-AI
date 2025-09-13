/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StorybookMobile.css';

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

const [sidebarOpen, setSidebarOpen] = useState(false);



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
<button onClick={goToQuiz} className="quiz-button1">
              <img src="/quiz-logo.png" alt="quiz" className="quiz-icon1" />
            </button>
                        <span className="tooltips">Take a fun quiz!</span>
                        </div>
  <div className="btn-wrapper">
            <button onClick={goToAud} className="aud-button1">
              <img src="/aud-logo.png" alt="aud" className="aud-icon1" />
            </button>  
                        <span className="tooltips2">Listen to the story!</span>
                        </div>
  <div className="btn-wrapper">
            <button onClick={goToDownload} className="download-button1">
              <img src="/download-logo.png" alt="download" className="download-icon1" />
            </button>
                        <span className="tooltips3">Download your story!</span>

            </div>
              <div className="btn-wrapper">

                    <Link to="/AboutUs" className="about-btns">
                    <img src="/about.png" alt="about" className="about-icon" />
            </Link>
                                    <span className="tooltips4">About us</span>
            </div>
            </div>


      <header className="app-headers">
        <Link to="/" className="logo-link">
          <div className="logo-section">
            <img src="/kidlit-logo.png" alt="logo" className="logo-icon" />
            <h1 className="logo-text">KidLit Ai</h1>
          </div>
        </Link>
      </header>

      <div className="main-body1">
        <div 
            className={`story-box1 
              ${currentPageIndex === 0 ? 'story-first-page1' : ''} 
              ${pages[currentPageIndex] === '' ? 'story-last-page1' : ''}`}
          >
            <div className={`story-content1 ${fade ? 'fade-in' : 'fade-out'}`}>
              {currentPageIndex === 0 ? (
                <h2 className="story-title1">{pages[0]}</h2>
              ) : pages[currentPageIndex] === '' ? (
                <h2 className="story-end1">{pages[currentPageIndex]}</h2>
              ) : (
                <p className="story-text1">{pages[currentPageIndex] || ''}</p>
              )}
            </div>
        </div>


      </div>

      <div className="page-controls1">
        <button onClick={handlePrev} disabled={currentPageIndex === 0}>&lt;</button>
        <button onClick={handleNext} disabled={isLastPage}>&gt;</button>
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

            
      ></div>
    </div>
  );
};

export default StorybookMobile;