import React from 'react';
import { Search, Bell, Waves, ShieldCheck } from 'lucide-react';

interface TopNavigationProps {
  activeTab: string;
  onNavigate: (tabId: string) => void;
  onOpenCommandPalette: () => void;
  unreadAlertsCount?: number;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  onNavigate,
  onOpenCommandPalette,
  unreadAlertsCount = 3
}) => {
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'live-map', label: 'Live Map' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'learning-lab', label: 'Learning Lab' },
    { id: 'community', label: 'Community' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#030712]/85 backdrop-blur-xl border-b border-cyan-500/15 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single visual unit) */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-sky-400 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#040e20] rounded-[7px] flex items-center justify-center">
              <Waves className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base tracking-wider text-white">
              ORCA
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase -mt-1">
              Marine Intelligence
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search, Telemetry Alerts, Profile & Primary Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Quick search input trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-700/60 hover:border-cyan-500/30 text-xs text-slate-400 transition-colors w-32 sm:w-56 justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">Search vessels, data...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Alerts Notification Button */}
          <button
            onClick={() => onNavigate('risk-alerts')}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            title="Marine Risk & Sanctuary Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* User profile capsule */}
          <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shadow-inner">
              PR
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-200">Prajwal R.</span>
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Researcher</span>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onNavigate('live-map')}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95 whitespace-nowrap"
          >
            Launch ORCA →
          </button>
        </div>
      </div>
    </header>
  );
};
