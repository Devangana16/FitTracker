const express = require('express');
const router = express.Router();
const Nutrition = require('../models/Nutrition');
const authMiddleware = require('../middleware/auth');

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { mealType, foodItem, calories, protein, carbs, fats } = req.body;

        const newLog = new Nutrition({
            user: req.user.id,
            mealType,
            foodItem,
            calories,
            protein,
            carbs,
            fats
        });

        const nutrition = await newLog.save();
        res.json(nutrition);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});
router.get('/', authMiddleware, async (req, res) => {
    try {
        const logs = await Nutrition.find({ user: req.user.id }).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const log = await Nutrition.findById(req.params.id);
        if (!log) return res.status(404).json({ msg: 'Log not found! ❌' });

        if (log.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized! ❌' });

        await Nutrition.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Log deleted! ✅' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error... ❌');
    }
});
module.exports = router;

