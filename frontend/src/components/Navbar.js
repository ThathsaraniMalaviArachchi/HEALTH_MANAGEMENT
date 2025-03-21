import React from 'react';

const Navbar = () => {
    return React.createElement('nav', {
        className: 'fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-teal-500 shadow-lg backdrop-blur-md'
    },
        React.createElement('div', {
            className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        },
            React.createElement('div', {
                className: 'flex items-center justify-between h-20'
            },
                React.createElement('div', {
                    className: 'flex-shrink-0 text-white font-extrabold text-3xl transform hover:scale-105 transition-transform duration-200',
                    style: { 
                        fontFamily: 'Arial, sans-serif', 
                        letterSpacing: '0.15em', 
                        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)' 
                    }
                }, 'AURA HEALTH'),
                React.createElement('div', {
                    className: 'flex space-x-4'
                },
                    React.createElement('button', {
                        className: 'bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition duration-300 shadow-md'
                    }, 'Sign In'),
                    React.createElement('button', {
                        className: 'bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition duration-300 shadow-md'
                    }, 'Sign Up')
                )
            )
        )
    );
};

export default Navbar;
