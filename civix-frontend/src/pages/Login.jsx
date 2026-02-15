import React from "react";
import "../styles/login.css";
import welcomeImg from "../assets/image1.png";
import Google from "../assets/image2.png";
import Facebook from "../assets/image3.png";
import bgImage from "../assets/image.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // Google login handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: codeResponse.code }),
        });
        const data = await res.json();
        console.log("Login Success:", data);
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = '/'; // Redirect to home page
        }
      } catch (err) {
        console.error(err);
      }
    },
    flow: 'auth-code',
  });

  return (
    <div className="login-wrapper">

      {/* LEFT SIDE */}
      <div className="login-left">
        <img src={welcomeImg} className="login-image" alt="welcome" />

        <h2>Welcome to Civix 👋</h2>
        <p className="subtitle">
          Join our platform to make your voice heard in local governance
        </p>

        <div className="form-box">
          <label>Email</label>
          <input type="email" placeholder="Example@email.com" />

          <label>Password</label>
          <input type="password" placeholder="At least 8 characters" />

          <div className="forgot">
            <a href="#">Forgot Password?</a>
          </div>

          <button className="signin-btn">Sign in</button>

          <div className="divider">OR</div>

          <div className="social-media">
            <button className="google-btn" onClick={() => handleGoogleLogin()}>
              <img src={Google} alt="google" className="icon" />
              Sign in with Google
            </button>

            <button className="facebook-btn">
              <img src={Facebook} alt="Facebook" className="icon" />
              Sign in with Facebook
            </button>
          </div>
        </div>

        <p className="signup-text">
          Don't have an account? <span onClick={() => navigate('/register')}>Sign up</span>
        </p>

        <p className="footer">© 2026 ALL RIGHTS RESERVED</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right" >
        <div className="right-overlay">
          <div className="right-content">

            {/* Quote */}
            <h2 className="quote">
              "Every voice matters. Every signature counts. Together we create change."
            </h2>
            <p className="quote-sub">
              Join thousands of activists making a difference.
            </p>

            {/* Brand */}
            <div className="brand">
              <i className="fa-solid fa-landmark"></i>
              <h2>Civix</h2>
            </div>

            <h4 className="platform-title">
              Digital Civic Engagement Platform
            </h4>

            <p className="description">
              Civix enables citizens to engage in local governance through
              petitions, voting, and tracking officials’ responses.
              Join our platform to make your voice heard and drive
              positive change in your community.
            </p>

            {/* Features */}
            <div className="features">
              <div className="feature-item">
                <i className="fa-regular fa-pen-to-square"></i>
                <div>
                  <h5>Create and Sign Petitions</h5>
                  <p>Easily create petitions for issues you care about.</p>
                </div>
              </div>

              <div className="feature-item">
                <i className="fa-regular fa-chart-bar"></i>
                <div>
                  <h5>Participate in Public Polls</h5>
                  <p>Vote and see real-time community sentiment.</p>
                </div>
              </div>

              <div className="feature-item">
                <i className="fa-regular fa-circle-check"></i>
                <div>
                  <h5>Track Official Responses</h5>
                  <p>Monitor how officials respond to concerns.</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats">
              <div className="stat-item">
                <h3>12.5K</h3>
                <p>Active Petitions</p>
              </div>

              <div className="stat-item">
                <h3>2.8M</h3>
                <p>Community Members</p>
              </div>

              <div className="stat-item">
                <h3>850+</h3>
                <p>Victories Won</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;
