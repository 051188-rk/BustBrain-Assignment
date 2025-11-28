import React from 'react';
import './QuestionRenderer.css';

function QuestionRenderer({ question, value, onChange }) {
    const renderInput = () => {
        switch (question.type) {
            case 'shortText':
                return (
                    <input
                        type="text"
                        className="form-input"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={question.required}
                    />
                );

            case 'longText':
                return (
                    <textarea
                        className="form-input"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={question.required}
                        rows={4}
                    />
                );

            case 'singleSelect':
                return (
                    <select
                        className="form-input"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={question.required}
                    >
                        <option value="">Select an option...</option>
                        {question.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'multiSelect':
                return (
                    <div className="multi-select">
                        {question.options?.map((option) => (
                            <label key={option} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={(value || []).includes(option)}
                                    onChange={(e) => {
                                        const currentValue = value || [];
                                        if (e.target.checked) {
                                            onChange([...currentValue, option]);
                                        } else {
                                            onChange(currentValue.filter(v => v !== option));
                                        }
                                    }}
                                />
                                {' '}{option}
                            </label>
                        ))}
                    </div>
                );

            case 'attachment':
                return (
                    <input
                        type="file"
                        className="form-input"
                        onChange={(e) => onChange(e.target.files[0])}
                        required={question.required}
                    />
                );

            default:
                return <p>Unsupported question type: {question.type}</p>;
        }
    };

    return (
        <div className="question-renderer">
            <label className="question-label">
                {question.label}
                {question.required && <span className="required-mark">*</span>}
            </label>
            {renderInput()}
        </div>
    );
}

export default QuestionRenderer;
