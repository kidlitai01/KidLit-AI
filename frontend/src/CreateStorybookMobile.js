import React from "react";
import "./CreateStorybookMobile.css";
import MobileHeader from "./MobileHeader";

function CreateStorybookMobile({
  selectedTheme,
  setSelectedTheme,
  names,
  addNameField,
  handleNameChange,
  ageGroup,
  setAgeGroup,
  language,
  setLanguage,
  preview,
  handlePhotoChange,
  setPreview,
  setPhoto,
  handleGenerate,
  isGenerating,
  themes
}) {

  return (
    <div className="story-mobile-home">

<MobileHeader />


      <div className="story-title-card">
        <h2>Create Storybook</h2>
      </div>

      <div className="story-glass-card">

        <label>Select Theme</label>

        <div className="mobile-theme-grid">
          {themes.map((theme) => (
            <button
              key={theme}
              className={`mobile-theme-btn ${
                selectedTheme === theme ? "active" : ""
              }`}
              onClick={() => setSelectedTheme(theme)}
            >
              {theme}
            </button>
          ))}
        </div>

      </div>

      <div className="story-glass-card">

        <label>Names</label>

        {names.map((n, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Child Name ${index + 1}`}
            value={n}
            onChange={(e) =>
              handleNameChange(index, e.target.value)
            }
          />
        ))}

        <button
          className="add-name-mobile-btn"
          onClick={addNameField}
        >
          + Add More Name
        </button>

      </div>

      <div className="story-glass-card">

        <label>Age Group</label>

        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
        >
          <option value="">
            Choose Age Group
          </option>

          <option value="3–5">
            3–5
          </option>

          <option value="6–8">
            6–8
          </option>

          <option value="9–12">
            9–12
          </option>
        </select>

      </div>

      <div className="story-glass-card">

        <label>Language</label>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
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

      <div className="story-glass-card">

        <label>Upload Photo (Optional)</label>

        {!preview ? (
          <>
            <label
            htmlFor="camera"
            className="mobile-upload-btn"
            >
            Upload Photo 📷
            </label>

            <input
              id="camera"
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </>
        ) : (
          <div className="mobile-preview-box">

            <img
              src={preview}
              alt="preview"
              className="mobile-preview-image"
            />

            <button
              className="remove-preview-btn"
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

      <button
        className="start-btn"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating
          ? "Generating..."
          : "Generate Story 🚀"}
      </button>

    </div>
  );
}

export default CreateStorybookMobile;