import React, { useState, useEffect } from 'react';
import './FieldSelector.css';
import axiosClient from '../api/axiosClient';

function FieldSelector({ baseId, tableId, onSelect }) {
    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFields();
    }, [baseId, tableId]);

    const fetchFields = async () => {
        try {
            const response = await axiosClient.get(`/airtable/bases/${baseId}/tables/${tableId}/fields`);
            setFields(response.data.fields);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching fields:', error);
            setLoading(false);
        }
    };

    const toggleField = (field) => {
        if (selectedFields.find(f => f.id === field.id)) {
            setSelectedFields(selectedFields.filter(f => f.id !== field.id));
        } else {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const handleContinue = () => {
        if (selectedFields.length === 0) {
            alert('Please select at least one field');
            return;
        }
        onSelect(selectedFields);
    };

    if (loading) return <div>Loading fields...</div>;

    return (
        <div className="field-selector">
            <div className="fields-list">
                {fields.map((field) => {
                    const isSelected = selectedFields.find(f => f.id === field.id);
                    return (
                        <div
                            key={field.id}
                            className={`field-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleField(field)}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                            />
                            <div className="field-info">
                                <h4>{field.name}</h4>
                                <span className="field-type">{field.type}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                className="button button-primary continue-button"
                onClick={handleContinue}
            >
                Continue with {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''}
            </button>
        </div>
    );
}

export default FieldSelector;
