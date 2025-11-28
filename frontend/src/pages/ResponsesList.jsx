import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ResponsesList.css';
import axiosClient from '../api/axiosClient';
import ResponsePreview from '../components/ResponsePreview';

function ResponsesList() {
    const { formId } = useParams();
    const [responses, setResponses] = useState([]);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [formId]);

    const fetchData = async () => {
        try {
            const [formRes, responsesRes] = await Promise.all([
                axiosClient.get(`/forms/${formId}`),
                axiosClient.get(`/forms/${formId}/responses`)
            ]);
            setForm(formRes.data.form);
            setResponses(responsesRes.data.responses);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="responses-container">Loading...</div>;

    return (
        <div className="responses-container">
            <div className="responses-header">
                <h1>Responses for: {form?.title}</h1>
                <div className="response-count">
                    {responses.length} {responses.length === 1 ? 'response' : 'responses'}
                </div>
            </div>

            {responses.length === 0 ? (
                <div className="empty-state">
                    <p>No responses yet</p>
                </div>
            ) : (
                <div className="responses-list">
                    {responses.map((response) => (
                        <ResponsePreview
                            key={response._id}
                            response={response}
                            form={form}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ResponsesList;
