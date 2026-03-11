import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutGrid, Activity, Utensils, Target, LogOut, User } from 'lucide-react';


const Navbar = () => {
    const { token, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => { logout(); navigate('/'); };
    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/dashboard',  icon: <LayoutGrid size={20} />, label: 'Overview' },
        { path: '/workouts',   icon: <Activity size={20} />,   label: 'Workouts' },
        { path: '/nutrition',  icon: <Utensils size={20} />,   label: 'Nutrition' },
        { path: '/goals',      icon: <Target size={20} />,     label: 'Goals' },
    ];

    return (
        <aside className="fit-sidebar">
            <Link to="/" className="fit-sidebar-logo" title="Fitness Tracker">FT</Link>

            <nav className="fit-nav">
                {token && navLinks.map(({ path, icon, label }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`fit-nav-item ${isActive(path) ? 'active' : ''}`}
                    >
                        {icon}
                        <span className="tooltip">{label}</span>
                    </Link>
                ))}
            </nav>

            <div className="fit-sidebar-bottom">
                {token ? (
                    <>
                        <div className="fit-user-btn" title={user?.username || 'Profile'}>
                            <User size={18} />
                        </div>
                        <button onClick={handleLogout} className="fit-logout-btn" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="fit-nav-item" title="Login">
                        <User size={20} />
                        <span className="tooltip">Login</span>
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Navbar;
