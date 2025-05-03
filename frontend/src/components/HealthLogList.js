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
    const [aiReport, setAIReport] = useState(null);
    const [showAIReport, setShowAIReport] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    const [searchDate, setSearchDate] = useState('');
    const [searchType, setSearchType] = useState('full'); // Add search type state

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

    const generateAIReport = async () => {
        if (logs.length === 0) {
            alert('No health logs available for AI analysis');
            return;
        }

        try {
            setLoadingAI(true);
            setError(null);
            setShowAIReport(false);
            
            const response = await healthLogsAPI.getAIReport();
            setAIReport(response);
            setShowAIReport(true);
        } catch (error) {
            console.error('Error generating AI report:', error);
            setError('Failed to generate AI report. Please try again later.');
        } finally {
            setLoadingAI(false);
        }
    };

    const shareToWhatsApp = (reportType) => {
        const text = reportType === 'regular' 
            ? `Health Report Summary:\n\nDate Range: ${report.dateRange.start} to ${report.dateRange.end}\nTotal Entries: ${report.totalEntries}\nAvg. Blood Pressure: ${report.averages.systolic}/${report.averages.diastolic} mmHg\nAvg. Glucose: ${report.averages.glucose} mg/dL\nAvg. Heart Rate: ${report.averages.heartRate} BPM`
            : `AI Health Analysis Report:\n\n${aiReport.report}`;
            
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
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

    const downloadAIReportPDF = () => {
        if (!aiReport) {
            alert('Please generate AI report first');
            return;
        }

        const doc = new jsPDF();
        const lineHeight = 10;
        let y = 20;

        // Add title
        doc.setFontSize(20);
        doc.text('AI Health Analysis Report', 20, y);
        y += lineHeight * 2;

        // Add content with regular font size
        doc.setFontSize(12);
        doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, y);
        y += lineHeight * 1.5;

        // Add AI analysis with text wrapping
        const splitText = doc.splitTextToSize(aiReport.report, 170);
        doc.text(splitText, 20, y);

        // Save the PDF
        doc.save('ai-health-analysis.pdf');
    };

    const filteredLogs = logs.filter(log => {
        if (!searchDate) return true;
        
        const logDate = new Date(log.date);
        const logDay = logDate.getDate().toString();
        const logMonth = (logDate.getMonth() + 1).toString();
        const logFullDate = logDate.toLocaleDateString();

        switch (searchType) {
            case 'day':
                return logDay === searchDate;
            case 'month':
                return logMonth === searchDate;
            case 'full':
            default:
                return logFullDate === searchDate;
        }
    });

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
                className: 'flex flex-wrap gap-3'
            },
                React.createElement('button', {
                    onClick: generateReport,
                    className: 'bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2'
                }, 
                    'Generate Report'
                ),
                React.createElement('button', {
                    onClick: generateAIReport,
                    className: 'bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2'
                }, 
                    ' AI Health Analysis'
                ),
                React.createElement('button', {
                    onClick: downloadPDF,
                    className: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2'
                }, 
                    ' Download Report'
                )
            )
        ),
        
        React.createElement('div', { 
            className: 'mb-8 p-6 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md mx-auto max-w-2xl'
        },
            React.createElement('h3', {
                className: 'text-lg font-semibold text-white mb-4 text-center'
            }, 'Search Health Logs'),
            React.createElement('div', { 
                className: 'flex flex-col sm:flex-row gap-4 items-center justify-center'
            },
                React.createElement('select', {
                    value: searchType,
                    onChange: (e) => {
                        setSearchType(e.target.value);
                        setSearchDate('');
                    },
                    className: 'px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-400 min-w-[140px] cursor-pointer outline-none'
                },
                    React.createElement('option', { value: 'full' }, 'Full Date'),
                    React.createElement('option', { value: 'day' }, 'Day Only'),
                    React.createElement('option', { value: 'month' }, 'Month Only')
                ),
                React.createElement('div', {
                    className: 'relative flex-1'
                },
                    React.createElement('input', {
                        type: searchType === 'full' ? 'text' : 'number',
                        min: searchType === 'month' ? '1' : searchType === 'day' ? '1' : null,
                        max: searchType === 'month' ? '12' : searchType === 'day' ? '31' : null,
                        placeholder: searchType === 'full' ? 'Search by date (e.g., 5/3/2025)' :
                                   searchType === 'day' ? 'Enter day (1-31)' : 
                                   'Enter month (1-12)',
                        value: searchDate,
                        onChange: (e) => setSearchDate(e.target.value),
                        className: 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 hover:border-blue-400 pl-10'
                    }),
                    React.createElement('div', {
                        className: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    },
                        React.createElement('svg', {
                            className: 'w-5 h-5',
                            fill: 'none',
                            stroke: 'currentColor',
                            viewBox: '0 0 24 24',
                            xmlns: 'http://www.w3.org/2000/svg'
                        },
                            React.createElement('path', {
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeWidth: '2',
                                d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                            })
                        )
                    )
                ),
                searchDate && React.createElement('button', {
                    onClick: () => setSearchDate(''),
                    className: 'px-4 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                }, 'Clear')
            )
        ),

        // Loading AI Report Indicator
        loadingAI && React.createElement('div', { 
            className: 'bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100 flex items-center justify-center'
        },
            React.createElement('div', { className: 'flex flex-col items-center' },
                React.createElement('div', { 
                    className: 'animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent mb-4' 
                }),
                React.createElement('p', { className: 'text-gray-600' }, 'Generating AI analysis...')
            )
        ),
        
        // Show AI Report Section
        showAIReport && aiReport && React.createElement('div', { 
            className: 'bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100 transform transition-all duration-200 hover:shadow-xl'
        },
            React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                React.createElement('h3', { className: 'text-xl font-semibold text-purple-700' }, 'AI Health Analysis Report'),
                React.createElement('div', { className: 'flex gap-2' },
                    React.createElement('button', {
                        onClick: downloadAIReportPDF,
                        className: 'text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm'
                    }, 'Download PDF'),
                    React.createElement('button', {
                        onClick: () => shareToWhatsApp('ai'),
                        className: 'text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center'
                    }, 
                        React.createElement('span', {
                            className: 'mr-1',
                            role: 'img',
                            'aria-label': 'WhatsApp'
                        }, ),
                        'Share to WhatsApp'
                    ),
                    React.createElement('button', {
                        onClick: () => setShowAIReport(false),
                        className: 'text-gray-500 hover:text-gray-700'
                    }, '✕')
                )
            ),
            React.createElement('div', { className: 'prose max-w-none' },
                React.createElement('div', { 
                    className: 'whitespace-pre-wrap text-gray-700', 
                    dangerouslySetInnerHTML: { __html: aiReport.report.replace(/\n/g, '<br />') } 
                })
            )
        ),
        
        // Show Report Section
        showReport && report && React.createElement('div', { 
            className: 'bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100 transform transition-all duration-200 hover:shadow-xl'
        },
            React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                React.createElement('h3', { className: 'text-xl font-semibold' }, 'Health Report Summary'),
                React.createElement('div', { className: 'flex gap-2' },
                    React.createElement('button', {
                        onClick: () => shareToWhatsApp('regular'),
                        className: 'text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center'
                    }, 
                        React.createElement('span', {
                            className: 'mr-1',
                            dangerouslySetInnerHTML: { __html: '&nbsp;<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967-.272-.099-.47-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.241-.579-.486-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.15.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M20.516 3.455C18.246 1.229 15.17 0 11.939 0 5.409 0 .095 5.313.094 11.845c0 2.087.547 4.126 1.589 5.928L0 24l6.36-1.663c1.737.95 3.699 1.45 5.696 1.45 6.53 0 11.844-5.313 11.845-11.845 0-3.163-1.231-6.138-3.385-8.486zM11.939 21.621c-1.771 0-3.506-.473-5.022-1.366l-.355-.215-3.735.979 1.004-3.695-.236-.377c-.98-1.551-1.499-3.35-1.499-5.202C2.094 6.641 6.455 2.28 11.939 2.28c2.644 0 5.127 1.03 6.991 2.895 1.863 1.866 2.891 4.394 2.89 7.05.001 5.398-4.36 9.76-9.881 9.76z"/></svg>&nbsp;' }
                        }),
                        'Share to WhatsApp'
                    ),
                    React.createElement('button', {
                        onClick: () => setShowReport(false),
                        className: 'text-gray-500 hover:text-gray-700 ml-2'
                    }, '✕')
                )
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

        filteredLogs.length === 0 ? 
            React.createElement('div', { 
                className: 'text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200'
            }, 
                React.createElement('p', { 
                    className: 'text-gray-500 text-lg'
                }, searchDate ? 'No health logs found for this date.' : 'No health logs found.')
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
                            filteredLogs.map(log => 
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
