const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const fs = require('fs'); // For deleting old image file
const path = require('path');

// Helper to sanitize user object for response
const sanitizeUser = (user) => {
    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    delete userResponse.updatedAt;
    return userResponse;
};

// GET /api/users (Admin Only)
exports.listUsers = async (req, res, next) => {
    try {
        // Implement Search & Filter logic
        const { search, filterBy, value } = req.query;
        let whereClause = {};

        if (search) {
            // Search by name or email
            whereClause[require('sequelize').Op.or] = [
                { name: { [require('sequelize').Op.like]: `%${search}%` } },
                { email: { [require('sequelize').Op.like]: `%${search}%` } }
            ];
        }
        
        if (filterBy && value) {
            // Filter by state, city, etc.
            if (['state', 'city', 'country'].includes(filterBy)) {
                whereClause[filterBy] = value;
            }
        }

        const users = await User.findAll({
            where: whereClause,
            attributes: { exclude: ['password'] }, // No sensitive data
            order: [['createdAt', 'DESC']]
        });

        res.json(users);
    } catch (error) {
        next({ status: 500, message: 'Failed to fetch users.', errors: error.errors });
    }
};

// GET /api/users/:id
exports.getUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] } // No sensitive data
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Authorization Check: A user can only view their own profile, unless they are an admin
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
        }

        res.json(user);
    } catch (error) {
        next({ status: 500, message: 'Failed to fetch user.', errors: error.errors });
    }
};

// PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;
    
    // Multer stores new image path in req.file.path
    const newImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // 1. Authorization Check: User can only update their own profile, unless admin
        const targetUser = await User.findByPk(id);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
        }
        
        // 2. Prepare Updates
        const updateFields = { ...updates };
        
        // Handle password update
        if (updateFields.password) {
            if (updateFields.password.length < 6 || !/\d/.test(updateFields.password)) {
                 return res.status(400).json({ message: 'Password must be at least 6 characters and include a number.' });
            }
            updateFields.password = await bcrypt.hash(updateFields.password, 10);
        }
        
        // Handle image update
        if (newImagePath) {
            updateFields.profile_image = newImagePath;
            // Optional: Delete old image if it exists and is not the default
            if (targetUser.profile_image) {
                const oldPath = path.join(__dirname, '..', targetUser.profile_image);
                fs.unlink(oldPath, (err) => {
                    if (err) console.error("Could not delete old image:", err);
                });
            }
        }
        
        // Admin-only fields (e.g., role change)
        if (req.user.role !== 'admin' && updateFields.role) {
            delete updateFields.role; // Non-admins cannot change role
        }

        // 3. Perform Update
        const [updatedRows] = await User.update(updateFields, {
            where: { id },
            returning: true // Gets updated rows (not supported by MySQL dialect for update)
        });

        if (updatedRows === 0) {
             return res.status(404).json({ message: 'User not found or no changes made.' });
        }
        
        // Fetch the updated user for response
        const updatedUser = await User.findByPk(id);

        res.json({ 
            message: 'User updated successfully.', 
            user: sanitizeUser(updatedUser) 
        });
    } catch (error) {
        // Handle unique constraint errors (e.g., updating email/phone to an existing one)
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ message: 'Email or phone number already in use.' });
        }
        next({ status: 500, message: 'Failed to update user.', errors: error.errors });
    }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const targetUser = await User.findByPk(id);
        
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 1. Authorization Check: Admin can delete anyone, standard users can only delete themselves
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied. You can only delete your own profile.' });
        }
        
        // 2. Delete
        const deletedRows = await User.destroy({ where: { id } });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'User not found or already deleted.' });
        }

        // Optional: Delete profile image file
        if (targetUser.profile_image) {
             const imagePath = path.join(__dirname, '..', targetUser.profile_image);
             fs.unlink(imagePath, (err) => {
                 if (err) console.error("Could not delete associated image:", err);
             });
        }

        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        next({ status: 500, message: 'Failed to delete user.', errors: error.errors });
    }
};