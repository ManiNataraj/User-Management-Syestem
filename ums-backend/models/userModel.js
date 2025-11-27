const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profile_image: {
        type: DataTypes.STRING, // URL or local path
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    pincode: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false,
    },
    // Sequelize automatically adds createdAt and updatedAt
}, {
    tableName: 'users',
    timestamps: true 
});

module.exports = User;