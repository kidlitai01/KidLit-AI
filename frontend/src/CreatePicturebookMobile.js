import React from "react";
import MobileHeader from "./MobileHeader";
import "./CreatePicturebookMobile.css";

function CreatePicturebookMobile({
  selectedGender,
  setSelectedGender,
  selectedTheme,
  setSelectedTheme,
  name,
  setName,
  ageGroup,
  setAgeGroup,
  language,
  setLanguage,
  handleGenerate,
  isGenerating,
  themes
}) {
  return (
    <div className="picture-mobile-home">

      <MobileHeader />

      <div className="picture-title-card">
        <h2>Create Picture Book</h2>
      </div>

      {/* Theme */}

      <div className="picture-glass-card">

        <label>Select Theme</label>

        <div className="picture-theme-grid">

          {themes.map((theme) => (

            <button
              key={theme}
              className={`picture-theme-btn ${
                selectedTheme === theme
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedTheme(theme)
              }
            >
              {theme}
            </button>

          ))}

        </div>

      </div>

      {/* Gender */}

      <div className="picture-glass-card">

        <label>Select Gender</label>

        <div className="mobile-gender-options">

          <div
            className={`mobile-gender-box boy ${
              selectedGender === "boy"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setSelectedGender("boy")
            }
          >
            <img
              src="/boy.png"
              alt="boy"
              className="mobile-gender-icon"
            />

            <p>Boy</p>

          </div>

          <div
            className={`mobile-gender-box girl ${
              selectedGender === "girl"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setSelectedGender("girl")
            }
          >
            <img
              src="/girl.png"
              alt="girl"
              className="mobile-gender-icon"
            />

            <p>Girl</p>

          </div>

        </div>

      </div>

      {/* Name */}

      <div className="picture-glass-card">

        <label>Child Name</label>

        <input
          type="text"
          placeholder="Enter Child Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

      </div>

      {/* Age */}

      <div className="picture-glass-card">

        <label>Age Group</label>

        <select
          value={ageGroup}
          onChange={(e) =>
            setAgeGroup(e.target.value)
          }
        >
          <option value="">
            Choose Age Group
          </option>

          <option value="3-5">
            3–5
          </option>

          <option value="6-8">
            6–8
          </option>

          <option value="9-12">
            9–12
          </option>

        </select>

      </div>

      {/* Language */}

      <div className="picture-glass-card">

        <label>Language</label>

        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value)
          }
        >
          <option value="">
            Default (English)
          </option>

          <option value="english">
            English
          </option>

          <option value="hindi">
            Hindi
          </option>

        </select>

      </div>

      <button
        className="start-btn"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating
          ? "Loading..."
          : "Generate Picture Book 🚀"}
      </button>

    </div>
  );
}

export default CreatePicturebookMobile;