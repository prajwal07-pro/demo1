export type VesselType = 'research' | 'fishing' | 'cargo' | 'tanker' | 'patrol' | 'custom';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AISVessel {
  id: string;
  name: string;
  mmsi: string;
  type: VesselType;
  flag: string;
  country: string;
  lat: number;
  lng: number;
  speed: number; // knots
  heading: number; // degrees
  destination: string;
  eta: string;
  draught: number; // meters
  length: number; // meters
  status: 'Underway Using Engine' | 'Moored' | 'Fishing' | 'Engaged in Survey' | 'At Anchor';
  riskLevel: RiskLevel;
  lastUpdate: string;
  track: [number, number][]; // lat, lng points
  callsign: string;
}

export interface OceanObservation {
  locationName: string;
  lat: number;
  lng: number;
  sst: number; // °C
  chlorophyll: number; // mg/m³
  waveHeight: number; // meters
  wavePeriod: number; // seconds
  windSpeed: number; // m/s
  windDirection: string; // e.g. "SW (220°)"
  salinity: number; // PSU
  currentSpeed: number; // m/s
  currentHeading: number; // degrees
  dissolvedOxygen: number; // mg/L
  timestamp: string;
  source: string;
}

export interface FishingZone {
  id: string;
  name: string;
  region: string;
  riskLevel: RiskLevel;
  confidence: number; // percentage
  targetSpecies: string[];
  sstGradient: number;
  chlorophyllDensity: number;
  vesselsCount: number;
  detectedAt: string;
  coordinates: [number, number][];
}

export interface MarineAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'analyzing' | 'streaming' | 'standby';
  confidence: number;
  lastOutput: string;
  sourceData: string;
  latencyMs: number;
  dependencies: string[];
}

export interface SimulationScenario {
  id: string;
  title: string;
  category: 'cyclone' | 'pfz' | 'search_rescue' | 'spill' | 'route_opt';
  description: string;
  status: 'ready' | 'running' | 'completed';
  parameters: {
    location: string;
    windSpeedKnots: number;
    waveHeightMeters: number;
    currentSpeedMps: number;
    timeHorizonHours: number;
    vesselType: string;
    severityScore: number;
  };
  metrics: {
    fuelSavingsPct?: number;
    etaChangeHours?: number;
    riskReductionPct?: number;
    predictedFrontLat?: number;
    predictedFrontLng?: number;
  };
}

export interface VarianceTrendPoint {
  hour: number;
  variancePct: number;
  windDeltaKnots: number;
  waveDeltaMeters: number;
}

export interface SimulationVarianceData {
  baselineWindKnots: number;
  actualWindKnots: number;
  windDeltaKnots: number;
  baselineWaveMeters: number;
  actualWaveMeters: number;
  waveDeltaMeters: number;
  sstVarianceCelsius: number;
  stokesDriftVarianceMps: number;
  chlorophyllDisplacementKm?: number;
  varianceSeverity: 'low' | 'moderate' | 'high' | 'critical';
  trendPoints: VarianceTrendPoint[];
}

export interface SimulationHistoryEntry {
  id: string;
  runNumber: number;
  timestamp: string;
  scenarioId: string;
  scenarioTitle: string;
  category: 'cyclone' | 'pfz' | 'search_rescue' | 'spill' | 'route_opt';
  outcomeSummary: string;
  riskReductionPct: number;
  fuelSavingsPct?: number;
  etaChangeHours?: number;
  parameters: {
    windSpeedKnots: number;
    waveHeightMeters: number;
    timeHorizonHours: number;
    vesselType: string;
    location: string;
  };
  variance: SimulationVarianceData;
}

export interface LearningQuest {
  id: string;
  title: string;
  category: 'satellite' | 'ais' | 'oceanography' | 'ai_models';
  xp: number;
  difficulty: 'Novice' | 'Specialist' | 'Commander';
  completed: boolean;
  durationMinutes: number;
  description: string;
  questionsCount: number;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    institution: string;
    verified: boolean;
  };
  title: string;
  body: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  timestamp: string;
  locationTag?: string;
  verifiedDataset?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'orca';
  text: string;
  timestamp: string;
  modelUsed?: string;
  toolType?: 'none' | 'search' | 'maps';
  groundingSources?: {
    type: 'web' | 'maps';
    title: string;
    uri: string;
  }[];
  evidence?: {
    sst?: string;
    chlorophyll?: string;
    vesselsNearby?: number;
    confidence?: number;
    source?: string;
    location?: string;
    recommendationSummary?: string[];
  };
  mapSnippet?: {
    centerLat: number;
    centerLng: number;
    zoneName: string;
    status: string;
  };
}
