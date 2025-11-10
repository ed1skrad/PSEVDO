// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin()) {
        return (
            <div className="access-denied">
                <h2>Доступ запрещен</h2>
                <p>Требуются права администратора для доступа к этой странице.</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;