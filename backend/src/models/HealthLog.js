const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    blood_pressure_systolic: {
        type: Number,
        required: true,
        min: 1
    },
    blood_pressure_diastolic: {
        type: Number,
        required: true,
        min: 1
    },
    glucose_level: {
        type: Number,
        required: true,
        min: 1
    },
    heart_rate: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HealthLog', healthLogSchema);
