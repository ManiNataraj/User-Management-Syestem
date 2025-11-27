const { body, validationResult } = require('express-validator');

const validationErrorCatcher = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Map errors to a simpler format for client
        const extractedErrors = errors.array().map(err => ({
            [err.path]: err.msg
        }));
        
        return res.status(400).json({ 
            message: 'Validation failed.',
            errors: extractedErrors 
        });
    }
    next();
};

const registerValidation = [
    // name: min 3 chars, alphabets only
    body('name')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.')
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only alphabets and spaces.'),
    
    // email: valid & unique (uniqueness check will be in controller)
    body('email').isEmail().withMessage('Must be a valid email address.'),

    // phone: 10-15 digits
    body('phone')
        .isLength({ min: 10, max: 15 }).withMessage('Phone must be 10 to 15 digits.')
        .isNumeric().withMessage('Phone must contain only digits.'),

    // password: min 6 chars with a number
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/\d/).withMessage('Password must contain at least one number.'),

    // address: optional, max 150 chars
    body('address').optional().isLength({ max: 150 }).withMessage('Address cannot exceed 150 characters.'),

    // state, city, country: required
    body('state').notEmpty().withMessage('State is required.'),
    body('city').notEmpty().withMessage('City is required.'),
    body('country').notEmpty().withMessage('Country is required.'),

    // pincode: 4-10 digits
    body('pincode')
        .isLength({ min: 4, max: 10 }).withMessage('Pincode must be 4 to 10 digits.')
        .isNumeric().withMessage('Pincode must contain only digits.'),

    // Image file check (Multer handles type/size, but check existence here)
    (req, res, next) => {
        if (req.file) {
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ message: 'Invalid file type. Only JPG/PNG are allowed.' });
            }
            if (req.file.size > 2 * 1024 * 1024) { // 2MB
                return res.status(400).json({ message: 'File size too large. Max 2MB allowed.' });
            }
        }
        next();
    },
    
    validationErrorCatcher
];

module.exports = { registerValidation };