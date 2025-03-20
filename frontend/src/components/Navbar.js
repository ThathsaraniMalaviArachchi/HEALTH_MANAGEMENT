import React from 'react';

const Navbar = () => {
    return React.createElement('nav', {
        className: 'fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-teal-500 shadow-lg backdrop-blur-md'
    },
        React.createElement('div', {
            className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        },
            React.createElement('div', {
                className: 'flex items-center justify-center h-20'
            },
                React.createElement('div', {
                    className: 'flex-shrink-0 text-white font-bold text-2xl transform hover:scale-105 transition-transform duration-200'
                }, '🏥 HealthTracker')
            )
        )
    );
};

export default Navbar;
