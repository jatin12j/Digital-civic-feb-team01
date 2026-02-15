import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { Landmark, FileText, Vote, CheckCircle, User, Mail, Lock, ArrowRight, Rocket, MapPin, Loader2 } from "lucide-react";
import "../styles/register.css";

import bgImage from "../assets/registerpage.jpg";

function Register() {
    const [role, setRole] = useState("citizen");
    const [location, setLocation] = useState("");
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");
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

    const handleGetCurrentLocation = async () => {
        setLoadingLocation(true);
        setLocationError("");

        // Check if geolocation is available
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Call OpenStreetMap Nominatim reverse geocoding API
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch location data");
                    }

                    const data = await response.json();

                    // Extract city name from response (check city, town, or village)
                    const cityName = data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.state ||
                        "Unknown";

                    setLocation(cityName);
                    setLoadingLocation(false);
                } catch (error) {
                    console.error("Error fetching location:", error);
                    setLocationError("Failed to determine your location. Please try again.");
                    setLoadingLocation(false);
                }
            },
            (error) => {
                // Handle geolocation errors
                let errorMessage = "";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location permission denied. Please enable location access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out.";
                        break;
                    default:
                        errorMessage = "An unknown error occurred.";
                        break;
                }
                setLocationError(errorMessage);
                setLoadingLocation(false);
            }
        );
    };

    return (
        <div className="register-wrapper" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
            <div className="register-container">

                {/* LEFT SIDE - Content */}
                <div className="register-left">
                    <div className="brand-header">
                        <Landmark size={28} color="white" />
                        <h2>Civix</h2>
                    </div>

                    <h1>Join the Civic Revolution <Rocket size={32} style={{ display: 'inline', verticalAlign: 'middle' }} /></h1>
                    <p className="sub-header">
                        Create petitions, participate in polls,
                        <br />and track official responses.
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


                </div>

                {/* RIGHT SIDE - Form Card */}
                <div className="register-right">
                    <div className="register-content-card">
                        <h2>Create Your Account</h2>
                        <p className="subtitle">Start engaging with your community today.</p>

                        <form className="register-form">

                            <div className="form-group">
                                <label>Full Name</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input type="text" placeholder="Full Name" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input type="email" placeholder="Email Address" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    {/* Only showing placeholder as per design, but good to have icon */}
                                    <input type="password" placeholder="Must be at least 8 characters" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <div className="input-wrapper">
                                    <MapPin size={18} className="input-icon" />
                                    <select
                                        value={location}
                                        onChange={(e) => {
                                            const selectedValue = e.target.value;
                                            if (selectedValue === "use_current_location") {
                                                handleGetCurrentLocation();
                                            } else {
                                                setLocation(selectedValue);
                                            }
                                        }}
                                    >
                                        <option value="" disabled>Select your location</option>
                                        <option value="use_current_location">📍 Use My Current Location</option>

                                        {/* Dynamic option for detected location if not a state */}
                                        {location && ![
                                            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
                                            "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
                                            "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
                                            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
                                            "Uttarakhand", "West Bengal", "Delhi", "Chandigarh", "Puducherry", "Jammu and Kashmir",
                                            "Ladakh", "Lakshadweep", "Andaman and Nicobar Islands"
                                        ].includes(location) && location !== "use_current_location" && (
                                                <option value={location}>📍 {location} (Detected)</option>
                                            )}

                                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                        <option value="Assam">Assam</option>
                                        <option value="Bihar">Bihar</option>
                                        <option value="Chhattisgarh">Chhattisgarh</option>
                                        <option value="Goa">Goa</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Haryana">Haryana</option>
                                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                                        <option value="Jharkhand">Jharkhand</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Kerala">Kerala</option>
                                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Manipur">Manipur</option>
                                        <option value="Meghalaya">Meghalaya</option>
                                        <option value="Mizoram">Mizoram</option>
                                        <option value="Nagaland">Nagaland</option>
                                        <option value="Odisha">Odisha</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Rajasthan">Rajasthan</option>
                                        <option value="Sikkim">Sikkim</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Telangana">Telangana</option>
                                        <option value="Tripura">Tripura</option>
                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                        <option value="Uttarakhand">Uttarakhand</option>
                                        <option value="West Bengal">West Bengal</option>
                                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                        <option value="Chandigarh">Chandigarh</option>
                                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                        <option value="Ladakh">Ladakh</option>
                                        <option value="Lakshadweep">Lakshadweep</option>
                                        <option value="Puducherry">Puducherry</option>
                                    </select>
                                </div>
                                {loadingLocation && <p className="location-loading">Detecting your location...</p>}
                                {locationError && <p className="location-error">{locationError}</p>}
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
                                Sign up with Google
                            </button>
                            <button className="social-btn">
                                Facebook
                            </button>
                        </div>

                        <p className="signin-link">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Register;