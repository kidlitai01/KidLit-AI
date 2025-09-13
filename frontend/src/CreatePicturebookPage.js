import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CreatePicturebookPage.css";

const CreatePicturebookPage = () => {
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  const themes = [
    "Sci-Fi", "Adventure", "Fantasy",
    "Mystery", "Fairytale", "Educational",
    "Funny", "Action", "Magic"
  ];

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    if (!selectedGender || !selectedTheme || !ageGroup || !name.trim()) {
      alert("Please select gender, enter a name, select age group, and choose a theme.");
      setIsGenerating(false);
      return;
    }

    try {
      // Call backend API
      const res = await fetch(
        `https://kidlit-picturebook-backend.onrender.com/api/story/${selectedGender.toLowerCase()}/${selectedTheme.toLowerCase()}/${ageGroup}?name=${encodeURIComponent(name)}`
      );

      if (!res.ok) throw new Error("No story found");

      const data = await res.json();

      // ✅ Store entire story + images in localStorage
      localStorage.setItem("picturebookStory", JSON.stringify(data));

      // Navigate to Picturebook reader
      navigate("/picturebook");
    } catch (err) {
      console.error(err);
      alert("No stories found for the selected options.");
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

      <div className="storybook-containers">
        <div className="left-panel">
          <h2 className="main-title">Create Picture Book</h2>
          <p className="subtitle"><strong>Fill out the form below</strong></p>

          <h3>Select Theme</h3>
          <div className="theme-buttons">
            {themes.map((theme) => (
              <button
                key={theme}
                className={`theme-btn ${selectedTheme === theme ? "active" : ""}`}
                onClick={() => setSelectedTheme(theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <h3>Select Gender</h3>
          <div className="gender-options">
            <div
              className={`gender-box boy ${selectedGender === "boy" ? "selected" : ""}`}
              onClick={() => setSelectedGender("boy")}
            >
              <img src="/boy.png" alt="Boy" className="gender-icon" />
              <p>Boy</p>
            </div>

            <div
              className={`gender-box girl ${selectedGender === "girl" ? "selected" : ""}`}
              onClick={() => setSelectedGender("girl")}
            >
              <img src="/girl.png" alt="Girl" className="gender-icon" />
              <p>Girl</p>
            </div>
          </div>

          <label>Child's Name</label>
          <input
            type="text"
            placeholder="Enter Child's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Age Group</label>
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
            <option value="">Choose Age Group</option>
            <option value="3-5">3–5</option>
            <option value="6-8">6–8</option>
            <option value="9-12">9–12</option>
          </select>

          <button className="generate-btnp" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Loading..." : "Generate Picture Book"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePicturebookPage;
