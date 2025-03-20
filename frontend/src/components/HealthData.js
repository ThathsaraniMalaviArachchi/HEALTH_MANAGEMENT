import React, { useState, useEffect } from 'react';

const HealthData = () => {
  const [healthData, setHealthData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from the backend API when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/reports')
      .then((response) => response.json())
      .then((data) => {
        setHealthData(data);
      })
      .catch((err) => {
        setError('Failed to fetch data');
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h2>Health Data</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blood Pressure</th>
            <th>Sugar Level</th>
            <th>Heart Rate</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {healthData.length > 0 ? (
            healthData.map((data) => (
              <tr key={data._id}>
                <td>{data.name}</td>
                <td>{data.bloodPressure}</td>
                <td>{data.sugarLevel}</td>
                <td>{data.heartRate}</td>
                <td>{new Date(data.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HealthData;
