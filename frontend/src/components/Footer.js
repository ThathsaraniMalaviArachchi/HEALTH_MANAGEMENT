import React from 'react';

const Footer = () => {
    return React.createElement('footer', {
        className: 'bg-gradient-to-r from-gray-900 to-blue-900 text-white mt-auto'
    },
        React.createElement('div', {
            className: 'max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'
        },
            React.createElement('div', {
                className: 'grid grid-cols-1 md:grid-cols-4 gap-12'
            },
                React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('h3', {
                        className: 'text-lg font-semibold mb-4'
                    }, 'Quick Links'),
                    ['About Us', 'Features', 'Privacy Policy', 'Contact Us'].map(item =>
                        React.createElement('a', {
                            key: item,
                            href: '#',
                            className: 'block text-gray-400 hover:text-white mb-2'
                        }, item)
                    )
                ),
                React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('h3', {
                        className: 'text-lg font-semibold mb-4'
                    }, 'Connect With Us'),
                    ['Twitter', 'LinkedIn', 'GitHub', 'Facebook'].map(item =>
                        React.createElement('a', {
                            key: item,
                            href: '#',
                            className: 'block text-gray-400 hover:text-white mb-2'
                        }, item)
                    )
                ),
                React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('h3', {
                        className: 'text-lg font-semibold mb-4'
                    }, 'Contact Information'),
                    React.createElement('p', {
                        className: 'text-gray-400'
                    }, 'Email: support@healthtracker.com'),
                    React.createElement('p', {
                        className: 'text-gray-400'
                    }, 'Phone: +1 234 567 890')
                ),
                React.createElement('div', {
                    className: 'space-y-4'
                },
                    React.createElement('h3', {
                        className: 'text-lg font-semibold mb-4'
                    }, 'Resources'),
                    ['Blog', 'Help Center', 'Terms of Service'].map(item =>
                        React.createElement('a', {
                            key: item,
                            href: '#',
                            className: 'block text-gray-400 hover:text-white mb-2'
                        }, item)
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
