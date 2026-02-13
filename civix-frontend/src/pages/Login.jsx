import React from "react";
import "../styles/login.css";
import welcomeImg from "../assets/image.png";
function Login() {
  return (
    <div className="login-wrapper">

      {/* LEFT SIDE */}
      <div className="login-left">
        <img
         src={welcomeImg} alt="welcome" 
          className="login-image"
        />

        <h2>Welcome to Civix 👋</h2>
        <p className="subtitle">
          Join our platform to make your voice heard in local governance
        </p>

        <label>Email</label>
        <input type="email" placeholder="Example@email.com" />

        <label>Password</label>
        <input type="password" placeholder="At least 8 characters" />

        <div className="forgot">
          <a href="#">Forgot Password?</a>
        </div>

        <button className="signin-btn">Sign in</button>

        <div className="divider">Or</div>

        <button className="google-btn">Sign in with Google</button>
        <button className="facebook-btn">Sign in with Facebook</button>

        <p className="signup-text">
          Don't you have an account? <span>Sign up</span>
        </p>
<div><p>© 2026 ALL RIGHTS RESERVED</p></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <h1>Civix</h1>
        <h3>Digital Civic Engagement Platform</h3>

        <ul>
          <li>Create and Sign Petitions</li>
          <li>Participate in Public Polls</li>
          <li>Track Official Responses</li>
        </ul>

        <div className="stats">
          <div>
            <h2>12.5K</h2>
            <p>Active Petitions</p>
          </div>
          <div>
            <h2>2.8M</h2>
            <p>Community Members</p>
          </div>
          <div>
            <h2>850+</h2>
            <p>Victories Won</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;
