import React, { useState, useEffect } from 'react';
import { medicationAPI } from '../services/api';

const MedicationManagement = () => {
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingMedication, setEditingMedication] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: '',
        start_date: '',
        end_date: '',
        notes: ''
    });
    
    useEffect(() => {
        fetchMedications();
    }, []);
    
    const fetchMedications = async () => {
        try {
            setLoading(true);
            const data = await medicationAPI.getAllMedications();
            setMedications(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            setError('Failed to load medications');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const resetForm = () => {
        setFormData({
            name: '',
            dosage: '',
            frequency: '',
            start_date: '',
            end_date: '',
            notes: ''
        });
        setEditingMedication(null);
    };
    
    const handleEdit = (medication) => {
        setEditingMedication(medication);
        
        // Format dates for form input
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        };
        
        setFormData({
            name: medication.name || '',
            dosage: medication.dosage || '',
            frequency: medication.frequency || '',
            start_date: formatDate(medication.start_date),
            end_date: formatDate(medication.end_date),
            notes: medication.notes || ''
        });
        
        setShowForm(true);
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medication?')) {
            try {
                await medicationAPI.deleteMedication(id);
                setSuccess('Medication deleted successfully');
                fetchMedications();
            } catch (err) {
                setError('Failed to delete medication');
                console.error(err);
            }
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            if (editingMedication) {
                await medicationAPI.updateMedication(editingMedication._id, formData);
                setSuccess('Medication updated successfully');
            } else {
                await medicationAPI.createMedication(formData);
                setSuccess('Medication added successfully');
            }
            
            resetForm();
            setShowForm(false);
            fetchMedications();
        } catch (err) {
            setError('Failed to save medication');
            console.error(err);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Medication Management</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}
            
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : 'Add New Medication'}
                </button>
            </div>
            
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingMedication ? 'Edit Medication' : 'Add New Medication'}
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Medication Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Dosage *
                            </label>
                            <input
                                type="text"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="E.g. 10mg, 1 tablet"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Frequency *
                            </label>
                            <input
                                type="text"
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="E.g. Once daily, Twice daily, Every 8 hours"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                End Date (Optional)
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                                placeholder="Additional information about this medication"
                            ></textarea>
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                {editingMedication ? 'Update Medication' : 'Save Medication'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {loading ? (
                <div className="text-center py-4">Loading medications...</div>
            ) : medications.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg mb-4">No medications found.</p>
                    <button 
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Add Your First Medication
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medications.map(medication => (
                        <div key={medication._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-blue-500 text-white p-4">
                                <h3 className="text-xl font-bold truncate">{medication.name}</h3>
                                <p className="text-blue-100">{medication.dosage}</p>
                            </div>
                            <div className="p-4">
                                <div className="mb-3">
                                    <p className="text-sm font-semibold text-gray-600">Frequency</p>
                                    <p className="text-gray-800">{medication.frequency}</p>
                                </div>
                                <div className="mb-3 grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Start Date</p>
                                        <p className="text-gray-800">{new Date(medication.start_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">End Date</p>
                                        <p className="text-gray-800">{medication.end_date ? new Date(medication.end_date).toLocaleDateString() : '-'}</p>
                                    </div>
                                </div>
                                {medication.notes && (
                                    <div className="mb-3">
                                        <p className="text-sm font-semibold text-gray-600">Notes</p>
                                        <p className="text-gray-800 text-sm">{medication.notes}</p>
                                    </div>
                                )}
                                <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => handleEdit(medication)}
                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(medication._id)}
                                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MedicationManagement;