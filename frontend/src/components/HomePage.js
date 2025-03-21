import React, { useState } from 'react';
import HealthLogList from './HealthLogList';
import HealthLogForm from './HealthLogForm';
import Navbar from './Navbar';
import Footer from './Footer';

const HomePage = () => {
    const [showForm, setShowForm] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    const handleFormSuccess = () => {
        setShowForm(false);
        setShowLogs(true);
    };

    return React.createElement('div', { className: 'min-h-screen bg-gray-100 flex flex-col' },
        //add navbar
        React.createElement(Navbar),
        
        // Main content wrapper with padding for navbar
        React.createElement('main', { className: 'flex-grow pt-16' },
            // Hero Section
            React.createElement('div', { className: 'bg-gradient-to-r from-blue-500 to-teal-400 text-white py-20 px-4' },
                React.createElement('div', { className: 'max-w-4xl mx-auto text-center' },
                    React.createElement('h1', { className: 'text-4xl md:text-6xl font-bold mb-6' }, 'Health Management System'),
                    React.createElement('p', { className: 'text-xl mb-8' }, 'Track your health metrics and monitor your progress over time'),
                    React.createElement('div', { className: 'space-x-4' },
                        React.createElement('button', {
                            onClick: () => {
                                setShowForm(true);
                                setShowLogs(false);
                            },
                            className: 'bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
                        }, '+ Add Health Log'),
                        React.createElement('button', {
                            onClick: () => {
                                setShowLogs(true);
                                setShowForm(false);
                            },
                            className: 'bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-500 transition-colors'
                        }, 'View Health Logs')
                    )
                )
            ),

            // Features Section
            !showForm && !showLogs && React.createElement('div', { className: 'max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8' },
                [
                    {
                        title: 'Automated Data Collection',
                        description: 'Connect with glucose monitors and BP machines for automatic data recording'
                    },
                    {
                        title: 'Progress Tracking',
                        description: 'View your health metrics over time with detailed analytics and trends'
                    },
                    {
                        title: 'Data Management',
                        description: 'Easy to update or remove health logs with full control over your data'
                    }
                ].map(feature =>
                    React.createElement('div', { 
                        key: feature.title,
                        className: 'bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow'
                    },
                        React.createElement('h3', { className: 'text-xl font-semibold mb-3 text-gray-800' }, feature.title),
                        React.createElement('p', { className: 'text-gray-600' }, feature.description)
                    )
                )
            ),

            // Conditional Rendering of Form or List
            showForm && React.createElement('div', { className: 'max-w-4xl mx-auto py-8 px-4' },
                React.createElement(HealthLogForm, {
                    onSuccess: handleFormSuccess,
                    key: Date.now() // Force new instance on each render
                })
            ),

            showLogs && React.createElement('div', { className: 'max-w-7xl mx-auto py-8 px-4' },
                React.createElement(HealthLogList)
            )
        ),

        // Add Footer
        React.createElement(Footer)
    );
};

export default HomePage;
