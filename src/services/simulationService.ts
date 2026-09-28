import { SimulationScenario, SimulationHistoryEntry, VarianceTrendPoint } from '../types/marine';

function generateVarianceTrend(
  timeHorizonHours: number,
  windDelta: number,
  waveDelta: number,
  category: string
): VarianceTrendPoint[] {
  const steps = 8;
  const points: VarianceTrendPoint[] = [];
  const maxDelta = Math.max(1, Math.abs(windDelta) + Math.abs(waveDelta) * 5);

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const hour = Math.round(progress * timeHorizonHours);
    
    let curveFactor = 0;
    if (category === 'cyclone') {
      curveFactor = Math.sin(progress * Math.PI * 0.95);
    } else if (category === 'pfz') {
      curveFactor = Math.pow(progress, 0.7);
    } else if (category === 'search_rescue') {
      curveFactor = 0.2 + 0.8 * Math.sqrt(progress);
    } else {
      curveFactor = 0.4 + 0.6 * Math.sin(progress * Math.PI);
    }

    const curWindDelta = Number((windDelta * (0.2 + 0.8 * curveFactor)).toFixed(1));
    const curWaveDelta = Number((waveDelta * (0.2 + 0.8 * curveFactor)).toFixed(1));
    
    const rawVariance = ((Math.abs(curWindDelta) + Math.abs(curWaveDelta) * 5) / maxDelta) * 100;
    const variancePct = Math.min(100, Math.max(5, Math.round(rawVariance * (0.8 + 0.2 * Math.sin(i * 1.5)))));

    points.push({
      hour,
      variancePct,
      windDeltaKnots: curWindDelta,
      waveDeltaMeters: curWaveDelta
    });
  }

  return points;
}

export const INITIAL_SIMULATION_HISTORY: SimulationHistoryEntry[] = [
  {
    id: 'run-hist-03',
    runNumber: 3,
    timestamp: '18:14 UTC',
    scenarioId: 'sim-01',
    scenarioTitle: 'Bay of Bengal Cyclone Trajectory & Fleet Avoidance',
    category: 'cyclone',
    outcomeSummary: 'Optimal Evasive Corridor Converged: 10,000 Monte Carlo particles verified outside 50kt gale radius.',
    riskReductionPct: 78.4,
    fuelSavingsPct: 6.2,
    etaChangeHours: +4.5,
    parameters: {
      location: '18.5°N, 88.2°E',
      windSpeedKnots: 65,
      waveHeightMeters: 4.8,
      timeHorizonHours: 48,
      vesselType: 'Cargo & Tankers'
    },
    variance: {
      baselineWindKnots: 40,
      actualWindKnots: 65,
      windDeltaKnots: +25,
      baselineWaveMeters: 2.5,
      actualWaveMeters: 4.8,
      waveDeltaMeters: +2.3,
      sstVarianceCelsius: +1.8,
      stokesDriftVarianceMps: +0.48,
      chlorophyllDisplacementKm: 32.5,
      varianceSeverity: 'critical',
      trendPoints: [
        { hour: 0, variancePct: 18, windDeltaKnots: 5.0, waveDeltaMeters: 0.5 },
        { hour: 6, variancePct: 32, windDeltaKnots: 9.2, waveDeltaMeters: 0.9 },
        { hour: 12, variancePct: 54, windDeltaKnots: 15.6, waveDeltaMeters: 1.4 },
        { hour: 18, variancePct: 76, windDeltaKnots: 21.0, waveDeltaMeters: 1.9 },
        { hour: 24, variancePct: 92, windDeltaKnots: 24.5, waveDeltaMeters: 2.2 },
        { hour: 30, variancePct: 98, windDeltaKnots: 25.0, waveDeltaMeters: 2.3 },
        { hour: 36, variancePct: 84, windDeltaKnots: 20.8, waveDeltaMeters: 1.9 },
        { hour: 42, variancePct: 62, windDeltaKnots: 14.5, waveDeltaMeters: 1.3 },
        { hour: 48, variancePct: 45, windDeltaKnots: 10.2, waveDeltaMeters: 0.9 }
      ]
    }
  },
  {
    id: 'run-hist-02',
    runNumber: 2,
    timestamp: '17:35 UTC',
    scenarioId: 'sim-02',
    scenarioTitle: 'PFZ Frontal Plume Drift Analysis',
    category: 'pfz',
    outcomeSummary: 'Frontal Plume Tracked: Plankton boundary displaced 14.2 km along continental shelf break.',
    riskReductionPct: 64.0,
    fuelSavingsPct: 14.8,
    etaChangeHours: -2.0,
    parameters: {
      location: 'Paradip Shelf (19.8°N, 87.2°E)',
      windSpeedKnots: 18,
      waveHeightMeters: 1.8,
      timeHorizonHours: 72,
      vesselType: 'Mechanised Trawlers'
    },
    variance: {
      baselineWindKnots: 15,
      actualWindKnots: 18,
      windDeltaKnots: +3,
      baselineWaveMeters: 1.5,
      actualWaveMeters: 1.8,
      waveDeltaMeters: +0.3,
      sstVarianceCelsius: -0.8,
      stokesDriftVarianceMps: +0.12,
      chlorophyllDisplacementKm: 14.2,
      varianceSeverity: 'moderate',
      trendPoints: [
        { hour: 0, variancePct: 12, windDeltaKnots: 0.4, waveDeltaMeters: 0.05 },
        { hour: 9, variancePct: 22, windDeltaKnots: 0.8, waveDeltaMeters: 0.08 },
        { hour: 18, variancePct: 38, windDeltaKnots: 1.3, waveDeltaMeters: 0.12 },
        { hour: 27, variancePct: 49, windDeltaKnots: 1.8, waveDeltaMeters: 0.18 },
        { hour: 36, variancePct: 64, windDeltaKnots: 2.2, waveDeltaMeters: 0.22 },
        { hour: 45, variancePct: 78, windDeltaKnots: 2.7, waveDeltaMeters: 0.26 },
        { hour: 54, variancePct: 88, windDeltaKnots: 3.0, waveDeltaMeters: 0.30 },
        { hour: 63, variancePct: 85, windDeltaKnots: 2.9, waveDeltaMeters: 0.28 },
        { hour: 72, variancePct: 80, windDeltaKnots: 2.6, waveDeltaMeters: 0.25 }
      ]
    }
  },
  {
    id: 'run-hist-01',
    runNumber: 1,
    timestamp: '16:50 UTC',
    scenarioId: 'sim-03',
    scenarioTitle: 'Maritime SAR Leeway Drift Simulation',
    category: 'search_rescue',
    outcomeSummary: 'Search Datum Constrained: 95% probability of containment area reduced to 18.5 sq nm.',
    riskReductionPct: 88.5,
    fuelSavingsPct: 4.2,
    etaChangeHours: 0,
    parameters: {
      location: '17.2°N, 83.5°E',
      windSpeedKnots: 22,
      waveHeightMeters: 2.2,
      timeHorizonHours: 24,
      vesselType: 'Artisanal Vessel (Life Raft)'
    },
    variance: {
      baselineWindKnots: 20,
      actualWindKnots: 22,
      windDeltaKnots: +2,
      baselineWaveMeters: 2.0,
      actualWaveMeters: 2.2,
      waveDeltaMeters: +0.2,
      sstVarianceCelsius: +0.2,
      stokesDriftVarianceMps: +0.21,
      chlorophyllDisplacementKm: 6.8,
      varianceSeverity: 'low',
      trendPoints: [
        { hour: 0, variancePct: 15, windDeltaKnots: 0.5, waveDeltaMeters: 0.05 },
        { hour: 3, variancePct: 28, windDeltaKnots: 0.9, waveDeltaMeters: 0.09 },
        { hour: 6, variancePct: 42, windDeltaKnots: 1.2, waveDeltaMeters: 0.12 },
        { hour: 9, variancePct: 56, windDeltaKnots: 1.5, waveDeltaMeters: 0.15 },
        { hour: 12, variancePct: 68, windDeltaKnots: 1.8, waveDeltaMeters: 0.18 },
        { hour: 15, variancePct: 79, windDeltaKnots: 2.0, waveDeltaMeters: 0.20 },
        { hour: 18, variancePct: 84, windDeltaKnots: 2.0, waveDeltaMeters: 0.20 },
        { hour: 21, variancePct: 82, windDeltaKnots: 1.9, waveDeltaMeters: 0.19 },
        { hour: 24, variancePct: 76, windDeltaKnots: 1.7, waveDeltaMeters: 0.17 }
      ]
    }
  }
];

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
  private history: SimulationHistoryEntry[] = [...INITIAL_SIMULATION_HISTORY];
  private nextRunNumber: number = 4;

  public getScenarios(): SimulationScenario[] {
    return this.scenarios;
  }

  public getHistory(): SimulationHistoryEntry[] {
    return this.history;
  }

  public clearHistory(): void {
    this.history = [];
  }

  public runSimulation(
    scenarioId: string, 
    customParams?: Partial<SimulationScenario['parameters']>
  ): { updatedScenario: SimulationScenario; historyEntry: SimulationHistoryEntry } {
    const idx = this.scenarios.findIndex(s => s.id === scenarioId);
    const current = idx !== -1 ? this.scenarios[idx] : this.scenarios[0];
    const updatedParams = { ...current.parameters, ...(customParams || {}) };

    // Baseline reference values from the default scenario template
    const baseline = SIMULATION_SCENARIOS.find(s => s.id === scenarioId) || current;
    const baseWind = baseline.parameters.windSpeedKnots;
    const baseWave = baseline.parameters.waveHeightMeters;

    // Dynamic hydrodynamic calculation based on parameters
    const windEffect = updatedParams.windSpeedKnots / 30;
    const waveEffect = updatedParams.waveHeightMeters / 2;
    const computedRisk = Math.min(99, Math.round(35 * windEffect + 25 * waveEffect));

    const riskReductionPct = Math.max(40, Math.min(96, Math.round(90 - computedRisk * 0.3)));
    const fuelSavingsPct = Number(Math.max(3.5, 12 - (updatedParams.waveHeightMeters * 1.2)).toFixed(1));
    const etaChangeHours = Number((updatedParams.windSpeedKnots > 45 ? 4.5 : updatedParams.windSpeedKnots > 25 ? 1.5 : -1.0).toFixed(1));

    const updated: SimulationScenario = {
      ...current,
      status: 'completed',
      parameters: updatedParams,
      metrics: {
        ...current.metrics,
        riskReductionPct,
        fuelSavingsPct,
        etaChangeHours
      }
    };

    if (idx !== -1) {
      this.scenarios[idx] = updated;
    }

    // Calculate oceanographic variance
    const windDelta = updatedParams.windSpeedKnots - baseWind;
    const waveDelta = Number((updatedParams.waveHeightMeters - baseWave).toFixed(1));
    const sstVariance = Number(((updatedParams.windSpeedKnots / 35) * 0.8 + (waveDelta > 0 ? 0.6 : -0.4)).toFixed(1));
    const stokesDrift = Number((0.016 * updatedParams.windSpeedKnots + 0.05 * updatedParams.waveHeightMeters).toFixed(2));
    const displacement = Number((updatedParams.currentSpeedMps * updatedParams.timeHorizonHours * 3.6 / 10).toFixed(1));

    let varianceSeverity: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (Math.abs(windDelta) > 20 || waveDelta > 2.0) {
      varianceSeverity = 'critical';
    } else if (Math.abs(windDelta) > 10 || waveDelta > 1.0) {
      varianceSeverity = 'high';
    } else if (Math.abs(windDelta) > 4 || waveDelta > 0.4) {
      varianceSeverity = 'moderate';
    }

    const now = new Date();
    const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;

    let outcomeSummary = `Optimal Evasive Path Converged: Risk mitigation calculated at ${riskReductionPct}% under ${updatedParams.windSpeedKnots} kn winds.`;
    if (current.category === 'pfz') {
      outcomeSummary = `Frontal Plume Dispersion Simulated: Boundary shift ${displacement} km with ${sstVariance > 0 ? '+' : ''}${sstVariance}°C SST delta.`;
    } else if (current.category === 'search_rescue') {
      outcomeSummary = `Monte Carlo SAR Leeway Modeled: Search datum localized with Stokes drift ${stokesDrift} m/s.`;
    } else if (current.category === 'route_opt') {
      outcomeSummary = `Isochrone Weather Corridor Optimized: ${fuelSavingsPct}% fuel conservation with ${etaChangeHours > 0 ? `+${etaChangeHours}` : etaChangeHours}h transit adjustment.`;
    }

    const historyEntry: SimulationHistoryEntry = {
      id: `run-hist-${Date.now()}`,
      runNumber: this.nextRunNumber++,
      timestamp: timeStr,
      scenarioId: current.id,
      scenarioTitle: current.title,
      category: current.category,
      outcomeSummary,
      riskReductionPct,
      fuelSavingsPct,
      etaChangeHours,
      parameters: {
        windSpeedKnots: updatedParams.windSpeedKnots,
        waveHeightMeters: updatedParams.waveHeightMeters,
        timeHorizonHours: updatedParams.timeHorizonHours,
        vesselType: updatedParams.vesselType,
        location: updatedParams.location
      },
      variance: {
        baselineWindKnots: baseWind,
        actualWindKnots: updatedParams.windSpeedKnots,
        windDeltaKnots: windDelta,
        baselineWaveMeters: baseWave,
        actualWaveMeters: updatedParams.waveHeightMeters,
        waveDeltaMeters: waveDelta,
        sstVarianceCelsius: sstVariance,
        stokesDriftVarianceMps: stokesDrift,
        chlorophyllDisplacementKm: displacement,
        varianceSeverity,
        trendPoints: generateVarianceTrend(updatedParams.timeHorizonHours, windDelta, waveDelta, current.category)
      }
    };

    this.history.unshift(historyEntry);

    return { updatedScenario: updated, historyEntry };
  }
}

export const simulationService = new SimulationService();
