import React, { useState, useEffect, useCallback } from 'react';
import { listAllUsers, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/common/UserTable'; // Component to render the table
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterState, setFilterState] = useState('');
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const fetchUsers = useCallback(async (search, state) => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (search) params.search = search;
            if (state) {
                 params.filterBy = 'state';
                 params.value = state;
            }

            const response = await listAllUsers(params);
            setUsers(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch users.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(searchQuery, filterState);
    }, [fetchUsers, searchQuery, filterState]); // Re-fetch on query/filter change

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(id);
            // Remove deleted user from the list
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete user.';
            setError(errorMessage);
        }
    };
    
    // For demonstration, let's assume a static list of states for filter dropdown
    const availableStates = [...new Set(users.map(u => u.state))];

    return (
        <div className="admin-dashboard">
            <header>
                <h1>Admin Panel - Welcome, {user.name}!</h1>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => navigate(`/profile/edit/${user.id}`)}>Edit Profile</button>
            </header>
            
            <hr/>

            <div className="controls">
                <input 
                    type="text" 
                    placeholder="Search by name or email" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                
                <select 
                    value={filterState} 
                    onChange={(e) => setFilterState(e.target.value)}
                >
                    <option value="">Filter by State</option>
                    {availableStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            {error && <p className="error-message">{error}</p>}
            
            {loading ? (
                <p>Loading user data...</p>
            ) : (
                <UserTable 
                    users={users} 
                    onDelete={handleDelete} 
                    onEdit={(id) => navigate(`/profile/edit/${id}`)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;