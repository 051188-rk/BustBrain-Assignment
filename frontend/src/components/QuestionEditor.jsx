import React, { useState } from 'react';
import './QuestionEditor.css';
import ConditionEditor from './ConditionEditor';

function QuestionEditor({ question, allQuestions, onUpdate }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleChange = (field, value) => {
        onUpdate({ ...question, [field]: value });
    };

    return (
        <div className="question-editor">
            <div className="question-header" onClick={() => setIsExpanded(!isExpanded)}>
                <h4>{question.label}</h4>
                <span className="toggle-icon">{isExpanded ? '−' : '+'}</span>
            </div>

            {isExpanded && (
                <div className="question-body">
                    <div className="form-group">
                        <label className="form-label">Question Label</label>
                        <input
                            type="text"
                            className="form-input"
                            value={question.label}
                            onChange={(e) => handleChange('label', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Question Key (internal)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={question.questionKey}
                            onChange={(e) => handleChange('questionKey', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) => handleChange('required', e.target.checked)}
                            />
                            {' '}Required field
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Conditional Logic</label>
                        <ConditionEditor
                            rules={question.conditionalRules}
                            allQuestions={allQuestions.filter(q => q.questionKey !== question.questionKey)}
                            onChange={(rules) => handleChange('conditionalRules', rules)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionEditor;
