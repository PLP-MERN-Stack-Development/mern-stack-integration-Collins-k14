const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res, next) => {
  try {
    console.log('Register payload:', req.body);

    const username = req.body.username || req.body.name;
    const { email, password } = req.body;

    // validation
    const missing = [];
    if (!username) missing.push('username');
    if (!email) missing.push('email');
    if (!password) missing.push('password');

    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missing,
        received: req.body,
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    const userSafe = user.toObject();
    delete userSafe.password; 

    res.status(201).json({ success: true, data: userSafe });
  } catch (err) {
    console.error('Register error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered', key: err.keyValue });
    }
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ensure password field is selected (in case schema sets select:false)
    const user = await User.findOne({ email }).select('+password');

    // user not found or password compare fails
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT secret not configured');
      return res.status(500).json({ success: false, message: 'Server misconfiguration: missing JWT secret' });
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1d' });

    // remove sensitive fields before sending
    const userSafe = user.toObject ? user.toObject() : { ...user };
    delete userSafe.password;

    res.status(200).json({ success: true, token, user: userSafe });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

// sanitize current user response
exports.getCurrentUser = async (req, res, next) => {
  const userSafe = req.user && req.user.toObject ? req.user.toObject() : req.user || {};
  delete userSafe.password;
  res.status(200).json({ success: true, user: userSafe });
};
