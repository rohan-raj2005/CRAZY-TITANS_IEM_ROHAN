import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BrainCircuit,
  BarChart3,
  GitCompare,
  History,
  Info,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, isLanding }) {
  if (isLanding) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Predict', path: '/predict', icon: BrainCircuit, badge: 'AI' },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, badge: null },
    { name: 'Model Performance', path: '/models', icon: GitCompare, badge: '3 ML' },
    { name: 'Student History', path: '/history', icon: History, badge: null },
    { name: 'About STUDY PULSE', path: '/about', icon: Info, badge: null }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 z-30 w-64 bg-slate-950/90 backdrop-blur-2xl border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Section title */}
          <div>
            <p className="text-[11px] font-mono tracking-wider text-slate-400 uppercase px-3 mb-2">
              Behavioral Suite
            </p>
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-bold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 transition-colors group-hover:text-cyan-400" />
                      <span>{link.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {link.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-500/20 font-bold">
                          {link.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom System Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-purple-950/40 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">5-Fold CV Verified</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Models evaluated with stratified leakage-free cross-validation.
          </p>
        </div>
      </aside>
    </>
  );
}
