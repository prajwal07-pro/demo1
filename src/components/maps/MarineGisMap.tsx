import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type MapLibreMap = maplibregl.Map;
import { 
  Flame, 
  Layers, 
  Crosshair, 
  Plus, 
  Minus, 
  Maximize2, 
  Search, 
  Ship, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';
import { AISVessel, FishingZone, VesselType } from '../../types/marine';
import { aisService } from '../../services/aisService';
import { ACTIVE_FISHING_ZONES } from '../../services/oceanService';

interface MarineGisMapProps {
  selectedVessel: AISVessel | null;
  onSelectVessel: (vessel: AISVessel) => void;
  vesselFilter: 'all' | VesselType;
  onFilterChange: (filter: 'all' | VesselType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectZone: (zone: FishingZone) => void;
}

export const MarineGisMap: React.FC<MarineGisMapProps> = ({
  selectedVessel,
  onSelectVessel,
  vesselFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onSelectZone,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showVesselPins, setShowVesselPins] = useState(true);
  const [showShippingLanes, setShowShippingLanes] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.85);

  // Initialize MapLibre GL map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Dark marine base style
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        name: 'ORCA Dark Ocean',
        sources: {
          'osm-raster': {
            type: 'raster',
            tiles: [
              'https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© CARTO © OpenStreetMap'
          }
        },
        layers: [
          {
            id: 'ocean-background',
            type: 'background',
            paint: {
              'background-color': '#020b18'
            }
          },
          {
            id: 'carto-tiles',
            type: 'raster',
            source: 'osm-raster',
            paint: {
              'raster-opacity': 0.65,
              'raster-contrast': 0.15,
              'raster-saturation': -0.3
            }
          }
        ]
      },
      center: [82.5, 14.5], // Centered between Arabian Sea, Bay of Bengal, and Indian Ocean
      zoom: 4.5,
      minZoom: 2,
      maxZoom: 13,
      pitch: 20
    });

    mapRef.current = map;

    map.on('load', () => {
      setIsMapLoaded(true);

      // --- 1. AIS VESSEL DENSITY HEATMAP LAYER ---
      const densityData = aisService.getAisDensityGeoJSON();
      map.addSource('ais-density-source', {
        type: 'geojson',
        data: densityData
      });

      map.addLayer({
        id: 'ais-heatmap-layer',
        type: 'heatmap',
        source: 'ais-density-source',
        maxzoom: 14,
        paint: {
          // Increase heatmap weight based on densityWeight
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'densityWeight'],
            0, 0.2,
            1, 1.0
          ],
          // Increase heatmap intensity with zoom
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            2, 0.8,
            5, 1.8,
            9, 3.2
          ],
          // Color ramp for heatmap: transparent -> cyan -> teal -> sky -> amber -> fiery rose
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.15, 'rgba(6, 182, 212, 0.25)',
            0.35, 'rgba(34, 211, 238, 0.55)',
            0.55, 'rgba(56, 189, 248, 0.75)',
            0.75, 'rgba(251, 191, 36, 0.88)',
            1, 'rgba(244, 63, 94, 0.98)'
          ],
          // Heatmap blur radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            2, 6,
            5, 18,
            9, 34
          ],
          'heatmap-opacity': 0.85
        }
      });

      // --- 2. SHIPPING TRUNK CORRIDORS (VECTOR LINES) ---
      map.addSource('shipping-lanes-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Suez-Malacca Trunk Corridor' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [50.2, 12.0],
                  [65.0, 9.8],
                  [76.2, 6.2],
                  [80.5, 5.8],
                  [88.2, 5.5],
                  [95.2, 5.6],
                  [99.8, 2.5]
                ]
              }
            },
            {
              type: 'Feature',
              properties: { name: 'Bay of Bengal Paradip Coastal Corridor' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [80.3, 13.1],
                  [83.4, 17.7],
                  [86.7, 20.3],
                  [88.1, 21.4]
                ]
              }
            },
            {
              type: 'Feature',
              properties: { name: 'Arabian Sea Mumbai High Tanker Transit' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [58.0, 24.0],
                  [68.5, 21.0],
                  [72.5, 19.0],
                  [75.8, 11.5]
                ]
              }
            }
          ]
        }
      });

      map.addLayer({
        id: 'shipping-lanes-layer',
        type: 'line',
        source: 'shipping-lanes-source',
        paint: {
          'line-color': '#06b6d4',
          'line-width': 2,
          'line-opacity': 0.45,
          'line-dasharray': [3, 2]
        }
      });

      // --- 3. POTENTIAL FISHING ZONE (PFZ) POLYGON ---
      map.addSource('pfz-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                id: 'pfz-01',
                name: 'Paradip East Frontal PFZ',
                status: 'High Catch Probability'
              },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [87.2, 20.5],
                  [88.0, 20.1],
                  [87.8, 18.9],
                  [86.6, 19.0],
                  [86.8, 20.1],
                  [87.2, 20.5]
                ]]
              }
            }
          ]
        }
      });

      map.addLayer({
        id: 'pfz-fill-layer',
        type: 'fill',
        source: 'pfz-source',
        paint: {
          'fill-color': '#f43f5e',
          'fill-opacity': 0.25
        }
      });

      map.addLayer({
        id: 'pfz-line-layer',
        type: 'line',
        source: 'pfz-source',
        paint: {
          'line-color': '#f43f5e',
          'line-width': 2,
          'line-dasharray': [4, 2]
        }
      });

      // Click on PFZ
      map.on('click', 'pfz-fill-layer', () => {
        onSelectZone(ACTIVE_FISHING_ZONES[0]);
      });

      // --- 4. INDIVIDUAL AIS TRACKED VESSELS (POINTS + SYMBOLS) ---
      map.addSource('tracked-vessels-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: aisService.getVessels().map(v => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [v.lng, v.lat] },
            properties: {
              id: v.id,
              name: v.name,
              mmsi: v.mmsi,
              type: v.type,
              speed: v.speed,
              heading: v.heading
            }
          }))
        }
      });

      // Vessel halo/circle
      map.addLayer({
        id: 'vessels-circle-layer',
        type: 'circle',
        source: 'tracked-vessels-source',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, 4,
            6, 7,
            10, 10
          ],
          'circle-color': [
            'match',
            ['get', 'type'],
            'research', '#38bdf8',
            'fishing', '#f59e0b',
            'cargo', '#34d399',
            'tanker', '#a78bfa',
            '#22d3ee'
          ],
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Click on vessel point
      map.on('click', 'vessels-circle-layer', (e: maplibregl.MapLayerMouseEvent) => {
        if (!e.features || !e.features[0]) return;
        const vId = e.features[0].properties?.id;
        const vessel = aisService.getVesselById(vId);
        if (vessel) {
          onSelectVessel(vessel);
        }
      });

      // Cursor changes on hover
      map.on('mouseenter', 'vessels-circle-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'vessels-circle-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update vessels points on live telemetry updates
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;

    const unsub = aisService.subscribe(vList => {
      // Filter vessels according to filter & search
      const filtered = vList.filter(v => {
        const matchesFilter = vesselFilter === 'all' || v.type === vesselFilter;
        const matchesSearch = !searchQuery.trim() || 
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          v.mmsi.includes(searchQuery);
        return matchesFilter && matchesSearch;
      });

      const vesselsGeoJSON = {
        type: 'FeatureCollection',
        features: filtered.map(v => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [v.lng, v.lat] },
          properties: {
            id: v.id,
            name: v.name,
            mmsi: v.mmsi,
            type: v.type,
            speed: v.speed,
            heading: v.heading
          }
        }))
      };

      const vesselSource = map.getSource('tracked-vessels-source') as maplibregl.GeoJSONSource;
      if (vesselSource) {
        vesselSource.setData(vesselsGeoJSON as any);
      }

      // Also refresh density points
      const densitySource = map.getSource('ais-density-source') as maplibregl.GeoJSONSource;
      if (densitySource) {
        densitySource.setData(aisService.getAisDensityGeoJSON() as any);
      }
    });

    return unsub;
  }, [isMapLoaded, vesselFilter, searchQuery]);

  // Toggle Heatmap visibility and opacity
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;
    if (map.getLayer('ais-heatmap-layer')) {
      map.setLayoutProperty('ais-heatmap-layer', 'visibility', showHeatmap ? 'visible' : 'none');
      if (showHeatmap) {
        map.setPaintProperty('ais-heatmap-layer', 'heatmap-opacity', heatmapOpacity);
      }
    }
  }, [showHeatmap, heatmapOpacity, isMapLoaded]);

  // Toggle Vessel pins
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;
    if (map.getLayer('vessels-circle-layer')) {
      map.setLayoutProperty('vessels-circle-layer', 'visibility', showVesselPins ? 'visible' : 'none');
    }
  }, [showVesselPins, isMapLoaded]);

  // Toggle Shipping lanes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;
    if (map.getLayer('shipping-lanes-layer')) {
      map.setLayoutProperty('shipping-lanes-layer', 'visibility', showShippingLanes ? 'visible' : 'none');
    }
  }, [showShippingLanes, isMapLoaded]);

  // Pan to selected vessel when chosen
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !selectedVessel) return;
    mapRef.current.easeTo({
      center: [selectedVessel.lng, selectedVessel.lat],
      zoom: Math.max(mapRef.current.getZoom(), 6),
      duration: 1200
    });
  }, [selectedVessel, isMapLoaded]);

  return (
    <div className="relative w-full h-full flex flex-col min-h-[520px] lg:min-h-[640px] bg-[#020b18] overflow-hidden">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Map search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#030914]/90 backdrop-blur-md border border-cyan-500/20 w-52 sm:w-64">
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search vessel, MMSI, corridor..."
            className="bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none w-full"
          />
        </div>

        {/* Vessel Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#030914]/90 backdrop-blur-md border border-cyan-500/20 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Vessels' },
            { id: 'fishing', label: 'Fishing' },
            { id: 'cargo', label: 'Cargo' },
            { id: 'tanker', label: 'Tankers' },
            { id: 'research', label: 'Research' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id as any)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                vesselFilter === tab.id
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Left Tool Floating Buttons */}
      <div className="absolute left-3 top-16 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-8 h-8 rounded-lg bg-[#030914]/85 border border-cyan-500/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-8 h-8 rounded-lg bg-[#030914]/85 border border-cyan-500/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (selectedVessel && mapRef.current) {
              mapRef.current.easeTo({ center: [selectedVessel.lng, selectedVessel.lat], zoom: 6.5 });
            } else {
              mapRef.current?.easeTo({ center: [82.5, 14.5], zoom: 4.5 });
            }
          }}
          className="w-8 h-8 rounded-lg bg-[#030914]/85 border border-cyan-500/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
          title="Center on Target"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Heatmap Toggle Button */}
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all shadow-lg ${
            showHeatmap
              ? 'bg-rose-500/30 border-rose-400 text-rose-300 shadow-rose-950/40'
              : 'bg-[#030914]/85 border-cyan-500/20 text-slate-400 hover:text-white'
          }`}
          title="Toggle AIS Vessel Density Heatmap"
        >
          <Flame className="w-4 h-4" />
        </button>

        {/* Vessel Pins Toggle */}
        <button
          onClick={() => setShowVesselPins(!showVesselPins)}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all shadow-lg ${
            showVesselPins
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
              : 'bg-[#030914]/85 border-cyan-500/20 text-slate-400 hover:text-white'
          }`}
          title="Toggle Tracked Vessel Pins"
        >
          <Ship className="w-4 h-4" />
        </button>

        {/* Shipping Corridors Toggle */}
        <button
          onClick={() => setShowShippingLanes(!showShippingLanes)}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all shadow-lg ${
            showShippingLanes
              ? 'bg-teal-500/30 border-teal-400 text-teal-200'
              : 'bg-[#030914]/85 border-cyan-500/20 text-slate-400 hover:text-white'
          }`}
          title="Toggle Shipping Trunk Corridors"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Heatmap Live Telemetry Legend & Layer Toggle Banner (Top-Right under controls) */}
      {showHeatmap && (
        <div className="absolute top-16 right-3 z-20 p-2.5 rounded-2xl bg-[#030914]/90 backdrop-blur-md border border-cyan-500/25 shadow-xl max-w-[210px] pointer-events-auto">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>AIS Vessel Density</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400">MapLibre GL</span>
          </div>

          {/* Density Heatmap Color Ramp Legend */}
          <div className="w-full h-2 rounded-full bg-gradient-to-r from-transparent via-cyan-400 via-sky-400 via-amber-400 to-rose-500 mb-1" />
          <div className="flex justify-between text-[9px] font-mono text-slate-400">
            <span>Low (Transit)</span>
            <span className="text-rose-300">High (Chokepoint)</span>
          </div>

          {/* Heatmap Opacity Slider */}
          <div className="mt-2 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Opacity</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={heatmapOpacity}
              onChange={e => setHeatmapOpacity(Number(e.target.value))}
              className="w-20 accent-rose-400 cursor-pointer h-1 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 relative cursor-grab active:cursor-grabbing" />

      {/* Bottom Map Badge & Geographic Coordinate HUD */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 pointer-events-none text-[10px] font-mono text-slate-400">
        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-cyan-500/20 text-cyan-300">
          WGS 84 · Bay of Bengal & Indian Ocean
        </span>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-slate-800 text-slate-400">
          32,489 AIS Transponders Synthesized
        </span>
      </div>
    </div>
  );
};
