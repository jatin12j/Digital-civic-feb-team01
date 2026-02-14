import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { Landmark, FileText, Vote, CheckCircle, MapPin, User, Mail, Lock, ArrowRight, Rocket } from "lucide-react";
import "../styles/register.css";
import illustration from "../assets/image.png"; // Reusing existing image as placeholder/illustration

function Register() {
    const [role, setRole] = useState("citizen");
    const navigate = useNavigate();

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
                    navigate('/');
                }
            } catch (err) {
                console.error(err);
            }
        },
        flow: 'auth-code',
    });

    return (
        <div className="register-wrapper">
            <div className="register-container">

                {/* LEFT SIDE - Blue Panel */}
                <div className="register-left">
                    <div className="brand-header">
                        <Landmark size={28} color="white" />
                        <h2>Civix</h2>
                    </div>

                    <h1>Join the Civic Revolution <Rocket size={32} style={{ display: 'inline', verticalAlign: 'middle' }} /></h1>
                    <p className="sub-header">
                        Create petitions, participate in polls, and track official responses.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="icon-wrapper">
                                <FileText size={20} />
                            </div>
                            <div className="feature-content">
                                <h4>Create & Sign Petitions</h4>
                                <p>Easily start or support petitions on local or national issues.</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="icon-wrapper">
                                <Vote size={20} />
                            </div>
                            <div className="feature-content">
                                <h4>Participate in Public Polls</h4>
                                <p>Share your opinions and see the results of community polls.</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="icon-wrapper">
                                <CheckCircle size={20} />
                            </div>
                            <div className="feature-content">
                                <h4>Track Official Responses</h4>
                                <p>Get notified of official responses from community leaders and track progress.</p>
                            </div>
                        </div>
                    </div>

                    <div className="left-illustration">
                        <img src={illustration} alt="Community Illustration" className="illustration-img" />
                    </div>
                </div>

                {/* RIGHT SIDE - Form Panel */}
                <div className="register-right">
                    <h2>Create Your Account</h2>
                    <p className="subtitle">Start engaging with your community today.</p>

                    <form className="register-form">

                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <input type="text" placeholder="Full Name" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <input type="email" placeholder="Email Address" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <input type="password" placeholder="Must be at least 8 characters" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <div className="input-wrapper">
                                <select defaultValue="">
                                    <option value="" disabled>Select your location</option>
                                    <option value="ny">New York</option>
                                    <option value="ca">California</option>
                                    <option value="tx">Texas</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="role-selection">
                                <label className="radio-group" onClick={() => setRole("citizen")}>
                                    <input
                                        type="radio"
                                        name="role"
                                        checked={role === "citizen"}
                                        onChange={() => setRole("citizen")}
                                    />
                                    Citizen
                                </label>
                                <label className="radio-group" onClick={() => setRole("official")}>
                                    <input
                                        type="radio"
                                        name="role"
                                        checked={role === "official"}
                                        onChange={() => setRole("official")}
                                    />
                                    Public Official
                                </label>
                            </div>
                        </div>

                        <button type="button" className="register-btn">
                            Create Account <ArrowRight size={18} />
                        </button>

                    </form>

                    <div className="divider-text">Or</div>

                    <div className="social-login">
                        <button className="social-btn" onClick={() => handleGoogleLogin()}>
                            <span>G</span> Sign up with Google
                        </button>
                        <button className="social-btn">
                            <span>f</span> Facebook
                        </button>
                    </div>

                    <p className="signin-link">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Register;