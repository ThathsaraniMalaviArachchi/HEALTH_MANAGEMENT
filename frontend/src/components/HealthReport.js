import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const HealthReport = () => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiReport, setAiReport] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Add these new states for user selection
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Debug state to track data flow
  const [debug, setDebug] = useState({
    dataLoaded: false,
    usersFound: [],
    currentSelection: '',
    filterCount: 0
  });

  // Define normal ranges for health metrics
  const normalRanges = {
    bloodPressure: {
      systolic: { min: 90, max: 120 },
      diastolic: { min: 60, max: 80 }
    },
    sugarLevel: { min: 70, max: 99 },
    heartRate: { min: 60, max: 100 }
  };

  // Helper function to check if a value is outside normal range
  const isOutsideNormalRange = (value, type) => {
    if (type === 'bloodPressure') {
      const parts = value.split('/');
      if (parts.length !== 2) return false;
      
      const systolic = parseInt(parts[0], 10);
      const diastolic = parseInt(parts[1], 10);
      
      return (
        systolic < normalRanges.bloodPressure.systolic.min || 
        systolic > normalRanges.bloodPressure.systolic.max ||
        diastolic < normalRanges.bloodPressure.diastolic.min || 
        diastolic > normalRanges.bloodPressure.diastolic.max
      );
    } else if (type === 'sugarLevel') {
      const numValue = parseInt(value, 10);
      return (
        numValue < normalRanges.sugarLevel.min || 
        numValue > normalRanges.sugarLevel.max
      );
    } else if (type === 'heartRate') {
      const numValue = parseInt(value, 10);
      return (
        numValue < normalRanges.heartRate.min || 
        numValue > normalRanges.heartRate.max
      );
    }
    return false;
  };

  useEffect(() => {
    console.log("Fetching health data...");
    fetch('http://localhost:5000/api/reports')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch health data');
        }
        return response.json();
      })
      .then(data => {
        console.log("Data received:", data);
        setHealthData(data);
        
        // Extract unique users from the data
        const uniqueUsers = [...new Set(data.map(item => item.name))];
        console.log("Unique users found:", uniqueUsers);
        setUsers(uniqueUsers);
        setDebug(prev => ({...prev, usersFound: uniqueUsers, dataLoaded: true}));
        
        // Set the first user as default if available
        if (uniqueUsers.length > 0) {
          console.log("Setting default user:", uniqueUsers[0]);
          setSelectedUser(uniqueUsers[0]);
          setDebug(prev => ({...prev, currentSelection: uniqueUsers[0]}));
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter data when selected user changes
  useEffect(() => {
    console.log("Selected user changed to:", selectedUser);
    setDebug(prev => ({...prev, currentSelection: selectedUser}));
    
    if (selectedUser && healthData.length > 0) {
      const userRecords = healthData.filter(item => item.name === selectedUser);
      console.log("Filtered records for", selectedUser, ":", userRecords.length);
      setFilteredData(userRecords);
      setDebug(prev => ({...prev, filterCount: userRecords.length}));
      
      // Generate AI report for the selected user if data exists
      if (userRecords.length > 0) {
        generateAIReport(userRecords);
      }
    }
  }, [selectedUser, healthData]);

  // Handle user selection change manually
  const handleUserChange = (e) => {
    const newUser = e.target.value;
    console.log("User selection changed to:", newUser);
    setSelectedUser(newUser);
  };

  // Calculate averages (keep this as a fallback and for data display)
  const calculateAverages = (data) => {
    if (!data || data.length === 0) return { bp: 'N/A', sugar: 'N/A', heartRate: 'N/A' };
    
    let totalBP = 0;
    let totalSugar = 0;
    let totalHeartRate = 0;
    let countBP = 0;
    let countSugar = 0;
    let countHeartRate = 0;
    
    data.forEach(item => {
      if (item.bloodPressure) {
        const bpValue = parseInt(item.bloodPressure.split('/')[0], 10);
        if (!isNaN(bpValue)) {
          totalBP += bpValue;
          countBP++;
        }
      }
      
      if (item.sugarLevel) {
        const sugarValue = parseInt(item.sugarLevel, 10);
        if (!isNaN(sugarValue)) {
          totalSugar += sugarValue;
          countSugar++;
        }
      }
      
      if (item.heartRate) {
        const heartRateValue = parseInt(item.heartRate, 10);
        if (!isNaN(heartRateValue)) {
          totalHeartRate += heartRateValue;
          countHeartRate++;
        }
      }
    });
    
    return {
      bp: countBP > 0 ? (totalBP / countBP).toFixed(0) : 'N/A',
      sugar: countSugar > 0 ? (totalSugar / countSugar).toFixed(0) : 'N/A',
      heartRate: countHeartRate > 0 ? (totalHeartRate / countHeartRate).toFixed(0) : 'N/A'
    };
  };

  // Generate AI report using OpenAI (simulate for now)
  const generateAIReport = async (data) => {
    if (!data || data.length === 0) return;
    
    setAiLoading(true);
    setAiReport(''); // Clear previous report
    
    try {
      const latestRecord = data[data.length - 1];
      const averages = calculateAverages(data);
      
      const report = `
# Health Report for ${latestRecord.name}

## Summary
This report analyzes the health metrics for ${latestRecord.name} based on ${data.length} recorded entries.

## Latest Measurements
- **Blood Pressure**: ${latestRecord.bloodPressure} ${isOutsideNormalRange(latestRecord.bloodPressure, 'bloodPressure') ? '(Outside normal range)' : '(Normal)'}
- **Blood Sugar**: ${latestRecord.sugarLevel} ${isOutsideNormalRange(latestRecord.sugarLevel, 'sugarLevel') ? '(Outside normal range)' : '(Normal)'}
- **Heart Rate**: ${latestRecord.heartRate} ${isOutsideNormalRange(latestRecord.heartRate, 'heartRate') ? '(Outside normal range)' : '(Normal)'}
- **Date Recorded**: ${new Date(latestRecord.timestamp).toLocaleString()}

## Normal Ranges
- **Blood Pressure**: ${normalRanges.bloodPressure.systolic.min}-${normalRanges.bloodPressure.systolic.max}/${normalRanges.bloodPressure.diastolic.min}-${normalRanges.bloodPressure.diastolic.max} mmHg
- **Blood Sugar**: ${normalRanges.sugarLevel.min}-${normalRanges.sugarLevel.max} mg/dL
- **Heart Rate**: ${normalRanges.heartRate.min}-${normalRanges.heartRate.max} bpm

## Historical Trends
The patient has maintained an average systolic blood pressure of ${averages.bp} mmHg, average blood sugar of ${averages.sugar} mg/dL, and an average heart rate of ${averages.heartRate} bpm.

## Assessment
${parseInt(averages.bp) > normalRanges.bloodPressure.systolic.max
  ? 'The blood pressure readings are elevated and warrant monitoring.'
  : parseInt(averages.bp) < normalRanges.bloodPressure.systolic.min
    ? 'The blood pressure readings are lower than normal and warrant monitoring.'
    : 'The blood pressure readings are within normal range.'}
${parseInt(averages.sugar) > normalRanges.sugarLevel.max
  ? 'The blood sugar levels are elevated. Consider dietary adjustments.'
  : parseInt(averages.sugar) < normalRanges.sugarLevel.min
    ? 'The blood sugar levels are lower than normal. Consider dietary adjustments.'
    : 'The blood sugar levels are within acceptable range.'}
${parseInt(averages.heartRate) > normalRanges.heartRate.max
  ? 'The heart rate is elevated. Consider stress reduction techniques.'
  : parseInt(averages.heartRate) < normalRanges.heartRate.min
    ? 'The heart rate is lower than normal. Consider consulting a healthcare provider.'
    : 'The heart rate is within normal parameters.'}

## Recommendations
1. Continue regular monitoring of vital signs
2. Maintain a balanced diet low in sodium and refined sugars
3. Exercise for at least 30 minutes daily
4. Stay well-hydrated throughout the day
5. Consider scheduling a follow-up with a healthcare provider

## Disclaimer
This report is generated based on limited data and should not replace professional medical advice.
    `;
      
      setAiReport(report);
      setAiLoading(false);
    } catch (err) {
      console.error('Error generating AI report:', err);
      setError(prev => prev || 'Failed to generate AI report. Using standard report instead.');
      setAiLoading(false);
    }
  };
  
  // Add a downloadPDF function
  const downloadPDF = () => {
    const reportElement = document.querySelector('.ai-report');
    if (!reportElement) {
      console.error("Report content not found");
      return;
    }
    const doc = new jsPDF();
    doc.html(reportElement, {
      callback: function(pdfDoc) {
        pdfDoc.save(`${selectedUser || "HealthReport"}.pdf`);
      },
      x: 15,
      y: 15
    });
  };

  if (loading) return <div>Loading health report...</div>;
  if (error && !healthData.length) return <div style={{ color: 'red' }}>Error: {error}</div>;

  const averages = calculateAverages(filteredData);
  const latestRecord = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f7f9fc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>Personalized Health Report</h2>
      
      {/* Debug info - Remove in production */}
      <div style={{ backgroundColor: '#ffe6e6', padding: '10px', marginBottom: '10px', fontSize: '12px', display: 'none' }}>
        <p>Debug: Data loaded: {debug.dataLoaded ? 'Yes' : 'No'}</p>
        <p>Users found: {debug.usersFound.join(', ')}</p>
        <p>Current selection: {debug.currentSelection}</p>
        <p>Filtered records: {debug.filterCount}</p>
      </div>
      
      {/* User selection dropdown */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="user-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Select User:
        </label>
        <select 
          id="user-select"
          value={selectedUser}
          onChange={handleUserChange}
          style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        >
          {users.length > 0 ? (
            users.map((user, index) => (
              <option key={index} value={user}>{user}</option>
            ))
          ) : (
            <option value="">No users available</option>
          )}
        </select>
      </div>

      {/* Normal ranges information */}
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e8f4fc', borderRadius: '5px' }}>
        <h3 style={{ color: '#2c3e50', marginTop: '0' }}>Normal Ranges</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Blood Pressure:</td>
              <td style={{ padding: '8px' }}>
                {normalRanges.bloodPressure.systolic.min}-{normalRanges.bloodPressure.systolic.max}/{normalRanges.bloodPressure.diastolic.min}-{normalRanges.bloodPressure.diastolic.max} mmHg
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Blood Sugar:</td>
              <td style={{ padding: '8px' }}>{normalRanges.sugarLevel.min}-{normalRanges.sugarLevel.max} mg/dL</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Heart Rate:</td>
              <td style={{ padding: '8px' }}>{normalRanges.heartRate.min}-{normalRanges.heartRate.max} bpm</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Loading indicator for AI report */}
      {aiLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Generating your AI health report...</p>
          <div className="loader" style={{ 
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 2s linear infinite',
            margin: '20px auto'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      
      {/* AI Report Display */}
      {aiReport ? (
        <div className="ai-report" style={{ marginTop: '20px' }}>
          <div dangerouslySetInnerHTML={{ 
            __html: aiReport.split('\n').map(line => {
              // Convert markdown headings to HTML
              if (line.startsWith('# ')) {
                return `<h2 style="color: #2c3e50; margin-top: 20px;">${line.substring(2)}</h2>`;
              } else if (line.startsWith('## ')) {
                return `<h3 style="color: #2c3e50; margin-top: 15px;">${line.substring(3)}</h3>`;
              } else if (line.startsWith('### ')) {
                return `<h4 style="color: #2c3e50; margin-top: 10px;">${line.substring(4)}</h4>`;
              } else if (line.startsWith('- ')) {
                const content = line.substring(2);
                // Highlight abnormal values in red
                if (content.includes('Outside normal range')) {
                  return `<li style="margin-bottom: 5px; color: red;">${content}</li>`;
                }
                return `<li style="margin-bottom: 5px;">${content}</li>`;
              } else if (line === '') {
                return '<br/>';
              } else {
                // Highlight abnormal assessment in red
                if (line.includes('elevated') || line.includes('higher than normal') || line.includes('lower than normal')) {
                  return `<p style="margin-bottom: 10px; color: red;">${line}</p>`;
                }
                return `<p style="margin-bottom: 10px;">${line}</p>`;
              }
            }).join('')
          }} />
        </div>
      ) : (
        <>
          {/* Fallback report sections if no AI report is available */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#2c3e50' }}>Overview</h3>
            <p>This report summarizes health data entries for {selectedUser} and provides a basic assessment of vital signs.</p>
          </div>

          {latestRecord && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: '#2c3e50' }}>Latest Recorded Values</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ backgroundColor: '#ecf0f1' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Name:</td>
                    <td style={{ padding: '8px' }}>{latestRecord.name}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Blood Pressure:</td>
                    <td style={{ 
                      padding: '8px', 
                      color: isOutsideNormalRange(latestRecord.bloodPressure, 'bloodPressure') ? 'red' : 'inherit'
                    }}>
                      {latestRecord.bloodPressure} 
                      {isOutsideNormalRange(latestRecord.bloodPressure, 'bloodPressure') && 
                        <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>(Outside normal range)</span>}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#ecf0f1' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Blood Sugar:</td>
                    <td style={{ 
                      padding: '8px', 
                      color: isOutsideNormalRange(latestRecord.sugarLevel, 'sugarLevel') ? 'red' : 'inherit'
                    }}>
                      {latestRecord.sugarLevel} mg/dL
                      {isOutsideNormalRange(latestRecord.sugarLevel, 'sugarLevel') && 
                        <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>(Outside normal range)</span>}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Heart Rate:</td>
                    <td style={{ 
                      padding: '8px', 
                      color: isOutsideNormalRange(latestRecord.heartRate, 'heartRate') ? 'red' : 'inherit'
                    }}>
                      {latestRecord.heartRate} bpm
                      {isOutsideNormalRange(latestRecord.heartRate, 'heartRate') && 
                        <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>(Outside normal range)</span>}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#ecf0f1' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Date:</td>
                    <td style={{ padding: '8px' }}>{new Date(latestRecord.timestamp).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#2c3e50' }}>Historical Averages</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ backgroundColor: '#ecf0f1' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>Average Systolic Blood Pressure:</td>
                  <td style={{ 
                    padding: '8px',
                    color: averages.bp !== 'N/A' && (parseInt(averages.bp) < normalRanges.bloodPressure.systolic.min || 
                           parseInt(averages.bp) > normalRanges.bloodPressure.systolic.max) ? 'red' : 'inherit'
                  }}>
                    {averages.bp} mmHg
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>Average Blood Sugar:</td>
                  <td style={{ 
                    padding: '8px',
                    color: averages.sugar !== 'N/A' && (parseInt(averages.sugar) < normalRanges.sugarLevel.min || 
                           parseInt(averages.sugar) > normalRanges.sugarLevel.max) ? 'red' : 'inherit'
                  }}>
                    {averages.sugar} mg/dL
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#ecf0f1' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>Average Heart Rate:</td>
                  <td style={{ 
                    padding: '8px',
                    color: averages.heartRate !== 'N/A' && (parseInt(averages.heartRate) < normalRanges.heartRate.min || 
                           parseInt(averages.heartRate) > normalRanges.heartRate.max) ? 'red' : 'inherit'
                  }}>
                    {averages.heartRate} bpm
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Available data records */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#2c3e50' }}>Available Records</h3>
        <p>Number of records for {selectedUser}: {filteredData.length}</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
              <th style={{ padding: '8px' }}>Date</th>
              <th style={{ padding: '8px' }}>BP</th>
              <th style={{ padding: '8px' }}>Sugar</th>
              <th style={{ padding: '8px' }}>Heart Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ecf0f1' : 'white' }}>
                <td style={{ padding: '8px' }}>{new Date(record.timestamp).toLocaleDateString()}</td>
                <td style={{ 
                  padding: '8px',
                  color: isOutsideNormalRange(record.bloodPressure, 'bloodPressure') ? 'red' : 'inherit'
                }}>
                  {record.bloodPressure}
                </td>
                <td style={{ 
                  padding: '8px',
                  color: isOutsideNormalRange(record.sugarLevel, 'sugarLevel') ? 'red' : 'inherit'
                }}>
                  {record.sugarLevel}
                </td>
                <td style={{ 
                  padding: '8px',
                  color: isOutsideNormalRange(record.heartRate, 'heartRate') ? 'red' : 'inherit'
                }}>
                  {record.heartRate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download Report Button */}
      {aiReport && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={downloadPDF}
            style={{ 
              backgroundColor: 'green', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Download Report as PDF
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '0.8em', color: '#7f8c8d', textAlign: 'center' }}>
        <p>This report is generated based on the data you've provided and should not replace professional medical advice.</p>
        <p>Report generated on: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default HealthReport;