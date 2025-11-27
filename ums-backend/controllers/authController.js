const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper to generate tokens
const generateTokens = (user) => {
    const payload = { id: user.id, role: user.role };
    
    // Access Token (1 hour expiry)
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60s' });
    
    // Refresh Token (7 days expiry)
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    
    return { accessToken, refreshToken };
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
    const { name, email, phone, password, address, state, city, country, pincode, role } = req.body;
    
    // Multer stores image path in req.file.path
    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // 1. Check for existing user (Email or Phone uniqueness)
        const existingUser = await User.findOne({ 
            where: { 
                [require('sequelize').Op.or]: [{ email }, { phone }] 
            } 
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User with this email or phone already exists.' });
        }

        // 2. Hash Password (bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User
        const newUser = await User.create({
            name, email, phone, 
            password: hashedPassword, 
            profile_image, 
            address, state, city, country, pincode, 
            // Only explicitly set 'admin' if requested AND system allows (simplified: default to 'user')
            role: role === 'admin' ? 'user' : 'user' // Default to 'user' for safety
        });

        // Omit password and other sensitive fields from response
        const userResponse = newUser.get({ plain: true });
        delete userResponse.password;
        delete userResponse.updatedAt;

        res.status(201).json({ 
            message: 'User registered successfully.', 
            user: userResponse
        });
    } catch (error) {
        // Handle database errors (e.g., if somehow a unique constraint is violated after check)
        next({ status: 500, message: 'Could not register user.', errors: error.errors });
    }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
    const { loginId, password } = req.body; // loginId can be email or phone

    try {
        // 1. Find user by email or phone
        const user = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [{ email: loginId }, { phone: loginId }]
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (User not found).' });
        }

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (Password mismatch).' });
        }

        // 3. Generate JWTs
        const { accessToken, refreshToken } = generateTokens(user);

        // 4. Successful Response (No sensitive data)
        const userResponse = user.get({ plain: true });
        delete userResponse.password;
        
        res.json({
            message: 'Login successful.',
            user: {
                id: userResponse.id,
                name: userResponse.name,
                email: userResponse.email,
                role: userResponse.role
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        next({ status: 500, message: 'Login failed.', errors: error.errors });
    }
};