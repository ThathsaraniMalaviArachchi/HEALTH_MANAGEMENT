import React, { useEffect, useState } from 'react';

function HealthDataTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/reports')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data); // Log the fetched data
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Log any errors
      });
  }, []);

  return (
    <div>
      <h2>Health Data Table</h2>
      <p>Below is the health data fetched from the database:</p> {/* Added text */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Blood Pressure</th>
            <th>Sugar Level</th>
            <th>Heart Rate</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(item => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.bloodPressure}</td>
                <td>{item.sugarLevel}</td>
                <td>{item.heartRate}</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HealthDataTable;

