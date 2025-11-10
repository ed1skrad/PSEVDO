// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Установка токена в заголовки axios
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Проверка валидности токена при загрузке
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    // Можно добавить endpoint для проверки токена
                    const userData = decodeToken(token);
                    setUser(userData);
                } catch (error) {
                    console.error('Invalid token:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const decodeToken = (token) => {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return {
                username: decoded.sub,
                roles: decoded.roles || [],
                exp: decoded.exp
            };
        } catch (error) {
            throw new Error('Invalid token');
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signin', {
                username,
                password
            });

            const { jwt, refreshToken, username: responseUsername } = response.data;
            setToken(jwt);

            const userData = decodeToken(jwt);
            setUser(userData);

            // Сохраняем refresh token
            localStorage.setItem('refreshToken', refreshToken);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', userData);

            const { jwt, refreshToken, username } = response.data;
            setToken(jwt);

            const decodedUser = decodeToken(jwt);
            setUser(decodedUser);

            localStorage.setItem('refreshToken', refreshToken);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    const hasRole = (role) => {
        if (!user || !user.roles) return false;
        return user.roles.includes(role);
    };

    const isAdmin = () => {
        return hasRole('ROLE_ADMIN');
    };

    const value = {
        user,
        login,
        register,
        logout,
        hasRole,
        isAdmin,
        loading,
        token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};