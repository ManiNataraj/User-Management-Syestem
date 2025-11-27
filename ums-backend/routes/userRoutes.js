const express = require('express');
const router = express.Router();
const { 
    listUsers, 
    getUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { upload } = require('../utils/multerConfig');

// All user routes are protected by authentication
router.use(authMiddleware); 

// GET /api/users - List all users (Admin only)
router.get('/', adminMiddleware, listUsers);

// GET /api/users/:id - Get user by ID (Protected)
router.get('/:id', getUser);

// PUT /api/users/:id - Update user (Protected)
// Multer is optional here, as image update is optional
router.put('/:id', upload.single('profile_image'), updateUser);

// DELETE /api/users/:id - Delete user (Protected)
router.delete('/:id', deleteUser); 

module.exports = router;