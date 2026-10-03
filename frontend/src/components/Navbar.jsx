import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Zap, Menu, X, Sparkles, Brain } from 'lucide-react';
import { getHealth } from '../services/api';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const [apiOnline, setApiOnline] = useState(false);
  const location = useLocation();

  useEffect(() => {
    getHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Predict', path: '/predict' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Models', path: '/models' },
    { name: 'History', path: '/history' },
    { name: 'About', path: '/about' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <Activity className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  STUDY PULSE
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold">
                  AI v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
                Academic Behavior Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Status Pill & Action Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                apiOnline ? 'bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
              {apiOnline ? 'ML Engine Online' : 'Connecting...'}
            </span>
          </div>

          <Link
            to="/predict"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Analyze Student
          </Link>
        </div>
      </div>
    </header>
  );
}
