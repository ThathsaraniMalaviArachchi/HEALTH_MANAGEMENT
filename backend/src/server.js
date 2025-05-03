const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const mongoose = require('mongoose');
const healthLogsRoutes = require('./routes/healthLogs');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const medicationRoutes = require('./routes/medications');

const app = express();

// Connect to database
const startServer = async () => {
    try {
        await connectDB();
        
        // Drop the problematic index causing duplicate key errors
        try {
            const User = mongoose.model('User');
            await User.collection.dropIndex('name_1');
            console.log('Successfully dropped name_1 index');
        } catch (indexError) {
            // If the index doesn't exist, this will error but we can ignore it
            console.log('No name_1 index to drop or already dropped');
        }

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
        app.use('/api/doctors', doctorRoutes);
        app.use('/api/appointments', appointmentRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/medications', medicationRoutes);

        // Move error handler to the end
        app.use((err, req, res, next) => {
            console.error('Error:', err);
            res.status(500).json({ error: err.message || 'Something went wrong!' });
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
