import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutTracker from './pages/WorkoutTracker';
import NutritionTracker from './pages/NutritionTracker';
import GoalsTracker from './pages/GoalsTracker';
import ProtectedRoute from './components/ProtectedRoute';

const AppShell = ({ children }) => {
  const location = useLocation();
  const noSidebarRoutes = ['/', '/login', '/register'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  if (!showSidebar) return <>{children}</>;

  return (
    <div className="fit-layout">
      <Navbar />
      <div className="fit-content-wrapper">
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell>
          <Routes>
            <Route path="/"          element={<Landing />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/workouts"  element={<ProtectedRoute><WorkoutTracker /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><NutritionTracker /></ProtectedRoute>} />
            <Route path="/goals"     element={<ProtectedRoute><GoalsTracker /></ProtectedRoute>} />
          </Routes>
        </AppShell>
      </AuthProvider>
    </Router>
  );
}

export default App;

