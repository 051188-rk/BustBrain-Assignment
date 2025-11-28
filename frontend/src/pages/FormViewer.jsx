import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FormViewer.css';
import axiosClient from '../api/axiosClient';
import QuestionRenderer from '../components/QuestionRenderer';
import { shouldShowQuestion } from '../utils/conditionalLogic';

function FormViewer() {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchForm();
    }, [formId]);

    const fetchForm = async () => {
        try {
            const response = await axiosClient.get(`/forms/${formId}`);
            setForm(response.data.form);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching form:', error);
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionKey, value) => {
        setAnswers({ ...answers, [questionKey]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const visibleQuestions = form.questions.filter(q =>
            shouldShowQuestion(q.conditionalRules, answers)
        );

        for (const question of visibleQuestions) {
            if (question.required && !answers[question.questionKey]) {
                alert(`Please answer: ${question.label}`);
                return;
            }
        }

        setSubmitting(true);
        try {
            await axiosClient.post(`/forms/${formId}/responses`, { answers });
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="form-viewer-container">Loading...</div>;
    if (!form) return <div className="form-viewer-container">Form not found</div>;
    if (submitted) {
        return (
            <div className="form-viewer-container">
                <div className="success-message">
                    <h2>✓ Form Submitted Successfully</h2>
                    <p>Thank you for your response!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="form-viewer-container">
            <div className="form-viewer-card">
                <h1>{form.title}</h1>
                {form.description && <p className="form-description">{form.description}</p>}

                <form onSubmit={handleSubmit}>
                    {form.questions.map((question) => {
                        const isVisible = shouldShowQuestion(question.conditionalRules, answers);
                        if (!isVisible) return null;

                        return (
                            <QuestionRenderer
                                key={question.questionKey}
                                question={question}
                                value={answers[question.questionKey]}
                                onChange={(value) => handleAnswerChange(question.questionKey, value)}
                            />
                        );
                    })}

                    <button
                        type="submit"
                        className="button button-primary submit-button"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FormViewer;
