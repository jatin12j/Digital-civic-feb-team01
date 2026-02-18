import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const res = await api.get('/auth/me');
                if (res.data.success) {
                    setUser(res.data.data);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                // If not logged in, it's fine, just set loading to false
                console.log('Not authenticated');
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.success) {
                setUser(res.data.user);
                setIsAuthenticated(true);
                return { success: true };
            }
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            if (res.data.success) {
                // We no longer automatically log in after registration per user request
                return { success: true };
            }
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        try {
            await api.get('/auth/logout');
            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const googleLogin = async (code) => {
        try {
            const res = await api.post('/auth/google', { code });
            if (res.data.success) {
                setUser(res.data.user);
                setIsAuthenticated(true);
                return { success: true };
            }
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Google Login failed'
            };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            googleLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
