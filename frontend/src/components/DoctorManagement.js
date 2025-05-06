import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const DoctorManagement = () => {
    const { isAdmin } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        hospital: '',
        specialization: '',
        availableTimes: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00' }
        ]
    });
    
    useEffect(() => {
        fetchDoctors();
    }, []);
    
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const data = await doctorAPI.getAllDoctors();
            setDoctors(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch doctors');
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
    
    const handleAvailabilityChange = (index, field, value) => {
        const updatedTimes = [...formData.availableTimes];
        updatedTimes[index] = {
            ...updatedTimes[index],
            [field]: value
        };
        
        setFormData({
            ...formData,
            availableTimes: updatedTimes
        });
    };
    
    const addAvailabilitySlot = () => {
        setFormData({
            ...formData,
            availableTimes: [
                ...formData.availableTimes,
                { day: 'Monday', startTime: '09:00', endTime: '17:00' }
            ]
        });
    };
    
    const removeAvailabilitySlot = (index) => {
        const updatedTimes = formData.availableTimes.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            availableTimes: updatedTimes
        });
    };
    
    const resetForm = () => {
        setFormData({
            name: '',
            hospital: '',
            specialization: '',
            availableTimes: [
                { day: 'Monday', startTime: '09:00', endTime: '17:00' }
            ]
        });
        setEditingDoctor(null);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingDoctor) {
                await doctorAPI.updateDoctor(editingDoctor._id, formData);
            } else {
                await doctorAPI.createDoctor(formData);
            }
            
            resetForm();
            setShowForm(false);
            fetchDoctors();
        } catch (err) {
            setError('Failed to save doctor');
            console.error(err);
        }
    };
    
    const handleEdit = (doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            name: doctor.name,
            hospital: doctor.hospital,
            specialization: doctor.specialization,
            availableTimes: doctor.availableTimes
        });
        setShowForm(true);
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await doctorAPI.deleteDoctor(id);
                fetchDoctors();
            } catch (err) {
                setError('Failed to delete doctor');
                console.error(err);
            }
        }
    };
    
    if (!isAdmin()) {
        return (
            <>
                <Navbar />
                <div className="text-center py-8">
                    <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                    <p className="mt-2">You don't have permission to access this page.</p>
                </div>
                <Footer />
            </>
        );
    }
    
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center" style={{ marginTop: '4rem', marginBottom: '2rem' }}>Doctor Management</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
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
                        {showForm ? 'Cancel' : 'Add New Doctor'}
                    </button>
                </div>
                
                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                        </h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Doctor Name
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
                                    Hospital
                                </label>
                                <input
                                    type="text"
                                    name="hospital"
                                    value={formData.hospital}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Available Times
                                </label>
                                
                                {formData.availableTimes.map((time, index) => (
                                    <div key={index} className="flex flex-wrap items-center mb-2 p-2 border rounded bg-gray-50">
                                        <div className="w-full md:w-1/4 mb-2 md:mb-0">
                                            <select
                                                value={time.day}
                                                onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            >
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="w-full md:w-1/4 px-0 md:px-2 mb-2 md:mb-0">
                                            <input
                                                type="time"
                                                value={time.startTime}
                                                onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        
                                        <div className="w-full md:w-1/4 px-0 md:px-2 mb-2 md:mb-0">
                                            <input
                                                type="time"
                                                value={time.endTime}
                                                onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        
                                        <div className="w-full md:w-1/4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => removeAvailabilitySlot(index)}
                                                className="text-red-500 hover:text-red-700"
                                                disabled={formData.availableTimes.length <= 1}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                <button
                                    type="button"
                                    onClick={addAvailabilitySlot}
                                    className="mt-2 bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                                >
                                    + Add Availability
                                </button>
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    {editingDoctor ? 'Update Doctor' : 'Save Doctor'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {loading ? (
                    <div className="text-center py-4">Loading doctors...</div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-4">No doctors found. Add your first doctor above.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">Name</th>
                                    <th className="py-3 px-4 text-left">Hospital</th>
                                    <th className="py-3 px-4 text-left">Specialization</th>
                                    <th className="py-3 px-4 text-left">Available Days</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {doctors.map(doctor => (
                                    <tr key={doctor._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">{doctor.name}</td>
                                        <td className="py-3 px-4">{doctor.hospital}</td>
                                        <td className="py-3 px-4">{doctor.specialization}</td>
                                        <td className="py-3 px-4">
                                            {doctor.availableTimes.map(time => time.day).join(', ')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleEdit(doctor)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doctor._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default DoctorManagement;