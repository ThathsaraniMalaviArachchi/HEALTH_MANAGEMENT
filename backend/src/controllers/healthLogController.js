const HealthLog = require('../models/HealthLog');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

// Load environment variables from .env file in the root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
            // Get the last 5 health logs
            const logs = await HealthLog.find({ user_id: req.userId })
                .sort({ date: -1 })
                .limit(5);
                
            if (logs.length === 0) {
                return res.status(400).json({ error: 'No health logs found for analysis' });
            }

            // Format the logs for the OpenAI API
            const formattedLogs = logs.map(log => ({
                date: new Date(log.date).toLocaleDateString(),
                blood_pressure: `${log.blood_pressure_systolic}/${log.blood_pressure_diastolic}`,
                glucose_level: log.glucose_level,
                heart_rate: log.heart_rate,
                notes: log.notes || 'No notes provided'
            }));

            // Prepare the message for OpenAI
            const prompt = {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a health analytics assistant. Analyze the health logs and provide insights, trends, and recommendations. Focus on blood pressure, glucose levels, and heart rate patterns."
                    },
                    {
                        role: "user",
                        content: `Please analyze these health logs and provide a detailed report with insights, trends, and health recommendations: ${JSON.stringify(formattedLogs)}`
                    }
                ]
            };
            
            // Send request to OpenAI API
            const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', prompt, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Return the AI-generated report
            res.json({ 
                report: openaiResponse.data.choices[0].message.content,
                logs: formattedLogs
            });
            
        } catch (error) {
            console.error('Error generating AI report:', error.response?.data || error.message);
            res.status(500).json({ 
                error: 'Failed to generate AI report', 
                details: error.message
            });
        }
    }
};

module.exports = healthLogController;
