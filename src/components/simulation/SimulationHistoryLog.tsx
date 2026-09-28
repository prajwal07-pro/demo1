import React, { useState } from 'react';
import { 
  History, 
  Wind, 
  Waves, 
  Thermometer, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Fuel, 
  Clock, 
  RotateCcw, 
  Filter, 
  Search, 
  Trash2, 
  Compass, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowLeftRight,
  Layers,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { SimulationHistoryEntry } from '../../types/marine';
import { SimulationVarianceSparkline } from './SimulationVarianceSparkline';
import { SimulationCompareModal } from './SimulationCompareModal';

interface SimulationHistoryLogProps {
  history: SimulationHistoryEntry[];
  onSelectRun: (entry: SimulationHistoryEntry) => void;
  onClearHistory: () => void;
  selectedRunId?: string;
}

export const SimulationHistoryLog: React.FC<SimulationHistoryLogProps> = ({
  history,
  onSelectRun,
  onClearHistory,
  selectedRunId
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length < 2) {
        return [...prev, id];
      }
      return [prev[1], id];
    });
  };

  const exportRunCSV = (item: SimulationHistoryEntry) => {
    const sanitize = (val: string | number | undefined) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows: string[] = [];

    // Run Metadata Section
    rows.push('--- RUN METADATA ---');
    rows.push('Parameter,Value');
    rows.push(`Run Number,${sanitize(item.runNumber)}`);
    rows.push(`Run ID,${sanitize(item.id)}`);
    rows.push(`Timestamp (UTC),${sanitize(item.timestamp)}`);
    rows.push(`Scenario Title,${sanitize(item.scenarioTitle)}`);
    rows.push(`Scenario Category,${sanitize(item.category)}`);
    rows.push(`Geographic Target,${sanitize(item.parameters.location)}`);
    rows.push(`Asset Class / Vessel Type,${sanitize(item.parameters.vesselType)}`);
    rows.push(`Forecast Horizon (Hours),${sanitize(item.parameters.timeHorizonHours)}`);
    rows.push(`Risk Reduction Percentage (%),${sanitize(item.riskReductionPct)}`);
    rows.push(`Fuel Savings Percentage (%),${sanitize(item.fuelSavingsPct ?? 'N/A')}`);
    rows.push(`ETA Adjustment (Hours),${sanitize(item.etaChangeHours ?? 0)}`);
    rows.push(`Outcome Statement,${sanitize(item.outcomeSummary)}`);
    rows.push('');

    // Oceanographic Variance Metrics Section
    rows.push('--- OCEANOGRAPHIC VARIANCE DATA ---');
    rows.push('Oceanographic Metric,Baseline,Actual / Result,Delta Anomaly,Unit');
    rows.push(`Wind Velocity,${item.variance.baselineWindKnots},${item.variance.actualWindKnots},${item.variance.windDeltaKnots > 0 ? `+${item.variance.windDeltaKnots}` : item.variance.windDeltaKnots},knots`);
    rows.push(`Significant Wave Height (SWH),${item.variance.baselineWaveMeters},${item.variance.actualWaveMeters},${item.variance.waveDeltaMeters > 0 ? `+${item.variance.waveDeltaMeters}` : item.variance.waveDeltaMeters},meters`);
    rows.push(`SST Thermal Front Anomaly,0.0,${item.variance.sstVarianceCelsius > 0 ? `+${item.variance.sstVarianceCelsius}` : item.variance.sstVarianceCelsius},${item.variance.sstVarianceCelsius > 0 ? `+${item.variance.sstVarianceCelsius}` : item.variance.sstVarianceCelsius},celsius`);
    rows.push(`Stokes Drift Kinematics,0.0,${item.variance.stokesDriftVarianceMps},+${item.variance.stokesDriftVarianceMps},m/s`);
    if (item.variance.chlorophyllDisplacementKm !== undefined) {
      rows.push(`Chlorophyll Plume / SAR Leeway Displacement,0.0,${item.variance.chlorophyllDisplacementKm},+${item.variance.chlorophyllDisplacementKm},km`);
    }
    rows.push(`Variance Severity Assessment,"","",${sanitize(item.variance.varianceSeverity)},level`);
    rows.push('');

    // Time-Series Variance Trend Points Section
    if (item.variance.trendPoints && item.variance.trendPoints.length > 0) {
      rows.push('--- TIME-SERIES DURATION VARIANCE PROFILE ---');
      rows.push('Timeline Step (Hour),Variance Index (%),Instantaneous Wind Delta (knots),Instantaneous Wave Delta (meters)');
      item.variance.trendPoints.forEach(pt => {
        rows.push(`T+${pt.hour}h,${pt.variancePct}%,${pt.windDeltaKnots > 0 ? `+${pt.windDeltaKnots}` : pt.windDeltaKnots},${pt.waveDeltaMeters > 0 ? `+${pt.waveDeltaMeters}` : pt.waveDeltaMeters}`);
      });
    }

    const csvContent = rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const cleanTitle = item.scenarioTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30);
    link.setAttribute('download', `orca_run_${String(item.runNumber).padStart(2, '0')}_${cleanTitle}_variance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const runA = history.find(h => h.id === selectedForCompare[0]);
  const runB = history.find(h => h.id === selectedForCompare[1]);

  const filteredHistory = history.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.scenarioTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.outcomeSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSeverityBadge = (severity: 'low' | 'moderate' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
            Critical Variance
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            High Variance
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
            Moderate
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            Nominal Drift
          </span>
        );
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#040e22] border border-cyan-500/20 shadow-2xl p-5 sm:p-6 flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">Simulation History & Variance Log</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {history.length} Runs Logged
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditable records of past hydrodynamic runs with Stokes wave drift, SST shifts, and parameter variance.
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#020713] border border-cyan-500/20 text-xs w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search past runs..."
              className="bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none w-full"
            />
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors"
              title="Clear Simulation History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Runs' },
          { id: 'cyclone', label: 'Cyclone Avoidance' },
          { id: 'pfz', label: 'PFZ Plume Drift' },
          { id: 'search_rescue', label: 'SAR Leeway' },
          { id: 'route_opt', label: 'Eco-Routes' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterCategory === cat.id
                ? 'bg-teal-500/25 text-teal-200 border border-teal-500/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Side-by-Side Comparison Selection Tray */}
      {selectedForCompare.length > 0 && (
        <div className="mb-4 p-3 rounded-2xl bg-[#04132b] border-2 border-cyan-400/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Variance Comparison Tray</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {selectedForCompare.length}/2 Selected
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                {selectedForCompare.length === 1 ? (
                  <span>Selected <strong className="text-cyan-300">Run #{runA?.runNumber}</strong>. Toggle another run below to compare variance divergence.</span>
                ) : (
                  <span>Ready to compare: <strong className="text-cyan-300">Run #{runA?.runNumber}</strong> vs <strong className="text-amber-300">Run #{runB?.runNumber}</strong></span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedForCompare([])}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-mono transition-colors"
            >
              Clear
            </button>

            <button
              disabled={selectedForCompare.length < 2}
              onClick={() => setIsCompareModalOpen(true)}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                selectedForCompare.length === 2
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-black hover:opacity-90 shadow-lg shadow-cyan-500/30 cursor-pointer animate-pulse'
                  : 'bg-slate-800/80 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Compare Variances Side-by-Side</span>
            </button>
          </div>
        </div>
      )}

      {/* Scrollable History List */}
      <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#020713]/60 border border-dashed border-slate-800 text-slate-400 text-xs">
            <History className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p>No past simulation runs match your criteria.</p>
            <p className="text-slate-500 mt-1">Execute a simulation in the workbench above to log new hydrodynamic variance data.</p>
          </div>
        ) : (
          filteredHistory.map(item => {
            const isSelected = selectedRunId === item.id;
            const isExpanded = expandedId === item.id;
            const isCandidateA = selectedForCompare[0] === item.id;
            const isCandidateB = selectedForCompare[1] === item.id;
            const isCompared = isCandidateA || isCandidateB;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl transition-all border ${
                  isCandidateA
                    ? 'bg-[#06152d] border-2 border-cyan-400 shadow-lg shadow-cyan-950/60'
                    : isCandidateB
                    ? 'bg-[#1a1205] border-2 border-amber-400 shadow-lg shadow-amber-950/60'
                    : isSelected 
                    ? 'bg-[#081b38] border-cyan-400/60 shadow-lg shadow-cyan-950/50' 
                    : 'bg-[#020b1a]/90 hover:bg-[#041126] border-cyan-500/15'
                }`}
              >
                {/* Run Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${
                      isCandidateA 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' 
                        : isCandidateB
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                        : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30'
                    }`}>
                      RUN #{String(item.runNumber).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.timestamp}
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide truncate max-w-[240px] sm:max-w-none">
                      {item.scenarioTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getSeverityBadge(item.variance.varianceSeverity)}

                    {/* Toggle Compare Button */}
                    <button
                      type="button"
                      onClick={() => toggleCompare(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                        isCandidateA
                          ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 shadow-sm shadow-cyan-500/30 ring-1 ring-cyan-400'
                          : isCandidateB
                          ? 'bg-amber-500/25 text-amber-200 border-amber-400 shadow-sm shadow-amber-500/30 ring-1 ring-amber-400'
                          : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-700 hover:border-cyan-500/40'
                      }`}
                      title={
                        isCandidateA 
                          ? 'Candidate A selected for comparison (click to deselect)' 
                          : isCandidateB 
                          ? 'Candidate B selected for comparison (click to deselect)' 
                          : 'Select this run for side-by-side variance comparison'
                      }
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>{isCandidateA ? 'Candidate A' : isCandidateB ? 'Candidate B' : 'Compare'}</span>
                    </button>

                    {/* Export CSV Button */}
                    <button
                      type="button"
                      onClick={() => exportRunCSV(item)}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 hover:border-sky-400 text-sky-200 text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-sm"
                      title={`Export raw oceanographic variance data for Run #${item.runNumber} as CSV`}
                    >
                      <Download className="w-3 h-3 text-sky-400" />
                      <span>Export CSV</span>
                    </button>

                    {/* Restore Button */}
                    <button
                      onClick={() => onSelectRun(item)}
                      className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs font-bold transition-colors flex items-center gap-1"
                      title="Load this run's parameters into Workbench"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                </div>

                {/* Outcome Statement */}
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {item.outcomeSummary}
                </p>

                {/* Oceanographic Variance Highlight HUD (The Core Variance Data Requested) */}
                <div className="p-2.5 rounded-xl bg-[#020612] border border-cyan-500/10 grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs font-mono">
                  {/* Wind Variance */}
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3 text-sky-400" />
                        Wind Δ
                      </span>
                      <span>Base: {item.variance.baselineWindKnots}kn</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-white font-bold">{item.variance.actualWindKnots} kn</span>
                      <span className={`text-[10px] font-bold ${
                        item.variance.windDeltaKnots > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {item.variance.windDeltaKnots > 0 ? `+${item.variance.windDeltaKnots}` : item.variance.windDeltaKnots} kn
                      </span>
                    </div>
                  </div>

                  {/* Wave Height Variance */}
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                      <span className="flex items-center gap-1">
                        <Waves className="w-3 h-3 text-teal-400" />
                        Wave Δ
                      </span>
                      <span>Base: {item.variance.baselineWaveMeters}m</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-white font-bold">{item.variance.actualWaveMeters} m</span>
                      <span className={`text-[10px] font-bold ${
                        item.variance.waveDeltaMeters > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {item.variance.waveDeltaMeters > 0 ? `+${item.variance.waveDeltaMeters}` : item.variance.waveDeltaMeters} m
                      </span>
                    </div>
                  </div>

                  {/* SST Variance */}
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-rose-400" />
                        SST Shift
                      </span>
                      <span className="text-[9px] text-slate-500">Thermal front</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-bold ${
                        item.variance.sstVarianceCelsius > 0 ? 'text-rose-400' : 'text-cyan-300'
                      }`}>
                        {item.variance.sstVarianceCelsius > 0 ? `+${item.variance.sstVarianceCelsius}` : item.variance.sstVarianceCelsius}°C
                      </span>
                      <span className="text-[10px] text-slate-400">front anomaly</span>
                    </div>
                  </div>

                  {/* Stokes Drift Variance / Plume Displacement */}
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-purple-400" />
                        Stokes Drift
                      </span>
                      <span className="text-[9px] text-slate-500">Kinematics</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-white font-bold">+{item.variance.stokesDriftVarianceMps} m/s</span>
                      {item.variance.chlorophyllDisplacementKm && (
                        <span className="text-[10px] text-teal-400">
                          ({item.variance.chlorophyllDisplacementKm} km)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mini Sparkline Chart Visualizing Variance Trends Across Run Duration */}
                {item.variance.trendPoints && item.variance.trendPoints.length > 0 && (
                  <SimulationVarianceSparkline
                    trendPoints={item.variance.trendPoints}
                    severity={item.variance.varianceSeverity}
                    durationHours={item.parameters.timeHorizonHours}
                    runNumber={item.runNumber}
                  />
                )}

                {/* Bottom Metric Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Risk Reduction: <strong>{item.riskReductionPct}%</strong>
                    </span>

                    {item.fuelSavingsPct && (
                      <span className="inline-flex items-center gap-1 text-teal-300 font-mono text-[11px]">
                        <Fuel className="w-3.5 h-3.5" />
                        Fuel Saved: <strong>{item.fuelSavingsPct}%</strong>
                      </span>
                    )}

                    {item.etaChangeHours !== undefined && (
                      <span className="inline-flex items-center gap-1 text-sky-300 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        ETA: <strong>{item.etaChangeHours > 0 ? `+${item.etaChangeHours}h` : item.etaChangeHours === 0 ? 'Nominal' : `${item.etaChangeHours}h`}</strong>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
                  >
                    <span>{isExpanded ? 'Hide Parameters' : 'View Parameters'}</span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Expanded Technical Parameters */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-cyan-500/10 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Forecast Horizon:</span>
                      <span className="text-white font-bold">{item.parameters.timeHorizonHours} Hours</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Target Asset Class:</span>
                      <span className="text-white font-bold">{item.parameters.vesselType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Geographic Locus:</span>
                      <span className="text-white font-bold">{item.parameters.location}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Side-by-Side Variance Comparison Modal */}
      {runA && runB && (
        <SimulationCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          runA={runA}
          runB={runB}
          onRestoreRun={onSelectRun}
        />
      )}
    </div>
  );
};
