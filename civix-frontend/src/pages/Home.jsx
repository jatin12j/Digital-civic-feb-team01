import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Civix</div>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#how">How It Works</a>
          <Link to="/login">Login</Link>
          <Link to="/register">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Empowering Citizens. <br />
            Strengthening Democracy.
          </h1>

          <p>
            Create petitions, vote in polls, and track official responses.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Create Petition</button>
            <button className="secondary-btn">Explore Issues</button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-section">
        <h2>How Civix Works</h2>
      </section>
    </>
  );
}

export default Home;
