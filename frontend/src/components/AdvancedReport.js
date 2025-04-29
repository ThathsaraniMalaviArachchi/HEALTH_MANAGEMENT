import React, { useState, useEffect } from 'react';
import { healthLogsAPI } from '../services/api';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const AdvancedReport = ({ onClose }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await healthLogsAPI.getAdvancedReport();
        setReport(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch advanced report. Please try again later.');
        console.error('Error fetching advanced report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return <FaArrowUp className="text-red-500" />;
      case 'decreasing':
        return <FaArrowDown className="text-green-500" />;
      default:
        return <FaMinus className="text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Loading advanced health analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="my-4">{error}</p>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!report || !report.logs || report.logs.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
          <h2 className="text-2xl font-bold">Advanced Health Report</h2>
          <p className="my-4">No health logs found to analyze. Please add some health logs first.</p>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">Advanced Health Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Analysis Period</h3>
          <p className="text-gray-600">
            {report.dateRange.start} to {report.dateRange.end} (Last {report.logs.length} records)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Vital Averages</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-700">Blood Pressure (Systolic):</span>
                <span className="font-medium">{report.averages.systolic} mmHg</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Blood Pressure (Diastolic):</span>
                <span className="font-medium">{report.averages.diastolic} mmHg</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Glucose Level:</span>
                <span className="font-medium">{report.averages.glucose} mg/dL</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Heart Rate:</span>
                <span className="font-medium">{report.averages.heartRate} BPM</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Health Trends</h3>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Blood Pressure (Systolic):</span>
                <span className="flex items-center space-x-2">
                  <span className="font-medium capitalize">{report.trends.systolic}</span>
                  {getTrendIcon(report.trends.systolic)}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Blood Pressure (Diastolic):</span>
                <span className="flex items-center space-x-2">
                  <span className="font-medium capitalize">{report.trends.diastolic}</span>
                  {getTrendIcon(report.trends.diastolic)}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Glucose Level:</span>
                <span className="flex items-center space-x-2">
                  <span className="font-medium capitalize">{report.trends.glucose}</span>
                  {getTrendIcon(report.trends.glucose)}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Heart Rate:</span>
                <span className="flex items-center space-x-2">
                  <span className="font-medium capitalize">{report.trends.heartRate}</span>
                  {getTrendIcon(report.trends.heartRate)}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Health Insights</h3>
          <ul className="bg-yellow-50 p-4 rounded-lg shadow space-y-3">
            {report.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span className="text-gray-800">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Detailed Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Blood Pressure</th>
                  <th className="py-2 px-4 border-b text-left">Glucose</th>
                  <th className="py-2 px-4 border-b text-left">Heart Rate</th>
                  <th className="py-2 px-4 border-b text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {report.logs.map((log, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {log.blood_pressure_systolic}/{log.blood_pressure_diastolic} mmHg
                    </td>
                    <td className="py-2 px-4 border-b">{log.glucose_level} mg/dL</td>
                    <td className="py-2 px-4 border-b">{log.heart_rate} BPM</td>
                    <td className="py-2 px-4 border-b">{log.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedReport;