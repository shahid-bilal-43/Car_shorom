import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sun, Moon, Eye, Palette, RefreshCw, Sparkles } from 'lucide-react';

interface PaintOption {
  name: string;
  color: string;
  hex: number;
}

const PAINT_OPTIONS: PaintOption[] = [
  { name: 'Alpine Pearl White', color: '#F8FAFC', hex: 0xf8fafc },
  { name: 'Leghari Royal Gold', color: '#C6A15B', hex: 0xc6a15b },
  { name: 'Obsidian Jet Black', color: '#111317', hex: 0x111317 },
  { name: 'Liquid Metallic Silver', color: '#94A3B8', hex: 0x94a3b8 },
  { name: 'Deep Royal Blue', color: '#1E3A8A', hex: 0x1e3a8a },
];

export const ThreeCarShowroom: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<PaintOption>(PAINT_OPTIONS[0]); // Default Alpine Pearl White
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [lightingPreset, setLightingPreset] = useState<'pure-white' | 'golden-hour' | 'studio-spot'>('pure-white');
  const [isInteracting, setIsInteracting] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // References to three objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const bodyMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const lightsRef = useRef<{
    keyLight: THREE.SpotLight;
    goldRimLight: THREE.SpotLight;
    ambientLight: THREE.AmbientLight;
    topSoftbox: THREE.DirectionalLight;
  } | null>(null);

  // Pointer drag state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene - Bright White Studio Environment
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf6f8fb);
    scene.fog = new THREE.FogExp2(0xf6f8fb, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.6, 2.1, 5.2);
    camera.lookAt(0, 0.45, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting (Pristine Daylight / Softbox Showroom)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const topSoftbox = new THREE.DirectionalLight(0xffffff, 2.2);
    topSoftbox.position.set(0, 10, 0);
    scene.add(topSoftbox);

    const keyLight = new THREE.SpotLight(0xffffff, 4.5);
    keyLight.position.set(6, 8, 6);
    keyLight.angle = Math.PI / 4;
    keyLight.penumbra = 0.8;
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const goldRimLight = new THREE.SpotLight(0xc6a15b, 4.0);
    goldRimLight.position.set(-6, 4, -5);
    goldRimLight.angle = Math.PI / 3;
    goldRimLight.penumbra = 0.9;
    scene.add(goldRimLight);

    lightsRef.current = { keyLight, goldRimLight, ambientLight, topSoftbox };

    // 5. White Polished Showroom Turntable Floor
    const floorGeo = new THREE.PlaneGeometry(35, 35);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.35,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Decorative Circular Gold Turntable Ring on Floor
    const ringGeo = new THREE.RingGeometry(2.5, 2.54, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc6a15b, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // 6. High-Detail 3D Car Model
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: selectedColor.hex,
      metalness: 0.85,
      roughness: 0.18,
    });
    bodyMaterialsRef.current = [bodyMat];

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.8,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.08,
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.3,
      roughness: 0.6,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x1e222a,
      roughness: 0.9,
      metalness: 0.05,
    });

    const brakeMat = new THREE.MeshStandardMaterial({
      color: 0xc6a15b, // Leghari Gold performance brake caliper
      roughness: 0.25,
      metalness: 0.85,
    });

    const headlampMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xdbeafe,
      emissiveIntensity: 2.8,
      roughness: 0.1,
    });

    const taillampMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 2.5,
      roughness: 0.2,
    });

    // Main Lower Chassis
    const lowerBodyGeo = new THREE.BoxGeometry(1.85, 0.44, 3.8);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
    lowerBody.position.y = 0.45;
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    carGroup.add(lowerBody);

    // Upper Cabin
    const cabinGeo = new THREE.BoxGeometry(1.5, 0.46, 2.1);
    const cabin = new THREE.Mesh(cabinGeo, bodyMat);
    cabin.position.set(0, 0.86, -0.15);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Front Windshield
    const frontWindshieldGeo = new THREE.BoxGeometry(1.46, 0.42, 0.8);
    const frontWindshield = new THREE.Mesh(frontWindshieldGeo, glassMat);
    frontWindshield.position.set(0, 0.83, 0.65);
    frontWindshield.rotation.x = Math.PI / 6;
    carGroup.add(frontWindshield);

    // Rear Windshield
    const rearWindshieldGeo = new THREE.BoxGeometry(1.46, 0.4, 0.85);
    const rearWindshield = new THREE.Mesh(rearWindshieldGeo, glassMat);
    rearWindshield.position.set(0, 0.81, -0.95);
    rearWindshield.rotation.x = -Math.PI / 5.5;
    carGroup.add(rearWindshield);

    // Side Windows
    const sideWindowGeo = new THREE.BoxGeometry(1.52, 0.33, 1.4);
    const sideWindow = new THREE.Mesh(sideWindowGeo, glassMat);
    sideWindow.position.set(0, 0.85, -0.15);
    carGroup.add(sideWindow);

    // Front Nose / Grille
    const noseGeo = new THREE.BoxGeometry(1.78, 0.32, 0.6);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.position.set(0, 0.39, 1.95);
    nose.castShadow = true;
    carGroup.add(nose);

    // Chrome Grille Frame
    const grilleGeo = new THREE.BoxGeometry(1.22, 0.22, 0.08);
    const grille = new THREE.Mesh(grilleGeo, darkTrimMat);
    grille.position.set(0, 0.36, 2.26);
    carGroup.add(grille);

    // Leghari Emblem
    const badgeGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.02, 16);
    const badge = new THREE.Mesh(badgeGeo, brakeMat);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0, 0.38, 2.31);
    carGroup.add(badge);

    // Dual LED Matrix Headlamps
    const leftLight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.09, 0.1), headlampMat);
    leftLight.position.set(0.65, 0.44, 2.22);
    carGroup.add(leftLight);

    const rightLight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.09, 0.1), headlampMat);
    rightLight.position.set(-0.65, 0.44, 2.22);
    carGroup.add(rightLight);

    // Rear Connected Taillight Bar
    const rearLightBar = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.08, 0.08), taillampMat);
    rearLightBar.position.set(0, 0.52, -1.92);
    carGroup.add(rearLightBar);

    // Diffuser & Exhausts
    const diffuserGeo = new THREE.BoxGeometry(1.4, 0.18, 0.12);
    const diffuser = new THREE.Mesh(diffuserGeo, darkTrimMat);
    diffuser.position.set(0, 0.24, -1.93);
    carGroup.add(diffuser);

    const exhaustGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16);
    const exhaustLeft = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaustLeft.rotation.x = Math.PI / 2;
    exhaustLeft.position.set(0.5, 0.22, -1.97);
    carGroup.add(exhaustLeft);

    const exhaustRight = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaustRight.rotation.x = Math.PI / 2;
    exhaustRight.position.set(-0.5, 0.22, -1.97);
    carGroup.add(exhaustRight);

    // Side Aerodynamic Mirrors
    const mirrorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.15), bodyMat);
    mirrorLeft.position.set(0.92, 0.76, 0.65);
    carGroup.add(mirrorLeft);

    const mirrorRight = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.15), bodyMat);
    mirrorRight.position.set(-0.92, 0.76, 0.65);
    carGroup.add(mirrorRight);

    // 4 Wheels with Alloy Rims & Gold Calipers
    const wheelPositions = [
      { x: 0.94, y: 0.33, z: 1.15 },
      { x: -0.94, y: 0.33, z: 1.15 },
      { x: 0.94, y: 0.33, z: -1.15 },
      { x: -0.94, y: 0.33, z: -1.15 },
    ];

    wheelPositions.forEach((pos, idx) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      // Rubber Tire
      const tireGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.24, 28);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Alloy Rim Face
      const rimGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.25, 20);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Leghari Gold Caliper
      const caliperGeo = new THREE.BoxGeometry(0.08, 0.14, 0.1);
      const caliper = new THREE.Mesh(caliperGeo, brakeMat);
      caliper.position.set(idx % 2 === 0 ? -0.04 : 0.04, 0.1, 0);
      wheelGroup.add(caliper);

      carGroup.add(wheelGroup);
    });

    scene.add(carGroup);

    // 7. Event Handlers for Drag-to-Rotate
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      setIsInteracting(true);
      setIsAutoRotating(false);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !carGroupRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      carGroupRef.current.rotation.y += deltaX * 0.008;

      if (cameraRef.current) {
        cameraRef.current.position.y = Math.max(1.2, Math.min(3.4, cameraRef.current.position.y - deltaY * 0.005));
        cameraRef.current.lookAt(0, 0.45, 0);
      }

      rotationVelocityRef.current = { x: deltaX * 0.002, y: deltaY * 0.001 };
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 520;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (carGroupRef.current) {
        if (isAutoRotating && !isDraggingRef.current) {
          carGroupRef.current.rotation.y += 0.004;
        } else if (!isDraggingRef.current && Math.abs(rotationVelocityRef.current.x) > 0.0001) {
          carGroupRef.current.rotation.y += rotationVelocityRef.current.x;
          rotationVelocityRef.current.x *= 0.92;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (domEl.parentNode) {
        domEl.parentNode.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, [isAutoRotating]);

  // Update Paint Color dynamically
  useEffect(() => {
    bodyMaterialsRef.current.forEach((mat) => {
      mat.color.setHex(selectedColor.hex);
    });
  }, [selectedColor]);

  // Update Lighting Presets
  useEffect(() => {
    if (!lightsRef.current || !sceneRef.current) return;
    const { keyLight, goldRimLight, ambientLight, topSoftbox } = lightsRef.current;

    if (lightingPreset === 'pure-white') {
      sceneRef.current.background = new THREE.Color(0xf6f8fb);
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 1.4;
      topSoftbox.intensity = 2.2;
      keyLight.intensity = 4.5;
      goldRimLight.color.setHex(0xc6a15b);
      goldRimLight.intensity = 4.0;
    } else if (lightingPreset === 'golden-hour') {
      sceneRef.current.background = new THREE.Color(0xfcf7ec);
      ambientLight.color.setHex(0xfffaed);
      ambientLight.intensity = 1.2;
      topSoftbox.intensity = 1.5;
      keyLight.intensity = 3.5;
      goldRimLight.color.setHex(0xd99b26);
      goldRimLight.intensity = 7.5;
    } else if (lightingPreset === 'studio-spot') {
      sceneRef.current.background = new THREE.Color(0xedf2f7);
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 1.0;
      topSoftbox.intensity = 3.0;
      keyLight.intensity = 6.0;
      goldRimLight.color.setHex(0xffffff);
      goldRimLight.intensity = 3.0;
    }
  }, [lightingPreset]);

  const handleResetCamera = () => {
    if (cameraRef.current && carGroupRef.current) {
      cameraRef.current.position.set(4.6, 2.1, 5.2);
      cameraRef.current.lookAt(0, 0.45, 0);
      carGroupRef.current.rotation.set(0, 0, 0);
      setIsAutoRotating(true);
    }
  };

  if (!webglSupported) {
    return (
      <div className="w-full h-[500px] rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center p-8 text-center shadow-sm">
        <Eye className="w-12 h-12 text-[#C6A15B] mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">3D Virtual Showroom Studio</h3>
        <p className="text-sm text-slate-500 max-w-md">
          Hardware WebGL acceleration is unavailable. You can browse all verified showroom photography below.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl bg-[#F6F8FB] border border-slate-200/90 overflow-hidden shadow-xl select-none group">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Brand Watermark in Clean White Glass */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 pointer-events-none z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-800">
            Leghari 3D Animated Studio
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
          Interactive White Showroom
        </h3>
        <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
          Drag to rotate 360° · Test paint finishes & daylight lighting
        </p>
      </div>

      {/* Rotating Prompt Overlay */}
      {isInteracting && (
        <div className="absolute top-6 right-6 pointer-events-none z-10 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
          Rotating 360°
        </div>
      )}

      {/* Bottom Floating Controls in Crisp White Frosted Glass */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-10 pointer-events-auto">
        {/* Paint Finish Selector */}
        <div className="flex items-center gap-2 p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md">
          <Palette className="w-4 h-4 text-slate-500 ml-1.5 hidden xs:block" />
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline mr-1">Exterior:</span>
          <div className="flex items-center gap-1.5">
            {PAINT_OPTIONS.map((paint) => {
              const isActive = selectedColor.name === paint.name;
              return (
                <button
                  key={paint.name}
                  onClick={() => setSelectedColor(paint)}
                  title={paint.name}
                  className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center border ${
                    isActive
                      ? 'scale-110 border-[#C6A15B] shadow-[0_0_10px_rgba(198,161,91,0.5)] ring-2 ring-[#C6A15B]/30'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: paint.color }}
                >
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#C6A15B]" />}
                </button>
              );
            })}
          </div>
          <span className="text-xs text-[#9F7E3B] font-bold ml-1 hidden md:inline">
            {selectedColor.name}
          </span>
        </div>

        {/* Studio Presets & Controls */}
        <div className="flex items-center gap-2">
          {/* Lighting Mode Buttons */}
          <div className="flex items-center p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md">
            <button
              onClick={() => setLightingPreset('pure-white')}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-colors ${
                lightingPreset === 'pure-white'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Bright White Daylight"
            >
              <Sun className="w-3.5 h-3.5 inline mr-1 text-[#C6A15B]" />
              Daylight
            </button>
            <button
              onClick={() => setLightingPreset('golden-hour')}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-colors ${
                lightingPreset === 'golden-hour'
                  ? 'bg-[#C6A15B] text-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Warm Golden Showroom"
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              Golden
            </button>
            <button
              onClick={() => setLightingPreset('studio-spot')}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-colors ${
                lightingPreset === 'studio-spot'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="High-Contrast Studio Spotlights"
            >
              <Eye className="w-3.5 h-3.5 inline mr-1 text-[#C6A15B]" />
              Studio
            </button>
          </div>

          {/* Auto-Rotation Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2.5 rounded-2xl backdrop-blur-md border transition-colors shadow-md ${
              isAutoRotating
                ? 'bg-white border-[#C6A15B] text-[#9F7E3B]'
                : 'bg-white/95 border-slate-200 text-slate-500 hover:text-slate-900'
            }`}
            title={isAutoRotating ? 'Pause 360 Rotation' : 'Start 360 Rotation'}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Reset Camera View */}
          <button
            onClick={handleResetCamera}
            className="p-2.5 rounded-2xl bg-white/95 hover:bg-slate-50 backdrop-blur-md border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-md"
            title="Reset Camera View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
