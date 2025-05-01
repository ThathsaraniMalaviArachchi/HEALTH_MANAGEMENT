import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        // No need to navigate as the AuthContext will handle the state update
    };

    return React.createElement('nav', {
        className: 'fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-teal-500 shadow-lg backdrop-blur-md'
    },
        React.createElement('div', {
            className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        },
            React.createElement('div', {
                className: 'flex items-center justify-between h-20'
            },
                React.createElement(Link, {
                    to: '/',
                    className: 'flex-shrink-0 text-white font-extrabold text-3xl transform hover:scale-105 transition-transform duration-200',
                    style: { 
                        fontFamily: 'Arial, sans-serif', 
                        letterSpacing: '0.15em', 
                        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)' 
                    }
                }, 'AURA HEALTH'),
                React.createElement('div', {
                    className: 'hidden md:block'
                },
                    React.createElement('div', {
                        className: 'ml-10 flex items-baseline space-x-4'
                    },
                      
                        // Add appointment management link for all users
                       
                        // Only show doctor management for admin users
                        currentUser && currentUser.isAdmin && React.createElement(Link, {
                            to: '/doctors',
                            className: 'text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                        }, 'Manage Doctors'),
                        // Add user management link for admin users
                        currentUser && currentUser.isAdmin && React.createElement(Link, {
                            to: '/manage-users',
                            className: 'text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                        }, 'Manage Users')
                    )
                ),
                React.createElement('div', {
                    className: 'flex space-x-4'
                },
                    currentUser ? [
                        // Logged in state - show user info and logout
                        React.createElement('span', {
                            key: 'welcome',
                            className: 'text-white self-center px-2'
                        }, `Welcome, ${currentUser.name}!`),
                        React.createElement('button', {
                            key: 'logout',
                            onClick: handleLogout,
                            className: 'bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition duration-300 shadow-md'
                        }, 'Log Out')
                    ] : [
                        // Logged out state - show login and signup
                        React.createElement(Link, {
                            key: 'login',
                            to: '/login',
                            className: 'bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition duration-300 shadow-md'
                        }, 'Log In'),
                        React.createElement(Link, {
                            key: 'signup',
                            to: '/signup',
                            className: 'bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition duration-300 shadow-md'
                        }, 'Sign Up')
                    ]
                )
            )
        )
    );
};

export default Navbar;
