import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormBuilder.css';
import axiosClient from '../api/axiosClient';
import BaseSelector from '../components/BaseSelector';
import TableSelector from '../components/TableSelector';
import FieldSelector from '../components/FieldSelector';
import QuestionEditor from '../components/QuestionEditor';

function FormBuilder() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        airtableBaseId: '',
        airtableTableId: '',
        questions: []
    });
    const [selectedBase, setSelectedBase] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [availableFields, setAvailableFields] = useState([]);

    const handleBaseSelect = (base) => {
        setSelectedBase(base);
        setFormData({ ...formData, airtableBaseId: base.id });
        setStep(2);
    };

    const handleTableSelect = (table) => {
        setSelectedTable(table);
        setFormData({ ...formData, airtableTableId: table.id });
        setStep(3);
    };

    const handleFieldsSelect = (fields) => {
        setAvailableFields(fields);
        const initialQuestions = fields.map(field => ({
            questionKey: field.name.toLowerCase().replace(/\s+/g, '_'),
            fieldId: field.id,
            label: field.name,
            type: field.type,
            required: false,
            options: field.options || null,
            conditionalRules: null
        }));
        setFormData({ ...formData, questions: initialQuestions });
        setStep(4);
    };

    const handleQuestionUpdate = (index, updatedQuestion) => {
        const newQuestions = [...formData.questions];
        newQuestions[index] = updatedQuestion;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSubmit = async () => {
        try {
            await axiosClient.post('/forms', formData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating form:', error);
            alert('Failed to create form');
        }
    };

    return (
        <div className="form-builder-container">
            <div className="form-builder-header">
                <h1>Create New Form</h1>
                <div className="step-indicator">
                    Step {step} of 4
                </div>
            </div>

            {step === 1 && (
                <div className="builder-step">
                    <h2>Select Airtable Base</h2>
                    <BaseSelector onSelect={handleBaseSelect} />
                </div>
            )}

            {step === 2 && (
                <div className="builder-step">
                    <h2>Select Table</h2>
                    <TableSelector baseId={selectedBase.id} onSelect={handleTableSelect} />
                </div>
            )}

            {step === 3 && (
                <div className="builder-step">
                    <h2>Select Fields</h2>
                    <FieldSelector
                        baseId={selectedBase.id}
                        tableId={selectedTable.id}
                        onSelect={handleFieldsSelect}
                    />
                </div>
            )}

            {step === 4 && (
                <div className="builder-step">
                    <h2>Configure Form</h2>
                    <div className="form-metadata">
                        <input
                            type="text"
                            placeholder="Form Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="form-input"
                        />
                        <textarea
                            placeholder="Form Description (optional)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    <h3>Questions</h3>
                    {formData.questions.map((question, index) => (
                        <QuestionEditor
                            key={index}
                            question={question}
                            allQuestions={formData.questions}
                            onUpdate={(updated) => handleQuestionUpdate(index, updated)}
                        />
                    ))}

                    <button className="button button-primary" onClick={handleSubmit}>
                        Create Form
                    </button>
                </div>
            )}
        </div>
    );
}

export default FormBuilder;
