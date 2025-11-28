import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import axiosClient from './api/axiosClient';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormViewer from './pages/FormViewer';
import ResponsesList from './pages/ResponsesList';
import Navbar from './components/Navbar';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('authToken', token);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const storedToken = localStorage.getItem('authToken');

        if (storedToken) {
            try {
                const response = await axiosClient.get('/auth/me');
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
            }
        }

        setLoading(false);
    };

    const ProtectedRoute = ({ children }) => {
        if (loading) return <div>Loading...</div>;
        return isAuthenticated ? children : <Navigate to="/login" />;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            {isAuthenticated && <Navbar user={user} />}

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/forms/new" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
                <Route path="/form/:formId" element={<FormViewer />} />
                <Route path="/forms/:formId/responses" element={<ProtectedRoute><ResponsesList /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
