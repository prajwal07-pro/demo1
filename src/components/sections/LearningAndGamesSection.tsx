import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Trophy, 
  Award, 
  Zap, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  Ship, 
  Waves, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface GameSector {
  id: string;
  name: string;
  sst: number;
  sstGradient: number;
  chlorophyll: number;
  isCorrect: boolean;
  explanation: string;
}

const PFZ_SECTORS: GameSector[] = [
  {
    id: 'sec-a',
    name: 'Sector Alpha (Open Ocean Basin)',
    sst: 30.5,
    sstGradient: 0.1,
    chlorophyll: 0.12,
    isCorrect: false,
    explanation: 'Oligotrophic waters. Uniform temperature and very low chlorophyll indicate an ocean desert with minimal fish congregation.'
  },
  {
    id: 'sec-b',
    name: 'Sector Bravo (Paradip Frontal Break)',
    sst: 29.4,
    sstGradient: 1.5,
    chlorophyll: 0.74,
    isCorrect: true,
    explanation: 'Optimal PFZ! The sharp 1.5°C thermal gradient front creates nutrient upwelling, supporting high chlorophyll (0.74 mg/m³) and dense pelagic schools.'
  },
  {
    id: 'sec-c',
    name: 'Sector Charlie (Inshore Harbor Mud)',
    sst: 31.2,
    sstGradient: 0.3,
    chlorophyll: 1.85,
    isCorrect: false,
    explanation: 'High sediment discharge and river runoff distort chlorophyll readings. Elevated turbidity and shallow depth do not sustain pelagic tuna/mackerel.'
  },
  {
    id: 'sec-d',
    name: 'Sector Delta (Deep Abyssal Trench)',
    sst: 27.8,
    sstGradient: 0.2,
    chlorophyll: 0.18,
    isCorrect: false,
    explanation: 'Deep cold layer without thermal breaks. Low nutrient retention at photic depths.'
  }
];

export const LearningAndGamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'pfz' | 'route'>('pfz');
  const [selectedSector, setSelectedSector] = useState<GameSector | null>(null);
  const [gameFeedback, setGameFeedback] = useState<'idle' | 'won' | 'lost'>('idle');
  const [userXp, setUserXp] = useState(1850);
  const [streakDays, setStreakDays] = useState(4);

  // Route Game States
  const [routeStep, setRouteStep] = useState<number>(0);
  const [routeFeedback, setRouteFeedback] = useState<string | null>(null);

  const handleSelectSector = (sector: GameSector) => {
    setSelectedSector(sector);
    if (sector.isCorrect) {
      setGameFeedback('won');
      setUserXp(prev => prev + 150);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } else {
      setGameFeedback('lost');
    }
  };

  const resetPfzGame = () => {
    setSelectedSector(null);
    setGameFeedback('idle');
  };

  return (
    <section id="learning-lab" className="w-full bg-[#030914] py-16 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Gamified Missions & Training Quests</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Marine Science & Strategy Lab
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Level up your oceanographic intuition. Analyze live satellite thermal fronts, route fleets past cyclonic storms, and earn verified badges.
            </p>
          </div>

          {/* Gamification Stats Bar */}
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs font-mono">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-white font-bold">{streakDays} Day Streak</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 font-bold">{userXp} XP</span>
              <span className="text-slate-400 text-[10px]">(Lvl 4 Specialist)</span>
            </div>
          </div>
        </div>

        {/* Game Mode Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => { setActiveGame('pfz'); resetPfzGame(); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeGame === 'pfz'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            GAME 01: Spot the Potential Fishing Zone (PFZ)
          </button>
          <button
            onClick={() => setActiveGame('route')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeGame === 'route'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            GAME 02: Route the Fleet Past Cyclone Vortex
          </button>
        </div>

        {/* GAME 01: SPOT THE PFZ */}
        {activeGame === 'pfz' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Interactive Grid (Left 8 Cols) */}
            <div className="lg:col-span-8 p-5 rounded-3xl bg-[#040e22] border border-cyan-500/20 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/10">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Mission Brief: Identify the High-Yield Feeding Zone
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">+150 XP Reward</span>
              </div>

              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Oceanographers identify Potential Fishing Zones by finding sharp <strong>SST thermal fronts</strong> (&gt;1.0°C gradient) paired with <strong>elevated chlorophyll-a</strong> concentration (&gt;0.5 mg/m³). Examine the 4 satellite quadrants below and select the true productive front:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PFZ_SECTORS.map(sec => {
                  const isSelected = selectedSector?.id === sec.id;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => handleSelectSector(sec)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? sec.isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500 text-white'
                            : 'bg-rose-950/60 border-rose-500 text-white'
                          : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold">{sec.name}</span>
                        {isSelected && (
                          sec.isCorrect 
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 
                            : <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono my-2 p-2 bg-black/40 rounded-xl">
                        <div>
                          <span className="text-slate-400 text-[10px] block">SST Gradient</span>
                          <span className="text-cyan-300 font-bold">{sec.sstGradient} °C/10km</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Chlorophyll-a</span>
                          <span className="text-emerald-300 font-bold">{sec.chlorophyll} mg/m³</span>
                        </div>
                      </div>

                      <span className="text-[11px] text-cyan-400 font-semibold block mt-1">
                        Select this quadrant →
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Feedback Alert Card */}
              {selectedSector && (
                <div className={`mt-5 p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                  selectedSector.isCorrect 
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100' 
                    : 'bg-rose-950/80 border-rose-500/50 text-rose-100'
                }`}>
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {selectedSector.isCorrect ? (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>SUCCESSFUL DETECTION! (+150 XP AWARDED)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>INCORRECT CLASSIFICATION</span>
                      </>
                    )}
                  </div>
                  <p>{selectedSector.explanation}</p>

                  <button
                    onClick={resetPfzGame}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 text-xs font-bold text-white transition-colors"
                  >
                    Try Another Simulation
                  </button>
                </div>
              )}
            </div>

            {/* Achievements & Badges Sidebar (Right 4 Cols) */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-[#040e22] border border-cyan-500/20 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-cyan-500/10">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Your Ocean Badges</span>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Ocean Explorer', desc: 'Completed basic hydrodynamics training', unlocked: true },
                    { title: 'PFZ Hunter', desc: 'Identified 5 consecutive frontal zones', unlocked: true },
                    { title: 'Satellite Scout', desc: 'Calibrated Sentinel-3 altimetry feeds', unlocked: true },
                    { title: 'Storm Evader', desc: 'Successfully rerouted fleet around cyclone', unlocked: false },
                    { title: 'ORCA Commander', desc: 'Achieved 5,000 XP in multi-agent labs', unlocked: false },
                  ].map((b, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border flex items-center gap-3 text-xs ${
                      b.unlocked 
                        ? 'bg-slate-900/90 border-amber-500/30 text-slate-100' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
                    }`}>
                      <div className={`p-2 rounded-lg ${b.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-600'}`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">{b.title}</div>
                        <div className="text-[10px] text-slate-400">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard snippet */}
              <div className="mt-6 pt-4 border-t border-cyan-500/10">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-2">
                  Global Researcher Leaderboard
                </span>
                <div className="text-xs space-y-1.5 font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span>1. Dr. Elena Rostova</span>
                    <span className="text-amber-400 font-bold">4,280 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Rajat Sengupta</span>
                    <span className="text-amber-400 font-bold">3,890 XP</span>
                  </div>
                  <div className="flex justify-between text-cyan-300 font-bold">
                    <span>3. You (Prajwal R.)</span>
                    <span className="text-cyan-400">{userXp} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GAME 02: ROUTE THE FLEET */}
        {activeGame === 'route' && (
          <div className="p-6 rounded-3xl bg-[#040e22] border border-cyan-500/20 shadow-xl">
            <h3 className="text-base font-bold text-white mb-2">Mission 02: Tactical Fleet Weather Routing</h3>
            <p className="text-xs text-slate-300 mb-6 max-w-2xl leading-relaxed">
              A Category 3 tropical cyclone is traversing 18°N in the Bay of Bengal with 65-knot gusts. As Maritime Route Commander, select the optimal routing strategy for container vessel <em>Ever Glory</em> on passage to Sri Lanka:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 1,
                  title: 'Option A: Direct Rhumb Line',
                  desc: 'Shortest nautical distance, but transits right through 4.8m waves and high hull stress.',
                  result: 'Vessel damaged! Cargo loss recorded due to 45° roll angles.'
                },
                {
                  id: 2,
                  title: 'Option B: Western Coastal Shelf Transit',
                  desc: 'Skirt along coastal bathymetry west of 84°E meridian, benefiting from 0.6 m/s tail currents.',
                  isBest: true,
                  result: 'Flawless transit! 8.4% fuel savings and zero hull stress.'
                },
                {
                  id: 3,
                  title: 'Option C: Full Southern Loop',
                  desc: 'Head south past 6°N before turning east.',
                  result: 'Safe from weather, but incurs a 36-hour delay and heavy fuel surcharge.'
                }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setRouteStep(opt.id);
                    setRouteFeedback(opt.result);
                    if (opt.isBest) {
                      setUserXp(prev => prev + 200);
                      try {
                        confetti({ particleCount: 70, spread: 60 });
                      } catch {}
                    }
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    routeStep === opt.id
                      ? opt.isBest ? 'bg-emerald-950/60 border-emerald-500' : 'bg-rose-950/60 border-rose-500'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white mb-1">{opt.title}</h4>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{opt.desc}</p>
                  <span className="text-xs font-semibold text-cyan-400">Order Course Execution →</span>
                </div>
              ))}
            </div>

            {routeFeedback && (
              <div className="mt-5 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-100 font-mono">
                {routeFeedback}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
