import React from 'react';
import './Login.css';

function Login() {
    const handleAirtableLogin = () => {
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        window.location.href = `${apiUrl}/auth/airtable/login`;
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Airtable Form Builder</h1>
                <p>Create dynamic forms connected to your Airtable bases</p>

                <button
                    className="airtable-login-button"
                    onClick={handleAirtableLogin}
                >
                    <span>Login with Airtable</span>
                </button>

                <small className="login-hint">
                    You'll be redirected to Airtable to authorize access
                </small>
            </div>
        </div>
    );
}

export default Login;
