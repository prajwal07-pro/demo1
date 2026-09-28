import React, { useState, useEffect } from 'react';
import { Waves, Satellite, Ship, Bot, Activity, CheckCircle2, FastForward } from 'lucide-react';

interface OrcaInitializationScreenProps {
  onComplete: () => void;
}

interface InitStage {
  id: string;
  name: string;
  subsystem: 'CORE' | 'SPACE' | 'AIS' | 'HYDRO' | 'AI';
  detail: string;
  threshold: number; // progress % when this stage activates
}

const STAGES: InitStage[] = [
  {
    id: 's-1',
    name: 'INITIALIZING ORCA CORE KINEMATICS',
    subsystem: 'CORE',
    detail: 'Booting WebGL 3D spatial render pipeline and telemetry bus',
    threshold: 15
  },
  {
    id: 's-2',
    name: 'CONNECTING SATELLITE CONSTELLATIONS',
    subsystem: 'SPACE',
    detail: 'Uplinking Copernicus Sentinel-3 SLSTR & NOAA-20 VIIRS thermal channels',
    threshold: 40
  },
  {
    id: 's-3',
    name: 'INGESTING GLOBAL AIS VESSEL STREAMS',
    subsystem: 'AIS',
    detail: 'Parsing 32,489 active vessel transponders across Indian Ocean & Bay of Bengal',
    threshold: 68
  },
  {
    id: 's-4',
    name: 'CALIBRATING HYDRODYNAMIC STATE',
    subsystem: 'HYDRO',
    detail: 'Synthesizing INCOIS OCM-3 chlorophyll gradients & baroclinic eddy fields',
    threshold: 88
  },
  {
    id: 's-5',
    name: 'SYNCHRONIZING 10-AGENT SOVEREIGN AI MESH',
    subsystem: 'AI',
    detail: 'Consensus matrix online. Multi-agent decision pathways established.',
    threshold: 100
  }
];

export const OrcaInitializationScreen: React.FC<OrcaInitializationScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Keyboard listener for Escape to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Natural paced progress accumulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 500);
          }, 350);
          return 100;
        }
        // Smooth random increment
        const increment = Math.floor(Math.random() * 5) + 3;
        return Math.min(100, prev + increment);
      });
    }, 70);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 200);
  };

  // Find active stage
  const currentStageIndex = STAGES.findIndex(s => progress <= s.threshold);
  const activeStage = currentStageIndex !== -1 ? STAGES[currentStageIndex] : STAGES[STAGES.length - 1];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-[#020713] text-slate-100 transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Radar Rings & Scanlines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full border border-cyan-500/10 animate-ping duration-1000 opacity-20" />
        <div className="absolute w-[450px] h-[450px] sm:w-[700px] sm:h-[700px] rounded-full border border-cyan-500/15" />
        <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full border border-cyan-500/20" />
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#020713]/80 to-[#020713]" />
      </div>

      {/* Top Header: Telemetry Status & Skip Button */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
            ORCA OS // SEQUENCE 01
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-xs text-slate-400 hover:text-white transition-all backdrop-blur-md"
        >
          <FastForward className="w-3.5 h-3.5 text-cyan-400" />
          <span>Skip Intro</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.2 text-[10px] font-mono text-slate-500 bg-slate-950 rounded border border-slate-800">
            ESC
          </kbd>
        </button>
      </div>

      {/* Center Holographic ORCA Glyphs & Subsystem Stages */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center my-auto">
        {/* Animated Holographic Core Ring */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/10 blur-xl animate-pulse" />
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 p-[1.5px] shadow-2xl shadow-cyan-500/30">
            <div className="w-full h-full bg-[#030e24] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <Waves className="w-12 h-12 text-cyan-300 animate-pulse" />
              {/* Rotating scan sweep inside glyph */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-transparent animate-radar origin-center opacity-40 pointer-events-none" />
            </div>
          </div>
          {/* Subsystem status badge */}
          <span className="absolute -bottom-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-900 text-cyan-300 border border-cyan-500/40">
            {activeStage.subsystem}
          </span>
        </div>

        {/* Display Title */}
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wider mb-2">
          ORCA MARINE INTELLIGENCE
        </h1>
        <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase mb-8">
          Sovereign Ocean Telemetry & Multi-Agent Network
        </p>

        {/* Active Stage Name & Subtitle */}
        <div className="w-full min-h-[56px] flex flex-col items-center justify-center mb-6">
          <div className="text-xs sm:text-sm font-mono font-bold text-white tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{activeStage.name}</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mt-1 truncate">
            {activeStage.detail}
          </p>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full bg-[#030e22] rounded-full p-1 border border-cyan-500/25 shadow-inner mb-3">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-sky-300 transition-all duration-100 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Progress Percentage & Status Readouts */}
        <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400">
          <span>STATUS: {progress === 100 ? 'ALL SYSTEMS READY' : 'INITIALIZING...'}</span>
          <span className="text-cyan-300 font-bold tabular-nums text-sm">{progress}%</span>
        </div>
      </div>

      {/* Bottom Subsystems Status Pills (Sat, AIS, Hydro, AI) */}
      <div className="relative z-10 w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'SATELLITE', ready: progress >= 40, icon: <Satellite className="w-3.5 h-3.5" /> },
          { label: 'AIS VESSEL', ready: progress >= 68, icon: <Ship className="w-3.5 h-3.5" /> },
          { label: 'HYDRODYNAMICS', ready: progress >= 88, icon: <Activity className="w-3.5 h-3.5" /> },
          { label: '10 AI AGENTS', ready: progress >= 100, icon: <Bot className="w-3.5 h-3.5" /> }
        ].map((sub, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] font-mono transition-colors ${
              sub.ready
                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {sub.icon}
              <span>{sub.label}</span>
            </div>
            {sub.ready ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
