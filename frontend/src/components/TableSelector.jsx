import React, { useState, useEffect } from 'react';
import './TableSelector.css';
import axiosClient from '../api/axiosClient';

function TableSelector({ baseId, onSelect }) {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTables();
    }, [baseId]);

    const fetchTables = async () => {
        try {
            const response = await axiosClient.get(`/airtable/bases/${baseId}/tables`);
            setTables(response.data.tables);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tables:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading tables...</div>;

    return (
        <div className="table-selector">
            {tables.map((table) => (
                <div
                    key={table.id}
                    className="table-item"
                    onClick={() => onSelect(table)}
                >
                    <h3>{table.name}</h3>
                    <p>{table.fields?.length || 0} fields</p>
                </div>
            ))}
        </div>
    );
}

export default TableSelector;
