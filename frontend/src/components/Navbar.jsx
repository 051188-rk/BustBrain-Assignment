import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    Airtable Form Builder
                </Link>

                <div className="navbar-menu">
                    <Link to="/dashboard" className="navbar-link">
                        Dashboard
                    </Link>
                    <Link to="/forms/new" className="navbar-link">
                        Create Form
                    </Link>
                    <div className="navbar-user">
                        <span>{user?.email || 'User'}</span>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
