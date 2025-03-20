import React, { useState } from 'react';
import HealthForm from './components/HealthForm';
import HealthDataTable from './components/HealthDataTable';
import HealthData from './components/HealthData';
import HealthReport from './components/HealthReport';

function App() {
  const [showHealthData, setShowHealthData] = useState(false);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      textAlign: 'center'
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '30px'
    },
    button: {
      backgroundColor: '#2980b9',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s, transform 0.1s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    activeButton: {
      backgroundColor: '#1abc9c',
      transform: 'scale(1.05)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Health Monitoring Dashboard</h1>
      </div>
      
      <div style={styles.buttonsContainer}>
        <button 
          onClick={() => setShowHealthData(false)}
          style={{
            ...styles.button,
            ...(showHealthData ? {} : styles.activeButton)
          }}
        >
          View Health Report
        </button>
        <button 
          onClick={() => setShowHealthData(true)}
          style={{
            ...styles.button,
            ...(showHealthData ? styles.activeButton : {})
          }}
        >
          View Health Data
        </button>
      </div>
      
      {showHealthData ? <HealthData /> : <HealthReport />}
    </div>
  );
}

export default App;

