const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  });
};

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // prevent client side scripts from accessing data
    secure: process.env.NODE_ENV === 'production', // only send over https in production
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'citizen',
      location
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Register Error Stack:', error);
    res.status(500).json({ message: 'Server Error', error: error.message, stack: error.stack });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user uses Google Auth only
    if (!user.password && user.googleId) {
      return res.status(400).json({ message: 'Please use Google Login for this account' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Public
const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

const googleLogin = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }

  try {
    // Exchange code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: 'postmessage'
    });
    const idToken = tokens.id_token;

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = new User({
        name,
        email,
        googleId,
        password: '', // Empty password for google users
        // role defaults to citizen
      });
      await user.save();
    }

    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  googleLogin
};
