import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUserDetails } from '../services/api';
import '../styles/EditProfile.css';

const EditProfile = () => {
    const { id } = useParams(); // Get user ID from the URL
    const navigate = useNavigate();
    const { user, setUser, isAdmin } = useAuth();
    
    // State to hold form data and image file
    const [formData, setFormData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Logic to ensure the authenticated user can only edit their own profile, 
    // unless they are an admin.
    useEffect(() => {
        if (!isAdmin && user.id !== parseInt(id)) {
            // Redirect if unauthorized to view this profile
            setError("You are not authorized to view this user's profile.");
            // Optionally, redirect to their own profile or dashboard
            setTimeout(() => navigate(user.role === 'admin' ? '/admin' : `/profile/edit/${user.id}`), 2000);
            return;
        }

        // Fetch user data
        const fetchUser = async () => {
            try {
                const response = await getUserById(id);
                // Pre-fill the form with existing user data
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch user data.");
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, user, isAdmin, navigate]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = new FormData();
            
            // Append form fields
            Object.keys(formData).forEach(key => {
                // Prevent sending sensitive or unnecessary fields like created_at, id, etc.
                if (key !== 'password' && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                    data.append(key, formData[key]);
                }
            });

            // Append new image file if selected
            if (profileImage) {
                data.append('profile_image', profileImage);
            }
            
            // Password update is handled separately if implemented (optional for basic profile edit)
            // if (formData.newPassword) {
            //     data.append('password', formData.newPassword);
            // }


            const response = await updateUserDetails(id, data);
            
            setSuccess("Profile updated successfully!");
            
            // If the current authenticated user updated their *own* profile, update the context
            if (user.id === parseInt(id)) {
                // Update local storage and context with the new sanitized data from the response
                const updatedUser = response.data.user;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }

        } catch (err) {
            setError(err.response?.data?.message || "Update failed. Check your data and network.");
        }
    };
    
    if (loading) return <div className="form-container">Loading profile...</div>;
    if (error && !loading) return <div className="form-container error-message">Error: {error}</div>;

    return (
        <div className="editprofile-form-container">
            <h2>{isAdmin && user.id !== parseInt(id) ? `Editing User ID: ${id}` : 'Edit My Profile'}</h2>
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" required />
                
                {/* Email (Optional: May require re-authentication if updated) */}
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" required />

                {/* Phone */}
                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Phone" required />
                
                {/* Location fields */}
                <input type="text" name="state" value={formData.state || ''} onChange={handleChange} placeholder="State" required />
                <input type="text" name="city" value={formData.city || ''} onChange={handleChange} placeholder="City" required />
                <input type="text" name="country" value={formData.country || ''} onChange={handleChange} placeholder="Country" required />
                <input type="text" name="pincode" value={formData.pincode || ''} onChange={handleChange} placeholder="Pincode" required />
                
                {/* Address */}
                <textarea name="address" value={formData.address || ''} onChange={handleChange} placeholder="Address" maxLength="150" />

                {/* Profile Image (Read-only display + new upload) */}
                <label>Current Profile Image:</label>
                {formData.profile_image && (
                    <img 
                        src={`http://localhost:5000${formData.profile_image}`} 
                        alt="Profile" 
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                )}
                <label>Upload New Image (Max 2MB):</label>
                <input type="file" name="profile_image" onChange={handleImageChange} accept=".png,.jpg,.jpeg" />
                
                {/* Admin Role Edit (Admin only) */}
                {isAdmin && (
                    <div style={{marginTop: '15px'}}>
                        <label>User Role:</label>
                        <select name="role" value={formData.role || 'user'} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                )}

                <button type="submit" style={{marginTop: '20px'}}>Save Changes</button>
            </form>
            <p style={{marginTop: '15px'}}>
                <button onClick={() => navigate(isAdmin ? '/admin' : `/`)}>
                    {isAdmin ? 'Back to Admin Dashboard' : 'Go Home'}
                </button>
            </p>
        </div>
    );
};

export default EditProfile;