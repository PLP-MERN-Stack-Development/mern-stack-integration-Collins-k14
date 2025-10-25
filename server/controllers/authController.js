const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // validate already done by middleware
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
};
