const HealthLog = require('../models/HealthLog');

const healthLogController = {
    getAdvancedReport: async (req, res) => {
        try {
            // Get the last 5 health logs
            const logs = await HealthLog.find({ user_id: req.userId })
                .sort({ date: -1 })
                .limit(5);
            
            if (!logs || logs.length === 0) {
                return res.status(404).json({ error: 'No health logs found' });
            }

            // Calculate basic statistics
            const avgSystolic = logs.reduce((sum, log) => sum + log.blood_pressure_systolic, 0) / logs.length;
            const avgDiastolic = logs.reduce((sum, log) => sum + log.blood_pressure_diastolic, 0) / logs.length;
            const avgGlucose = logs.reduce((sum, log) => sum + log.glucose_level, 0) / logs.length;
            const avgHeartRate = logs.reduce((sum, log) => sum + log.heart_rate, 0) / logs.length;
            
            // Calculate trends (increasing, decreasing, stable)
            const systolicTrend = calculateTrend(logs.map(log => log.blood_pressure_systolic));
            const diastolicTrend = calculateTrend(logs.map(log => log.blood_pressure_diastolic));
            const glucoseTrend = calculateTrend(logs.map(log => log.glucose_level));
            const heartRateTrend = calculateTrend(logs.map(log => log.heart_rate));
            
            // Generate health insights based on the data
            const insights = generateInsights(logs);

            res.json({
                logs: logs,
                averages: {
                    systolic: Math.round(avgSystolic),
                    diastolic: Math.round(avgDiastolic),
                    glucose: Math.round(avgGlucose),
                    heartRate: Math.round(avgHeartRate)
                },
                trends: {
                    systolic: systolicTrend,
                    diastolic: diastolicTrend,
                    glucose: glucoseTrend,
                    heartRate: heartRateTrend
                },
                insights: insights,
                dateRange: {
                    start: new Date(logs[logs.length - 1].date).toISOString().split('T')[0],
                    end: new Date(logs[0].date).toISOString().split('T')[0]
                }
            });
        } catch (error) {
            console.error('Error generating advanced report:', error);
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const healthLog = new HealthLog({
                ...req.body,
                user_id: req.userId
            });
            await healthLog.save();
            res.status(201).json(healthLog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const logs = await HealthLog.find({ user_id: req.userId });
            res.json(logs || []); // Ensure we always return an array
        } catch (error) {
            console.error('Error fetching logs:', error);
            res.status(500).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const log = await HealthLog.findOneAndUpdate(
                { _id: req.params.id, user_id: req.userId },
                req.body,
                { new: true }
            );
            if (!log) return res.status(404).json({ error: 'Log not found' });
            res.json(log);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const log = await HealthLog.findOneAndDelete({ 
                _id: req.params.id, 
                user_id: req.userId 
            });
            if (!log) return res.status(404).json({ error: 'Log not found' });
            res.json({ message: 'Log deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

// Helper function to calculate trend
function calculateTrend(values) {
    if (values.length < 2) return 'stable';
    
    // Reverse array to get chronological order for trend analysis
    const chronological = [...values].reverse();
    
    // Simple linear regression to determine trend
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    
    for (let i = 0; i < chronological.length; i++) {
        sumX += i;
        sumY += chronological[i];
        sumXY += i * chronological[i];
        sumX2 += i * i;
    }
    
    const n = chronological.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Determine trend based on slope
    if (slope > 0.5) return 'increasing';
    if (slope < -0.5) return 'decreasing';
    return 'stable';
}

// Helper function to generate health insights
function generateInsights(logs) {
    const insights = [];
    const latestLog = logs[0]; // Most recent log
    
    // Blood pressure insights
    if (latestLog.blood_pressure_systolic >= 140 || latestLog.blood_pressure_diastolic >= 90) {
        insights.push('Blood pressure is elevated. Consider lifestyle changes or consult with your healthcare provider.');
    } else if (latestLog.blood_pressure_systolic <= 90 || latestLog.blood_pressure_diastolic <= 60) {
        insights.push('Blood pressure is lower than optimal. Monitor for symptoms like dizziness.');
    } else {
        insights.push('Blood pressure is within normal range. Keep maintaining healthy habits.');
    }
    
    // Glucose insights
    if (latestLog.glucose_level >= 126) {
        insights.push('Fasting glucose level is elevated. Consider consulting with your healthcare provider.');
    } else if (latestLog.glucose_level >= 100) {
        insights.push('Glucose level indicates pre-diabetic range. Consider dietary adjustments.');
    } else {
        insights.push('Glucose levels are within normal range.');
    }
    
    // Heart rate insights
    if (latestLog.heart_rate >= 100) {
        insights.push('Resting heart rate is elevated. Consider stress management techniques.');
    } else if (latestLog.heart_rate < 60) {
        insights.push('Heart rate is lower than typical. This may be normal for athletes or could indicate an issue.');
    } else {
        insights.push('Heart rate is within normal range.');
    }
    
    return insights;
}

module.exports = healthLogController;
