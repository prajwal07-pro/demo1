import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface OrcaOceanCanvasProps {
  interactive?: boolean;
  quality?: 'low' | 'med' | 'high';
  onTelemetryUpdate?: (stats: { depth: number; speed: number; pitch: number }) => void;
}

export const OrcaOceanCanvas: React.FC<OrcaOceanCanvasProps> = ({
  interactive = true,
  quality = 'high',
  onTelemetryUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderQuality, setRenderQuality] = useState<'low' | 'med' | 'high'>(quality);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020d1c, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 7.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: renderQuality !== 'low',
        powerPreference: 'high-performance',
        alpha: true
      });
    } catch {
      return;
    }

    const pixelRatio = renderQuality === 'high' ? Math.min(window.devicePixelRatio, 2) : 1;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x0a223d, 1.2);
    scene.add(ambientLight);

    // Key light (sun rays filtering through ocean surface)
    const sunLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    sunLight.position.set(5, 12, 4);
    scene.add(sunLight);

    // Cyan bioluminescent rim light
    const rimLight = new THREE.PointLight(0x06b6d4, 4.5, 18);
    rimLight.position.set(-4, -1, 3);
    scene.add(rimLight);

    // Deep abyss upward bounce
    const abyssLight = new THREE.DirectionalLight(0x0284c7, 0.8);
    abyssLight.position.set(0, -8, 2);
    scene.add(abyssLight);

    // --- MATERIALS ---
    const orcaSkinMaterial = new THREE.MeshStandardMaterial({
      color: 0x050811,
      roughness: 0.18,
      metalness: 0.35,
    });

    const orcaWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.25,
      metalness: 0.1,
    });

    // Glowing cybernetic telemetry line
    const sensoryCircuitsMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: false,
    });

    // --- PROCEDURAL CINEMATIC ORCA MODEL HIERARCHY ---
    const orcaGroup = new THREE.Group();
    scene.add(orcaGroup);

    // 1. Main Torpedo Body
    const bodyGeometry = new THREE.CylinderGeometry(0.55, 0.22, 3.8, 32, 16);
    bodyGeometry.rotateZ(Math.PI / 2);
    // Taper front and back for hydrodynamic profile
    const posAttr = bodyGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      // Profile scale based on x
      const factor = 1 - Math.pow(x / 2.0, 2) * 0.45;
      posAttr.setY(i, y * Math.max(0.2, factor));
      posAttr.setZ(i, z * Math.max(0.25, factor * 0.95));
    }
    bodyGeometry.computeVertexNormals();
    const bodyMesh = new THREE.Mesh(bodyGeometry, orcaSkinMaterial);
    orcaGroup.add(bodyMesh);

    // 2. White Underbelly Patch
    const bellyGeometry = new THREE.CylinderGeometry(0.52, 0.18, 2.6, 24, 8, false, 0, Math.PI);
    bellyGeometry.rotateZ(Math.PI / 2);
    bellyGeometry.rotateX(Math.PI);
    bellyGeometry.scale(0.98, 0.75, 0.95);
    const bellyMesh = new THREE.Mesh(bellyGeometry, orcaWhiteMaterial);
    bellyMesh.position.set(0.1, -0.12, 0);
    orcaGroup.add(bellyMesh);

    // 3. Eye Patches (Signature Oval White Spots)
    const eyePatchGeo = new THREE.SphereGeometry(0.18, 16, 16);
    eyePatchGeo.scale(2.2, 0.6, 0.25);
    const leftEyePatch = new THREE.Mesh(eyePatchGeo, orcaWhiteMaterial);
    leftEyePatch.position.set(1.1, 0.22, 0.42);
    leftEyePatch.rotation.set(0.15, 0.25, 0.1);
    orcaGroup.add(leftEyePatch);

    const rightEyePatch = leftEyePatch.clone();
    rightEyePatch.position.set(1.1, 0.22, -0.42);
    rightEyePatch.rotation.set(-0.15, -0.25, -0.1);
    orcaGroup.add(rightEyePatch);

    // 4. Iconic Dorsal Fin
    const dorsalShape = new THREE.Shape();
    dorsalShape.moveTo(0, 0);
    dorsalShape.lineTo(-0.45, 1.4);
    dorsalShape.quadraticCurveTo(-0.6, 0.8, -0.7, 0);
    dorsalShape.closePath();
    const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const dorsalGeo = new THREE.ExtrudeGeometry(dorsalShape, extrudeSettings);
    dorsalGeo.center();
    const dorsalMesh = new THREE.Mesh(dorsalGeo, orcaSkinMaterial);
    dorsalMesh.position.set(-0.35, 1.05, 0);
    dorsalMesh.rotation.z = -0.05;
    orcaGroup.add(dorsalMesh);

    // 5. Saddle Patch behind dorsal fin (Subtle greyish-blue)
    const saddleGeo = new THREE.CylinderGeometry(0.53, 0.38, 0.9, 16, 4, false, -Math.PI / 3, (2 * Math.PI) / 3);
    saddleGeo.rotateZ(Math.PI / 2);
    const saddleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
    const saddleMesh = new THREE.Mesh(saddleGeo, saddleMat);
    saddleMesh.position.set(-0.95, 0.16, 0);
    orcaGroup.add(saddleMesh);

    // 6. Pectoral Flippers (Left & Right)
    const flipperShape = new THREE.Shape();
    flipperShape.moveTo(0, 0);
    flipperShape.quadraticCurveTo(0.6, -0.8, 0.2, -1.35);
    flipperShape.quadraticCurveTo(-0.3, -0.9, -0.4, 0);
    flipperShape.closePath();
    const flipperGeo = new THREE.ExtrudeGeometry(flipperShape, extrudeSettings);
    flipperGeo.center();

    const leftFlipper = new THREE.Mesh(flipperGeo, orcaSkinMaterial);
    leftFlipper.position.set(0.7, -0.28, 0.72);
    leftFlipper.rotation.set(0.6, 0.3, -0.4);
    orcaGroup.add(leftFlipper);

    const rightFlipper = leftFlipper.clone();
    rightFlipper.position.set(0.7, -0.28, -0.72);
    rightFlipper.rotation.set(-0.6, -0.3, -0.4);
    orcaGroup.add(rightFlipper);

    // 7. Articulated Tail & Flukes
    const tailStemGeo = new THREE.CylinderGeometry(0.24, 0.08, 1.5, 16, 8);
    tailStemGeo.rotateZ(Math.PI / 2);
    const tailStem = new THREE.Mesh(tailStemGeo, orcaSkinMaterial);
    tailStem.position.set(-2.2, 0, 0);
    orcaGroup.add(tailStem);

    const flukeShape = new THREE.Shape();
    flukeShape.moveTo(0, 0);
    flukeShape.quadraticCurveTo(-0.7, 0.35, -1.2, 0.05);
    flukeShape.quadraticCurveTo(-0.9, -0.3, -0.3, -0.45);
    flukeShape.lineTo(0, -0.3);
    flukeShape.lineTo(0.3, -0.45);
    flukeShape.quadraticCurveTo(0.9, -0.3, 1.2, 0.05);
    flukeShape.quadraticCurveTo(0.7, 0.35, 0, 0);
    flukeShape.closePath();

    const flukeGeo = new THREE.ExtrudeGeometry(flukeShape, extrudeSettings);
    flukeGeo.center();
    const flukeMesh = new THREE.Mesh(flukeGeo, orcaSkinMaterial);
    flukeMesh.position.set(-2.95, 0.02, 0);
    flukeMesh.rotation.set(Math.PI / 2, 0, 0);
    orcaGroup.add(flukeMesh);

    // 8. Cybernetic Biometric Telemetry Nodes (Along Lateral Line)
    const nodeCount = 18;
    const circuitPoints: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const t = (i / (nodeCount - 1)) * 3.4 - 1.7;
      const y = Math.sin(i * 0.4) * 0.06;
      const z = 0.52 * Math.cos(t * 0.6);
      circuitPoints.push(new THREE.Vector3(t, y, z));
      // Small glowing sensor dots
      const dotGeo = new THREE.SphereGeometry(0.028, 8, 8);
      const dotMesh = new THREE.Mesh(dotGeo, sensoryCircuitsMaterial);
      dotMesh.position.set(t, y, z);
      orcaGroup.add(dotMesh);

      // Symmetrical other side
      const dotMesh2 = dotMesh.clone();
      dotMesh2.position.set(t, y, -z);
      orcaGroup.add(dotMesh2);
    }

    // Connect line
    const curveLeft = new THREE.CatmullRomCurve3(circuitPoints);
    const lineGeo = new THREE.TubeGeometry(curveLeft, 32, 0.008, 6, false);
    const lineMesh = new THREE.Mesh(lineGeo, sensoryCircuitsMaterial);
    orcaGroup.add(lineMesh);

    // Symmetrical line right side
    const circuitPointsRight = circuitPoints.map(p => new THREE.Vector3(p.x, p.y, -p.z));
    const curveRight = new THREE.CatmullRomCurve3(circuitPointsRight);
    const lineGeoRight = new THREE.TubeGeometry(curveRight, 32, 0.008, 6, false);
    const lineMeshRight = new THREE.Mesh(lineGeoRight, sensoryCircuitsMaterial);
    orcaGroup.add(lineMeshRight);

    // --- BIOLUMINESCENT PLANKTON / MARINE SNOW PARTICLES ---
    const particleCount = renderQuality === 'low' ? 350 : renderQuality === 'med' ? 750 : 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 16;
      particlePos[i + 1] = (Math.random() - 0.5) * 8;
      particlePos[i + 2] = (Math.random() - 0.5) * 12;

      particleVel[i] = (Math.random() - 0.5) * 0.006;
      particleVel[i + 1] = (Math.random() - 0.5) * 0.003 - 0.002;
      particleVel[i + 2] = (Math.random() - 0.5) * 0.006;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- CELESTIAL SATELLITE BEAM CONE OVERHEAD ---
    const beamGeo = new THREE.ConeGeometry(3.5, 9, 32, 1, true);
    beamGeo.translate(0, -4.5, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const beamCone = new THREE.Mesh(beamGeo, beamMat);
    beamCone.position.set(2, 6.5, -2);
    scene.add(beamCone);

    // Small satellite representation high in orbit
    const satGroup = new THREE.Group();
    satGroup.position.set(2, 6.5, -2);
    const satBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.45), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 }));
    satGroup.add(satBody);
    const solarL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.4), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 }));
    solarL.position.set(-0.8, 0, 0);
    satGroup.add(solarL);
    const solarR = solarL.clone();
    solarR.position.set(0.8, 0, 0);
    satGroup.add(solarR);
    scene.add(satGroup);

    // Initial positioning
    orcaGroup.position.set(0.3, -0.1, 0);
    orcaGroup.rotation.set(0.12, 0.45, -0.08);

    // --- INTERACTION & ANIMATION LOOP ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0.45;
    let targetRotX = 0.12;
    let targetPosY = -0.1;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = nx;
      mouseY = ny;
      if (interactive) {
        targetRotY = 0.45 + nx * 0.4;
        targetRotX = 0.12 - ny * 0.3;
        targetPosY = -0.1 + ny * 0.4;
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Kinematic Sinusoidal Undulation (Swimming motion)
      const swimCycle = Math.sin(elapsedTime * 2.8);
      const spineCycle = Math.cos(elapsedTime * 2.8);

      // Tail and fluke bend
      tailStem.rotation.y = swimCycle * 0.22;
      tailStem.position.y = spineCycle * 0.06;
      flukeMesh.rotation.z = swimCycle * 0.35;
      flukeMesh.position.y = -0.02 + spineCycle * 0.12;

      // Pectorals subtle pitching
      leftFlipper.rotation.z = -0.4 + swimCycle * 0.08;
      rightFlipper.rotation.z = -0.4 - swimCycle * 0.08;

      // Smooth lerp to mouse guidance
      orcaGroup.rotation.y += (targetRotY - orcaGroup.rotation.y) * 0.05;
      orcaGroup.rotation.x += (targetRotX - orcaGroup.rotation.x) * 0.05;
      orcaGroup.position.y += (targetPosY + Math.sin(elapsedTime * 1.5) * 0.12 - orcaGroup.position.y) * 0.04;
      orcaGroup.position.x += (0.3 + mouseX * 0.25 - orcaGroup.position.x) * 0.03;

      // Bank orca body slightly into turning direction
      orcaGroup.rotation.z = (targetRotY - 0.45) * -0.3 + swimCycle * 0.03;

      // Drift particles with wake
      const pPositions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        pPositions[i] += particleVel[i];
        pPositions[i + 1] += particleVel[i + 1];
        pPositions[i + 2] += particleVel[i + 2];

        // Wrap particles
        if (pPositions[i + 1] < -4) pPositions[i + 1] = 4;
        if (pPositions[i] > 8) pPositions[i] = -8;
        if (pPositions[i] < -8) pPositions[i] = 8;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse biometric sensor glow
      const glowIntensity = 0.8 + Math.sin(elapsedTime * 4.0) * 0.25;
      sensoryCircuitsMaterial.color.setRGB(0.13 * glowIntensity, 0.82 * glowIntensity, 0.93 * glowIntensity);

      // Satellite beam pulsation
      beamCone.rotation.y = elapsedTime * 0.15;
      satGroup.rotation.y = elapsedTime * 0.2;

      renderer.render(scene, camera);

      if (onTelemetryUpdate && Math.random() < 0.1) {
        onTelemetryUpdate({
          depth: Number((18.4 + Math.sin(elapsedTime * 0.5) * 2.1).toFixed(1)),
          speed: Number((12.4 + swimCycle * 0.6).toFixed(1)),
          pitch: Number((orcaGroup.rotation.x * 57.3).toFixed(1))
        });
      }
    };

    animate();
    setIsReady(true);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [renderQuality, interactive, onTelemetryUpdate]);

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Atmospheric Vignette and Depth Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-90" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#030712]/80 via-transparent to-[#030712]/60" />

      {/* 3D Controls HUD Overlay (Quality Switcher + Watermark) */}
      <div className="absolute bottom-4 left-6 z-20 flex items-center gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#061226]/80 backdrop-blur-md rounded-lg border border-cyan-500/20 text-xs">
          {(['low', 'med', 'high'] as const).map(q => (
            <button
              key={q}
              onClick={() => setRenderQuality(q)}
              className={`px-2.5 py-1 uppercase font-mono rounded transition-colors ${
                renderQuality === q
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="text-[11px] font-mono text-cyan-400/70 tracking-wider">
          WebGL 60FPS · Caustics & Kinematics Active
        </div>
      </div>
    </div>
  );
};
