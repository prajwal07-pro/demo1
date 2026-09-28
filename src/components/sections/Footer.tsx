import React from 'react';
import { Waves, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#020610] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-cyan-500/15">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-cyan-500/10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-sky-400 p-[1px]">
                <div className="w-full h-full bg-[#040e20] rounded-[7px] flex items-center justify-center">
                  <Waves className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base tracking-wider text-white">ORCA</span>
                <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase -mt-1">Marine Intelligence Platform</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Sovereign Earth observation, real-time AIS vessel kinematics, and hydrodynamic intelligence synthesised into actionable predictions for maritime research, safety, and sustainable ocean governance.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multi-Agent Sovereign Mesh Online</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-cyan-300 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('live-map')} className="hover:text-cyan-300 transition-colors">
                  Live GIS Marine Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('intelligence')} className="hover:text-cyan-300 transition-colors">
                  10-Agent Intelligence Mesh
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulation')} className="hover:text-cyan-300 transition-colors">
                  Hydrodynamic Simulations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('3d-explorer')} className="hover:text-cyan-300 transition-colors">
                  3D Tech Explorer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Data Providers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Integrated Data Sources</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>Copernicus CMEMS</span>
                <span className="text-[10px] font-mono text-cyan-400">SST & Currents</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Sentinel-3 SLSTR / OLCI</span>
                <span className="text-[10px] font-mono text-cyan-400">Optical / Color</span>
              </li>
              <li className="flex items-center justify-between">
                <span>INCOIS Marine Services</span>
                <span className="text-[10px] font-mono text-cyan-400">PFZ & Wave Buoys</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NOAA Coral Reef Watch</span>
                <span className="text-[10px] font-mono text-cyan-400">Thermal Bleach</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Global AIS Network</span>
                <span className="text-[10px] font-mono text-cyan-400">Class A/B Transmitters</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Research */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Research & Impact</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('learning-lab')} className="hover:text-cyan-300 transition-colors">
                  Learning Lab & Missions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-cyan-300 transition-colors">
                  Research Community
                </button>
              </li>
              <li className="text-slate-500 pt-1">
                Designed for Smart India Hackathon & Sovereign Maritime Technology.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} ORCA Marine Intelligence Platform. All telemetry data verified against Copernicus & INCOIS.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Strict Real Data Integrity Protocol</span>
            <span>·</span>
            <span className="text-cyan-400">WGS84 Marine Coordinates</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
