import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Ship, 
  MapPin, 
  Bot, 
  Compass, 
  Waves, 
  ShieldAlert, 
  Activity, 
  Boxes, 
  Flame, 
  ArrowRight, 
  X,
  Radio,
  RotateCcw
} from 'lucide-react';
import { aisService } from '../../services/aisService';
import { AISVessel } from '../../types/marine';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionKey: string, payload?: any) => void;
}

interface CommandItem {
  id: string;
  category: 'Vessels' | 'Navigation' | 'AI Intelligence' | 'Simulations' | 'Ocean Layers';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [vessels, setVessels] = useState<AISVessel[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVessels(aisService.getVessels());
    const unsub = aisService.subscribe(vList => setVessels(vList));
    return unsub;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Build searchable items list
  const baseItems: CommandItem[] = [
    {
      id: 'act-map',
      category: 'Navigation',
      title: 'Open Live Marine GIS Map',
      subtitle: 'Full oceanographic projection with 32,489 AIS tracks',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      action: () => onSelectAction('live-map')
    },
    {
      id: 'act-heatmap',
      category: 'Ocean Layers',
      title: 'AIS Vessel Density Heatmap Layer',
      subtitle: 'Inspect global and regional shipping lane traffic density via MapLibre GL JS',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      action: () => onSelectAction('live-map')
    },
    {
      id: 'act-chat',
      category: 'AI Intelligence',
      title: 'Consult ORCA AI Co-Pilot',
      subtitle: 'Multimodal marine reasoning with source provenance',
      icon: <Bot className="w-4 h-4 text-cyan-400" />,
      action: () => onSelectAction('ai-chat')
    },
    {
      id: 'act-sim-cyclone',
      category: 'Simulations',
      title: 'Run Bay of Bengal Cyclone Simulation',
      subtitle: 'Vortex track modeling and fleet avoidance route optimization',
      icon: <Waves className="w-4 h-4 text-emerald-400" />,
      action: () => onSelectAction('simulation', { scenarioId: 'sim-01' })
    },
    {
      id: 'act-sim-pfz',
      category: 'Simulations',
      title: 'Model Potential Fishing Zone Plankton Drift',
      subtitle: '72-hour chlorophyll boundary forecast near Paradip',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      action: () => onSelectAction('simulation', { scenarioId: 'sim-02' })
    },
    {
      id: 'act-3d-explorer',
      category: 'Navigation',
      title: 'Launch 3D Marine Explorer',
      subtitle: 'Inspect 3D Orca, Satellites, Sonar Buoys and Underwater Sensors',
      icon: <Boxes className="w-4 h-4 text-blue-400" />,
      action: () => onSelectAction('3d-explorer')
    },
    {
      id: 'act-alerts',
      category: 'Navigation',
      title: 'View High-Priority Risk Alerts',
      subtitle: '3 active geofence and overfishing notifications',
      icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
      action: () => onSelectAction('risk-alerts')
    },
    {
      id: 'act-games',
      category: 'AI Intelligence',
      title: 'Launch Marine Learning Missions & Games',
      subtitle: 'Spot the PFZ, Route the Fleet & earn XP badges',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      action: () => onSelectAction('learning-lab')
    },
    {
      id: 'act-reinit',
      category: 'Navigation',
      title: 'Re-run ORCA Initialization Sequence',
      subtitle: 'Play the cinematic subsystem connect sequence (Satellite, AIS, AI)',
      icon: <RotateCcw className="w-4 h-4 text-teal-400" />,
      action: () => onSelectAction('reinit')
    }
  ];

  // Dynamic vessel search items
  const vesselItems: CommandItem[] = vessels.map(v => ({
    id: `vessel-${v.id}`,
    category: 'Vessels',
    title: `${v.name} (${v.callsign})`,
    subtitle: `MMSI: ${v.mmsi} · ${v.type.toUpperCase()} · ${v.speed} kn · Heading ${v.heading}°`,
    icon: <Ship className="w-4 h-4 text-cyan-300" />,
    action: () => onSelectAction('select-vessel', { vessel: v })
  }));

  const allItems = [...baseItems, ...vesselItems];

  const filteredItems = query.trim()
    ? allItems.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#061226]/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cyan-500/15 bg-[#030a17]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search vessels, MMSI, regions, AI simulations, or commands..."
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-400 bg-slate-800/80 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Radio className="w-8 h-8 text-cyan-500/40 mx-auto mb-2 animate-pulse" />
              <p className="text-sm">No maritime telemetry or commands matching "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for "Ocean Explorer", "Cyclone", or "Paradip"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                      : 'hover:bg-slate-900/60 text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20' : 'bg-slate-900'}`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-[#030a17] border-t border-cyan-500/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700">↵</kbd> Select</span>
          </div>
          <span className="text-cyan-400/80">ORCA Global Maritime Index</span>
        </div>
      </div>
    </div>
  );
};
