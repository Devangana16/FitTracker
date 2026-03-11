const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const authMiddleware = require('../middleware/auth');

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { goalType, targetValue, endDate } = req.body;

        const newGoal = new Goal({
            user: req.user.id,
            goalType,
            targetValue,
            endDate
        });

        const goal = await newGoal.save();
        res.json(goal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { currentValue, status } = req.body;
        let goal = await Goal.findById(req.params.id);

        if (!goal) return res.status(404).json({ msg: 'Goal not found! ❌' });
        if (goal.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized! ❌' });
        if (currentValue !== undefined) goal.currentValue = currentValue;
        if (status) goal.status = status;
        await goal.save();
        res.json(goal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});
router.get('/', authMiddleware, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).sort({ startDate: -1 });
        res.json(goals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ msg: 'Goal not found! ❌' });

        if (goal.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized! ❌' });

        await Goal.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Goal deleted! ✅' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});

module.exports = router;

