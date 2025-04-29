import React from 'react';
import { useState, useEffect } from 'react';
import { healthLogsAPI } from '../services/api';
import { jsPDF } from "jspdf";
import HealthLogForm from './HealthLogForm';

const HealthLogList = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editLog, setEditLog] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [report, setReport] = useState(null);
    const [aiReport, setAiReport] = useState(null);
    const [showAiReport, setShowAiReport] = useState(false);
    const [generatingAiReport, setGeneratingAiReport] = useState(false);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await healthLogsAPI.getAll();
            setLogs(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Error fetching logs:', error);
            setError('Failed to load health logs');
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleDelete = async (id) => {
        // Add confirmation dialog
        const confirmed = window.confirm('Are you sure you want to delete this health log?');
        if (!confirmed) {
            return;
        }

        try {
            await healthLogsAPI.delete(id);
            setLogs(prevLogs => prevLogs.filter(log => log._id !== id));
        } catch (error) {
            console.error('Error deleting log:', error);
            alert('Failed to delete log');
        }
    };

    const handleEdit = (log) => {
        setEditLog(log);
        setShowEditForm(true);
    };

    const handleEditSuccess = async () => {
        await fetchLogs();
        setEditLog(null);
        setShowEditForm(false);
    };

    const generateReport = () => {
        if (logs.length === 0) {
            alert('No health logs available to generate report');
            return;
        }

        const report = {
            totalEntries: logs.length,
            averages: {
                systolic: Math.round(logs.reduce((acc, log) => acc + log.blood_pressure_systolic, 0) / logs.length),
                diastolic: Math.round(logs.reduce((acc, log) => acc + log.blood_pressure_diastolic, 0) / logs.length),
                glucose: Math.round(logs.reduce((acc, log) => acc + log.glucose_level, 0) / logs.length),
                heartRate: Math.round(logs.reduce((acc, log) => acc + log.heart_rate, 0) / logs.length)
            },
            dateRange: {
                start: new Date(Math.min(...logs.map(log => new Date(log.date)))).toLocaleDateString(),
                end: new Date(Math.max(...logs.map(log => new Date(log.date)))).toLocaleDateString()
            }
        };

        setReport(report);
        setShowReport(true);
    };

    const downloadPDF = () => {
        if (!report) {
            alert('Please generate report first');
            return;
        }

        const doc = new jsPDF();
        const lineHeight = 10;
        let y = 20;

        // Add title
        doc.setFontSize(20);
        doc.text('Health Report Summary', 20, y);
        y += lineHeight * 2;

        // Add content with regular font size
        doc.setFontSize(12);
        doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, y);
        y += lineHeight * 1.5;

        doc.text(`Date Range: ${report.dateRange.start} to ${report.dateRange.end}`, 20, y);
        y += lineHeight;
        doc.text(`Total Entries: ${report.totalEntries}`, 20, y);
        y += lineHeight * 1.5;

        // Add averages
        doc.text('Average Measurements:', 20, y);
        y += lineHeight;
        doc.text(`Blood Pressure: ${report.averages.systolic}/${report.averages.diastolic} mmHg`, 30, y);
        y += lineHeight;
        doc.text(`Glucose Level: ${report.averages.glucose} mg/dL`, 30, y);
        y += lineHeight;
        doc.text(`Heart Rate: ${report.averages.heartRate} BPM`, 30, y);
        y += lineHeight * 2;

        // Add detailed log entries
        doc.text('Detailed Log Entries:', 20, y);
        y += lineHeight;

        logs.forEach(log => {
            if (y > 270) { // Check if we need a new page
                doc.addPage();
                y = 20;
            }
            doc.text(`Date: ${new Date(log.date).toLocaleDateString()}`, 30, y);
            y += lineHeight;
            doc.text(`BP: ${log.blood_pressure_systolic}/${log.blood_pressure_diastolic}, ` +
                     `Glucose: ${log.glucose_level}, HR: ${log.heart_rate}`, 30, y);
            y += lineHeight * 1.5;
        });

        // Save the PDF
        doc.save('health-report.pdf');
    };

    const generateAIReport = async () => {
        if (logs.length === 0) {
            alert('No health logs available to generate AI report');
            return;
        }

        try {
            setGeneratingAiReport(true);
            setShowAiReport(false);
            
            const response = await healthLogsAPI.generateAIReport();
            setAiReport(response.report);
            setShowAiReport(true);
        } catch (error) {
            console.error('Error generating AI report:', error);
            alert('Failed to generate AI report. Please try again.');
        } finally {
            setGeneratingAiReport(false);
        }
    };

    if (loading) {
        return React.createElement('div', { 
            className: 'flex items-center justify-center min-h-[400px]'
        }, 
            React.createElement('div', {
                className: 'animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent'
            })
        );
    }

    if (error) {
        return React.createElement('div', { 
            className: 'text-red-500 text-center py-8 bg-red-50 rounded-lg border border-red-100 max-w-2xl mx-auto'
        }, error);
    }

    return React.createElement('div', { className: 'container mx-auto px-4 py-8 max-w-7xl' },
        React.createElement('div', { 
            className: 'flex flex-col md:flex-row justify-between items-center mb-8 gap-4'
        },
            React.createElement('h2', { 
                className: 'text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent'
            }, 'Health Logs'),
            React.createElement('div', { 
                className: 'flex space-x-4'
            },
                React.createElement('button', {
                    onClick: generateReport,
                    className: 'bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2'
                }, 
                    '📊 Generate Report'
                ),
                React.createElement('button', {
                    onClick: downloadPDF,
                    className: 'bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2'
                }, 
                    '📥 Download PDF'
                ),
                React.createElement('button', {
                    onClick: generateAIReport,
                    disabled: generatingAiReport,
                    className: `bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 ${generatingAiReport ? 'opacity-75 cursor-not-allowed' : 'hover:bg-purple-700'}`
                }, 
                    generatingAiReport ? 'Generating...' : '🤖 Generate AI Report'
                )
            )
        ),
        
        // AI Report Loading Indicator
        generatingAiReport && React.createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
        },
            React.createElement('div', { 
                className: 'bg-white p-8 rounded-xl shadow-xl flex flex-col items-center'
            },
                React.createElement('div', { 
                    className: 'animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4'
                }),
                React.createElement('p', { 
                    className: 'text-lg text-gray-800'
                }, 'Generating AI Health Report...'),
                React.createElement('p', { 
                    className: 'text-sm text-gray-500 mt-2'
                }, 'Please wait, this may take a minute.')
            )
        ),
        
        // Show AI Report Section
        showAiReport && aiReport && React.createElement('div', { 
            className: 'bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100 transform transition-all duration-200 hover:shadow-xl'
        },
            React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                React.createElement('h3', { className: 'text-xl font-semibold text-purple-700' }, 'AI Health Analysis Report'),
                React.createElement('button', {
                    onClick: () => setShowAiReport(false),
                    className: 'text-gray-500 hover:text-gray-700'
                }, '✕')
            ),
            React.createElement('div', { className: 'prose max-w-none' },
                React.createElement('div', {
                    dangerouslySetInnerHTML: { __html: aiReport.replace(/\n/g, '<br />') }
                })
            )
        ),
        
        // Show Report Section
        showReport && report && React.createElement('div', { 
            className: 'bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100 transform transition-all duration-200 hover:shadow-xl'
        },
            React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                React.createElement('h3', { className: 'text-xl font-semibold' }, 'Health Report Summary'),
                React.createElement('button', {
                    onClick: () => setShowReport(false),
                    className: 'text-gray-500 hover:text-gray-700'
                }, '✕')
            ),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                React.createElement('div', null,
                    React.createElement('p', { className: 'text-gray-600' }, 
                        `Total Entries: ${report.totalEntries}`
                    ),
                    React.createElement('p', { className: 'text-gray-600' }, 
                        `Date Range: ${report.dateRange.start} to ${report.dateRange.end}`
                    )
                ),
                React.createElement('div', null,
                    React.createElement('p', { className: 'text-gray-600' }, 
                        `Avg. Blood Pressure: ${report.averages.systolic}/${report.averages.diastolic} mmHg`
                    ),
                    React.createElement('p', { className: 'text-gray-600' }, 
                        `Avg. Glucose: ${report.averages.glucose} mg/dL`
                    ),
                    React.createElement('p', { className: 'text-gray-600' }, 
                        `Avg. Heart Rate: ${report.averages.heartRate} BPM`
                    )
                )
            )
        ),

        showEditForm ? 
            React.createElement('div', { className: 'mb-8' },
                React.createElement(HealthLogForm, {
                    onSuccess: handleEditSuccess,
                    initialData: editLog
                })
            ) : null,

        logs.length === 0 ? 
            React.createElement('div', { 
                className: 'text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200'
            }, 
                React.createElement('p', { 
                    className: 'text-gray-500 text-lg'
                }, 'No health logs found.')
            ) :
            React.createElement('div', { 
                className: 'bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'
            },
                React.createElement('div', { 
                    className: 'overflow-x-auto'
                },
                    React.createElement('table', { 
                        className: 'min-w-full divide-y divide-gray-200'
                    },
                        React.createElement('thead', { className: 'bg-gray-100' },
                            React.createElement('tr', null,
                                ['Date', 'Systolic', 'Diastolic', 'Glucose', 'Heart Rate', 'Actions'].map(header =>
                                    React.createElement('th', { 
                                        key: header,
                                        className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    }, header)
                                )
                            )
                        ),
                        React.createElement('tbody', { className: 'divide-y divide-gray-200' },
                            logs.map(log => 
                                React.createElement('tr', { key: log._id },
                                    React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' }, new Date(log.date).toLocaleDateString()),
                                    React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' }, log.blood_pressure_systolic),
                                    React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' }, log.blood_pressure_diastolic),
                                    React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' }, log.glucose_level),
                                    React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' }, log.heart_rate),
                                    React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                                        React.createElement('button', { 
                                            className: 'text-indigo-600 hover:text-indigo-900', 
                                            onClick: () => handleEdit(log)
                                        }, 'Edit'),
                                        React.createElement('button', { 
                                            className: 'text-red-600 hover:text-red-900 ml-4', 
                                            onClick: () => handleDelete(log._id)
                                        }, 'Delete')
                                    )
                                )
                            )
                        )
                    )
                )
            )
    );
};

export default HealthLogList;
