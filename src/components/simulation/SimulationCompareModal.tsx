import React from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Wind, 
  Waves, 
  Thermometer, 
  Activity, 
  ShieldCheck, 
  Fuel, 
  Clock, 
  RotateCcw, 
  TrendingUp, 
  AlertTriangle,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { SimulationHistoryEntry } from '../../types/marine';

interface SimulationCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  runA: SimulationHistoryEntry;
  runB: SimulationHistoryEntry;
  onRestoreRun: (entry: SimulationHistoryEntry) => void;
}

export const SimulationCompareModal: React.FC<SimulationCompareModalProps> = ({
  isOpen,
  onClose,
  runA,
  runB,
  onRestoreRun
}) => {
  if (!isOpen || !runA || !runB) return null;

  // Compute variance differentials
  const windSpeedDiff = runA.parameters.windSpeedKnots - runB.parameters.windSpeedKnots;
  const windDeltaDiff = runA.variance.windDeltaKnots - runB.variance.windDeltaKnots;
  const waveHeightDiff = Number((runA.parameters.waveHeightMeters - runB.parameters.waveHeightMeters).toFixed(1));
  const waveDeltaDiff = Number((runA.variance.waveDeltaMeters - runB.variance.waveDeltaMeters).toFixed(1));
  const sstVarianceDiff = Number((runA.variance.sstVarianceCelsius - runB.variance.sstVarianceCelsius).toFixed(1));
  const stokesDiff = Number((runA.variance.stokesDriftVarianceMps - runB.variance.stokesDriftVarianceMps).toFixed(2));
  const riskDiff = runA.riskReductionPct - runB.riskReductionPct;
  const fuelDiff = (runA.fuelSavingsPct && runB.fuelSavingsPct) 
    ? Number((runA.fuelSavingsPct - runB.fuelSavingsPct).toFixed(1)) 
    : null;

  // Maximum timeline duration between the two runs
  const maxHorizon = Math.max(runA.parameters.timeHorizonHours, runB.parameters.timeHorizonHours);

  // SVG Chart Dimensions
  const svgWidth = 540;
  const svgHeight = 110;
  const padX = 24;
  const padTop = 16;
  const padBottom = 22;
  const plotW = svgWidth - 2 * padX;
  const plotH = svgHeight - padTop - padBottom;

  // Build path coordinates for a run's trend points
  const getPathCoords = (points: typeof runA.variance.trendPoints, horizon: number) => {
    if (!points || points.length === 0) return '';
    const coords = points.map((p, i) => {
      // Map hour relative to maxHorizon
      const progress = p.hour / maxHorizon;
      const x = padX + progress * plotW;
      const clampedPct = Math.max(0, Math.min(100, p.variancePct));
      const y = padTop + plotH - (clampedPct / 100) * plotH;
      return { x, y, p };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const c = coords[i];
      const n = coords[i + 1];
      const cpX1 = c.x + (n.x - c.x) / 2;
      const cpY1 = c.y;
      const cpX2 = c.x + (n.x - c.x) / 2;
      const cpY2 = n.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${n.x} ${n.y}`;
    }
    return { pathD, coords };
  };

  const chartA = getPathCoords(runA.variance.trendPoints, runA.parameters.timeHorizonHours);
  const chartB = getPathCoords(runB.variance.trendPoints, runB.parameters.timeHorizonHours);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">Critical Variance</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">High Variance</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">Moderate</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">Nominal Drift</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#030c1d] border border-cyan-500/30 shadow-2xl p-5 sm:p-7 flex flex-col my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">Hydrodynamic Variance Comparison</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Side-by-Side Analysis
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Divergence matrix comparing oceanographic anomaly parameters and overlaid timeline variance profiles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side Run Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* RUN A */}
          <div className="p-4 rounded-2xl bg-[#06142a] border-2 border-cyan-500/40 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40">
                RUN #{String(runA.runNumber).padStart(2, '0')} (Candidate A)
              </span>
              <div className="flex items-center gap-2">
                {getSeverityBadge(runA.variance.varianceSeverity)}
                <span className="text-[11px] font-mono text-slate-400">{runA.timestamp}</span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{runA.scenarioTitle}</h3>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{runA.outcomeSummary}</p>
          </div>

          {/* RUN B */}
          <div className="p-4 rounded-2xl bg-[#06142a] border-2 border-amber-500/40 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                RUN #{String(runB.runNumber).padStart(2, '0')} (Candidate B)
              </span>
              <div className="flex items-center gap-2">
                {getSeverityBadge(runB.variance.varianceSeverity)}
                <span className="text-[11px] font-mono text-slate-400">{runB.timestamp}</span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{runB.scenarioTitle}</h3>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{runB.outcomeSummary}</p>
          </div>
        </div>

        {/* Overlaid Dual Variance Sparkline Timeline Chart */}
        <div className="p-4 rounded-2xl bg-[#020713] border border-cyan-500/20 mb-5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-cyan-500/10 text-xs font-mono">
            <div className="flex items-center gap-2 text-white font-bold">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Overlaid Variance Profiles (Normalized 0 → 100%)</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 border border-white/40 inline-block" />
                <span className="text-cyan-300">Run #{runA.runNumber} ({runA.parameters.timeHorizonHours}h)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-white/40 inline-block" />
                <span className="text-amber-300">Run #{runB.runNumber} ({runB.parameters.timeHorizonHours}h)</span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[110px]">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              {[0.25, 0.5, 0.75].map(ratio => (
                <line
                  key={ratio}
                  x1={padX}
                  y1={padTop + plotH * ratio}
                  x2={svgWidth - padX}
                  y2={padTop + plotH * ratio}
                  stroke="#1e293b"
                  strokeDasharray="2,3"
                  strokeWidth="0.8"
                />
              ))}

              {/* Run A Path (Cyan) */}
              {chartA && (
                <g>
                  <path
                    d={chartA.pathD}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {chartA.coords.map((c, i) => (
                    <circle
                      key={`a-${i}`}
                      cx={c.x}
                      cy={c.y}
                      r="3"
                      fill="#ffffff"
                      stroke="#0891b2"
                      strokeWidth="1.8"
                    />
                  ))}
                </g>
              )}

              {/* Run B Path (Amber) */}
              {chartB && (
                <g>
                  <path
                    d={chartB.pathD}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="4,2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {chartB.coords.map((c, i) => (
                    <circle
                      key={`b-${i}`}
                      cx={c.x}
                      cy={c.y}
                      r="3"
                      fill="#ffffff"
                      stroke="#d97706"
                      strokeWidth="1.8"
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1 px-3">
            <span>T+0h (Start)</span>
            <span>T+{Math.round(maxHorizon / 2)}h</span>
            <span>T+{maxHorizon}h (Timeline Max)</span>
          </div>
        </div>

        {/* Detailed Oceanographic Variance Comparison Matrix */}
        <div className="mb-5 overflow-x-auto rounded-2xl border border-cyan-500/20 bg-[#020713]">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyan-500/20 bg-slate-900/60 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Oceanographic Variance Parameter</th>
                <th className="py-2.5 px-3 font-semibold text-cyan-300">Run #{runA.runNumber}</th>
                <th className="py-2.5 px-3 font-semibold text-amber-300">Run #{runB.runNumber}</th>
                <th className="py-2.5 px-3 font-semibold text-right">Variance Divergence (A - B)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {/* Wind Speed & Wind Delta */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 text-slate-300 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  <span>Wind Velocity & Δ Delta</span>
                </td>
                <td className="py-2.5 px-3 text-white font-bold">
                  {runA.parameters.windSpeedKnots} kn <span className="text-slate-400 font-normal">({runA.variance.windDeltaKnots > 0 ? `+${runA.variance.windDeltaKnots}` : runA.variance.windDeltaKnots}kn)</span>
                </td>
                <td className="py-2.5 px-3 text-white font-bold">
                  {runB.parameters.windSpeedKnots} kn <span className="text-slate-400 font-normal">({runB.variance.windDeltaKnots > 0 ? `+${runB.variance.windDeltaKnots}` : runB.variance.windDeltaKnots}kn)</span>
                </td>
                <td className="py-2.5 px-3 text-right font-bold">
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    windSpeedDiff > 0 ? 'bg-amber-500/20 text-amber-300' : windSpeedDiff < 0 ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {windSpeedDiff > 0 ? `+${windSpeedDiff}` : windSpeedDiff} kn ({windDeltaDiff > 0 ? `+${windDeltaDiff}` : windDeltaDiff}kn Δ)
                  </span>
                </td>
              </tr>

              {/* Wave Height & Wave Delta */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 text-slate-300 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-teal-400" />
                  <span>Significant Wave Height (SWH)</span>
                </td>
                <td className="py-2.5 px-3 text-white font-bold">
                  {runA.parameters.waveHeightMeters} m <span className="text-slate-400 font-normal">({runA.variance.waveDeltaMeters > 0 ? `+${runA.variance.waveDeltaMeters}` : runA.variance.waveDeltaMeters}m)</span>
                </td>
                <td className="py-2.5 px-3 text-white font-bold">
                  {runB.parameters.waveHeightMeters} m <span className="text-slate-400 font-normal">({runB.variance.waveDeltaMeters > 0 ? `+${runB.variance.waveDeltaMeters}` : runB.variance.waveDeltaMeters}m)</span>
                </td>
                <td className="py-2.5 px-3 text-right font-bold">
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    waveHeightDiff > 0 ? 'bg-amber-500/20 text-amber-300' : waveHeightDiff < 0 ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {waveHeightDiff > 0 ? `+${waveHeightDiff}` : waveHeightDiff} m ({waveDeltaDiff > 0 ? `+${waveDeltaDiff}` : waveDeltaDiff}m Δ)
                  </span>
                </td>
              </tr>

              {/* SST Anomaly */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  <span>SST Thermal Front Variance</span>
                </td>
                <td className="py-2.5 px-3 text-white font-bold">
                  {runA.variance.sstVarianceCelsius > 0 ? `+${runA.variance.sstVarianceCelsius}` : runA.variance.sstVarianceCelsius}°C
                </td>
                <td className="py-2.5 px-3 text-white font-bold">
                  {runB.variance.sstVarianceCelsius > 0 ? `+${runB.variance.sstVarianceCelsius}` : runB.variance.sstVarianceCelsius}°C
                </td>
                <td className="py-2.5 px-3 text-right font-bold">
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    sstVarianceDiff > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {sstVarianceDiff > 0 ? `+${sstVarianceDiff}` : sstVarianceDiff}°C difference
                  </span>
                </td>
              </tr>

              {/* Stokes Drift Kinematics */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span>Stokes Wave Drift Velocity</span>
                </td>
                <td className="py-2.5 px-3 text-white font-bold">
                  +{runA.variance.stokesDriftVarianceMps} m/s
                </td>
                <td className="py-2.5 px-3 text-white font-bold">
                  +{runB.variance.stokesDriftVarianceMps} m/s
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-300">
                  {stokesDiff > 0 ? `+${stokesDiff}` : stokesDiff} m/s
                </td>
              </tr>

              {/* Risk Mitigation */}
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-3 text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Calculated Risk Mitigation</span>
                </td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">
                  {runA.riskReductionPct}%
                </td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">
                  {runB.riskReductionPct}%
                </td>
                <td className="py-2.5 px-3 text-right font-bold">
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    riskDiff > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {riskDiff > 0 ? `+${riskDiff}% (Run #${runA.runNumber} safer)` : `${riskDiff}% (Run #${runB.runNumber} safer)`}
                  </span>
                </td>
              </tr>

              {/* Fuel Conservation */}
              {fuelDiff !== null && (
                <tr className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 text-slate-300 flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-teal-400" />
                    <span>Estimated Fuel Savings</span>
                  </td>
                  <td className="py-2.5 px-3 text-teal-300 font-bold">
                    {runA.fuelSavingsPct}%
                  </td>
                  <td className="py-2.5 px-3 text-teal-300 font-bold">
                    {runB.fuelSavingsPct}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-teal-300">
                    {fuelDiff > 0 ? `+${fuelDiff}% in Run #${runA.runNumber}` : `${fuelDiff}% in Run #${runA.runNumber}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-cyan-500/20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onRestoreRun(runA);
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Run #{runA.runNumber} Parameters</span>
            </button>
            <button
              onClick={() => {
                onRestoreRun(runB);
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Run #{runB.runNumber} Parameters</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
