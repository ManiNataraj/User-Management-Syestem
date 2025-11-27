const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db.config');
const securityMiddleware = require('./middleware/securityMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup security middleware (CORS, Helmet)
securityMiddleware(app);

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve static images

// Import and connect DB
connectDB();

// Sync database models (creates tables if they don't exist)
sequelize.sync({ alter: true }).then(() => {
    console.log("Database & tables created/updated!");
}).catch(err => {
    console.error("Error syncing database:", err);
});

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Basic Home Route
app.get('/', (req, res) => {
    res.send('User Management System API is Running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong on the server.',
        errors: err.errors // For validation errors
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});