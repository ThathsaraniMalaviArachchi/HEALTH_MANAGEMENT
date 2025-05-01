const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const appointmentController = {
    // Create a new appointment
    create: async (req, res) => {
        try {
            const { doctorId, date, time, reason } = req.body;
            
            // Check if doctor exists
            const doctor = await Doctor.findById(doctorId);
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            
            // Check if the time slot is available (simple validation)
            const appointmentDate = new Date(date);
            const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][appointmentDate.getDay()];
            
            // Check if doctor works on that day
            const availableDay = doctor.availableTimes.find(t => t.day === dayOfWeek);
            if (!availableDay) {
                return res.status(400).json({ error: `Doctor is not available on ${dayOfWeek}` });
            }
            
            // Create the appointment
            const appointment = new Appointment({
                doctor: doctorId,
                patient: req.userId,
                date: appointmentDate,
                time,
                reason
            });
            
            await appointment.save();
            
            res.status(201).json(appointment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    // Get all appointments for a user
    getUserAppointments: async (req, res) => {
        try {
            const appointments = await Appointment.find({ patient: req.userId })
                .populate('doctor', 'name hospital specialization')
                .sort({ date: 1 });
                
            res.json(appointments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Get all appointments (admin only)
    getAllAppointments: async (req, res) => {
        try {
            const appointments = await Appointment.find()
                .populate('doctor', 'name hospital specialization')
                .populate('patient', 'name email')
                .sort({ date: 1 });
                
            res.json(appointments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Update appointment status (admin only)
    updateStatus: async (req, res) => {
        try {
            const { status } = req.body;
            
            if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }
            
            const appointment = await Appointment.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );
            
            if (!appointment) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            
            res.json(appointment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    // Cancel appointment (user or admin)
    cancelAppointment: async (req, res) => {
        try {
            const appointment = await Appointment.findById(req.params.id);
            
            if (!appointment) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            
            // Only the patient who made the appointment or an admin can cancel it
            if (appointment.patient.toString() !== req.userId && req.userRole !== 'admin') {
                return res.status(403).json({ error: 'Not authorized to cancel this appointment' });
            }
            
            appointment.status = 'cancelled';
            await appointment.save();
            
            res.json(appointment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = appointmentController;