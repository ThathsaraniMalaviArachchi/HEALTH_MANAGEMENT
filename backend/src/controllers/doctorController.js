const Doctor = require('../models/Doctor');

const doctorController = {
    // Create a new doctor (admin only)
    create: async (req, res) => {
        try {
            const { name, hospital, specialization, availableTimes } = req.body;
            
            const doctor = new Doctor({
                name,
                hospital,
                specialization,
                availableTimes,
                createdBy: req.userId
            });
            
            await doctor.save();
            res.status(201).json(doctor);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    // Get all doctors
    getAll: async (req, res) => {
        try {
            const doctors = await Doctor.find();
            res.json(doctors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Get doctor by ID
    getById: async (req, res) => {
        try {
            const doctor = await Doctor.findById(req.params.id);
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json(doctor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Update doctor (admin only)
    update: async (req, res) => {
        try {
            const { name, hospital, specialization, availableTimes } = req.body;
            
            const doctor = await Doctor.findByIdAndUpdate(
                req.params.id,
                { name, hospital, specialization, availableTimes },
                { new: true, runValidators: true }
            );
            
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            
            res.json(doctor);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    // Delete doctor (admin only)
    delete: async (req, res) => {
        try {
            const doctor = await Doctor.findByIdAndDelete(req.params.id);
            
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            
            res.json({ message: 'Doctor deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = doctorController;