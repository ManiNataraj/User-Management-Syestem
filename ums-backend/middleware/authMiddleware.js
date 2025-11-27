const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user but exclude the password field
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] } 
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.user = user; // Attach user object to request
        next();
    } catch (error) {
        // Handle token expired, bad signature, etc.
        res.status(401).json({ message: 'Token is not valid or expired.' });
    }
};

module.exports = authMiddleware;