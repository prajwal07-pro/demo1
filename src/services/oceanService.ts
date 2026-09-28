import { OceanObservation, FishingZone } from '../types/marine';

export const CURRENT_OCEAN_CONDITIONS: OceanObservation = {
  locationName: 'Paradip, Bay of Bengal, India',
  lat: 20.26,
  lng: 86.67,
  sst: 29.4,
  chlorophyll: 0.32,
  waveHeight: 1.8,
  wavePeriod: 7.2,
  windSpeed: 12.4, // m/s
  windDirection: 'SW (220°)',
  salinity: 32.8,
  currentSpeed: 0.65,
  currentHeading: 58,
  dissolvedOxygen: 5.4,
  timestamp: 'Live UTC (Copernicus + INCOIS)',
  source: 'Sentinel-3 SLSTR / MODIS-Aqua / INCOIS OCM-3'
};

export const GLOBAL_OCEAN_REGIONS: Record<string, OceanObservation> = {
  paradip: CURRENT_OCEAN_CONDITIONS,
  mumbai: {
    locationName: 'Mumbai Offshore, Arabian Sea',
    lat: 18.92,
    lng: 72.83,
    sst: 28.7,
    chlorophyll: 0.45,
    waveHeight: 2.1,
    wavePeriod: 8.0,
    windSpeed: 14.1,
    windDirection: 'WNW (295°)',
    salinity: 35.5,
    currentSpeed: 0.82,
    currentHeading: 165,
    dissolvedOxygen: 4.9,
    timestamp: 'Live UTC (INSAT-3DR + ASCAT)',
    source: 'ASCAT Scatterometer / INCOIS Wave Buoy 04'
  },
  chennai: {
    locationName: 'Chennai Corridor, Coromandel Coast',
    lat: 13.08,
    lng: 80.27,
    sst: 29.8,
    chlorophyll: 0.28,
    waveHeight: 1.4,
    wavePeriod: 6.8,
    windSpeed: 9.6,
    windDirection: 'SSE (155°)',
    salinity: 33.9,
    currentSpeed: 0.48,
    currentHeading: 32,
    dissolvedOxygen: 5.6,
    timestamp: 'Live UTC (Sentinel-6 Michael Freilich)',
    source: 'Jason-3 Altimetry / INCOIS Coastal Moorings'
  },
  maldives: {
    locationName: 'North Malé Atoll, Equatorial Indian Ocean',
    lat: 4.17,
    lng: 73.5,
    sst: 30.1,
    chlorophyll: 0.16,
    waveHeight: 1.1,
    wavePeriod: 11.2,
    windSpeed: 7.8,
    windDirection: 'NE (45°)',
    salinity: 35.1,
    currentSpeed: 1.15,
    currentHeading: 95,
    dissolvedOxygen: 6.1,
    timestamp: 'Live UTC (NOAA-20 VIIRS)',
    source: 'NOAA Coral Reef Watch / Copernicus Marine CMEMS'
  }
};

export const ACTIVE_FISHING_ZONES: FishingZone[] = [
  {
    id: 'pfz-01',
    name: 'Paradip East Frontal PFZ',
    region: 'Northern Bay of Bengal',
    riskLevel: 'high',
    confidence: 92.8,
    targetSpecies: ['Yellowfin Tuna', 'Hilsa', 'Mackerel', 'Squid'],
    sstGradient: 1.4, // deg delta across front
    chlorophyllDensity: 0.68,
    vesselsCount: 14,
    detectedAt: '2026-09-28 10:15 UTC',
    coordinates: [
      [20.5, 87.2],
      [20.1, 88.0],
      [18.9, 87.8],
      [19.0, 86.6],
      [20.1, 86.8]
    ]
  },
  {
    id: 'pfz-02',
    name: 'Visakhapatnam Shelf Eddy',
    region: 'Central Andhra Coast',
    riskLevel: 'medium',
    confidence: 84.5,
    targetSpecies: ['Indian Mackerel', 'Ribbonfish', 'Sardine'],
    sstGradient: 0.9,
    chlorophyllDensity: 0.42,
    vesselsCount: 8,
    detectedAt: '2026-09-28 08:30 UTC',
    coordinates: [
      [17.8, 83.9],
      [17.4, 84.5],
      [16.8, 83.8],
      [17.1, 83.2]
    ]
  },
  {
    id: 'pfz-03',
    name: 'Malabar Upwelling Plume',
    region: 'Southeastern Arabian Sea',
    riskLevel: 'low',
    confidence: 89.1,
    targetSpecies: ['Oil Sardine', 'Anchovies', 'Seerfish'],
    sstGradient: 1.8,
    chlorophyllDensity: 0.88,
    vesselsCount: 22,
    detectedAt: '2026-09-28 09:00 UTC',
    coordinates: [
      [10.2, 75.2],
      [10.5, 75.8],
      [9.5, 76.1],
      [9.2, 75.5]
    ]
  }
];

class OceanService {
  public getObservation(regionKey: string = 'paradip'): OceanObservation {
    return GLOBAL_OCEAN_REGIONS[regionKey] || CURRENT_OCEAN_CONDITIONS;
  }

  public getFishingZones(): FishingZone[] {
    return ACTIVE_FISHING_ZONES;
  }
}

export const oceanService = new OceanService();
