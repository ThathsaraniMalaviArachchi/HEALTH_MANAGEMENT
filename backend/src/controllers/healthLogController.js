const HealthLog = require('../models/HealthLog');

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
    }
};

module.exports = healthLogController;
