import React, { useState } from 'react';
import { 
  Activity, 
  Play, 
  RotateCcw, 
  Wind, 
  Waves, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Fuel, 
  TrendingUp,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { simulationService } from '../../services/simulationService';
import { SimulationScenario } from '../../types/marine';

interface SimulationLabSectionProps {
  initialScenarioId?: string;
  onOpenInMap?: (scenario: SimulationScenario) => void;
}

export const SimulationLabSection: React.FC<SimulationLabSectionProps> = ({
  initialScenarioId = 'sim-01',
  onOpenInMap
}) => {
  const [scenarios, setScenarios] = useState<SimulationScenario[]>(simulationService.getScenarios());
  const [activeScenarioId, setActiveScenarioId] = useState(initialScenarioId);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  // Dynamic interactive parameter states
  const [windKnots, setWindKnots] = useState(activeScenario.parameters.windSpeedKnots);
  const [waveHeight, setWaveHeight] = useState(activeScenario.parameters.waveHeightMeters);
  const [timeHorizon, setTimeHorizon] = useState(activeScenario.parameters.timeHorizonHours);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const updated = simulationService.runSimulation(activeScenarioId, {
        windSpeedKnots: windKnots,
        waveHeightMeters: waveHeight,
        timeHorizonHours: timeHorizon
      });
      setScenarios(simulationService.getScenarios());
      setIsSimulating(false);
    }, 600);
  };

  return (
    <section id="simulation" className="w-full bg-[#020914] py-16 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-teal-400 uppercase mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Physics & Hydrodynamic Laboratory</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Predictive Marine Simulations
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Model extreme weather avoidance, chlorophyll plume drift, and search-and-rescue leeway dispersion under combined wind stress and Stokes drift.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="mt-4 md:mt-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {scenarios.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveScenarioId(s.id);
                  setWindKnots(s.parameters.windSpeedKnots);
                  setWaveHeight(s.parameters.waveHeightMeters);
                  setTimeHorizon(s.parameters.timeHorizonHours);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  activeScenarioId === s.id
                    ? 'bg-teal-500/25 text-teal-200 border border-teal-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {s.title.split(' ')[0]} {s.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Simulation Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Panel (Left 4 Cols) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-[#040e22] border border-cyan-500/20 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/10">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Simulation Parameters</span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{activeScenario.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{activeScenario.description}</p>

              {/* Slider 1: Wind Speed */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    Wind Velocity
                  </span>
                  <span className="font-bold text-cyan-300">{windKnots} knots</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={windKnots}
                  onChange={e => setWindKnots(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Slider 2: Wave Height */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-teal-400" />
                    Significant Wave Height
                  </span>
                  <span className="font-bold text-cyan-300">{waveHeight} m</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.1"
                  value={waveHeight}
                  onChange={e => setWaveHeight(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Slider 3: Time Horizon */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Forecast Time Horizon
                  </span>
                  <span className="font-bold text-cyan-300">{timeHorizon} hours</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="120"
                  step="6"
                  value={timeHorizon}
                  onChange={e => setTimeHorizon(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Vessel Type Indicator */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span className="text-slate-500">Target Asset Class:</span>
                <span className="font-bold text-cyan-200">{activeScenario.parameters.vesselType}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Running Physics Step...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visualization Canvas & Output Metrics (Right 8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Visual Hydrodynamic Canvas */}
            <div className="relative w-full h-[320px] rounded-3xl bg-[#030d1d] border border-cyan-500/20 overflow-hidden flex items-center justify-center p-4">
              <svg viewBox="0 0 800 400" className="w-full h-full">
                <defs>
                  <radialGradient id="cycloneGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#ea580c" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#0284c7" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* Grid */}
                {[100, 200, 300, 400, 500, 600, 700].map(x => (
                  <line key={x} x1={x} y1="0" x2={x} y2="400" stroke="#06b6d4" strokeOpacity="0.08" strokeDasharray="3,3" />
                ))}

                {/* Storm Vortex / Eddy */}
                <g className="animate-spin origin-[500px_180px] duration-1000">
                  <circle cx="500" cy="180" r="110" fill="url(#cycloneGrad)" />
                  <path d="M 500,180 Q 550,110 600,150" stroke="#f43f5e" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <path d="M 500,180 Q 450,250 400,210" stroke="#f43f5e" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <path d="M 500,180 Q 550,250 490,290" stroke="#f43f5e" strokeWidth="2.5" fill="none" opacity="0.7" />
                </g>

                {/* Eye of storm label */}
                <circle cx="500" cy="180" r="8" fill="#ffffff" />
                <text x="520" y="185" fill="#fca5a5" fontSize="11" fontWeight="bold">Storm Vortex Eye (994 hPa)</text>

                {/* Original hazardous direct route (red dashed) */}
                <path
                  d="M 120,320 L 500,180 L 720,110"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  fill="none"
                  opacity="0.6"
                />
                <text x="240" y="240" fill="#f87171" fontSize="10">Hazardous Direct Route</text>

                {/* Optimized ORCA evasive corridor (Cyan solid glowing path) */}
                <path
                  d="M 120,320 Q 340,360 480,330 T 720,110"
                  stroke="#22d3ee"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle cx="120" cy="320" r="5" fill="#38bdf8" />
                <circle cx="720" cy="110" r="5" fill="#34d399" />
                <text x="320" y="380" fill="#67e8f9" fontSize="11" fontWeight="bold">
                  ORCA Optimized Evasive Rhumb Line (+{activeScenario.metrics.riskReductionPct}% Safe)
                </text>
              </svg>

              {/* Status pill in corner */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                Monte Carlo Particles: 10,000 Verified
              </div>
            </div>

            {/* Computed Output Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#040e22] border border-cyan-500/15">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Risk Reduction</span>
                </div>
                <span className="font-mono tabular-nums text-2xl font-extrabold text-white">
                  {activeScenario.metrics.riskReductionPct}%
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">Hazard corridor bypassed</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#040e22] border border-cyan-500/15">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Fuel className="w-4 h-4 text-teal-400" />
                  <span>Fuel Savings</span>
                </div>
                <span className="font-mono tabular-nums text-2xl font-extrabold text-white">
                  {activeScenario.metrics.fuelSavingsPct || 8.4}%
                </span>
                <span className="text-[10px] text-teal-400 block mt-1">Wave resistance min.</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#040e22] border border-cyan-500/15">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>ETA Deviation</span>
                </div>
                <span className="font-mono tabular-nums text-2xl font-extrabold text-white">
                  {activeScenario.metrics.etaChangeHours ? `+${activeScenario.metrics.etaChangeHours} hrs` : 'Nominal'}
                </span>
                <span className="text-[10px] text-sky-400 block mt-1">Calculated at 14 kn cruise</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
