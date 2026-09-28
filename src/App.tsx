import React, { useState, useEffect } from 'react';
import { OrcaInitializationScreen } from './components/loading/OrcaInitializationScreen';
import { TopNavigation } from './components/navigation/TopNavigation';
import { CommandPalette } from './components/command/CommandPalette';
import { CinematicHero } from './components/hero/CinematicHero';
import { OperationalDeck } from './components/dashboard/OperationalDeck';
import { MultiAgentArchitecture } from './components/sections/MultiAgentArchitecture';
import { SimulationLabSection } from './components/sections/SimulationLabSection';
import { Explorer3DSection } from './components/sections/Explorer3DSection';
import { LearningAndGamesSection } from './components/sections/LearningAndGamesSection';
import { CommunitySection } from './components/sections/CommunitySection';
import { Footer } from './components/sections/Footer';
import { AISVessel, SimulationScenario } from './types/marine';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedVesselForDeck, setSelectedVesselForDeck] = useState<AISVessel | null>(null);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === '/' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(tabId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCommandAction = (actionKey: string, payload?: any) => {
    if (actionKey === 'live-map') {
      setActiveTab('live-map');
      document.getElementById('operational-deck')?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionKey === 'ai-chat') {
      setActiveTab('intelligence');
      document.getElementById('operational-deck')?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionKey === 'simulation') {
      setActiveTab('simulation');
      document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionKey === '3d-explorer') {
      setActiveTab('3d-explorer');
      document.getElementById('3d-explorer')?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionKey === 'learning-lab') {
      setActiveTab('learning-lab');
      document.getElementById('learning-lab')?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionKey === 'select-vessel' && payload?.vessel) {
      setSelectedVesselForDeck(payload.vessel);
      document.getElementById('operational-deck')?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionKey === 'risk-alerts') {
      document.getElementById('operational-deck')?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionKey === 'reinit') {
      setIsInitializing(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* High-fidelity ORCA Initialization Loading Sequence */}
      {isInitializing && (
        <OrcaInitializationScreen onComplete={() => setIsInitializing(false)} />
      )}

      {/* Global Cmd+K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandAction}
      />

      {/* Strict 3-Zone Top Navigation Bar */}
      <TopNavigation
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        {/* 1. Cinematic Hero with 3D Orca & Volumetric Ocean */}
        <CinematicHero
          onExploreMap={() => handleNavigate('live-map')}
          onOpenChat={() => {
            document.getElementById('operational-deck')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectFeature={(featId) => handleNavigate(featId)}
        />

        {/* 2. Main Operational Deck: Live GIS Map, Real-Time AIS, Ocean Conditions & AI Chat */}
        <div id="operational-deck">
          <OperationalDeck
            onNavigateToSection={handleNavigate}
            selectedVesselFromPalette={selectedVesselForDeck}
          />
        </div>

        {/* 3. 10-Agent Sovereign Intelligence Mesh */}
        <div id="intelligence">
          <MultiAgentArchitecture
            onAskAgent={(agentName) => {
              document.getElementById('operational-deck')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* 4. Predictive Marine Simulation Workbench */}
        <SimulationLabSection
          initialScenarioId="sim-01"
          onOpenInMap={(scenario: SimulationScenario) => {
            document.getElementById('operational-deck')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5. 3D Technology Laboratory & Asset Inspector */}
        <Explorer3DSection />

        {/* 6. Gen-Z Learning Missions & Marine Games (Spot the PFZ / Route the Fleet) */}
        <LearningAndGamesSection />

        {/* 7. Ocean Research & Sovereign Marine Community */}
        <CommunitySection />
      </main>

      {/* 8. Scientific Footer with Real Data Citations */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
