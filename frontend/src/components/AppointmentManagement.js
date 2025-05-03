import React, { useState, useEffect } from 'react';
import { appointmentAPI, doctorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const AppointmentManagement = () => {
    const { isAdmin } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // States for appointment booking
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [appointmentReason, setAppointmentReason] = useState('');
    const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);
    
    useEffect(() => {
        fetchAppointments();
        if (!isAdmin()) {
            fetchDoctors();
        }
    }, []);
    
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = isAdmin() 
                ? await appointmentAPI.getAllAppointments()
                : await appointmentAPI.getUserAppointments();
            setAppointments(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch appointments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const data = await doctorAPI.getAllDoctors();
            setDoctors(data);
        } catch (err) {
            console.error('Failed to fetch doctors:', err);
            setError('Failed to load doctors list');
        }
    };
    
    const handleStatusChange = async (id, status) => {
        try {
            await appointmentAPI.updateAppointmentStatus(id, status);
            setSuccess(`Appointment marked as ${status}`);
            fetchAppointments();
        } catch (err) {
            setError('Failed to update appointment status');
            console.error(err);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await appointmentAPI.cancelAppointment(id);
                setSuccess('Appointment cancelled successfully');
                fetchAppointments();
            } catch (err) {
                setError('Failed to cancel appointment');
                console.error(err);
            }
        }
    };
    
    // Helper to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // New appointment form handling
    const handleDoctorChange = (e) => {
        const doctorId = e.target.value;
        setSelectedDoctor(doctorId);
        setSelectedDoctorDetails(doctors.find(doctor => doctor._id === doctorId) || null);
    };

    const generateTimeSlots = (startTime, endTime) => {
        const slots = [];
        let start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        
        while (start < end) {
            const timeString = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            slots.push(timeString);
            start.setHours(start.getHours() + 1); // 1-hour blocks
        }
        
        return slots;
    };
    
    const getAvailableTimeSlotsForDate = () => {
        if (!selectedDoctorDetails || !appointmentDate) return [];
        
        const date = new Date(appointmentDate);
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
        
        const availableDay = selectedDoctorDetails.availableTimes.find(t => t.day === dayOfWeek);
        if (!availableDay) return [];
        
        return generateTimeSlots(availableDay.startTime, availableDay.endTime);
    };

    const handleSubmitAppointment = async (e) => {
        e.preventDefault();
        
        if (!selectedDoctor || !appointmentDate || !appointmentTime || !appointmentReason) {
            setError('Please complete all required fields');
            return;
        }
        
        try {
            const appointmentData = {
                doctorId: selectedDoctor,
                date: appointmentDate,
                time: appointmentTime,
                reason: appointmentReason
            };
            
            await appointmentAPI.createAppointment(appointmentData);
            setSuccess('Appointment booked successfully!');
           
            // Reset form
            setSelectedDoctor('');
            setAppointmentDate('');
            setAppointmentTime('');
            setAppointmentReason('');
            setShowBookingForm(false);
            
            // Refresh appointments
            fetchAppointments();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book appointment');
            console.error(err);
        }
    };
    
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center" style={{ marginTop: '5rem' }}>
                    {isAdmin() ? 'Appointment Management' : 'My Appointments'}
                </h1>
                
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

                {/* User booking section */}
                {!isAdmin() && (
                    <div className="mb-8">
                        {!showBookingForm ? (
                            <button 
                                onClick={() => setShowBookingForm(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-6"
                            >
                                Book New Appointment
                            </button>
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Book an Appointment</h2>
                                    <button 
                                        onClick={() => setShowBookingForm(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmitAppointment}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Select Doctor *
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {doctors.map(doctor => (
                                                <button
                                                    key={doctor._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedDoctor(doctor._id);
                                                        setSelectedDoctorDetails(doctor);
                                                    }}
                                                    className={`p-4 border rounded-lg text-left hover:bg-blue-50 transition-colors 
                                                        ${selectedDoctor === doctor._id ? 'bg-blue-100 border-blue-500 shadow-md' : 'bg-white'}`}
                                                >
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                                            {doctor.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold">{doctor.name}</h3>
                                                            <p className="text-sm text-gray-600">{doctor.specialization}</p>
                                                            <p className="text-xs text-gray-500">{doctor.hospital}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {selectedDoctorDetails && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                                            <p className="font-semibold">Available Days:</p>
                                            <ul className="list-disc ml-5">
                                                {selectedDoctorDetails.availableTimes.map((time, index) => (
                                                    <li key={index}>
                                                        {time.day}: {time.startTime} - {time.endTime}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={appointmentDate}
                                            onChange={(e) => setAppointmentDate(e.target.value)}
                                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            min={new Date().toISOString().split('T')[0]} // Today or future dates only
                                            required
                                        />
                                    </div>

                                    {appointmentDate && selectedDoctorDetails && (
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Select Time Slot (1-hour blocks) *
                                            </label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {getAvailableTimeSlotsForDate().length > 0 ? (
                                                    getAvailableTimeSlotsForDate().map((timeSlot, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => setAppointmentTime(timeSlot)}
                                                            className={`py-3 px-4 border rounded-lg text-center hover:bg-blue-50 transition-colors relative
                                                                ${appointmentTime === timeSlot 
                                                                    ? 'bg-blue-100 border-blue-500 shadow-md' 
                                                                    : 'bg-white border-gray-200'}`}
                                                        >
                                                            <span className="block font-medium">{timeSlot}</span>
                                                            <span className="text-xs text-gray-500 block">1 hour</span>
                                                            {appointmentTime === timeSlot && (
                                                                <span className="absolute top-1 right-1 text-blue-600">
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <p className="col-span-full text-red-500">
                                                        No available time slots for the selected date. Please choose another date.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Reason for Visit *
                                        </label>
                                        <textarea
                                            value={appointmentReason}
                                            onChange={(e) => setAppointmentReason(e.target.value)}
                                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            rows="3"
                                            placeholder="Please describe the reason for your appointment"
                                            required
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!selectedDoctor || !appointmentDate || !appointmentTime || !appointmentReason}
                                            className={`px-4 py-2 rounded ${
                                                !selectedDoctor || !appointmentDate || !appointmentTime || !appointmentReason
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                                            }`}
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
                
                {loading ? (
                    <div className="text-center py-4">Loading appointments...</div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg mb-4">No appointments found.</p>
                        {!isAdmin() && (
                            <button 
                                onClick={() => setShowBookingForm(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Book Your First Appointment
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        {isAdmin() && <th className="py-3 px-4 text-left">Patient</th>}
                                        <th className="py-3 px-4 text-left">Doctor</th>
                                        <th className="py-3 px-4 text-left">Hospital</th>
                                        <th className="py-3 px-4 text-left">Date & Time</th>
                                        <th className="py-3 px-4 text-left">Reason</th>
                                        <th className="py-3 px-4 text-left">Status</th>
                                        <th className="py-3 px-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {appointments.map(appointment => (
                                        <tr key={appointment._id} className="hover:bg-gray-50">
                                            {isAdmin() && (
                                                <td className="py-3 px-4">
                                                    {appointment.patient?.name || appointment.patient?.email || 'Unknown'}
                                                </td>
                                            )}
                                            <td className="py-3 px-4">{appointment.doctor?.name || 'Unknown'}</td>
                                            <td className="py-3 px-4">{appointment.doctor?.hospital || 'Unknown'}</td>
                                            <td className="py-3 px-4">
                                                {formatDate(appointment.date)} <br />
                                                <span className="text-sm text-gray-600">{appointment.time}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="max-w-xs truncate">{appointment.reason}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col space-y-1">
                                                    {isAdmin() ? (
                                                        // Admin actions
                                                        <>
                                                            {appointment.status !== 'completed' && (
                                                                <button
                                                                    onClick={() => handleStatusChange(appointment._id, 'completed')}
                                                                    className="text-green-600 hover:text-green-800 text-sm"
                                                                >
                                                                    Mark Completed
                                                                </button>
                                                            )}
                                                            {appointment.status !== 'cancelled' && (
                                                                <button
                                                                    onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                            {appointment.status === 'cancelled' && appointment.status !== 'scheduled' && (
                                                                <button
                                                                    onClick={() => handleStatusChange(appointment._id, 'scheduled')}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                                >
                                                                    Reschedule
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        // User actions
                                                        <>
                                                            {appointment.status === 'scheduled' && (
                                                                <button
                                                                    onClick={() => handleCancel(appointment._id)}
                                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AppointmentManagement;