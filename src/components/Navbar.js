// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <h1>Система управления базой данных</h1>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/database">Управление базой данных</Link>
                        <Link to="/voenkomat">Запросы военкомата</Link>
                        <div className="user-info">
                            <span>Добро пожаловать, {user.username}</span>
                            {isAdmin() && <span className="badge admin-badge">ADMIN</span>}
                            <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                Выйти
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="btn btn-outline">Войти</Link>
                        <Link to="/register" className="btn btn-primary">Регистрация</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;