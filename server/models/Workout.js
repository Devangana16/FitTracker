const mongoose = require('mongoose');
const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: { type: String, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number },
    intensity: { type: String, enum: ['Light', 'Moderate', 'Heavy'], default: 'Moderate' },
    date: { type: Date, default: Date.now },
    details: {
        sets: { type: Number },
        reps: { type: Number },
        weight: { type: Number }
    }
});

module.exports = mongoose.model('Workout', workoutSchema);
