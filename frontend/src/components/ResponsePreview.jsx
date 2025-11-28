import React, { useState } from 'react';
import './ResponsePreview.css';

function ResponsePreview({ response, form }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="response-preview">
            <div className="response-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="response-info">
                    <span className="response-id">#{response._id.slice(-6)}</span>
                    <span className="response-date">{formatDate(response.createdAt)}</span>
                    {response.deletedInAirtable && (
                        <span className="deleted-badge">Deleted in Airtable</span>
                    )}
                </div>
                <span className="toggle-icon">{isExpanded ? '−' : '+'}</span>
            </div>

            {isExpanded && (
                <div className="response-body">
                    {Object.entries(response.answers).map(([key, value]) => {
                        const question = form.questions.find(q => q.questionKey === key);
                        const label = question?.label || key;

                        return (
                            <div key={key} className="answer-row">
                                <strong>{label}:</strong>
                                <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                            </div>
                        );
                    })}

                    <div className="response-metadata">
                        <small>Airtable Record ID: {response.airtableRecordId}</small>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResponsePreview;
