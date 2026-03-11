import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Dumbbell, Clock, Flame, Trash2, Plus } from 'lucide-react';


const WorkoutTracker = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        activityType: '',
        duration: '',
        caloriesBurned: '',
        intensity: 'Moderate'
    });

    useEffect(() => { fetchWorkouts(); }, []);

    const fetchWorkouts = async () => {
        try {
            const res = await api.get('/workouts');
            const data = Array.isArray(res.data) ? res.data : (res.data.logs || []);
            setWorkouts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/workouts/add', {
                ...formData,
                duration: Number(formData.duration),
                caloriesBurned: Number(formData.caloriesBurned)
            });
            setFormData({ activityType: '', duration: '', caloriesBurned: '', intensity: 'Moderate' });
            fetchWorkouts();
        } catch (err) {
            alert('Could not save workout. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this workout?')) return;
        try {
            await api.delete(`/workouts/${id}`);
            fetchWorkouts();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div className="fit-loading"><div className="fit-spinner"></div></div>;
    }

    const intensityColor = (intensity) => {
        if (!intensity) return '';
        const lower = intensity.toLowerCase();
        if (lower === 'light') return 'green';
        if (lower === 'heavy') return 'orange';
        return 'blue';
    };

    const totalCals = workouts.reduce((s, w) => s + (Number(w.caloriesBurned) || 0), 0);
    const totalMins = workouts.reduce((s, w) => s + (Number(w.duration) || 0), 0);

    return (
        <div className="fit-main">
            <div className="fit-page">
                <div className="page-header">
                    <div>
                        <p className="page-subtitle">MOVEMENT LOG</p>
                        <h1 className="page-title">Workouts 🏋️</h1>
                    </div>
                    <span className="page-badge">
                        {workouts.length} Sessions
                    </span>
                </div>

                <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 32 }}>
                    <div className="stat-card">
                        <div className="stat-card-icon orange"><Dumbbell size={18} /></div>
                        <div className="stat-value">{workouts.length}</div>
                        <div className="stat-name">Total Sessions</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon orange"><Flame size={18} /></div>
                        <div className="stat-value">{totalCals.toLocaleString()}</div>
                        <div className="stat-name">Calories Burned</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon blue"><Clock size={18} /></div>
                        <div className="stat-value">{totalMins}</div>
                        <div className="stat-name">Total Minutes</div>
                    </div>
                </div>

                <div className="fit-two-col">
                    <div className="form-panel" style={{ position: 'sticky', top: 24 }}>
                        <div className="form-panel-title">Log New Workout</div>

                        <form onSubmit={handleSubmit}>
                            <div className="fit-field">
                                <label className="fit-label">Activity Type</label>
                                <input
                                    type="text"
                                    name="activityType"
                                    className="fit-input"
                                    placeholder="e.g. Running, Cycling..."
                                    required
                                    value={formData.activityType}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="fit-field">
                                    <label className="fit-label">Duration (min)</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        className="fit-input"
                                        placeholder="30"
                                        required
                                        min="1"
                                        value={formData.duration}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="fit-field">
                                    <label className="fit-label">Calories (kcal)</label>
                                    <input
                                        type="number"
                                        name="caloriesBurned"
                                        className="fit-input"
                                        placeholder="250"
                                        required
                                        min="0"
                                        value={formData.caloriesBurned}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="fit-field">
                                <label className="fit-label">Intensity</label>
                                <select
                                    name="intensity"
                                    className="fit-input fit-select"
                                    value={formData.intensity}
                                    onChange={handleChange}
                                >
                                    <option value="Light">🟢 Light — Recovery</option>
                                    <option value="Moderate">🔵 Moderate — Steady</option>
                                    <option value="Heavy">🔥 Heavy — High Intensity</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                                <Plus size={16} />
                                {submitting ? 'Saving...' : 'Log Workout'}
                            </button>
                        </form>
                    </div>

        
                    <div>
                        <div className="section-header">
                            <span className="section-title">Session History</span>
                        </div>

                        {workouts.length === 0 ? (
                            <div className="fit-empty">
                                <div className="fit-empty-title">No workouts yet</div>
                                <div className="fit-empty-sub">Log your first workout using the form on the left.</div>
                            </div>
                        ) : (
                            workouts.map((w, idx) => (
                                <div key={idx} className="fit-card">
                                    <div className="fit-card-header">
                                        <span className="fit-card-title">{w.activityType}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span className="fit-card-date">{new Date(w.date).toLocaleDateString()}</span>
                                            <button onClick={() => handleDelete(w._id)} className="btn-danger" style={{ padding: '4px 8px' }}>
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                        <span className={`intensity-badge ${intensityColor(w.intensity)}`}>{w.intensity}</span>
                                    </div>

                                    <div className="fit-card-meta">
                                        <div className="fit-meta-item">
                                            <div className="fit-meta-value orange">{w.caloriesBurned}</div>
                                            <div className="fit-meta-label">Calories</div>
                                        </div>
                                        <div className="fit-meta-item">
                                            <div className="fit-meta-value">{w.duration}</div>
                                            <div className="fit-meta-label">Minutes</div>
                                        </div>
                                        <div className="fit-meta-item">
                                            <div className="fit-meta-value blue">
                                                {w.duration > 0 ? Math.round(w.caloriesBurned / w.duration) : 0}
                                            </div>
                                            <div className="fit-meta-label">Kcal/min</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutTracker;
