import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Login failed. Please check your credentials.');
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

                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Sign in to continue your fitness journey.</p>

                <form onSubmit={handleSubmit}>
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
                            placeholder="••••••••"
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: 28, fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">Create one free</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
