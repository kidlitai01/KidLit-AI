import React, { useState, } from 'react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './AboutUs.css';

function AboutUs() {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      rating: `${rating} star(s) ⭐`, // ✅ rating shown in email
    };

    // 1️⃣ Send feedback to YOU
    emailjs
      .send(
        'service_gy8bo6c',   // ✅ Your Service ID
        'template_98g21be',  // ✅ Admin Template ID
        templateParams,
        'CBX7OfnRIDiufleiy'  // ✅ Your Public Key
      )
      .then(() => {
        // 2️⃣ Auto-reply to USER
        emailjs.send(
          'service_gy8bo6c',
          'template_6xto8n9', // ✅ Auto-reply Template ID
          templateParams,
          'CBX7OfnRIDiufleiy'
        );

        setStatus('✅ Thank you for your feedback!');
        setFormData({ name: '', email: '', message: '' });
        setRating(0);
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        setStatus('❌ Failed to send feedback. Try again!');
      });
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

  <section className="about-section">
    {/* Left Section: Intro Text */}
    <section className="left-section">
      <p className="intro">
       KidLit AI is an innovative educational platform designed to create interactive children’s storybooks and picture books. The project uses AI-powered storytelling to generate personalized stories based on a child’s name, age group, chosen theme, and even uploaded images. It aims to foster creativity, reading skills, and imagination in children aged 3–12 years, providing an engaging, fun, and safe learning experience. The platform includes features like text-to-speech narration, word highlighting, bilingual support (English/Hindi), and dynamic story illustrations.
      </p>
    </section>

    {/* Right Section: Feedback Form */}
    <section className="right-section">
      <div className="feedback-form">
        <h3>Share Your Feedback 💌</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Feedback"
            value={formData.message}
            onChange={handleInputChange}
            required
          />

          {/* Star Rating */}
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? 'star filled' : 'star'}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <button type="submit">Send Feedback</button>
        </form>
        {status && <p className="status">{status}</p>}
      </div>
    </section>
  </section>
</div>

  );
}

export default AboutUs;
