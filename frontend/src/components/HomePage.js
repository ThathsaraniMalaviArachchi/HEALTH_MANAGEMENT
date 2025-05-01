import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import homeCover from '../images/homeCover.jpg';
import HealthLogList from './HealthLogList';
import HealthLogForm from './HealthLogForm';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { isAdmin } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [showHealthOptions, setShowHealthOptions] = useState(false);

    const handleFormSuccess = () => {
        setShowForm(false);
        setShowLogs(true);
        setShowHealthOptions(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <div className="flex-grow pt-16">
                {/* Hero Section */}
                <div className="relative text-white py-24 px-6 text-center shadow-lg" style={{ backgroundImage: `url(${homeCover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-400 opacity-75"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
                            {isAdmin() ? 'Admin Dashboard' : 'Health Management System'}
                        </h1>
                        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                            {isAdmin() 
                                ? 'Manage users and appointments from your admin dashboard'
                                : 'Track your health metrics and monitor your progress over time with ease.'}
                        </p>
                    </div>
                </div>

                {/* Quick Access Buttons Section */}
                {!showForm && !showLogs && !showHealthOptions && (
                    <div className="bg-white py-10 px-6 shadow-md">
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Quick Access</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Show different buttons based on user role */}
                                {!isAdmin() && (
                                    <>
                                        <button 
                                            className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 flex flex-col items-center"
                                            onClick={() => console.log('Medications Management clicked')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                            <span className="text-xl font-semibold">Medications Management</span>
                                        </button>
                                        <button 
                                            className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 flex flex-col items-center"
                                            onClick={() => setShowHealthOptions(true)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            <span className="text-xl font-semibold">Health Logs</span>
                                        </button>
                                        <Link 
                                            to="/manage-appointments"
                                            className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 flex flex-col items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xl font-semibold">My Appointments</span>
                                        </Link>
                                    </>
                                )}
                                
                                {/* Admin buttons */}
                                {isAdmin() && (
                                    <>
                                        <Link 
                                            to="/doctors"
                                            className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 flex flex-col items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            <span className="text-xl font-semibold">Doctor Management</span>
                                        </Link>
                                        
                                        <Link 
                                            to="/manage-appointments"
                                            className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 flex flex-col items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xl font-semibold">Appointment Management</span>
                                        </Link>
                                        
                                        <button 
                                            className="bg-gray-700 hover:bg-gray-800 text-white p-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 flex flex-col items-center"
                                            onClick={() => console.log('User Management clicked')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <span className="text-xl font-semibold">User Management</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Health Logs Options - Only shown to regular users */}
                {!isAdmin() && showHealthOptions && !showForm && !showLogs && (
                    <div className="bg-white py-10 px-6 shadow-md">
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Health Logs</h2>
                            <div className="flex flex-col md:flex-row justify-center gap-6">
                                <button
                                    onClick={() => { setShowForm(true); setShowLogs(false); setShowHealthOptions(false); }}
                                    className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md border-2 border-white hover:border-gray-200 transform hover:scale-105 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Health Log
                                </button>
                                <button
                                    onClick={() => { setShowLogs(true); setShowForm(false); setShowHealthOptions(false); }}
                                    className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md border-2 border-white hover:border-gray-200 transform hover:scale-105 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    View Health Logs
                                </button>
                                <button
                                    onClick={() => setShowHealthOptions(false)}
                                    className="bg-gray-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 shadow-md border-2 border-white hover:border-gray-200 transform hover:scale-105 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Section - Only shown to regular users */}
                {!isAdmin() && !showForm && !showLogs && !showHealthOptions && (
                    <div className="relative bg-gradient-to-r from-blue-600 to-teal-400 text-white py-16 px-6">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Automated Data Collection',
                                    description: 'Connect with glucose monitors and BP machines for automatic data recording.'
                                },
                                {
                                    title: 'Progress Tracking',
                                    description: 'View your health metrics over time with detailed analytics and trends.'
                                },
                                {
                                    title: 'Data Management',
                                    description: 'Easy to update or remove health logs with full control over your data.'
                                }
                            ].map(feature => (
                                <div key={feature.title} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 border-t-4 border-blue-500 text-gray-800">
                                    <h3 className="text-2xl font-bold mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Conditional Rendering of Form or List - Only for regular users */}
                {!isAdmin() && showForm && (
                    <div className="max-w-4xl mx-auto py-12 px-6 bg-white shadow-lg rounded-lg">
                        <div className="mb-6 flex justify-end">
                            <button
                                onClick={() => { setShowForm(false); setShowHealthOptions(true); }}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back
                            </button>
                        </div>
                        <HealthLogForm onSuccess={handleFormSuccess} key={Date.now()} />
                    </div>
                )}

                {!isAdmin() && showLogs && (
                    <div className="max-w-7xl mx-auto py-12 px-6 bg-white shadow-lg rounded-lg">
                        <div className="mb-6 flex justify-end">
                            <button
                                onClick={() => { setShowLogs(false); setShowHealthOptions(true); }}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back
                            </button>
                        </div>
                        <HealthLogList />
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
