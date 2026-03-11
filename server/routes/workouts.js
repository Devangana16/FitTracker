const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const authMiddleware = require('../middleware/auth');

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { activityType, duration, caloriesBurned, intensity, sets, reps, weight } = req.body;

        const newWorkout = new Workout({
            user: req.user.id,
            activityType,
            duration,
            caloriesBurned,
            intensity,
            details: { sets, reps, weight }
        });

        const workout = await newWorkout.save();
        res.json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
        res.json(workouts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) return res.status(404).json({ msg: 'Workout not found! ❌' });
        if (workout.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized! ❌' });
        await Workout.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Workout deleted! ✅' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});
module.exports = router;
