import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Login.css';

const Login = () => {
    const [loginId, setLoginId] = useState(''); // Email or Phone
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error

        // Simple client-side validation
        if (!loginId || !password) {
            setError('Login ID and password are required.');
            return;
        }

        try {
            const user = await login(loginId, password);
            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(`/profile/edit/${user.id}`); // Redirect standard user to their edit page
            }
        } catch (errorMessage) {
            setError(errorMessage);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Email or Phone" 
                    value={loginId} 
                    onChange={(e) => setLoginId(e.target.value)} 
                    required 
                />
                <input
                    className='password-input'
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            <div className='login-text'><p>Don't have an account? <Link to="/register">Register</Link></p></div>
            
        </div>
    );
};

export default Login;