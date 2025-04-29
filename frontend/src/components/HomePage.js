import React, { useState } from 'react';
import homeCover from '../images/homeCover.jpg';
import HealthLogList from './HealthLogList';
import HealthLogForm from './HealthLogForm';
import AdvancedReport from './AdvancedReport';
import Navbar from './Navbar';
import Footer from './Footer';

const HomePage = () => {
    const [showForm, setShowForm] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [showAdvancedReport, setShowAdvancedReport] = useState(false);

    const handleFormSuccess = () => {
        setShowForm(false);
        setShowLogs(true);
    };

    const handleShowAdvancedReport = () => {
        setShowAdvancedReport(true);
        setShowForm(false);
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
                            Health Management System
                        </h1>
                        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                            Track your health metrics and monitor your progress over time with ease.
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={() => { setShowForm(true); setShowLogs(false); }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md border-2 border-white hover:border-gray-200 transform hover:scale-105"
                            >
                                Add Health Log
                            </button>
                            <button
                                onClick={() => { setShowLogs(true); setShowForm(false); }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md border-2 border-white hover:border-gray-200 transform hover:scale-105"
                            >
                                View Health Logs
                            </button>
                            <button
                                onClick={handleShowAdvancedReport}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 shadow-md border-2 border-white hover:border-gray-200 transform hover:scale-105"
                            >
                                Advanced Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                {!showForm && !showLogs && (
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

                {/* Conditional Rendering of Form or List */}
                {showForm && (
                    <div className="max-w-4xl mx-auto py-12 px-6 bg-white shadow-lg rounded-lg">
                        <HealthLogForm onSuccess={handleFormSuccess} key={Date.now()} />
                    </div>
                )}

                {showLogs && (
                    <div className="max-w-7xl mx-auto py-12 px-6 bg-white shadow-lg rounded-lg">
                        <HealthLogList />
                    </div>
                )}

                {/* Advanced Report Modal */}
                {showAdvancedReport && (
                    <AdvancedReport onClose={() => setShowAdvancedReport(false)} />
                )}
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
