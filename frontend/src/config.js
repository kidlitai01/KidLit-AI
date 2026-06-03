const isLocal = window.location.hostname === "localhost";

const API = {
  storybook: isLocal
    ? "http://localhost:5000"
    : "https://kidlit-storybook-backend.onrender.com",

  picturebook: isLocal
    ? "http://localhost:5001"
    : "https://kidlit-picturebook-backend.onrender.com",
};

export default API;