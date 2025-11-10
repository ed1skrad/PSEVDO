import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Система управления базой данных</h1>
      <div className="nav-links">
        <Link to="/database">Управление базой данных</Link>
        <Link to="/voenkomat">Запросы военкомата</Link>
      </div>
    </nav>
  );
};

export default Navbar;
