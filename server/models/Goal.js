const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalType: { type: String, enum: ['Weight Loss', 'Muscle Gain', 'Step Count', 'Workout Hours'], required: true },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ['In Progress', 'Completed', 'Failed'], default: 'In Progress' }
});

module.exports = mongoose.model('Goal', goalSchema);
