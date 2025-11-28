import React, { useState } from 'react';
import './ConditionEditor.css';

function ConditionEditor({ rules, allQuestions, onChange }) {
    const [enabled, setEnabled] = useState(rules !== null);

    const handleToggle = () => {
        if (enabled) {
            setEnabled(false);
            onChange(null);
        } else {
            setEnabled(true);
            onChange({
                logic: 'AND',
                conditions: []
            });
        }
    };

    const handleLogicChange = (logic) => {
        onChange({ ...rules, logic });
    };

    const addCondition = () => {
        onChange({
            ...rules,
            conditions: [
                ...rules.conditions,
                { questionKey: '', operator: 'equals', value: '' }
            ]
        });
    };

    const updateCondition = (index, field, value) => {
        const newConditions = [...rules.conditions];
        newConditions[index] = { ...newConditions[index], [field]: value };
        onChange({ ...rules, conditions: newConditions });
    };

    const removeCondition = (index) => {
        onChange({
            ...rules,
            conditions: rules.conditions.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="condition-editor">
            <label>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={handleToggle}
                />
                {' '}Enable conditional logic
            </label>

            {enabled && rules && (
                <div className="conditions-container">
                    <div className="logic-selector">
                        <label>Show this question when:</label>
                        <select
                            value={rules.logic}
                            onChange={(e) => handleLogicChange(e.target.value)}
                            className="form-input"
                        >
                            <option value="AND">ALL conditions match (AND)</option>
                            <option value="OR">ANY condition matches (OR)</option>
                        </select>
                    </div>

                    {rules.conditions.map((condition, index) => (
                        <div key={index} className="condition-row">
                            <select
                                value={condition.questionKey}
                                onChange={(e) => updateCondition(index, 'questionKey', e.target.value)}
                                className="form-input"
                            >
                                <option value="">Select question...</option>
                                {allQuestions.map((q) => (
                                    <option key={q.questionKey} value={q.questionKey}>
                                        {q.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={condition.operator}
                                onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                                className="form-input"
                            >
                                <option value="equals">equals</option>
                                <option value="notEquals">not equals</option>
                                <option value="contains">contains</option>
                            </select>

                            <input
                                type="text"
                                value={condition.value}
                                onChange={(e) => updateCondition(index, 'value', e.target.value)}
                                placeholder="Value"
                                className="form-input"
                            />

                            <button
                                type="button"
                                onClick={() => removeCondition(index)}
                                className="remove-button"
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addCondition}
                        className="button button-secondary add-condition-button"
                    >
                        + Add Condition
                    </button>
                </div>
            )}
        </div>
    );
}

export default ConditionEditor;
