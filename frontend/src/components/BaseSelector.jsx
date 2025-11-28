import React, { useState, useEffect } from 'react';
import './BaseSelector.css';
import axiosClient from '../api/axiosClient';

function BaseSelector({ onSelect }) {
    const [bases, setBases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBases();
    }, []);

    const fetchBases = async () => {
        try {
            const response = await axiosClient.get('/airtable/bases');
            setBases(response.data.bases);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bases:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading bases...</div>;

    return (
        <div className="base-selector">
            {bases.map((base) => (
                <div
                    key={base.id}
                    className="base-item"
                    onClick={() => onSelect(base)}
                >
                    <h3>{base.name}</h3>
                    <p>Click to select</p>
                </div>
            ))}
        </div>
    );
}

export default BaseSelector;
