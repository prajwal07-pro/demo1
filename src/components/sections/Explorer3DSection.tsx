import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Boxes, 
  RotateCw, 
  Layers, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  ChevronRight,
  Maximize2
} from 'lucide-react';

type ModelKey = 'orca' | 'satellite' | 'vessel' | 'buoy' | 'drone';

interface ModelMeta {
  id: ModelKey;
  name: string;
  category: string;
  description: string;
  specs: Record<string, string>;
  hotspots: { title: string; desc: string }[];
}

const MODELS: ModelMeta[] = [
  {
    id: 'orca',
    name: 'Apex Biometric Orca',
    category: 'Marine Biomimetic & Natural Apex Sensor',
    description: 'Autonomous bio-telemetry framework combining cetacean echolocation physics with sensory mesh integration.',
    specs: {
      'Acoustic Range': '24 km via multi-frequency click bursts',
      'Max Dive Velocity': '30 knots (56 km/h)',
      'Subsurface Range': '1,000 meters depth capability',
      'Lateral Line Res.': '0.001 Pa pressure difference'
    },
    hotspots: [
      { title: 'Melon Acoustic Lens', desc: 'Focuses high-frequency echolocation beam for sub-surface bathymetry' },
      { title: 'Hydrodynamic Dorsal', desc: 'Maintains directional stability during high-speed shear current transit' },
      { title: 'Lateral Sensorial Band', desc: 'Detects micro-vibrations from schooling pelagic biomass' }
    ]
  },
  {
    id: 'satellite',
    name: 'Sentinel-3 Earth Observation Satellite',
    category: 'Orbital Ocean Altimetry & Radiometry',
    description: 'Sun-synchronous orbital satellite measuring sea surface temperature with 0.1°K accuracy and micro-altimetry topography.',
    specs: {
      'Orbital Altitude': '814.5 km',
      'Sensors': 'SLSTR (Thermal Infrared) + OLCI + SRAL Altimeter',
      'Swath Width': '1,420 km',
      'Repeat Cycle': '27 days (sub-daily combined)'
    },
    hotspots: [
      { title: 'SLSTR Radiometer', desc: 'Dual-angle infrared sea surface temperature calibration' },
      { title: 'Synthetic Aperture Radar', desc: 'Measures wave height and sea surface wind roughness' },
      { title: 'Solar Array Wing', desc: 'High-efficiency Gallium Arsenide photovoltaic generator' }
    ]
  },
  {
    id: 'vessel',
    name: 'MV Ocean Explorer',
    category: 'Multi-Mission Deep Oceanographic Research Vessel',
    description: 'Equipped with multibeam echosounders, dynamic positioning class II, and deep conductivity-temperature-depth (CTD) rosettes.',
    specs: {
      'Length Overall': '118 meters',
      'Gross Tonnage': '6,450 GT',
      'Survey Speed': '12.4 knots',
      'Endurance': '60 days unassisted'
    },
    hotspots: [
      { title: 'Radome Dome Array', desc: 'Inmarsat FleetBroadband and Ku/Ka satellite datalinks' },
      { title: 'A-Frame Stern Crane', desc: 'Deployment crane for 6,000-meter deep CTD winches' },
      { title: 'Sonar Gondola', desc: 'Drop-keel acoustic gondola isolated from bubble sweep-down' }
    ]
  },
  {
    id: 'buoy',
    name: 'Autonomous Met-Ocean Buoy',
    category: 'In-Situ Ocean Surface Telemetry Station',
    description: 'Solar-powered moored discus buoy transmitting directional wave spectra, barometric pressure, and SST hourly via Iridium.',
    specs: {
      'Hull Diameter': '2.8 meters',
      'Sensors': '3-axis accelerometer, ultrasonic anemometer, CTD',
      'Telemetry': 'Iridium Short Burst Data (SBD)',
      'Mooring Depth': 'Up to 4,500 meters'
    },
    hotspots: [
      { title: 'Ultrasonic Wind Sensor', desc: 'Solid-state 3D wind velocity and turbulence measure' },
      { title: 'Solar Power Ring', desc: 'Marine-grade photovoltaic array with internal LiFePO4 bank' },
      { title: 'Wave Motion Sensor', desc: 'High-precision inertial unit calculating directional swell' }
    ]
  }
];

export const Explorer3DSection: React.FC = () => {
  const [activeModelKey, setActiveModelKey] = useState<ModelKey>('orca');
  const [wireframe, setWireframe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeMeta = MODELS.find(m => m.id === activeModelKey) || MODELS[0];

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020a17, 0.04);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(0, 1.5, 4.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0x0f2d4a, 1.4);
    scene.add(amb);
    const key = new THREE.DirectionalLight(0x38bdf8, 2.8);
    key.position.set(4, 8, 4);
    scene.add(key);
    const fill = new THREE.PointLight(0x06b6d4, 3, 15);
    fill.position.set(-3, -1, 3);
    scene.add(fill);

    // Build model geometry based on activeModelKey
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const matDark = new THREE.MeshStandardMaterial({
      color: 0x091426,
      roughness: 0.25,
      metalness: 0.4,
      wireframe
    });
    const matCyan = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.15,
      metalness: 0.8,
      wireframe
    });
    const matWhite = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.1,
      wireframe
    });

    if (activeModelKey === 'orca') {
      // Sleek Cetacean
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.2, 3.2, 24), matDark);
      body.rotation.z = Math.PI / 2;
      rootGroup.add(body);
      const belly = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.15, 2.2, 16, 4, false, 0, Math.PI), matWhite);
      belly.rotation.z = Math.PI / 2;
      belly.rotation.x = Math.PI;
      belly.position.y = -0.1;
      rootGroup.add(belly);
      const fin = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.2, 16), matDark);
      fin.position.set(-0.2, 0.9, 0);
      fin.rotation.z = -0.3;
      rootGroup.add(fin);
    } else if (activeModelKey === 'satellite') {
      // Satellite
      const bus = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.2), matDark);
      rootGroup.add(bus);
      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.3, 16), matCyan);
      dish.position.set(0, -0.6, 0);
      dish.rotation.x = Math.PI;
      rootGroup.add(dish);
      const wingL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 0.8), matCyan);
      wingL.position.set(-1.6, 0, 0);
      rootGroup.add(wingL);
      const wingR = wingL.clone();
      wingR.position.set(1.6, 0, 0);
      rootGroup.add(wingR);
    } else if (activeModelKey === 'vessel') {
      // Research Vessel
      const hull = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 3.4), matDark);
      hull.position.y = -0.3;
      rootGroup.add(hull);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 1.2), matWhite);
      cabin.position.set(0, 0.3, -0.2);
      rootGroup.add(cabin);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), matCyan);
      dome.position.set(0, 0.85, -0.3);
      rootGroup.add(dome);
    } else {
      // Buoy
      const hull = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 0.4, 24), matCyan);
      rootGroup.add(hull);
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 1.4, 8, 1, true), matDark);
      tower.position.y = 0.8;
      rootGroup.add(tower);
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), matWhite);
      beacon.position.y = 1.6;
      rootGroup.add(beacon);
    }

    // Interaction loop
    let reqId: number;
    let isMouseDown = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => { isMouseDown = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      rootGroup.rotation.y += dx * 0.01;
      rootGroup.rotation.x += dy * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    const anim = () => {
      reqId = requestAnimationFrame(anim);
      if (!isMouseDown) {
        rootGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    anim();

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [activeModelKey, wireframe]);

  return (
    <section id="3d-explorer" className="w-full bg-[#030712] py-16 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase mb-2">
              <Boxes className="w-3.5 h-3.5" />
              <span>3D Interactive Engineering Laboratory</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Ocean Technology Explorer
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Orbit, inspect, and analyze high-fidelity 3D assets driving the ORCA ecosystem—from satellite sensors to autonomous marine platforms.
            </p>
          </div>

          {/* Model Switcher */}
          <div className="mt-4 md:mt-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveModelKey(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  activeModelKey === m.id
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {m.name.split(' ')[0]} {m.name.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Viewport & Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Interactive 3D Canvas (Left 8 Cols) */}
          <div className="lg:col-span-8 relative h-[440px] lg:h-[520px] rounded-3xl bg-[#020b18] border border-cyan-500/20 overflow-hidden flex flex-col justify-between">
            <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

            {/* Top Toolbar */}
            <div className="relative z-10 p-4 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#030914]/80 backdrop-blur-md border border-cyan-500/20 text-xs font-bold text-white">
                  {activeMeta.name}
                </span>
                <span className="text-[10px] font-mono text-cyan-400/80 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800">
                  {activeMeta.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWireframe(!wireframe)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                    wireframe ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200' : 'bg-slate-900/80 border-slate-700 text-slate-400'
                  }`}
                >
                  Wireframe: {wireframe ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Bottom Controls helper */}
            <div className="relative z-10 p-4 text-[11px] font-mono text-slate-400 flex items-center justify-between pointer-events-none">
              <span>Click & Drag to Orbit 360°</span>
              <span className="text-cyan-400/80">Three.js GPU Acceleration Active</span>
            </div>
          </div>

          {/* Specs & Hotspots Sidebar (Right 4 Cols) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-[#040e22] border border-cyan-500/20 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-2">{activeMeta.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{activeMeta.description}</p>

              {/* Technical Specifications */}
              <div className="mb-6">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                  Technical Specifications
                </span>
                <div className="space-y-2">
                  {Object.entries(activeMeta.specs).map(([key, val]) => (
                    <div key={key} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between text-xs">
                      <span className="text-slate-400">{key}</span>
                      <span className="font-mono font-bold text-white">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-system Hotspots */}
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                  Sensor & Sub-system Hotspots
                </span>
                <div className="space-y-2">
                  {activeMeta.hotspots.map((h, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#030a17] border border-cyan-500/10 text-xs">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{h.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{h.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
