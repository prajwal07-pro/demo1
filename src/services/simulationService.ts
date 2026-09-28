import { SimulationScenario } from '../types/marine';

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sim-01',
    title: 'Bay of Bengal Cyclone Trajectory & Fleet Avoidance',
    category: 'cyclone',
    description: 'Simulate cyclonic vortex propagation across Northern Bay of Bengal and optimize commercial fleet evasive maneuvers.',
    status: 'ready',
    parameters: {
      location: '18.5°N, 88.2°E',
      windSpeedKnots: 65,
      waveHeightMeters: 4.8,
      currentSpeedMps: 1.4,
      timeHorizonHours: 48,
      vesselType: 'Cargo & Tankers',
      severityScore: 84
    },
    metrics: {
      fuelSavingsPct: 6.2,
      etaChangeHours: +4.5,
      riskReductionPct: 78.4,
      predictedFrontLat: 20.4,
      predictedFrontLng: 87.1
    }
  },
  {
    id: 'sim-02',
    title: 'Potential Fishing Zone (PFZ) Frontal Plume Drift',
    category: 'pfz',
    description: 'Predict movement of chlorophyll-rich thermal boundaries under tidal oscillations and wind stress over 72 hours.',
    status: 'ready',
    parameters: {
      location: 'Paradip Shelf (19.8°N, 87.2°E)',
      windSpeedKnots: 18,
      waveHeightMeters: 1.8,
      currentSpeedMps: 0.65,
      timeHorizonHours: 72,
      vesselType: 'Mechanised Trawlers',
      severityScore: 35
    },
    metrics: {
      fuelSavingsPct: 14.8,
      etaChangeHours: -2.0,
      riskReductionPct: 64.0,
      predictedFrontLat: 19.5,
      predictedFrontLng: 86.8
    }
  },
  {
    id: 'sim-03',
    title: 'Maritime Search and Rescue (SAR) Leeway Drift',
    category: 'search_rescue',
    description: 'Monte Carlo leeway particle dispersion for missing 12-meter artisanal craft off Andhra coast under combined Stokes drift.',
    status: 'ready',
    parameters: {
      location: '17.2°N, 83.5°E',
      windSpeedKnots: 22,
      waveHeightMeters: 2.2,
      currentSpeedMps: 0.9,
      timeHorizonHours: 24,
      vesselType: 'Artisanal Vessel (Life Raft)',
      severityScore: 92
    },
    metrics: {
      riskReductionPct: 88.5,
      predictedFrontLat: 16.9,
      predictedFrontLng: 83.9
    }
  },
  {
    id: 'sim-04',
    title: 'Suez-Malacca Eco-Route Weather & Hydrodynamic Optimization',
    category: 'route_opt',
    description: 'Compute minimum fuel isochrone corridor balancing monsoon currents, adverse swell resistance, and CII ratings.',
    status: 'ready',
    parameters: {
      location: 'Southern Indian Ocean Transit',
      windSpeedKnots: 28,
      waveHeightMeters: 3.1,
      currentSpeedMps: 0.8,
      timeHorizonHours: 96,
      vesselType: 'Ultra Large Container Vessel (ULCV)',
      severityScore: 42
    },
    metrics: {
      fuelSavingsPct: 9.6,
      etaChangeHours: +1.2,
      riskReductionPct: 52.0
    }
  }
];

class SimulationService {
  private scenarios: SimulationScenario[] = [...SIMULATION_SCENARIOS];

  public getScenarios(): SimulationScenario[] {
    return this.scenarios;
  }

  public runSimulation(scenarioId: string, customParams?: Partial<SimulationScenario['parameters']>): SimulationScenario {
    const idx = this.scenarios.findIndex(s => s.id === scenarioId);
    if (idx === -1) return this.scenarios[0];

    const current = this.scenarios[idx];
    const updatedParams = { ...current.parameters, ...(customParams || {}) };

    // Dynamic hydrodynamic calculation based on parameters
    const windEffect = updatedParams.windSpeedKnots / 30;
    const waveEffect = updatedParams.waveHeightMeters / 2;
    const computedRisk = Math.min(99, Math.round(35 * windEffect + 25 * waveEffect));

    const updated: SimulationScenario = {
      ...current,
      status: 'completed',
      parameters: updatedParams,
      metrics: {
        ...current.metrics,
        riskReductionPct: Math.max(40, Math.min(96, Math.round(90 - computedRisk * 0.3))),
        fuelSavingsPct: Number(Math.max(3.5, 12 - (updatedParams.waveHeightMeters * 1.2)).toFixed(1))
      }
    };

    this.scenarios[idx] = updated;
    return updated;
  }
}

export const simulationService = new SimulationService();
