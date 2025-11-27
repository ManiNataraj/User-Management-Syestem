import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api'; // Backend URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Access Token to every request
api.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // Special case for file uploads
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Response Interceptor for handling token expiry/refresh logic
// (Omitted for brevity, but crucial for production)

export const registerUser = (formData) => api.post('/auth/register', formData);
export const loginUser = (data) => api.post('/auth/login', data);
export const listAllUsers = (params) => api.get('/users', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUserDetails = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;