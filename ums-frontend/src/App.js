import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './pages/AdminDashboard';
import EditProfile from './pages/EditProfile';
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Protected Route Components ---

/**;
 * Ensures the user is logged in before rendering the children.
 * If not authenticated, redirects to /login.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Simple loading state
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * Ensures the user is logged in AND has the 'admin' role.
 * If not admin, denies access (403 Forbidden equivalent).
 */
const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return isAdmin ? children : <div style={{padding: '20px', textAlign: 'center', color: 'red'}}>
        <h1>403 Forbidden</h1>
        <p>Access Denied. Admin privileges are required for this page.</p>
        <button onClick={() => window.location.href = '/login'}>Go to Login</button>
    </div>; // Custom denied message for clarity
};

// --- Main App Component ---

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Admin Protected Route (RBAC) */}
                        <Route 
                            path="/admin" 
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } 
                        />
                        
                        {/* General Protected Route (Authentication) */}
                        <Route 
                            path="/profile/edit/:id" 
                            element={
                                <ProtectedRoute>
                                    <EditProfile />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* CORRECTED: Default redirect to the public Login page */}
                        <Route path="/" element={<Navigate to="/login" />} />
                        
                        {/* Catch-all Route */}
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;