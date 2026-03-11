import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Zap, TrendingUp, ChevronRight, CheckCircle2, Trophy, Dumbbell, Flame, Target } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    return (
        <div className="fit-landing">
            <header className="landing-header">
                <div className="container header-container">
                    <Link to="/" className="landing-logo">
                        <Activity className="logo-icon" size={28} />
                        <span className="logo-text">FitTracker</span>
                    </Link>
                </div>
            </header>

            <section className="fit-hero">
                <div className="container">
                    <div className="fit-hero-content">
                        <div className="hero-tag">Elevate Your Performance</div>
                        <h1 className="hero-title">
                            TRAIN <span className="highlight">SMARTER</span><br />
                            TRACK <span className="highlight-green">BETTER</span>
                        </h1>
                        <p className="hero-description">
                            The ultimate all-in-one ecosystem for your nutrition, workouts, and fitness progression. 
                            Built for athletes who demand precision in their data.
                        </p>
                        <div className="hero-btns">
                            <Link to="/register" className="btn-primary">
                                Join The Movement <ChevronRight size={18} />
                            </Link>
                            <Link to="/login" className="btn-ghost">
                                Athlete Login
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="hero-blob blob-orange"></div>
                <div className="hero-blob blob-green"></div>
            </section>

            <section className="fit-features">
                <div className="container">
                    <div className="grid-features">
                        <div className="feature-card">
                            <div className="feature-icon orange">
                                <Dumbbell size={24} />
                            </div>
                            <h3>Dynamic Workouts</h3>
                            <p>Log every session with precision. Track intensity, duration, and calories burned with intuitive analytics.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon green">
                                <Flame size={24} />
                            </div>
                            <h3>Smart Nutrition</h3>
                            <p>Fueled by a massive data library. Search and log meals instantly to maintain your optimal energy levels.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon blue">
                                <Target size={24} />
                            </div>
                            <h3>Goal Directives</h3>
                            <p>Establish clear objectives. Visualize your journey toward peak performance with real-time progress tracking.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="fit-cta-section">
                <div className="container">
                    <div className="cta-content">
                        <div className="cta-icon-box">
                            <Trophy size={48} color="var(--orange)" />
                        </div>
                        <h2>READY TO REACH YOUR PEAK?</h2>
                        <p>Thousands of athletes use FitTracker to dominate their goals. Join them today.</p>
                        <Link to="/register" className="btn-primary large">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
