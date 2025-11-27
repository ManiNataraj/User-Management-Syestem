import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', 
        address: '', state: '', city: '', country: '', pincode: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    // Simple Client-Side Validation (Backend validation is the ultimate check)
    const validateForm = () => {
        setError('');
        const { name, email, phone, password, state, city, country, pincode } = formData;
        
        if (name.length < 3 || !/^[A-Za-z\s]+$/.test(name)) {
            setError('Name must be 3+ chars, alphabets only.');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Invalid email format.');
            return false;
        }
        if (phone.length < 10 || phone.length > 15 || !/^\d+$/.test(phone)) {
            setError('Phone must be 10-15 digits.');
            return false;
        }
        if (password.length < 6 || !/\d/.test(password)) {
            setError('Password must be 6+ chars and include a number.');
            return false;
        }
        if (!state || !city || !country) {
            setError('State, City, and Country are required.');
            return false;
        }
        if (pincode.length < 4 || pincode.length > 10 || !/^\d+$/.test(pincode)) {
            setError('Pincode must be 4-10 digits.');
            return false;
        }

        if (profileImage && profileImage.size > 2000000) { // 2MB
            setError('Image file size must be less than 2MB.');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const data = new FormData();
            for (const key in formData) {
                data.append(key, formData[key]);
            }
            if (profileImage) {
                data.append('profile_image', profileImage);
            }

            await registerUser(data);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            // Handle backend validation errors or unique constraint errors
            const errorMessage = err.response?.data?.message || 'Registration failed.';
            setError(errorMessage);
            setSuccess('');
        }
    };

    return (
        <div className="form-container">
            <h2>User Registration</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                {/* Simplified form structure */}
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                
                {/* Location fields */}
                <input type="text" name="state" placeholder="State" onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" onChange={handleChange} required />
                <input type="text" name="country" placeholder="Country" onChange={handleChange} required />
                <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} required />
                
                {/* Optional fields */}
                <input type="text" name="address" placeholder="Address (Optional)" onChange={handleChange} maxLength="150" />
                <label>Profile Image (Max 2MB, JPG/PNG):</label>
                <input type="file" name="profile_image" onChange={handleImageChange} accept=".png,.jpg,.jpeg" />
                
                <button type="submit">Register</button>
            </form>
            <div className='register-text'>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;