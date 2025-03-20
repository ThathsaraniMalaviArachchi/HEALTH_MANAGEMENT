const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const healthLogsRoutes = require('./routes/healthLogs');
const authRoutes = require('./routes/auth');

const app = express();
connectDB();

// Updated CORS configuration
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/health-logs', healthLogsRoutes);

// Move error handler to the end
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
