import React, { useState } from 'react';
import { 
  Bot, 
  Satellite, 
  Waves, 
  Ship, 
  CloudSun, 
  Compass, 
  ShieldAlert, 
  LifeBuoy, 
  Route, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Database
} from 'lucide-react';
import { ORCA_AGENTS } from '../../services/aiAgentService';
import { MarineAgent } from '../../types/marine';

interface MultiAgentArchitectureProps {
  onAskAgent: (agentName: string) => void;
}

export const MultiAgentArchitecture: React.FC<MultiAgentArchitectureProps> = ({
  onAskAgent
}) => {
  const [selectedAgent, setSelectedAgent] = useState<MarineAgent>(ORCA_AGENTS[0]);

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'agent-sat': return <Satellite className="w-5 h-5 text-cyan-400" />;
      case 'agent-ocean': return <Waves className="w-5 h-5 text-teal-400" />;
      case 'agent-ais': return <Ship className="w-5 h-5 text-blue-400" />;
      case 'agent-weather': return <CloudSun className="w-5 h-5 text-amber-400" />;
      case 'agent-pfz': return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'agent-risk': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'agent-safety': return <LifeBuoy className="w-5 h-5 text-orange-400" />;
      case 'agent-route': return <Route className="w-5 h-5 text-sky-400" />;
      case 'agent-rec': return <Layers className="w-5 h-5 text-indigo-400" />;
      default: return <Bot className="w-5 h-5 text-cyan-300" />;
    }
  };

  return (
    <section id="intelligence" className="w-full bg-[#030712] py-16 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Sovereign Mesh</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              10 Specialized AI Agents. One Unified Mind.
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Unlike generic LLMs, ORCA orchestrates ten dedicated domain-native intelligence agents—each continuously ingesting raw satellite telemetry, hydrodynamic equations, and AIS kinematics.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">Global Consensus Active (10/10 Online)</span>
          </div>
        </div>

        {/* Interactive Grid & Selected Agent Drill-down */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Agent Nodes Grid (Left 7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ORCA_AGENTS.map(agent => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400/50 shadow-lg shadow-cyan-950/40'
                      : 'bg-[#040e22]/80 hover:bg-[#061533] border-cyan-500/15'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-500/20' : 'bg-slate-900'}`}>
                        {getAgentIcon(agent.id)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                        <span className="text-[10px] text-cyan-400 font-mono block">{agent.role}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {agent.confidence}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-2 leading-relaxed font-sans">
                    {agent.lastOutput}
                  </p>

                  <div className="mt-3 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Latency: {agent.latencyMs}ms</span>
                    <span className="capitalize text-cyan-300">{agent.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Agent Detailed Telemetry & Evidence Inspector (Right 5 Cols) */}
          <div className="lg:col-span-5 p-5 rounded-3xl bg-[#040f24] border border-cyan-400/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/30">
                  {getAgentIcon(selectedAgent.id)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedAgent.name}</h3>
                  <span className="text-[11px] text-cyan-400 font-mono">{selectedAgent.role}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {selectedAgent.confidence}% Confidence
              </span>
            </div>

            {/* Input Data Stream */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-cyan-400" />
                  Telemetry Data Ingestion Pipeline
                </span>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                  {selectedAgent.sourceData}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Live Synthesized Inference Output
                </span>
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/25 text-xs text-cyan-100 leading-relaxed font-sans">
                  "{selectedAgent.lastOutput}"
                </div>
              </div>

              {/* Agent Consensus Connections */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Consensus Dependencies in Mesh
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.dependencies.length > 0 ? (
                    selectedAgent.dependencies.map((dep, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-[11px] font-mono text-cyan-300 border border-cyan-500/20"
                      >
                        → {dep}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Autonomous Root Node (Multi-Channel Dispatch)</span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onAskAgent(selectedAgent.name)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-semibold text-xs hover:from-cyan-300 hover:to-teal-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>Query {selectedAgent.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
