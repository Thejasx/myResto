const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

// @desc    Register customer
// @route   POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please provide name, email and password' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists with this email' });

    const user = await User.create({ name, email, password, phone, role: 'customer' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login customer
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ message: 'Your account has been deactivated' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Owner signup
// @route   POST /api/auth/owner/signup
const ownerSignup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please provide name, email and password' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists with this email' });

    const user = await User.create({ name, email, password, phone, role: 'owner' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Owner login
// @route   POST /api/auth/owner/login
const ownerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email, role: 'owner' });
    if (!user) return res.status(401).json({ message: 'No owner account found with this email' });
    if (!user.isActive) return res.status(403).json({ message: 'Your account has been deactivated' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ message: 'Invalid admin credentials' });

    let admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      admin = await User.create({ name: 'Admin', email, password, role: 'admin' });
    }
    res.json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role, token: generateToken(admin._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, phone: updated.phone, avatar: updated.avatar, token: generateToken(updated._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login, ownerSignup, ownerLogin, adminLogin, getProfile, updateProfile };
