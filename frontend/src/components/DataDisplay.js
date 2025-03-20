// src/components/DataDisplay.js
import React from 'react';

const DataDisplay = ({ data = [] }) => {
  return (
    <div>
      <h2>Health Data</h2>
      <table border="1" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blood Pressure</th>
            <th>Blood Sugar</th>
            <th>Heart Rate</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((person, index) => (
              <tr key={index}>
                <td>{person.name}</td>
                <td>{person.bloodPressure}</td>
                <td>{person.sugarLevel}</td>
                <td>{person.heartRate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataDisplay;
