import React, { useState } from 'react';

const HealthForm = () => {
  const [name, setName] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [sugarLevel, setSugarLevel] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const healthData = { name, bloodPressure, sugarLevel, heartRate };
      
      const response = await fetch('http://localhost:5000/api/health-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(healthData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit data');
      }
      
      const data = await response.json();
      alert('Health data sent successfully!');
      
      // Reset form
      setName('');
      setBloodPressure('');
      setSugarLevel('');
      setHeartRate('');
    } catch (err) {
      setError(err.message || 'Failed to send health data');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Submit Health Data</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Blood Pressure" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} />
        <input type="text" placeholder="Sugar Level" value={sugarLevel} onChange={(e) => setSugarLevel(e.target.value)} />
        <input type="text" placeholder="Heart Rate" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
        <button type="submit" disabled={isSubmitting}>Submit Data</button>
      </form>
    </div>
  );
};

export default HealthForm;
