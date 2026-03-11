import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { searchFood } from '../utils/foodData';
import { Utensils, Flame, Beef, Plus, Trash2 } from 'lucide-react';


const NutritionTracker = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestRef = useRef(null);

    const [formData, setFormData] = useState({
        mealType: 'Breakfast',
        foodItem: '',
        calories: '',
        protein: ''
    });

    useEffect(() => {
        fetchLogs();
        const handleClick = (e) => {
            if (suggestRef.current && !suggestRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/nutrition');
            const data = Array.isArray(res.data) ? res.data : (res.data.logs || []);
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFoodInput = (e) => {
        const val = e.target.value;
        setFormData(p => ({ ...p, foodItem: val }));
        if (val.length >= 2) {
            const res = searchFood(val);
            setSuggestions(res);
            setShowSuggestions(res.length > 0);
        } else {
            setSuggestions([]); setShowSuggestions(false);
        }
    };

    const handleSelectFood = (food) => {
        setFormData(p => ({ ...p, foodItem: food.name, calories: food.calories, protein: food.protein }));
        setShowSuggestions(false);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/nutrition/add', {
                ...formData,
                calories: Number(formData.calories),
                protein: Number(formData.protein)
            });
            setFormData({ mealType: 'Breakfast', foodItem: '', calories: '', protein: '' });
            fetchLogs();
        } catch (err) {
            alert('Could not save. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this entry?')) return;
        try {
            await api.delete(`/nutrition/${id}`);
            fetchLogs();
        } catch (err) { console.error(err); }
    };

    const mealEmoji = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙', Snack: '🍎' };

    if (loading) {
        return <div className="fit-loading"><div className="fit-spinner"></div></div>;
    }

    const totalCals    = logs.reduce((s, l) => s + (Number(l.calories) || 0), 0);
    const totalProtein = logs.reduce((s, l) => s + (Number(l.protein)  || 0), 0);

    return (
        <div className="fit-main">
            <div className="fit-page">
                <div className="page-header">
                    <div>
                        <p className="page-subtitle">NUTRITIONAL TRACKING</p>
                        <h1 className="page-title">Nutrition 🥗</h1>
                    </div>
                    <span className="page-badge green">{logs.length} Entries</span>
                </div>

                <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 32 }}>
                    <div className="stat-card">
                        <div className="stat-card-icon orange"><Flame size={18} /></div>
                        <div className="stat-value">{totalCals.toLocaleString()}</div>
                        <div className="stat-name">Calories Today</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon green"><Beef size={18} /></div>
                        <div className="stat-value">{totalProtein}<span className="stat-unit">g</span></div>
                        <div className="stat-name">Protein Intake</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon blue"><Utensils size={18} /></div>
                        <div className="stat-value">{logs.length}</div>
                        <div className="stat-name">Meals Logged</div>
                    </div>
                </div>

                <div className="fit-two-col">
                    <div className="form-panel" style={{ position: 'sticky', top: 24 }}>
                        <div className="form-panel-title">Log Meal</div>
                        <form onSubmit={handleSubmit}>
                            <div className="fit-field">
                                <label className="fit-label">Meal Type</label>
                                <select name="mealType" className="fit-input fit-select" value={formData.mealType} onChange={handleChange}>
                                    <option value="Breakfast">🌅 Breakfast</option>
                                    <option value="Lunch">☀️ Lunch</option>
                                    <option value="Dinner">🌙 Dinner</option>
                                    <option value="Snack">🍎 Snack</option>
                                </select>
                            </div>

                            <div className="fit-field" style={{ position: 'relative' }} ref={suggestRef}>
                                <label className="fit-label">Food Item</label>
                                <input
                                    type="text"
                                    name="foodItem"
                                    className="fit-input"
                                    placeholder="Search or type food..."
                                    required
                                    value={formData.foodItem}
                                    onChange={handleFoodInput}
                                    autoComplete="off"
                                />
                                {showSuggestions && (
                                    <div className="suggest-box">
                                        {suggestions.map((food, idx) => (
                                            <div key={idx} className="suggest-item" onMouseDown={() => handleSelectFood(food)}>
                                                <div className="suggest-name">{food.name}</div>
                                                <div className="suggest-meta">{food.calories} kcal · {food.protein}g protein</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="fit-field">
                                    <label className="fit-label">Calories (kcal)</label>
                                    <input
                                        type="number" name="calories" className="fit-input"
                                        placeholder="0" required min="0"
                                        value={formData.calories} onChange={handleChange}
                                    />
                                </div>
                                <div className="fit-field">
                                    <label className="fit-label">Protein (g)</label>
                                    <input
                                        type="number" name="protein" className="fit-input"
                                        placeholder="0" required min="0"
                                        value={formData.protein} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                                <Plus size={16} /> {submitting ? 'Saving...' : 'Log Meal'}
                            </button>
                        </form>
                    </div>

                    <div>
                        <div className="section-header">
                            <span className="section-title">Meal History</span>
                        </div>

                        {logs.length === 0 ? (
                            <div className="fit-empty">
                                <div className="fit-empty-title">No meals logged yet</div>
                                <div className="fit-empty-sub">Track what you eat to hit your nutrition goals.</div>
                            </div>
                        ) : (
                            logs.map((L, idx) => (
                                <div key={idx} className="fit-card">
                                    <div className="fit-card-header">
                                        <span className="fit-card-title">
                                            {mealEmoji[L.mealType] || '🍽️'} {L.foodItem}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span className="fit-card-date">{new Date(L.date).toLocaleDateString()}</span>
                                            <button onClick={() => handleDelete(L._id)} className="btn-danger" style={{ padding: '4px 8px' }}>
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <span className="page-badge green" style={{ fontSize: 11 }}>{L.mealType}</span>
                                    </div>
                                    <div className="fit-card-meta">
                                        <div className="fit-meta-item">
                                            <div className="fit-meta-value orange">{L.calories}</div>
                                            <div className="fit-meta-label">Calories</div>
                                        </div>
                                        <div className="fit-meta-item">
                                            <div className="fit-meta-value green">{L.protein}g</div>
                                            <div className="fit-meta-label">Protein</div>
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

export default NutritionTracker;
