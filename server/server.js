const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness-tracker')
    .then(() => console.log('Connected to MongoDB! 🎉'))
    .catch((err) => console.error('Error connecting to MongoDB: ❌', err));

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const nutritionRoutes = require('./routes/nutrition');
const goalRoutes = require('./routes/goals');

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/goals', goalRoutes);
app.get('/', (req, res) => {
    res.send('Fitness Tracker API is running... 🚀');
});
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} 🚀`);
});
