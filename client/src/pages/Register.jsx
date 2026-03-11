import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Registration failed. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-screen">
            <div className="auth-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <Link to="/" className="auth-logo" style={{ marginBottom: 0 }}>FT</Link>
                    <Link to="/" className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
                        ← Back to Home
                    </Link>
                </div>

                <h2 className="auth-title">Get Started</h2>
                <p className="auth-subtitle">Create your free account and start tracking today.</p>

                <form onSubmit={handleSubmit}>
                    <div className="fit-field">
                        <label className="fit-label">Username</label>
                        <input
                            type="text"
                            className="fit-input"
                            placeholder="Your display name"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="fit-field">
                        <label className="fit-label">Email Address</label>
                        <input
                            type="email"
                            className="fit-input"
                            placeholder="you@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="fit-field">
                        <label className="fit-label">Password</label>
                        <input
                            type="password"
                            className="fit-input"
                            placeholder="Choose a strong password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ marginTop: 28, fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
