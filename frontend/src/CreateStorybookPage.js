import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CreateStorybookPage.css';

const CreateStorybookPage = () => {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [names, setNames] = useState(['']);
  const [ageGroup, setAgeGroup] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null); // ✅ added preview state
  const navigate = useNavigate();
  const [language, setLanguage] = useState('english');
  const [isGenerating, setIsGenerating] = useState(false);

  const addNameField = () => setNames([...names, '']);

  const handleNameChange = (index, value) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  // ✅ update preview when photo changes
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

    useEffect(() => {
    document.body.classList.add('Story-theme');
    return () => {
      document.body.classList.remove('Story-theme');
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('Story-theme');
    return () => {
      document.body.classList.remove('Story-theme');
    };
  }, []);

  const themes = [
    'Sci-Fi', 'Adventure', 'Fantasy',
    'Mystery', 'Fairytale', 'Educational',
    'Funny', 'Action', 'Magic'
  ];

  const isMobile = () => window.innerWidth <= 768;

 const BACKEND_URL = "https://kidlit-storybook-backend.onrender.com";

const handleGenerate = async () => {
  if (isGenerating) return;
  setIsGenerating(true);

  const defaultStory = `Oops! Something went wrong, but don't worry! Here's a fun little story: Once upon a time, a curious child clicked the Generate button. Even though the magic hiccupped, their imagination soared, and a new adventure began anyway!`;

  if (!selectedTheme) {
    alert('Please select a theme.');
    setIsGenerating(false);
    return;
  }

  const navigateTo = isMobile() ? '/storybook-mobile' : '/storybook';

  try {
    if (names.some(n => n.trim() !== '') || ageGroup) {
      const res = await fetch(`${BACKEND_URL}/api/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          names: names.filter(n => n.trim() !== ''),
          ageGroup,
          theme: selectedTheme,
          language
        })
      });

      const data = await res.json();
      localStorage.setItem('generatedTitle', data.title || 'My Story');
      localStorage.setItem('generatedStory', data.story || defaultStory);
      navigate(navigateTo);

    } else if (photo) {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('theme', selectedTheme);
      formData.append('language', language);
      if (ageGroup) formData.append('ageGroup', ageGroup);
      if (names && names.length > 0) {
        names.filter(n => n.trim() !== '').forEach((n) => {
          formData.append('names[]', n);
        });
      }

      const res = await fetch(`${BACKEND_URL}/api/generate-from-photo`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      localStorage.setItem('generatedTitle', data.title || 'My Story');
      localStorage.setItem('generatedStory', data.story || defaultStory);
      navigate(navigateTo);
    } else {
      alert('Please enter at least one name or age group, OR upload a photo.');
    }
  } catch (err) {
    console.error(err);
    localStorage.setItem('generatedTitle', 'My Story');
    localStorage.setItem('generatedStory', defaultStory);
    navigate(navigateTo);
  } finally {
    setIsGenerating(false);
  }
};


  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="logo-link">
          <div className="logo-section">
            <img src="/kidlit-logo.png" alt="logo" className="logo-icon" />
            <h1 className="logo-text">KidLit Ai</h1>
          </div>
        </Link>
        <Link to="/AboutUs" className="about-btn">About Us</Link>
      </header>

      <div className="storybook-container">
        <div className="left-panel">
          <h2 className="main-title">Create Storybook</h2>
          <p className="subtitle"><strong>Select a story theme and fill out the form</strong></p>
          <p className="description">Let KidLit AI turn your ideas into a delightful storybook adventure!</p>

          <div className="theme-buttons">
            {themes.map((theme) => (
              <button
                key={theme}
                className={`theme-btn ${selectedTheme === theme ? 'active' : ''}`}
                onClick={() => setSelectedTheme(theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <p className="right-instruction">
            <strong>Type the names of the children in the text boxes below</strong>
          </p>
          <p className="description1">So we can make the story truly yours!</p>

          <label>Names</label>
          {names.map((n, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Enter Child name ${index + 1}`}
              value={n}
              onChange={(e) => handleNameChange(index, e.target.value)}
              style={{ marginBottom: '8px' }}
            />
          ))}
          <button type="button" onClick={addNameField} className="add-name-btn">
            + Add More Name
          </button>

          <label>Age</label>
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
            <option value="">Choose Age Group</option>
            <option value="3–5">3–5</option>
            <option value="6–8">6–8</option>
            <option value="9–12">9–12</option>
          </select>

          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>

          <p className="or-text">OR</p>

          <button className="generate-btn" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>

        <div className="camera-upload">
          <div className="btn-wrapper">
            {!preview ? (
              <>
                <label htmlFor="camera" className="camera-icon">
                  <img src="/cam-logo.png" alt="cam" className="cam-icon" />
                </label>
                <input
                  id="camera"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
                <span className="tooltip4">Capture or upload <br />a picture here!</span>
              </>
            ) : (
              <div className="preview-box mt-3">
                <img src={preview} alt="Preview" className="preview-image" />

                {/* Optional remove button */}
                <button
                  className="remove-btn"
                  onClick={() => {
                    setPreview(null);
                    setPhoto(null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStorybookPage;
