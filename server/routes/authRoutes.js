const express = require('express');
const router = express.Router();
const { signup, login, ownerSignup, ownerLogin, adminLogin, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/owner/signup', ownerSignup);
router.post('/owner/login', ownerLogin);
router.post('/admin/login', adminLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
