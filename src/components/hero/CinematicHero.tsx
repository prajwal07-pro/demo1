import React from 'react';
import { 
  ArrowRight, 
  Play, 
  Satellite, 
  Ship, 
  Layers, 
  Bot, 
  Thermometer, 
  Waves, 
  Wind, 
  Droplet,
  Compass,
  Activity,
  Boxes,
  Flame,
  Users
} from 'lucide-react';
import { OrcaOceanCanvas } from '../3d/OrcaOceanCanvas';

interface CinematicHeroProps {
  onExploreMap: () => void;
  onOpenChat: () => void;
  onSelectFeature: (featureId: string) => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onExploreMap,
  onOpenChat,
  onSelectFeature
}) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#030712] border-b border-cyan-500/10">
      {/* Background 3D Orca & Volumetric Ocean Scene */}
      <div className="relative w-full h-[580px] lg:h-[640px] xl:h-[700px]">
        <OrcaOceanCanvas quality="high" />

        {/* Foreground Content Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Main Hero Typography & Call-To-Action (Left Side) */}
          <div className="pt-4 sm:pt-8 max-w-2xl pointer-events-auto">
            {/* Tagline kicker */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 font-semibold mb-3 uppercase">
              <span>Data</span>
              <span className="text-cyan-500/40">×</span>
              <span>Ocean</span>
              <span className="text-cyan-500/40">×</span>
              <span>AI</span>
              <span className="text-cyan-500/40">×</span>
              <span>Impact</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-4 text-balance drop-shadow-md">
              A SMARTER OCEAN FOR A <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-400">SAFER TOMORROW.</span>
            </h1>

            {/* Body Description */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl mb-6 drop-shadow">
              ORCA integrates satellite Earth observation, real-time AIS vessel telemetry, oceanographic physics, and multi-agent AI to deliver sovereign marine intelligence for research, safety, and sustainable oceans.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <button
                onClick={onExploreMap}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-semibold text-xs sm:text-sm hover:from-cyan-300 hover:to-teal-200 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95"
              >
                <span>Explore Live Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm border border-slate-700/80 hover:border-cyan-400/40 backdrop-blur-md transition-colors"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Talk to ORCA</span>
              </button>
            </div>

            {/* Live Operational Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl">
              <div className="p-2.5 rounded-xl bg-[#061226]/80 backdrop-blur-md border border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <Ship className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-white">32,489</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">Live Vessels Tracked</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#061226]/80 backdrop-blur-md border border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-white">12+</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">Ocean Data Layers</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#061226]/80 backdrop-blur-md border border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono text-sm sm:text-base font-bold text-white">Real-time</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">Global Space Pass</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#061226]/80 backdrop-blur-md border border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono text-sm sm:text-base font-bold text-white">10 Agents</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">24/7 Multi-Agent Mesh</span>
              </div>
            </div>
          </div>

          {/* Right Floating Cards: Space Telemetry & Visual Preview */}
          <div className="hidden lg:flex flex-col items-end gap-3 pointer-events-auto absolute top-6 right-8 w-72">
            {/* Live From Space HUD */}
            <div className="w-full p-3.5 rounded-2xl bg-[#050f22]/85 backdrop-blur-md border border-cyan-400/20 shadow-xl shadow-cyan-950/40">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-cyan-500/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                  <Satellite className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                  <span>LIVE FROM SPACE</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  SENTINEL-3
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                    <Thermometer className="w-3 h-3 text-rose-400" />
                    <span>SST</span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-bold text-white">29.4 °C</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                    <Droplet className="w-3 h-3 text-emerald-400" />
                    <span>Chlorophyll</span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-bold text-white">0.32 mg/m³</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                    <Waves className="w-3 h-3 text-cyan-400" />
                    <span>Waves</span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-bold text-white">1.8 m</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                    <Wind className="w-3 h-3 text-sky-400" />
                    <span>Wind</span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-bold text-white">12.4 m/s</span>
                </div>
              </div>
            </div>

            {/* Visual Teaser Cards (Explore Ocean / Impact / AI) */}
            <div 
              onClick={() => onSelectFeature('3d-explorer')}
              className="w-full p-3 rounded-xl bg-[#061226]/80 hover:bg-[#091a38] border border-cyan-500/15 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Play className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300">Explore the Ocean</h4>
                  <p className="text-[10px] text-slate-400">3D inspection & sensor buoys</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5" />
            </div>

            <div 
              onClick={() => onSelectFeature('simulation')}
              className="w-full p-3 rounded-xl bg-[#061226]/80 hover:bg-[#091a38] border border-cyan-500/15 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Activity className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300">Real-world Simulations</h4>
                  <p className="text-[10px] text-slate-400">From cyclone to PFZ prediction</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Selector Quick-Pill Bar (Directly below hero, inspired by reference image) */}
      <div className="w-full bg-[#040b18] border-t border-cyan-500/10 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectFeature('live-map')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/25 text-xs font-medium text-cyan-200 shrink-0 transition-colors"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <div className="text-left">
              <span className="block font-semibold">Live Marine Map</span>
              <span className="text-[10px] text-slate-400">Real-time AIS + Ocean Data</span>
            </div>
          </button>

          <button
            onClick={() => onSelectFeature('intelligence')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/20 text-xs font-medium text-slate-200 shrink-0 transition-colors"
          >
            <Bot className="w-4 h-4 text-blue-400" />
            <div className="text-left">
              <span className="block font-semibold">AI Insights</span>
              <span className="text-[10px] text-slate-400">Risk analysis & predictions</span>
            </div>
          </button>

          <button
            onClick={() => onSelectFeature('simulation')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/20 text-xs font-medium text-slate-200 shrink-0 transition-colors"
          >
            <Waves className="w-4 h-4 text-teal-400" />
            <div className="text-left">
              <span className="block font-semibold">Ocean Simulations</span>
              <span className="text-[10px] text-slate-400">What-if scenarios</span>
            </div>
          </button>

          <button
            onClick={() => onSelectFeature('3d-explorer')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/20 text-xs font-medium text-slate-200 shrink-0 transition-colors"
          >
            <Boxes className="w-4 h-4 text-indigo-400" />
            <div className="text-left">
              <span className="block font-semibold">3D Learning Lab</span>
              <span className="text-[10px] text-slate-400">Interactive education</span>
            </div>
          </button>

          <button
            onClick={() => onSelectFeature('learning-lab')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/20 text-xs font-medium text-slate-200 shrink-0 transition-colors"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="block font-semibold">Marine Games</span>
              <span className="text-[10px] text-slate-400">Quests & XP progression</span>
            </div>
          </button>

          <button
            onClick={() => onSelectFeature('community')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/20 text-xs font-medium text-slate-200 shrink-0 transition-colors"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <span className="block font-semibold">Community</span>
              <span className="text-[10px] text-slate-400">Researchers & expeditions</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
