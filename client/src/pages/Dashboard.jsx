import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Flame, TrendingUp, Dumbbell, Target, ArrowRight } from 'lucide-react';


const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [data, setData] = useState({
        workouts: [], goals: [],
        stats: { totalCalories: 0, count: 0, goalProgress: 0, totalDuration: 0 },
        loading: true, error: null
    });

    useEffect(() => {
        const fetchAll = async () => {
            if (!user) return;
            try {
                const [workoutRes, goalRes] = await Promise.all([
                    api.get('/workouts'), api.get('/goals')
                ]);
                const workouts = Array.isArray(workoutRes.data) ? workoutRes.data : [];
                const goals    = Array.isArray(goalRes.data)   ? goalRes.data   : [];

                const totalCals = workouts.reduce((s, w) => s + (Number(w.caloriesBurned) || 0), 0);
                const totalDur  = workouts.reduce((s, w) => s + (Number(w.duration)       || 0), 0);
                let   avgProg   = 0;
                if (goals.length > 0) {
                    avgProg = Math.round(
                        goals.reduce((s, g) => s + Math.min((Number(g.currentValue) / Math.max(Number(g.targetValue), 1)) * 100, 100), 0)
                        / goals.length
                    );
                }
                setData({ workouts, goals, stats: { totalCalories: totalCals, count: workouts.length, goalProgress: avgProg, totalDuration: totalDur }, loading: false, error: null });
            } catch (err) {
                setData(prev => ({ ...prev, loading: false, error: 'Could not load data.' }));
            }
        };
        if (user) fetchAll();
        else if (!authLoading) setData(prev => ({ ...prev, loading: false }));
    }, [user, authLoading]);

    if (data.loading || authLoading) {
        return <div className="fit-loading"><div className="fit-spinner"></div></div>;
    }

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="fit-main">
            <div className="fit-page">
                <div className="page-header">
                    <div>
                        <p className="page-subtitle">{today}</p>
                        <h1 className="page-title">
                            {greeting()}, {user?.username || 'Athlete'} 💪
                        </h1>
                    </div>
                    <span className="page-badge">
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block' }}></span>
                        Active
                    </span>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-card-icon orange"><Flame size={20} /></div>
                        <div className="stat-value">{data.stats.totalCalories.toLocaleString()}<span className="stat-unit"> kcal</span></div>
                        <div className="stat-name">Total Calories Burned</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon orange"><Dumbbell size={20} /></div>
                        <div className="stat-value">{data.stats.count}</div>
                        <div className="stat-name">Workout Sessions</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon blue"><TrendingUp size={20} /></div>
                        <div className="stat-value">{data.stats.totalDuration}<span className="stat-unit"> min</span></div>
                        <div className="stat-name">Total Active Minutes</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon green"><Target size={20} /></div>
                        <div className="stat-value">{data.stats.goalProgress}<span className="stat-unit">%</span></div>
                        <div className="stat-name">Avg Goal Progress</div>
                        <div className="progress-bar-track" style={{ marginTop: 12 }}>
                            <div className="progress-bar-fill green" style={{ width: `${data.stats.goalProgress}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="section-header">
                    <span className="section-title">Quick Actions</span>
                </div>
                <div className="d-flex gap-3 mb-5 flex-wrap">
                    <Link to="/workouts" className="btn-primary">
                        <Dumbbell size={16} /> Log Workout
                    </Link>
                    <Link to="/nutrition" className="btn-ghost">
                        <Flame size={16} /> Track Nutrition
                    </Link>
                    <Link to="/goals" className="btn-ghost">
                        <Target size={16} /> View Goals
                    </Link>
                </div>

                {data.workouts.length > 0 && (
                    <>
                        <div className="section-header">
                            <span className="section-title">Recent Workouts</span>
                            <Link to="/workouts" className="btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }}>
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        {data.workouts.slice(0, 4).map((w, i) => (
                            <div key={i} className="fit-card">
                                <div className="fit-card-header">
                                    <span className="fit-card-title">{w.activityType}</span>
                                    <span className="fit-card-date">{new Date(w.date).toLocaleDateString()}</span>
                                </div>
                                <div className="fit-card-meta">
                                    <div className="fit-meta-item">
                                        <div className="fit-meta-value orange">{w.caloriesBurned}</div>
                                        <div className="fit-meta-label">Kcal</div>
                                    </div>
                                    <div className="fit-meta-item">
                                        <div className="fit-meta-value">{w.duration}</div>
                                        <div className="fit-meta-label">Minutes</div>
                                    </div>
                                    <div className="fit-meta-item">
                                        <span className={`intensity-badge ${w.intensity?.toLowerCase()}`}>{w.intensity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {data.workouts.length === 0 && (
                    <div className="fit-empty">
                        <div className="fit-empty-title">No workouts logged yet</div>
                        <div className="fit-empty-sub">Start your fitness journey by logging your first workout.</div>
                        <Link to="/workouts" className="btn-primary" style={{ marginTop: 20 }}>Log First Workout</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
