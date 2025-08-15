const express = require('express');
const router = express.Router();
const { signup, verifyEmail } = require('../controllers/auth.controller');

// Signup route
router.post('/signup', signup);

// Email verification route
router.get('/verify-email/:token', verifyEmail);

module.exports = router;