const adminMiddleware = (req, res, next) => {
    // Assumes authMiddleware has run and attached req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

module.exports = adminMiddleware;