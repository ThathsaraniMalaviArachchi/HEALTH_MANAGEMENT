import React, { useState, useEffect } from 'react';
import { doctorAPI, appointmentAPI } from '../services/api';

const AppointmentBooking = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [userAppointments, setUserAppointments] = useState([]);
    const [appointmentReason, setAppointmentReason] = useState('');
    const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Date, 3: Select Time, 4: Confirm
    
    useEffect(() => {
        fetchDoctors();
        fetchUserAppointments();
    }, []);
    
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const data = await doctorAPI.getAllDoctors();
            setDoctors(data);
            setError('');
        } catch (err) {
            setError('Failed to load doctors');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchUserAppointments = async () => {
        try {
            const appointments = await appointmentAPI.getUserAppointments();
            setUserAppointments(appointments);
        } catch (err) {
            console.error('Failed to fetch user appointments:', err);
        }
    };
    
    const selectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };
    
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setStep(3);
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
        if (!selectedDoctor || !selectedDate) return [];
        
        const date = new Date(selectedDate);
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
        
        const availableDay = selectedDoctor.availableTimes.find(t => t.day === dayOfWeek);
        if (!availableDay) return [];
        
        return generateTimeSlots(availableDay.startTime, availableDay.endTime);
    };

    
    const handleTimeSlotSelect = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
        setStep(4);
    };
    
    const handleReasonChange = (e) => {
        setAppointmentReason(e.target.value);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!selectedDoctor || !selectedDate || !selectedTimeSlot || !appointmentReason) {
            setError('Please complete all fields');
            return;
        }
        
        try {
            const appointmentData = {
                doctorId: selectedDoctor._id,
                date: selectedDate,
                time: selectedTimeSlot,
                reason: appointmentReason
            };
            
            await appointmentAPI.createAppointment(appointmentData);
            setSuccess('Appointment booked successfully!');
            
            // Reset form
            setSelectedDoctor(null);
            setSelectedDate('');
            setSelectedTimeSlot('');
            setAppointmentReason('');
            setStep(1); 
            
            // Refresh user appointments
            fetchUserAppointments();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book appointment');
            console.error(err);
        }
    };
    
    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await appointmentAPI.cancelAppointment(id);
                setSuccess('Appointment cancelled successfully');
                fetchUserAppointments();
            } catch (err) {
                setError('Failed to cancel appointment');
                console.error(err);
            }
        }
    };
    
    const resetAppointmentProcess = () => {
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedTimeSlot('');
        setAppointmentReason('');
        setStep(1);
    };
    
    // Helper to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Book an Appointment</h1>
            
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
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Book Your Appointment</h2>
                        {step > 1 && (
                            <button 
                                onClick={resetAppointmentProcess}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Start Over
                            </button>
                        )}
                    </div>
                    
                    <div className="mt-4 mb-6">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</div>
                            <div className={`h-1 flex-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
                            <div className={`h-1 flex-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>3</div>
                            <div className={`h-1 flex-1 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>4</div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>Select Doctor</span>
                            <span>Choose Date</span>
                            <span>Select Time</span>
                            <span>Confirm</span>
                        </div>
                    </div>
                </div>
                
                {/* Step 1: Select Doctor */}
                {step === 1 && (
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Choose a Doctor</h3>
                        {loading ? (
                            <div className="text-center py-4">Loading doctors...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {doctors.map(doctor => (
                                    <button
                                        key={doctor._id}
                                        onClick={() => selectDoctor(doctor)}
                                        className="border rounded-lg p-4 hover:bg-blue-50 transition-colors text-left flex flex-col h-full"
                                    >
                                        <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-bold text-lg">{doctor.name}</h4>
                                        <p className="text-gray-600">{doctor.specialization}</p>
                                        <p className="text-gray-500 text-sm">{doctor.hospital}</p>
                                        <div className="text-sm mt-2">
                                            <p className="font-semibold">Available on:</p>
                                            <p>{doctor.availableTimes.map(time => time.day).join(', ')}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Step 2: Select Date */}
                {step === 2 && selectedDoctor && (
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Select Appointment Date</h3>
                        <div className="p-4 mb-4 bg-blue-50 rounded-lg">
                            <p className="font-bold">{selectedDoctor.name} - {selectedDoctor.specialization}</p>
                            <p className="text-sm text-gray-600">{selectedDoctor.hospital}</p>
                            <div className="mt-2">
                                <p className="font-semibold">Available Days:</p>
                                <ul className="list-disc ml-5 text-sm">
                                    {selectedDoctor.availableTimes.map((time, index) => (
                                        <li key={index}>
                                            {time.day}: {time.startTime} - {time.endTime}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Select a Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                min={new Date().toISOString().split('T')[0]} // Today or future dates only
                                required
                            />
                        </div>
                    </div>
                )}
                
                {/* Step 3: Select Time  */}
                {step === 3 && selectedDoctor && selectedDate && (
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Select Appointment Time</h3>
                        <div className="p-4 mb-4 bg-blue-50 rounded-lg">
                            <p className="font-bold">{selectedDoctor.name} - {selectedDoctor.specialization}</p>
                            <p className="text-sm text-gray-600">{selectedDoctor.hospital}</p>
                            <p className="mt-1">Date: {formatDate(selectedDate)}</p>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Available Time Slots (1 hour each)
                            </label>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {getAvailableTimeSlotsForDate().length > 0 ? (
                                    getAvailableTimeSlotsForDate().map((timeSlot, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleTimeSlotSelect(timeSlot)}
                                            className={`py-2 px-3 border rounded text-center hover:bg-blue-50 ${
                                                selectedTimeSlot === timeSlot ? 'bg-blue-100 border-blue-500' : ''
                                            }`}
                                        >
                                            {timeSlot}
                                        </button>
                                    ))
                                ) : (
                                    <p className="col-span-full text-red-500">
                                        No available time slots for the selected date. Please choose another date.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Step 4: Confirmation */}
                {step === 4 && selectedDoctor && selectedDate && selectedTimeSlot && (
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Confirm Your Appointment</h3>
                        <div className="p-4 mb-4 bg-blue-50 rounded-lg">
                            <p className="font-bold">{selectedDoctor.name} - {selectedDoctor.specialization}</p>
                            <p className="text-sm text-gray-600">{selectedDoctor.hospital}</p>
                            <p className="mt-1">Date: {formatDate(selectedDate)}</p>
                            <p>Time: {selectedTimeSlot}</p>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Reason for Visit
                            </label>
                            <textarea
                                value={appointmentReason}
                                onChange={handleReasonChange}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                                placeholder="Please describe the reason for your appointment"
                                required
                            ></textarea>
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!appointmentReason}
                                className={`px-4 py-2 rounded ${
                                    appointmentReason 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
                
                {userAppointments.length === 0 ? (
                    <p className="text-gray-600">You don't have any appointments scheduled.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left">Doctor</th>
                                    <th className="py-3 px-4 text-left">Hospital</th>
                                    <th className="py-3 px-4 text-left">Date</th>
                                    <th className="py-3 px-4 text-left">Time</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {userAppointments.map(appointment => (
                                    <tr key={appointment._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">{appointment.doctor?.name || 'Unknown'}</td>
                                        <td className="py-3 px-4">{appointment.doctor?.hospital || 'Unknown'}</td>
                                        <td className="py-3 px-4">{formatDate(appointment.date)}</td>
                                        <td className="py-3 px-4">{appointment.time}</td>
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
                                            {appointment.status === 'scheduled' && (
                                                <button
                                                    onClick={() => handleCancel(appointment._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentBooking;