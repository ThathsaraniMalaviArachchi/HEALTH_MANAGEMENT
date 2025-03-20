const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend requests

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/MernHealth', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected to MernHealth database'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const healthDataSchema = new mongoose.Schema({
  name: String,
  bloodPressure: String,
  sugarLevel: String,
  heartRate: String,
  timestamp: { type: Date, default: Date.now },
});

const HealthData = mongoose.model('HealthData', healthDataSchema, 'mernapp');

// Endpoint to receive health data
app.post('/api/health-data', async (req, res) => {
  try {
    const newHealthData = new HealthData(req.body);
    await newHealthData.save();
    res.json({ message: 'Health data received!', data: newHealthData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save health data' });
  }
});

// Endpoint to fetch all health reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await HealthData.find(); // Use HealthData model to fetch data
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error); // Log the error
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Test API
app.get('/api/test', (req, res) => {
  res.json({ message: 'Your MERN environment is working perfectly, my lord!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
