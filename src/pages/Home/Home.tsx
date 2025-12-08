import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

/**
 * The landing page of the note‑taking app.
 * Modern, appealing design with hero section and feature highlights.
 */
const Home: React.FC = () => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-hero-title">Zealot Notes</h1>
        <p className="home-hero-subtitle">
          Your thoughts, beautifully organized. Fast, secure, and private note-taking made simple.
        </p>
        <div className="home-cta-buttons">
          <Link to="/notes" className="home-cta-primary">
            Start Writing
            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="home-features">
        <div className="home-features-container">
          <h2 className="home-features-title">Why Choose Zealot Notes?</h2>
          <div className="home-features-grid">
            <div className="home-feature-card">
              <span className="home-feature-icon">⚡</span>
              <h3 className="home-feature-title">Lightning Fast</h3>
              <p className="home-feature-description">
                Instant load times and seamless performance. Your notes are always ready when you need them.
              </p>
            </div>

            <div className="home-feature-card">
              <span className="home-feature-icon">🔒</span>
              <h3 className="home-feature-title">Privacy First</h3>
              <p className="home-feature-description">
                Your notes stay on your device. No cloud storage, no tracking, complete privacy guaranteed.
              </p>
            </div>

            <div className="home-feature-card">
              <span className="home-feature-icon">✨</span>
              <h3 className="home-feature-title">Clean Interface</h3>
              <p className="home-feature-description">
                Distraction-free writing experience with a beautiful, modern interface that stays out of your way.
              </p>
            </div>

            <div className="home-feature-card">
              <span className="home-feature-icon">💾</span>
              <h3 className="home-feature-title">Auto-Save</h3>
              <p className="home-feature-description">
                Never lose your work. Every change is automatically saved to your browser's local storage.
              </p>
            </div>

            <div className="home-feature-card">
              <span className="home-feature-icon">⌨️</span>
              <h3 className="home-feature-title">Keyboard Shortcuts</h3>
              <p className="home-feature-description">
                Power user features like Cmd/Ctrl + S to save. Write faster without lifting your hands.
              </p>
            </div>

            <div className="home-feature-card">
              <span className="home-feature-icon">📱</span>
              <h3 className="home-feature-title">Responsive Design</h3>
              <p className="home-feature-description">
                Works perfectly on any device. Desktop, tablet, or mobile - your notes adapt to your screen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;