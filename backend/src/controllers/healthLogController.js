const HealthLog = require('../models/HealthLog');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file in the root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { OpenAI } = require('openai');

// Check if API key exists and create OpenAI client
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey || openaiApiKey === 'YOUR_OPENAI_API_KEY_HERE') {
    console.error('Warning: OpenAI API key is not properly configured!');
}

const openai = new OpenAI({
    apiKey: openaiApiKey,
});

const healthLogController = {
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
    },

    generateAIReport: async (req, res) => {
        try {
            // Verify API key is available
            if (!openaiApiKey || openaiApiKey === 'YOUR_OPENAI_API_KEY_HERE') {
                return res.status(500).json({ 
                    error: 'OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.' 
                });
            }
            
            // Get all health logs for the user for a more comprehensive analysis
            const logs = await HealthLog.find({ user_id: req.userId })
                .sort({ date: -1 });
            
            if (!logs || logs.length === 0) {
                return res.status(404).json({ error: 'No health logs found' });
            }

            // Calculate averages for a better report
            const averages = {
                blood_pressure_systolic: Math.round(logs.reduce((acc, log) => acc + log.blood_pressure_systolic, 0) / logs.length),
                blood_pressure_diastolic: Math.round(logs.reduce((acc, log) => acc + log.blood_pressure_diastolic, 0) / logs.length),
                glucose_level: Math.round(logs.reduce((acc, log) => acc + log.glucose_level, 0) / logs.length),
                heart_rate: Math.round(logs.reduce((acc, log) => acc + log.heart_rate, 0) / logs.length)
            };

            // Format logs for OpenAI with proper field names from our schema
            const logsData = logs.map(log => {
                return {
                    date: new Date(log.date).toISOString().split('T')[0],
                    blood_pressure: `${log.blood_pressure_systolic}/${log.blood_pressure_diastolic}`,
                    glucose_level: log.glucose_level,
                    heart_rate: log.heart_rate
                };
            });

            // Generate report using OpenAI
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: "You are a health analytics assistant. Analyze the given health logs and provide useful insights, trends, and recommendations. Format your response with clear sections including: Summary, Trends Analysis, Health Insights, and Recommendations."
                    },
                    {
                        role: "user", 
                        content: `Please analyze these health logs and provide a comprehensive health report. Include analysis of blood pressure, glucose levels, and heart rate trends. Here are the logs: ${JSON.stringify(logsData)}. The average values are: Blood Pressure: ${averages.blood_pressure_systolic}/${averages.blood_pressure_diastolic} mmHg, Glucose Level: ${averages.glucose_level} mg/dL, Heart Rate: ${averages.heart_rate} BPM.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500
            });

            const aiReport = completion.choices[0].message.content;
            
            // Return report with additional metadata for better PDF generation
            res.json({ 
                report: aiReport,
                generatedDate: new Date().toISOString(),
                dataPoints: logs.length,
                averages: averages
            });
        } catch (error) {
            console.error('Error generating AI report:', error);
            res.status(500).json({ error: 'Failed to generate AI report: ' + error.message });
        }
    }
};

module.exports = healthLogController;
