const express = require('express');
const router = express.Router();
const { register, login, refresh } = require('../controllers/authController');
const { registerValidation } = require('../utils/validation');
const { upload } = require('../utils/multerConfig');

// POST /api/auth/register
// Multer middleware handles file upload before validation and controller logic
router.post('/register', upload.single('profile_image'), registerValidation, register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/refresh (Optional: For getting new access token with refresh token)
// router.post('/refresh', refresh); 

module.exports = router;