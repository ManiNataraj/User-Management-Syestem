import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (loginId, password) => {
        try {
            const response = await loginUser({ loginId, password });
            const { user: userData, accessToken, refreshToken } = response.data;

            // Store tokens in secure cookies
            Cookies.set('accessToken', accessToken, { expires: 1/24, secure: false }); // 1 hour
            Cookies.set('refreshToken', refreshToken, { expires: 7, secure: false }); // 7 days

            // Store user data in local storage
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            return userData;
        } catch (error) {
            // Handle error response from API
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const logout = () => {
        // Clear all session data
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!user;

    const value = {
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
        setUser
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};