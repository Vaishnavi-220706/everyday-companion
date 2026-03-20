// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');


// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
const register = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters.'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered.'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Register error:', err);

    res.status(500).json({
      error: 'Server error during registration.'
    });
  }
};


// @route   POST /api/auth/login
// @desc    Login existing user
// @access  Public
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      error: 'Server error during login.'
    });
  }
};


// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
const getMe = async (req, res) => {
  try {

    const user = await User
      .findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found.'
      });
    }

    res.json({ user });

  } catch (err) {

    res.status(500).json({
      error: 'Server error.'
    });

  }
};


module.exports = {
  register,
  login,
  getMe
};