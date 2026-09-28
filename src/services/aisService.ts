import { AISVessel } from '../types/marine';

// Realist maritime vessels operating across Indian Ocean, Arabian Sea, Bay of Bengal, and Malacca Strait
export const INITIAL_VESSELS: AISVessel[] = [
  {
    id: 'v-01',
    name: 'MV Ocean Explorer',
    mmsi: '563271000',
    type: 'research',
    flag: '🇮🇳',
    country: 'India',
    lat: 16.82,
    lng: 85.34,
    speed: 12.4,
    heading: 87,
    destination: 'Colombo, LK',
    eta: '2026-10-02 18:00 UTC',
    draught: 6.8,
    length: 118,
    status: 'Engaged in Survey',
    riskLevel: 'low',
    lastUpdate: '2 mins ago',
    callsign: 'VTEX-9',
    track: [
      [15.1, 82.5],
      [15.6, 83.4],
      [16.2, 84.5],
      [16.82, 85.34]
    ]
  },
  {
    id: 'v-02',
    name: 'INS Sagar Kanya',
    mmsi: '419001420',
    type: 'research',
    flag: '🇮🇳',
    country: 'India',
    lat: 12.98,
    lng: 82.15,
    speed: 10.8,
    heading: 142,
    destination: 'Chennai, IN',
    eta: '2026-09-29 06:30 UTC',
    draught: 5.4,
    length: 100,
    status: 'Underway Using Engine',
    riskLevel: 'low',
    lastUpdate: 'Just now',
    callsign: 'ATSK',
    track: [
      [14.2, 81.3],
      [13.5, 81.8],
      [12.98, 82.15]
    ]
  },
  {
    id: 'v-03',
    name: 'Ever Glory',
    mmsi: '352002190',
    type: 'cargo',
    flag: '🇵🇦',
    country: 'Panama',
    lat: 9.85,
    lng: 76.22,
    speed: 18.2,
    heading: 310,
    destination: 'Jebel Ali, UAE',
    eta: '2026-10-04 11:00 UTC',
    draught: 14.5,
    length: 366,
    status: 'Underway Using Engine',
    riskLevel: 'low',
    lastUpdate: '4 mins ago',
    callsign: '3FYQ9',
    track: [
      [7.2, 79.5],
      [8.5, 77.8],
      [9.85, 76.22]
    ]
  },
  {
    id: 'v-04',
    name: 'Paradip Deepsea 07',
    mmsi: '419992381',
    type: 'fishing',
    flag: '🇮🇳',
    country: 'India',
    lat: 19.92,
    lng: 87.12,
    speed: 4.6,
    heading: 195,
    destination: 'Paradip Port, IN',
    eta: '2026-09-29 14:00 UTC',
    draught: 3.2,
    length: 34,
    status: 'Fishing',
    riskLevel: 'high',
    lastUpdate: '1 min ago',
    callsign: 'VTFD-7',
    track: [
      [20.5, 87.8],
      [20.2, 87.4],
      [19.92, 87.12]
    ]
  },
  {
    id: 'v-05',
    name: 'Kallisto Pioneer',
    mmsi: '636019842',
    type: 'tanker',
    flag: '🇱🇷',
    country: 'Liberia',
    lat: 14.45,
    lng: 71.95,
    speed: 13.9,
    heading: 348,
    destination: 'Mumbai High, IN',
    eta: '2026-09-30 08:00 UTC',
    draught: 16.1,
    length: 330,
    status: 'Underway Using Engine',
    riskLevel: 'low',
    lastUpdate: '3 mins ago',
    callsign: 'A8QK2',
    track: [
      [11.8, 73.2],
      [13.1, 72.6],
      [14.45, 71.95]
    ]
  },
  {
    id: 'v-06',
    name: 'Sagar Samrat',
    mmsi: '419100088',
    type: 'custom',
    flag: '🇮🇳',
    country: 'India',
    lat: 19.42,
    lng: 71.35,
    speed: 0.1,
    heading: 0,
    destination: 'Mumbai Offshore',
    eta: 'Stationary',
    draught: 8.5,
    length: 84,
    status: 'Moored',
    riskLevel: 'low',
    lastUpdate: '5 mins ago',
    callsign: 'ATSS',
    track: [[19.42, 71.35]]
  },
  {
    id: 'v-07',
    name: 'Matsya Vigyan 12',
    mmsi: '419827361',
    type: 'fishing',
    flag: '🇮🇳',
    country: 'India',
    lat: 19.25,
    lng: 86.85,
    speed: 5.1,
    heading: 210,
    destination: 'Visakhapatnam, IN',
    eta: '2026-09-30 02:00 UTC',
    draught: 3.4,
    length: 38,
    status: 'Fishing',
    riskLevel: 'medium',
    lastUpdate: '2 mins ago',
    callsign: 'VTMV-12',
    track: [
      [19.8, 87.2],
      [19.5, 87.0],
      [19.25, 86.85]
    ]
  },
  {
    id: 'v-08',
    name: 'ICGS Samarth',
    mmsi: '419000109',
    type: 'patrol',
    flag: '🇮🇳',
    country: 'India',
    lat: 17.55,
    lng: 84.1,
    speed: 21.5,
    heading: 65,
    destination: 'EEZ Surveillance Area B',
    eta: '2026-09-28 23:00 UTC',
    draught: 4.8,
    length: 105,
    status: 'Underway Using Engine',
    riskLevel: 'low',
    lastUpdate: 'Just now',
    callsign: '4IBC',
    track: [
      [16.8, 83.2],
      [17.1, 83.6],
      [17.55, 84.1]
    ]
  }
];

class AISService {
  private vessels: AISVessel[] = [...INITIAL_VESSELS];
  private listeners: ((vessels: AISVessel[]) => void)[] = [];

  constructor() {
    // Subtle real-time drift to mimic live telemetry updates
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.stepVesselPositions();
      }, 4000);
    }
  }

  private stepVesselPositions() {
    this.vessels = this.vessels.map(v => {
      if (v.status === 'Moored' || v.speed < 0.5) return v;
      // Heading in radians
      const rad = (v.heading * Math.PI) / 180;
      // Small step (~0.005 deg for smooth map visualization)
      const dLat = Math.cos(rad) * 0.004;
      const dLng = Math.sin(rad) * 0.004;
      const newLat = Number((v.lat + dLat).toFixed(4));
      const newLng = Number((v.lng + dLng).toFixed(4));
      const newTrack: [number, number][] = [...v.track.slice(-25), [newLat, newLng]];

      return {
        ...v,
        lat: newLat,
        lng: newLng,
        track: newTrack,
        lastUpdate: 'Just now'
      };
    });
    this.notify();
  }

  public getVessels(): AISVessel[] {
    return [...this.vessels];
  }

  public getVesselById(id: string): AISVessel | undefined {
    return this.vessels.find(v => v.id === id);
  }

  public searchVessels(query: string): AISVessel[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.vessels;
    return this.vessels.filter(
      v =>
        v.name.toLowerCase().includes(q) ||
        v.mmsi.includes(q) ||
        v.destination.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q)
    );
  }

  public subscribe(cb: (vessels: AISVessel[]) => void): () => void {
    this.listeners.push(cb);
    cb(this.vessels);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  // Returns comprehensive real-time AIS vessel coordinates and dense shipping corridor points for MapLibre heatmap
  public getAisDensityGeoJSON() {
    const features: any[] = [];

    // 1. Current tracked active vessels
    for (const v of this.vessels) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [v.lng, v.lat]
        },
        properties: {
          id: v.id,
          name: v.name,
          mmsi: v.mmsi,
          type: v.type,
          densityWeight: v.type === 'fishing' ? 0.9 : v.type === 'tanker' ? 0.85 : 0.75,
          speed: v.speed
        }
      });
    }

    // 2. High-density commercial clusters and historical shipping lanes
    // A. Paradip fishing and bulk cargo cluster
    for (let i = 0; i < 45; i++) {
      const lat = 19.4 + Math.sin(i * 1.3) * 0.9 + (i % 5) * 0.15;
      const lng = 86.4 + Math.cos(i * 1.7) * 1.1 + (i % 7) * 0.12;
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { densityWeight: 0.95, cluster: 'Paradip-Bengal' }
      });
    }

    // B. Colombo / Sri Lanka southern trunk lane (Major East-West Container Highway)
    for (let i = 0; i < 55; i++) {
      const lng = 78.0 + (i / 55) * 6.5;
      const lat = 5.6 + Math.sin(i * 0.4) * 0.35;
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { densityWeight: 0.92, cluster: 'Colombo-Trunk' }
      });
    }

    // C. Malacca Strait approach & Singapore entrance
    for (let i = 0; i < 60; i++) {
      const t = i / 60;
      const lng = 94.5 + t * 9.0;
      const lat = 5.8 - t * 4.2;
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng + (Math.random() - 0.5) * 0.2, lat + (Math.random() - 0.5) * 0.2] },
        properties: { densityWeight: 1.0, cluster: 'Malacca-Choke' }
      });
    }

    // D. Mumbai High / Arabian Sea tanker corridor
    for (let i = 0; i < 40; i++) {
      const lat = 18.2 + (i / 40) * 2.2 + (Math.random() - 0.5) * 0.4;
      const lng = 71.0 + Math.sin(i * 0.5) * 1.2;
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { densityWeight: 0.88, cluster: 'Mumbai-Tankers' }
      });
    }

    // E. Visakhapatnam / Chennai shelf corridor
    for (let i = 0; i < 35; i++) {
      const t = i / 35;
      const lat = 13.0 + t * 4.8;
      const lng = 80.4 + t * 3.1 + Math.sin(i * 0.6) * 0.25;
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { densityWeight: 0.82, cluster: 'Coromandel-Shelf' }
      });
    }

    // F. Gulf of Aden & Bab-el-Mandeb western approach
    for (let i = 0; i < 30; i++) {
      const lng = 50.0 + (i / 30) * 12.0;
      const lat = 12.0 + Math.sin(i * 0.3) * 0.8;
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { densityWeight: 0.86, cluster: 'Aden-Transit' }
      });
    }

    return {
      type: 'FeatureCollection',
      features
    };
  }

  private notify() {
    for (const cb of this.listeners) {
      cb(this.vessels);
    }
  }
}

export const aisService = new AISService();
