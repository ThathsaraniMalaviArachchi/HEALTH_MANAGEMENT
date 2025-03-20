import React, { useState, useEffect } from 'react';
import { healthLogsAPI } from '../services/api';

const HealthLogForm = ({ onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        blood_pressure_systolic: initialData?.blood_pressure_systolic || '',
        blood_pressure_diastolic: initialData?.blood_pressure_diastolic || '',
        glucose_level: initialData?.glucose_level || '',
        heart_rate: initialData?.heart_rate || ''
    });
    const [warnings, setWarnings] = useState({});
    const ranges = {
        blood_pressure_systolic: { min: 70, max: 200, unit: 'mmHg' },
        blood_pressure_diastolic: { min: 40, max: 130, unit: 'mmHg' },
        glucose_level: { min: 30, max: 600, unit: 'mg/dL' },
        heart_rate: { min: 40, max: 200, unit: 'BPM' }
    };

    const getWarningMessage = (name, value) => {
        const range = ranges[name];
        if (!range || !value) return null;
        
        const numValue = parseInt(value);
        if (isNaN(numValue)) return null;

        if (numValue < range.min) {
            return `⚠️ Low ${name.split('_').join(' ')} (${numValue} ${range.unit})`;
        }
        if (numValue > range.max) {
            return `⚠️ High ${name.split('_').join(' ')} (${numValue} ${range.unit})`;
        }
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value === '' || /^\d*$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            
            // Check for warnings on each change
            const warning = getWarningMessage(name, value);
            setWarnings(prev => ({
                ...prev,
                [name]: warning
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                blood_pressure_systolic: parseInt(formData.blood_pressure_systolic),
                blood_pressure_diastolic: parseInt(formData.blood_pressure_diastolic),
                glucose_level: parseInt(formData.glucose_level),
                heart_rate: parseInt(formData.heart_rate)
            };

            // Update warnings one last time before submission
            Object.keys(payload).forEach(key => {
                const warning = getWarningMessage(key, payload[key]);
                if (warning) {
                    setWarnings(prev => ({
                        ...prev,
                        [key]: warning
                    }));
                }
            });

            if (initialData?._id) {
                await healthLogsAPI.update(initialData._id, payload);
            } else {
                await healthLogsAPI.create(payload);
            }
            
            // Reset form
            setFormData({
                blood_pressure_systolic: '',
                blood_pressure_diastolic: '',
                glucose_level: '',
                heart_rate: ''
            });
            setWarnings({});
            
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to save health log. Please try again.');
        }
    };

    const handleCancel = () => {
        setFormData({
            blood_pressure_systolic: '',
            blood_pressure_diastolic: '',
            glucose_level: '',
            heart_rate: ''
        });
        setWarnings({});
        if (typeof onSuccess === 'function') {
            onSuccess();
        }
    };

    return React.createElement('div', { className: 'bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-gray-100' },
        React.createElement('h2', { 
            className: 'text-3xl font-bold mb-8 text-gray-800 text-center' 
        }, 
            initialData ? 'Update Health Log' : 'Add New Health Log'
        ),
        React.createElement('form', { 
            onSubmit: handleSubmit, 
            className: 'space-y-8'
        },
            [
                {
                    label: 'Blood Pressure (Systolic)',
                    name: 'blood_pressure_systolic',
                    placeholder: '120',
                    ...ranges.blood_pressure_systolic
                },
                {
                    label: 'Blood Pressure (Diastolic)',
                    name: 'blood_pressure_diastolic',
                    placeholder: '80',
                    ...ranges.blood_pressure_diastolic
                },
                {
                    label: 'Glucose Level',
                    name: 'glucose_level',
                    placeholder: '100',
                    ...ranges.glucose_level
                },
                {
                    label: 'Heart Rate',
                    name: 'heart_rate',
                    placeholder: '75',
                    ...ranges.heart_rate
                }
            ].map(field => 
                React.createElement('div', { key: field.name },
                    React.createElement('label', { 
                        className: 'block text-sm font-semibold text-gray-700 mb-2' 
                    }, 
                        `${field.label} (${field.unit})`
                    ),
                    React.createElement('input', {
                        type: 'number',
                        name: field.name,
                        placeholder: field.placeholder,
                        className: `w-full px-4 py-3 border ${
                            warnings[field.name] 
                                ? 'border-yellow-400 bg-yellow-50' 
                                : 'border-gray-300 hover:border-blue-400'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`,
                        value: formData[field.name],
                        onChange: handleChange,
                        required: true
                    }),
                    React.createElement('p', { 
                        className: 'mt-2 text-xs text-gray-500'
                    }, 
                        `Normal range: ${field.min}-${field.max} ${field.unit}`
                    ),
                    warnings[field.name] && React.createElement('p', { 
                        className: 'mt-2 text-sm text-yellow-600 font-medium flex items-center'
                    }, 
                        React.createElement('span', { 
                            className: 'mr-1'
                        }, '⚠️'),
                        warnings[field.name]
                    )
                )
            ),
            React.createElement('div', { 
                className: 'flex justify-end space-x-4 pt-4'
            },
                React.createElement('button', {
                    type: 'button',
                    onClick: handleCancel,
                    className: 'px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium'
                }, 'Cancel'),
                React.createElement('button', {
                    type: 'submit',
                    className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg'
                }, initialData ? 'Update' : 'Add')
            )
        )
    );
};

export default HealthLogForm;
