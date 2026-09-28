import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Bot, 
  Ship, 
  Layers, 
  ShieldAlert, 
  Activity, 
  Boxes, 
  BookOpen, 
  Users, 
  Wrench, 
  Settings, 
  Search, 
  Plus, 
  Minus, 
  Crosshair, 
  Maximize2, 
  Thermometer, 
  Droplet, 
  Waves, 
  Wind, 
  Send, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ExternalLink, 
  ChevronRight,
  Sparkles,
  Flame,
  Info,
  MapPin,
  Globe,
  Cpu
} from 'lucide-react';
import { aisService } from '../../services/aisService';
import { oceanService, ACTIVE_FISHING_ZONES } from '../../services/oceanService';
import { aiAgentService, INITIAL_CHAT_MESSAGES } from '../../services/aiAgentService';
import { AISVessel, ChatMessage, FishingZone, OceanObservation, VesselType } from '../../types/marine';
import { MarineGisMap } from '../maps/MarineGisMap';

interface OperationalDeckProps {
  onNavigateToSection: (sectionKey: string, payload?: any) => void;
  selectedVesselFromPalette?: AISVessel | null;
}

export const OperationalDeck: React.FC<OperationalDeckProps> = ({
  onNavigateToSection,
  selectedVesselFromPalette
}) => {
  // Navigation & Tabs
  const [activeSidebarTab, setActiveSidebarTab] = useState<'map' | 'chat' | 'vessels' | 'layers' | 'alerts' | 'sim' | 'explorer' | 'learn' | 'community' | 'settings'>('map');
  const [vesselFilter, setVesselFilter] = useState<'all' | VesselType>('all');
  const [mapSearch, setMapSearch] = useState('');
  
  // Real-time Data States
  const [vessels, setVessels] = useState<AISVessel[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<AISVessel | null>(null);
  const [selectedZone, setSelectedZone] = useState<FishingZone | null>(ACTIVE_FISHING_ZONES[0]);
  const [oceanData, setOceanData] = useState<OceanObservation>(oceanService.getObservation());
  
  // AI Chat States
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [activeTool, setActiveTool] = useState<'none' | 'search' | 'maps'>('none');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = aisService.subscribe(vList => {
      setVessels(vList);
      if (!selectedVessel) {
        // default select MV Ocean Explorer
        const explorer = vList.find(v => v.mmsi === '563271000') || vList[0];
        setSelectedVessel(explorer);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (selectedVesselFromPalette) {
      setSelectedVessel(selectedVesselFromPalette);
      setActiveSidebarTab('map');
    }
  }, [selectedVesselFromPalette]);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsTyping(true);

    // Multi-turn conversation history
    const history = messages.map(m => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      text: m.text
    }));

    const response = await aiAgentService.queryGemini(query, {
      history,
      model: selectedModel,
      toolType: activeTool,
      userLocation: selectedVessel 
        ? { latitude: selectedVessel.lat, longitude: selectedVessel.lng } 
        : { latitude: 19.82, longitude: 86.85 }
    });

    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  return (
    <div className="w-full bg-[#030712] py-8 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto">
        {/* Main Operational Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#040c1b] border border-cyan-500/20 rounded-3xl shadow-2xl shadow-cyan-950/40 overflow-hidden">
          
          {/* ==============================================================
              1. LEFT NAVIGATION SIDEBAR
             ============================================================== */}
          <div className="lg:col-span-2 bg-[#030914] border-r border-cyan-500/15 p-3 flex flex-col justify-between">
            <div>
              {/* Brand Lockup */}
              <div className="flex items-center gap-2.5 px-3 py-3 mb-2 border-b border-cyan-500/10">
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-white tracking-wider">ORCA</span>
                  <span className="text-[9px] font-mono text-cyan-400 block -mt-1">INTELLIGENCE</span>
                </div>
              </div>

              {/* Sidebar Navigation Items */}
              <div className="space-y-1">
                {[
                  { id: 'map', label: 'Live Map', icon: <Compass className="w-4 h-4" /> },
                  { id: 'chat', label: 'AI Chat (ORCA)', icon: <Bot className="w-4 h-4" /> },
                  { id: 'vessels', label: 'Vessel Tracking', icon: <Ship className="w-4 h-4" /> },
                  { id: 'layers', label: 'Ocean Layers', icon: <Layers className="w-4 h-4" /> },
                  { id: 'alerts', label: 'Risk & Alerts', icon: <ShieldAlert className="w-4 h-4" />, badge: '3' },
                  { id: 'sim', label: 'Simulation Lab', icon: <Activity className="w-4 h-4" /> },
                  { id: 'explorer', label: '3D Explorer', icon: <Boxes className="w-4 h-4" /> },
                  { id: 'learn', label: 'Learning Hub', icon: <BookOpen className="w-4 h-4" /> },
                  { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                ].map(item => {
                  const isActive = activeSidebarTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSidebarTab(item.id as any);
                        if (item.id === 'sim') onNavigateToSection('simulation');
                        if (item.id === 'explorer') onNavigateToSection('3d-explorer');
                        if (item.id === 'learn') onNavigateToSection('learning-lab');
                        if (item.id === 'community') onNavigateToSection('community');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-cyan-300' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="w-4 h-4 rounded-full bg-rose-500/90 text-[10px] font-bold text-white flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Profile Card at Sidebar Bottom */}
            <div className="mt-4 pt-3 border-t border-cyan-500/10 px-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  PR
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">Prajwal R.</div>
                  <div className="text-[10px] text-slate-400 font-mono">Senior Oceanographer</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* ==============================================================
              2. CENTER GIS MAP (MapLibre GL JS + Real-Time AIS Heatmap)
             ============================================================== */}
          <div className="lg:col-span-6 relative bg-[#020b18] overflow-hidden flex flex-col min-h-[520px] lg:min-h-[640px]">
            <MarineGisMap
              selectedVessel={selectedVessel}
              onSelectVessel={setSelectedVessel}
              vesselFilter={vesselFilter}
              onFilterChange={setVesselFilter}
              searchQuery={mapSearch}
              onSearchChange={setMapSearch}
              onSelectZone={setSelectedZone}
            />

            {/* Selected Vessel Floating Info Card (Bottom-Center of Map) */}
            {selectedVessel && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-20 p-3.5 rounded-2xl bg-[#030914]/95 backdrop-blur-md border border-cyan-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{selectedVessel.name}</span>
                        <span className="text-sm">{selectedVessel.flag}</span>
                      </h4>
                      <span className="text-[10px] text-cyan-400 font-mono capitalize">
                        {selectedVessel.type} Vessel · {selectedVessel.country}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {selectedVessel.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono my-2.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[9px]">MMSI</span>
                    <span className="text-white font-bold">{selectedVessel.mmsi}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">SPEED</span>
                    <span className="text-white font-bold">{selectedVessel.speed} kn</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">HEADING</span>
                    <span className="text-white font-bold">{selectedVessel.heading}°</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">DESTINATION</span>
                    <span className="text-white font-bold truncate block">{selectedVessel.destination}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">Updated {selectedVessel.lastUpdate}</span>
                  <button 
                    onClick={() => {
                      handleSendMessage(`Provide full intelligence profile and risk analysis for vessel ${selectedVessel.name} (MMSI ${selectedVessel.mmsi})`);
                    }}
                    className="px-3 py-1 text-[11px] font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Analyze Vessel</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ==============================================================
              3. RIGHT COLUMN: OCEAN CONDITIONS, AI RISK & CHAT
             ============================================================== */}
          <div className="lg:col-span-4 bg-[#030914] p-4 flex flex-col gap-3.5 overflow-y-auto max-h-[820px]">
            
            {/* A. Ocean Conditions Card (Top) */}
            <div className="p-3.5 rounded-2xl bg-[#061226]/80 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-cyan-500/10">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Ocean Conditions</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Paradip, Bay of Bengal</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-0.5">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    <span>SST</span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-bold text-white">{oceanData.sst} °C</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-0.5">
                    <Droplet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chlorophyll</span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-bold text-white">{oceanData.chlorophyll} mg/m³</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-0.5">
                    <Waves className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Wave Height</span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-bold text-white">{oceanData.waveHeight} m</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-0.5">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    <span>Wind Speed</span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-bold text-white">{oceanData.windSpeed} m/s</span>
                </div>
              </div>

              {/* Animated Hydrodynamic Eddy / Vortex visualizer */}
              <div className="mt-2.5 p-2 rounded-xl bg-slate-950/80 border border-cyan-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-full bg-cyan-950 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border border-dashed border-cyan-400 animate-spin" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-200 block">Anticyclonic Frontal Eddy</span>
                    <span className="text-[9px] font-mono text-cyan-400">Velocity: {oceanData.currentSpeed} m/s · Heading {oceanData.currentHeading}°</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Nutrient Surge</span>
              </div>
            </div>

            {/* B. AI Risk Analysis Gauge Card */}
            <div className="p-3.5 rounded-2xl bg-[#061226]/80 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">AI Risk Analysis</span>
                <span className="text-[10px] font-mono text-slate-400">Next 24 Hours</span>
              </div>

              <div className="flex items-center gap-3.5">
                {/* Radial Gauge */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-400"
                      strokeDasharray="72, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xs font-mono font-extrabold text-white">72%</span>
                  </div>
                </div>

                <div className="text-left">
                  <h5 className="text-xs font-semibold text-cyan-200">Potential Fishing Zone Activity</h5>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    High density detected near marine sanctuary boundary based on satellite SST & AIS kinematics.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => onNavigateToSection('simulation', { scenarioId: 'sim-02' })}
                className="w-full mt-3 py-1.5 text-[11px] font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* C. Chat with ORCA Co-Pilot */}
            <div className="flex-1 flex flex-col p-3.5 rounded-2xl bg-[#061226]/80 border border-cyan-500/20 min-h-[380px]">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Chat with ORCA</h4>
                    <span className="text-[9px] text-slate-400 font-mono">Gemini Multimodal Co-Pilot</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>

              {/* Gemini Model Selector & Grounding Tools Bar */}
              <div className="mb-2 space-y-1.5 pb-2 border-b border-cyan-500/10 text-[10px]">
                {/* Model Selector */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-400 font-mono text-[9px] flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    Model:
                  </span>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedModel('gemini-3.5-flash')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        selectedModel === 'gemini-3.5-flash'
                          ? 'bg-cyan-500/25 text-cyan-200 font-bold border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="gemini-3.5-flash: General marine intelligence tasks"
                    >
                      Flash 3.5
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        selectedModel === 'gemini-3.1-pro-preview'
                          ? 'bg-purple-500/25 text-purple-200 font-bold border border-purple-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="gemini-3.1-pro-preview: Particularly complex hydrodynamics & STEM tasks"
                    >
                      Pro 3.1
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        selectedModel === 'gemini-3.1-flash-lite'
                          ? 'bg-emerald-500/25 text-emerald-200 font-bold border border-emerald-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="gemini-3.1-flash-lite: Ultra-fast low-latency telemetry lookups"
                    >
                      Flash Lite
                    </button>
                  </div>
                </div>

                {/* Grounding Tools Selector */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-400 font-mono text-[9px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Grounding:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTool(prev => prev === 'search' ? 'none' : 'search')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-mono transition-all ${
                        activeTool === 'search'
                          ? 'bg-blue-500/25 text-blue-200 border-blue-400 shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                      }`}
                      title="Google Search Grounding: Live web research and latest events"
                    >
                      <Globe className="w-3 h-3 text-blue-400" />
                      <span>Google Search</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTool(prev => prev === 'maps' ? 'none' : 'maps')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-mono transition-all ${
                        activeTool === 'maps'
                          ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400 shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                      }`}
                      title="Google Maps Grounding: Real-world marine coordinates, ports, and geographic landmarks"
                    >
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>Google Maps</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[220px]">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-2.5 rounded-2xl text-xs max-w-[95%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30'
                          : 'bg-slate-900/90 text-slate-200 border border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-cyan-400">
                          {msg.sender === 'user' ? 'You' : 'ORCA Co-Pilot'}
                        </span>
                        {msg.modelUsed && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {msg.modelUsed}
                          </span>
                        )}
                      </div>

                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Grounding Sources & Citations Links */}
                      {msg.groundingSources && msg.groundingSources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-cyan-500/15 text-[10px] space-y-1">
                          <div className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                            <Sparkles className="w-3 h-3" />
                            <span>Verified Grounding Citations:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.groundingSources.map((src, idx) => (
                              <a
                                key={idx}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 hover:text-white transition-colors text-[10px] truncate max-w-full"
                              >
                                {src.type === 'maps' ? (
                                  <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <Globe className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                                )}
                                <span className="truncate">{src.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence Card if provided */}
                      {msg.evidence && (
                        <div className="mt-2 pt-2 border-t border-cyan-500/15 text-[10px] font-mono text-slate-300 space-y-1">
                          <div className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Auditable Evidence & Provenance</span>
                          </div>
                          {msg.evidence.recommendationSummary?.map((rec, i) => (
                            <div key={i} className="text-slate-300">
                              {rec}
                            </div>
                          ))}
                          <div className="text-[9px] text-slate-500 pt-1">
                            Verified Source: {msg.evidence.source}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-0.5 px-1">{msg.timestamp}</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono p-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>ORCA multi-agent consensus running ({selectedModel})...</span>
                  </div>
                )}
              </div>

              {/* Prompt Suggestion Chips */}
              <div className="my-2 flex flex-wrap gap-1">
                {[
                  'Show fishing zones near Paradip',
                  'Analyze cyclone risk for next 3 days',
                  'Explain chlorophyll maps',
                  'Find nearest deepwater port'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-500/30 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Box */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="mt-1 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-cyan-500/20"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask ORCA anything about vessels, weather, ports, or ocean physics..."
                  className="w-full bg-transparent px-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isRecording ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:text-white'
                  }`}
                  title={isRecording ? 'Stop Voice Recording' : 'Voice Input'}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 font-bold transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ==============================================================
            4. BOTTOM DECK CAROUSEL CARDS (From Reference Image)
           ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          <div
            onClick={() => onNavigateToSection('3d-explorer')}
            className="p-3.5 rounded-2xl bg-[#040e22] hover:bg-[#071738] border border-cyan-500/15 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">3D Vessel Explorer</h4>
                <p className="text-[10px] text-slate-400">Inspect realistic 3D models</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div
            onClick={() => onNavigateToSection('simulation')}
            className="p-3.5 rounded-2xl bg-[#040e22] hover:bg-[#071738] border border-cyan-500/15 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-300">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-teal-300">Ocean Simulations</h4>
                <p className="text-[10px] text-slate-400">Visualize real-world scenarios</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div
            onClick={() => onNavigateToSection('learning-lab')}
            className="p-3.5 rounded-2xl bg-[#040e22] hover:bg-[#071738] border border-cyan-500/15 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300">Marine Games</h4>
                <p className="text-[10px] text-slate-400">Quests, challenges & rewards</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div
            onClick={() => onNavigateToSection('learning-lab')}
            className="p-3.5 rounded-2xl bg-[#040e22] hover:bg-[#071738] border border-cyan-500/15 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">Learning Hub</h4>
                <p className="text-[10px] text-slate-400">Courses, tutorials & datasets</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div
            onClick={() => onNavigateToSection('community')}
            className="p-3.5 rounded-2xl bg-[#040e22] hover:bg-[#071738] border border-cyan-500/15 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300">Community</h4>
                <p className="text-[10px] text-slate-400">Join researchers worldwide</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
