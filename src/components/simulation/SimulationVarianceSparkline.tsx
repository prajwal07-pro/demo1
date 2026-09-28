import React, { useState } from 'react';
import { TrendingUp, Activity, Zap } from 'lucide-react';
import { VarianceTrendPoint } from '../../types/marine';

interface SimulationVarianceSparklineProps {
  trendPoints: VarianceTrendPoint[];
  severity: 'low' | 'moderate' | 'high' | 'critical';
  durationHours: number;
  runNumber: number;
}

export const SimulationVarianceSparkline: React.FC<SimulationVarianceSparklineProps> = ({
  trendPoints,
  severity,
  durationHours,
  runNumber
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!trendPoints || trendPoints.length === 0) return null;

  // Color schemes based on severity
  const colorMap = {
    critical: {
      stroke: '#f43f5e', // rose-500
      glow: 'rgba(244, 63, 94, 0.45)',
      fillTop: 'rgba(244, 63, 94, 0.35)',
      fillBottom: 'rgba(244, 63, 94, 0.02)',
      text: 'text-rose-400',
      badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300'
    },
    high: {
      stroke: '#f59e0b', // amber-500
      glow: 'rgba(245, 158, 11, 0.45)',
      fillTop: 'rgba(245, 158, 11, 0.35)',
      fillBottom: 'rgba(245, 158, 11, 0.02)',
      text: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300'
    },
    moderate: {
      stroke: '#14b8a6', // teal-500
      glow: 'rgba(20, 184, 166, 0.45)',
      fillTop: 'rgba(20, 184, 166, 0.35)',
      fillBottom: 'rgba(20, 184, 166, 0.02)',
      text: 'text-teal-400',
      badgeBg: 'bg-teal-500/15 border-teal-500/30 text-teal-300'
    },
    low: {
      stroke: '#06b6d4', // cyan-500
      glow: 'rgba(6, 182, 212, 0.45)',
      fillTop: 'rgba(6, 182, 212, 0.35)',
      fillBottom: 'rgba(6, 182, 212, 0.02)',
      text: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
    }
  };

  const colors = colorMap[severity] || colorMap.low;

  // Chart coordinates
  const svgWidth = 320;
  const svgHeight = 52;
  const padX = 10;
  const padTop = 8;
  const padBottom = 10;
  const plotWidth = svgWidth - 2 * padX;
  const plotHeight = svgHeight - padTop - padBottom;

  // Compute (x, y) coordinates for each trend point
  const coords = trendPoints.map((pt, i) => {
    const x = padX + (i / (trendPoints.length - 1)) * plotWidth;
    // Normalized 0 to 100 with bounds
    const clampedPct = Math.max(0, Math.min(100, pt.variancePct));
    const y = padTop + plotHeight - (clampedPct / 100) * plotHeight;
    return { x, y, pt };
  });

  // Build smooth cubic bezier SVG path
  let pathD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const cpX1 = curr.x + (next.x - curr.x) / 2;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (next.x - curr.x) / 2;
    const cpY2 = next.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  // Area path for gradient fill
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgHeight - padBottom} L ${coords[0].x} ${svgHeight - padBottom} Z`;

  // Find peak variance point
  let peakIndex = 0;
  for (let i = 1; i < trendPoints.length; i++) {
    if (trendPoints[i].variancePct > trendPoints[peakIndex].variancePct) {
      peakIndex = i;
    }
  }
  const peakCoord = coords[peakIndex];
  const activeCoord = hoveredIndex !== null ? coords[hoveredIndex] : null;

  const gradId = `spark-grad-${runNumber}-${severity}`;

  return (
    <div className="p-3 rounded-xl bg-[#020713]/90 border border-cyan-500/15 mb-3 flex flex-col">
      {/* Sparkline Top Header */}
      <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
        <div className="flex items-center gap-1.5 text-slate-300">
          <TrendingUp className={`w-3.5 h-3.5 ${colors.text}`} />
          <span className="font-bold">Variance Profile</span>
          <span className="text-[10px] text-slate-400">
            (T+0h → T+{durationHours}h)
          </span>
        </div>

        {/* Dynamic Hover HUD or Peak Label */}
        {activeCoord ? (
          <div className="flex items-center gap-2 text-[10px] text-cyan-200 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 animate-in fade-in duration-150">
            <span className="font-bold text-white">T+{activeCoord.pt.hour}h</span>
            <span>Index: <strong className={colors.text}>{activeCoord.pt.variancePct}%</strong></span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">
              Wind: {activeCoord.pt.windDeltaKnots > 0 ? `+${activeCoord.pt.windDeltaKnots}` : activeCoord.pt.windDeltaKnots}kn
            </span>
            <span className="hidden sm:inline">
              Wave: {activeCoord.pt.waveDeltaMeters > 0 ? `+${activeCoord.pt.waveDeltaMeters}` : activeCoord.pt.waveDeltaMeters}m
            </span>
          </div>
        ) : (
          <div className={`px-2 py-0.5 rounded text-[10px] font-mono border ${colors.badgeBg} flex items-center gap-1`}>
            <Zap className="w-2.5 h-2.5" />
            <span>Peak: <strong>{peakCoord.pt.variancePct}%</strong> at T+{peakCoord.pt.hour}h</span>
          </div>
        )}
      </div>

      {/* SVG Canvas Area */}
      <div 
        className="relative w-full h-[52px] cursor-crosshair group"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.38} />
              <stop offset="70%" stopColor={colors.stroke} stopOpacity={0.08} />
              <stop offset="100%" stopColor={colors.stroke} stopOpacity={0.0} />
            </linearGradient>
            <filter id={`glow-${runNumber}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={colors.stroke} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Reference Grid Baselines */}
          <line
            x1={padX}
            y1={padTop + plotHeight * 0.25}
            x2={svgWidth - padX}
            y2={padTop + plotHeight * 0.25}
            stroke="#1e293b"
            strokeDasharray="2,3"
            strokeWidth="0.8"
          />
          <line
            x1={padX}
            y1={padTop + plotHeight * 0.75}
            x2={svgWidth - padX}
            y2={padTop + plotHeight * 0.75}
            stroke="#1e293b"
            strokeDasharray="2,3"
            strokeWidth="0.8"
          />

          {/* Area Fill Gradient Underneath Trendline */}
          <path d={areaD} fill={`url(#${gradId})`} />

          {/* Sparkline Curve */}
          <path
            d={pathD}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${runNumber})`}
          />

          {/* Peak Indicator Marker */}
          <circle
            cx={peakCoord.x}
            cy={peakCoord.y}
            r="5"
            fill={colors.stroke}
            fillOpacity="0.25"
            className="animate-ping origin-center"
          />
          <circle
            cx={peakCoord.x}
            cy={peakCoord.y}
            r="3.5"
            fill="#ffffff"
            stroke={colors.stroke}
            strokeWidth="2"
          />

          {/* Interactive Hover Crosshair & Dot */}
          {activeCoord && (
            <g>
              <line
                x1={activeCoord.x}
                y1={padTop}
                x2={activeCoord.x}
                y2={svgHeight - padBottom}
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="4.5"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Invisible Overlay Hover Catchers */}
          {coords.map((c, i) => (
            <rect
              key={i}
              x={i === 0 ? 0 : c.x - plotWidth / (coords.length * 2)}
              y={0}
              width={plotWidth / (coords.length - 1)}
              height={svgHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          ))}
        </svg>
      </div>

      {/* Timeline Axis Footer */}
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1 px-1">
        <span>T+0h (Departure / Origin)</span>
        <span className="text-slate-600">T+{Math.round(durationHours / 2)}h</span>
        <span>T+{durationHours}h (Horizon)</span>
      </div>
    </div>
  );
};
