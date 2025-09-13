import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const storyText = localStorage.getItem('generatedStory');
    const lang = localStorage.getItem('storyLanguage') || 'english';
    setLanguage(lang);

    if (!storyText) return;

    fetch('http://localhost:5000/api/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story: storyText, language: lang }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.quiz) {
          setQuestions(data.quiz);
        } else if (data.questions) {
          setQuestions(data.questions); // fallback
        } else {
          setError('No quiz questions received.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Quiz API Error:', err);
        setError('Failed to load quiz. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleOptionSelect = (qIndex, option) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: option });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getText = (en, hi) => (language === 'hindi' ? hi : en);

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="logo-link">
          <div className="logo-section">
            <img src="/kidlit-logo.png" alt="logo" className="logo-icon" />
            <h1 className="logo-text">KidLit Ai</h1>
          </div>
        </Link>
        <Link to="/AboutUs" className="about-btn">{getText('About Us', 'हमारे बारे में')}</Link>
      </header>

      <div className="quiz-container">
        <h3>{getText('Story Quiz', 'कहानी प्रश्नोत्तरी')}</h3>

        {loading && <p>{getText('Loading questions...', 'प्रश्न लोड हो रहे हैं...')}</p>}
        {error && <p className="error">{error}</p>}

        {!loading &&
          questions.map((q, index) => (
            <div key={index} className="quiz-question">
              <p className="question-text">
                {index + 1}. {q.question}
              </p>
              <div className="options">
                {q.options.map((option, optIndex) => {
                  const isSelected = selectedAnswers[index] === option;
                  const isCorrect = q.answer === option;
                  const show = showResults;

                  let className = 'option';
                  if (show) {
                    className += isCorrect ? ' correct' : '';
                    if (isSelected && !isCorrect) className += ' incorrect';
                  } else if (isSelected) {
                    className += ' selected';
                  }

                  return (
                    <div
                      key={optIndex}
                      className={className}
                      onClick={() => !show && handleOptionSelect(index, option)}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        {!loading && questions.length > 0 && !showResults && (
          <button className="submit-btn" onClick={handleSubmit}>
            {getText('Submit Quiz', 'प्रश्नोत्तरी जमा करें')}
          </button>
        )}

        {!loading && showResults && (
          <div className="results">
            <h3>Your Results:</h3>
            <p>
              Score:{' '}
              {
                Object.keys(selectedAnswers).filter(index => {
                  const q = questions[Number(index)];
                  return selectedAnswers[index] === q.answer;
                }).length
              }{' '}
              / {questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
