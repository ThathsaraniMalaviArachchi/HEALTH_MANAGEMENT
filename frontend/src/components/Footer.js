import React from 'react';

const Footer = () => {
    return React.createElement('footer', {
        className: 'bg-gradient-to-r from-gray-900 to-blue-900 text-white mt-auto'
    },
        React.createElement('div', {
            className: 'max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'
        },
            React.createElement('div', {
                className: 'grid grid-cols-1 md:grid-cols-3 gap-12'
            },
                React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('h3', {
                        className: 'text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent'
                    }, '🏥 HealthTracker'),
                    React.createElement('p', {
                        className: 'text-gray-400 leading-relaxed'
                    }, 'Empowering you to take control of your health journey.')
                ),
                React.createElement('div', null,
                    React.createElement('h3', {
                        className: 'text-lg font-semibold mb-4'
                    }, 'Quick Links'),
                    ['About Us', 'Features', 'Privacy Policy'].map(item =>
                        React.createElement('a', {
                            key: item,
                            href: '#',
                            className: 'block text-gray-400 hover:text-white mb-2'
                        }, item)
                    )
                ),
                React.createElement('div', null,
                    React.createElement('h3', {
                        className: 'text-lg font-semibold mb-4'
                    }, 'Connect With Us'),
                    React.createElement('div', {
                        className: 'flex space-x-4'
                    },
                        ['Twitter', 'LinkedIn', 'GitHub'].map(item =>
                            React.createElement('a', {
                                key: item,
                                href: '#',
                                className: 'text-gray-400 hover:text-white'
                            }, item)
                        )
                    )
                )
            ),
            React.createElement('div', {
                className: 'mt-12 pt-8 border-t border-gray-800 text-center text-gray-400'
            }, '© 2024 HealthTracker. All rights reserved.')
        )
    );
};

export default Footer;
