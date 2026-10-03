import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AnimatedBackground from './components/AnimatedBackground';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Analytics from './pages/Analytics';
import ModelPerformance from './pages/ModelPerformance';
import StudentHistory from './pages/StudentHistory';
import About from './pages/About';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Animated Canvas Particle & Neural Background */}
      <AnimatedBackground />

      {/* Top Navigation Bar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />

      {/* Main App Body */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isLanding={isLandingPage}
        />

        {/* Dynamic Route Content */}
        <main className={`flex-1 transition-all duration-300 w-full ${isLandingPage ? '' : 'lg:pl-64'}`}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/models" element={<ModelPerformance />} />
            <Route path="/history" element={<StudentHistory />} />
            <Route path="/about" element={<About />} />
            {/* Fallback to Dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>

      {/* Global Footer */}
      <footer className={`border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 text-center text-xs text-slate-500 ${isLandingPage ? '' : 'lg:pl-64'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 STUDY PULSE • AI-Based Academic Procrastination Pattern Detection System</span>
          <span className="font-mono text-[11px] text-cyan-400/80">Supervised 5-Fold ML Engine v1.0</span>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
