const Medication = require('../models/Medication');

const medicationController = {
    // Get all medications for a user
    getAll: async (req, res) => {
        try {
            const medications = await Medication.find({ user_id: req.userId }).sort({ createdAt: -1 });
            res.json(medications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get single medication
    getOne: async (req, res) => {
        try {
            const medication = await Medication.findOne({ 
                _id: req.params.id, 
                user_id: req.userId 
            });
            
            if (!medication) return res.status(404).json({ error: 'Medication not found' });
            
            res.json(medication);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create new medication
    create: async (req, res) => {
        try {
            const { name, dosage, frequency, start_date, end_date, notes } = req.body;
            
            const medication = new Medication({
                user_id: req.userId,
                name,
                dosage,
                frequency,
                start_date,
                end_date,
                notes
            });
            
            await medication.save();
            res.status(201).json(medication);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Update medication
    update: async (req, res) => {
        try {
            const medication = await Medication.findOneAndUpdate(
                { _id: req.params.id, user_id: req.userId },
                req.body,
                { new: true }
            );
            if (!medication) return res.status(404).json({ error: 'Medication not found' });
            res.json(medication);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete medication
    delete: async (req, res) => {
        try {
            const medication = await Medication.findOneAndDelete({ 
                _id: req.params.id, 
                user_id: req.userId 
            });
            if (!medication) return res.status(404).json({ error: 'Medication not found' });
            res.json({ message: 'Medication deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = medicationController;