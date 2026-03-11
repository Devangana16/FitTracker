import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Target, TrendingUp, Plus, Trash2, Edit3, CheckCircle } from 'lucide-react';


const GoalsTracker = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        goalType: 'Weight Loss',
        targetValue: '',
        endDate: ''
    });

    useEffect(() => { fetchGoals(); }, []);

    const fetchGoals = async () => {
        try {
            const res = await api.get('/goals');
            setGoals(Array.isArray(res.data) ? res.data : []);
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
            await api.post('/goals/add', { ...formData, targetValue: Number(formData.targetValue) });
            setFormData({ goalType: 'Weight Loss', targetValue: '', endDate: '' });
            fetchGoals();
        } catch (err) {
            alert('Could not save goal. Please check your data.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateProgress = async (id, current) => {
        const val = prompt(`Current value: ${current}\nEnter new progress:`, current);
        if (val === null || val === '') return;
        try {
            await api.put(`/goals/${id}`, { currentValue: Number(val) });
            fetchGoals();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this goal?')) return;
        try {
            await api.delete(`/goals/${id}`);
            fetchGoals();
        } catch (err) { console.error(err); }
    };

    const goalEmoji = {
        'Weight Loss': '⚖️',
        'Muscle Gain': '💪',
        'Step Count': '👟',
        'Workout Hours': '⏱️'
    };

    if (loading) {
        return <div className="fit-loading"><div className="fit-spinner"></div></div>;
    }

    const completedGoals = goals.filter(g => (Number(g.currentValue) / Math.max(Number(g.targetValue), 1)) >= 1).length;

    return (
        <div className="fit-main">
            <div className="fit-page">
                <div className="page-header">
                    <div>
                        <p className="page-subtitle">OBJECTIVE TRACKING</p>
                        <h1 className="page-title">Goals 🎯</h1>
                    </div>
                    <span className="page-badge blue">{goals.length} Active</span>
                </div>

                <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 32 }}>
                    <div className="stat-card">
                        <div className="stat-card-icon blue"><Target size={18} /></div>
                        <div className="stat-value">{goals.length}</div>
                        <div className="stat-name">Total Goals</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon green"><CheckCircle size={18} /></div>
                        <div className="stat-value">{completedGoals}</div>
                        <div className="stat-name">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon orange"><TrendingUp size={18} /></div>
                        <div className="stat-value">
                            {goals.length > 0
                                ? Math.round(goals.reduce((s, g) => s + Math.min((Number(g.currentValue) / Math.max(Number(g.targetValue), 1)) * 100, 100), 0) / goals.length)
                                : 0}%
                        </div>
                        <div className="stat-name">Avg Progress</div>
                    </div>
                </div>

                <div className="fit-two-col">
                    <div className="form-panel" style={{ position: 'sticky', top: 24 }}>
                        <div className="form-panel-title">Set New Goal</div>
                        <form onSubmit={handleSubmit}>
                            <div className="fit-field">
                                <label className="fit-label">Goal Type</label>
                                <select name="goalType" className="fit-input fit-select" value={formData.goalType} onChange={handleChange}>
                                    <option value="Weight Loss">⚖️ Weight Loss</option>
                                    <option value="Muscle Gain">💪 Muscle Gain</option>
                                    <option value="Step Count">👟 Step Count</option>
                                    <option value="Workout Hours">⏱️ Workout Hours</option>
                                </select>
                            </div>
                            <div className="fit-field">
                                <label className="fit-label">Target Value</label>
                                <input
                                    type="number" name="targetValue" className="fit-input"
                                    placeholder="e.g. 70 (kg), 10000 (steps)"
                                    required min="1"
                                    value={formData.targetValue} onChange={handleChange}
                                />
                            </div>
                            <div className="fit-field">
                                <label className="fit-label">Target Date</label>
                                <input
                                    type="date" name="endDate" className="fit-input"
                                    required
                                    value={formData.endDate} onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                                <Plus size={16} /> {submitting ? 'Saving...' : 'Add Goal'}
                            </button>
                        </form>
                    </div>

                    <div>
                        <div className="section-header">
                            <span className="section-title">Your Goals</span>
                        </div>

                        {goals.length === 0 ? (
                            <div className="fit-empty">
                                <div className="fit-empty-title">No goals set yet</div>
                                <div className="fit-empty-sub">Set your first fitness goal and start tracking progress.</div>
                            </div>
                        ) : (
                            goals.map((g, idx) => {
                                const progress = Math.min((Number(g.currentValue) / Math.max(Number(g.targetValue), 1)) * 100, 100);
                                const isComplete = progress >= 100;
                                const daysLeft = Math.ceil((new Date(g.endDate) - new Date()) / (1000 * 60 * 60 * 24));

                                return (
                                    <div key={idx} className="fit-card">
                                        <div className="fit-card-header">
                                            <span className="fit-card-title">
                                                {goalEmoji[g.goalType] || '🎯'} {g.goalType}
                                            </span>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                {isComplete && (
                                                    <span className="page-badge green" style={{ fontSize: 11, padding: '4px 10px' }}>
                                                        ✓ Complete
                                                    </span>
                                                )}
                                                <button onClick={() => handleUpdateProgress(g._id, g.currentValue)} className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }}>
                                                    <Edit3 size={13} />
                                                </button>
                                                <button onClick={() => handleDelete(g._id)} className="btn-danger" style={{ padding: '4px 8px' }}>
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ margin: '12px 0 6px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                                                    {Number(g.currentValue).toLocaleString()} / {Number(g.targetValue).toLocaleString()}
                                                </span>
                                                <span style={{ fontSize: 16, fontWeight: 800, color: isComplete ? 'var(--green)' : 'var(--blue)' }}>
                                                    {Math.round(progress)}%
                                                </span>
                                            </div>
                                            <div className="progress-bar-track">
                                                <div
                                                    className={`progress-bar-fill ${isComplete ? 'green' : 'blue'}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="fit-card-meta">
                                            <div className="fit-meta-item">
                                                <div className="fit-meta-label">Deadline</div>
                                                <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>
                                                    {new Date(g.endDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="fit-meta-item">
                                                <div className="fit-meta-label">Days Left</div>
                                                <div style={{ fontSize: 13, color: daysLeft < 7 ? 'var(--orange)' : 'var(--text-dim)', fontWeight: 600 }}>
                                                    {daysLeft > 0 ? `${daysLeft}d` : 'Past Due'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalsTracker;
