const express = require('express');
const {
  register,
  login,
  requestOtp,
  changePassword,
} = require('../controllers/authController');

const router = express.Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

// Request OTP for password reset
router.post('/request-otp', requestOtp);

// Change password using OTP
router.post('/change-password', changePassword);

module.exports = router;
