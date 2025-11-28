// ============================================
// DASHBOARD PAGE
// ============================================
// TODO: Show list of user's forms

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
// import axiosClient from '../api/axiosClient';

function Dashboard() {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            // TODO: Fetch forms from API
            // const response = await axiosClient.get('/forms');
            // setForms(response.data.forms);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching forms:', error);
            setLoading(false);
        }
    };

    const handleCreateForm = () => {
        navigate('/forms/new');
    };

    const handleViewForm = (formId) => {
        navigate(`/form/${formId}`);
    };

    const handleViewResponses = (formId) => {
        navigate(`/forms/${formId}/responses`);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>My Forms</h1>
                <button className="button button-primary" onClick={handleCreateForm}>
                    + Create New Form
                </button>
            </div>

            {loading ? (
                <p>Loading forms...</p>
            ) : forms.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't created any forms yet.</p>
                    <button className="button button-primary" onClick={handleCreateForm}>
                        Create Your First Form
                    </button>
                </div>
            ) : (
                <div className="forms-grid">
                    {forms.map((form) => (
                        <div key={form._id} className="form-card">
                            <h3>{form.title}</h3>
                            <p>{form.description || 'No description'}</p>
                            <div className="form-card-footer">
                                <button onClick={() => handleViewForm(form._id)}>View Form</button>
                                <button onClick={() => handleViewResponses(form._id)}>Responses</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
