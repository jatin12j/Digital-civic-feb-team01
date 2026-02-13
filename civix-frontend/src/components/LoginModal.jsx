import React from "react";
import "../styles/modal.css";

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* Close Button */}
        <span className="close-btn" onClick={onClose}>
          ✖
        </span>

        <div className="modal-content">
          {/* LEFT SIDE */}
          <div className="modal-left">
            <h2>Welcome to Civix 👋</h2>
            <p>Join our platform to make your voice heard in local governance</p>

            <input type="email" placeholder="Example@email.com" />
            <input type="password" placeholder="At least 8 characters" />

            <button className="login-btn">Sign in</button>
          </div>

          {/* RIGHT SIDE */}
          <div className="modal-right">
            <h2>Civix</h2>
            <p>Digital Civic Engagement Platform</p>
            <ul>
              <li>Create and Sign Petitions</li>
              <li>Participate in Public Polls</li>
              <li>Track Official Responses</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginModal;
