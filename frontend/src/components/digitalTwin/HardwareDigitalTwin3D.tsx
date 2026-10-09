import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HARDWARE_COMPONENTS } from '../../services/digitalTwinConstants';
import { CameraPreset, HardwareEntityId, HardwareTelemetryContract } from '../../types/digitalTwin';

interface HardwareDigitalTwin3DProps {
  telemetry: HardwareTelemetryContract;
  selectedComponentId: HardwareEntityId | null;
  onSelectComponent: (id: HardwareEntityId) => void;
  cameraPreset: CameraPreset;
  showLabels: boolean;
  showWires: boolean;
}

export const HardwareDigitalTwin3D: React.FC<HardwareDigitalTwin3DProps> = ({
  telemetry,
  selectedComponentId,
  onSelectComponent,
  cameraPreset,
  showLabels,
  showWires,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<HardwareEntityId | null>(null);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Dynamic mesh references
  const oledTextureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const oledTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const pin13LedRef = useRef<THREE.Mesh | null>(null);
  const pin13LightRef = useRef<THREE.PointLight | null>(null);
  const txRxLedRef = useRef<THREE.Mesh | null>(null);
  const mq7GlowRef = useRef<THREE.Mesh | null>(null);
  const dustBeamRef = useRef<THREE.Mesh | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const buzzerRippleRef = useRef<THREE.Mesh | null>(null);

  const interactiveObjectsRef = useRef<{ [key: string]: THREE.Object3D }>({});
  const wireGroupRef = useRef<THREE.Group | null>(null);

  // Camera target animation state
  const targetCamPos = useRef(new THREE.Vector3(0, 11, 14));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  // Only lerp when a preset / selection triggers a camera move
  const isCameraTransitioning = useRef(false);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06090e); // Sleek cyber-laboratory dark base
    scene.fog = new THREE.FogExp2(0x06090e, 0.022);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 11, 14);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't clip below workbench
    controls.minDistance = 2.5;
    controls.maxDistance = 24.0;
    controls.target.set(0, 0, 0);
    // Cancel any active camera transition the moment the user grabs / scrolls
    controls.addEventListener('start', () => {
      isCameraTransitioning.current = false;
    });
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.9);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffffff, 45, 30, Math.PI / 4, 0.35, 1);
    mainSpot.position.set(5, 14, 6);
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 2048;
    mainSpot.shadow.mapSize.height = 2048;
    mainSpot.shadow.bias = -0.0001;
    scene.add(mainSpot);

    const rimLightBlue = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLightBlue.position.set(-10, 6, -8);
    scene.add(rimLightBlue);

    const rimLightAmber = new THREE.DirectionalLight(0xf59e0b, 0.7);
    rimLightAmber.position.set(10, 4, -8);
    scene.add(rimLightAmber);

    // 6. Workbench / Acrylic Prototyping Chassis with Brass Standoffs
    createAcrylicChassis(scene);

    // 7. Create All 12 Physical Hardware Entities
    createAllHardwareEntities(scene, interactiveObjectsRef.current);

    // 8. Create Continuous 3D Color-Coded Wiring Harness
    const wireGroup = createWiringHarness();
    scene.add(wireGroup);
    wireGroupRef.current = wireGroup;

    // 9. Dust Particle Chamber System
    const dustParticles = createDustParticleSystem();
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera interpolation toward target (only runs during a programmatic preset / click)
      if (isCameraTransitioning.current) {
        camera.position.lerp(targetCamPos.current, 0.06);
        controls.target.lerp(targetLookAt.current, 0.06);
        // Stop transitioning once close enough so OrbitControls can take over freely
        const posClose = camera.position.distanceTo(targetCamPos.current) < 0.04;
        const lookClose = controls.target.distanceTo(targetLookAt.current) < 0.02;
        if (posClose && lookClose) {
          isCameraTransitioning.current = false;
          // Sync OrbitControls internal state so zoom/pan work from the new position
          controls.target.copy(targetLookAt.current);
        }
      }
      controls.update();

      // Dynamic LED blinking & pulsing
      if (pin13LedRef.current && pin13LightRef.current) {
        // 1 Hz heartbeat pulse
        const pulse = Math.sin(time * 6.28) > 0 ? 1 : 0.15;
        (pin13LedRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 2.5;
        pin13LightRef.current.intensity = pulse * 1.2;
      }

      if (txRxLedRef.current) {
        // Fast random serial flickers
        const flicker = Math.random() > 0.4 ? 1.5 : 0.1;
        (txRxLedRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flicker;
      }

      // MQ7 Thermal Glow Pulsing (Cyclic 5V / 1.4V heating)
      if (mq7GlowRef.current) {
        const glow = 0.5 + 0.5 * Math.sin(time * 1.5);
        (mq7GlowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glow * 2.0;
      }

      // GP2Y1010 Optical Beam & Particles
      if (dustBeamRef.current) {
        const beamPulse = 0.4 + 0.6 * Math.abs(Math.sin(time * 8.0));
        (dustBeamRef.current.material as THREE.MeshBasicMaterial).opacity = beamPulse * 0.7;
      }

      if (dustParticlesRef.current) {
        const positions = dustParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time + i) * 0.002;
          positions[i + 2] -= 0.008; // Move through chamber
          if (positions[i + 2] < -4.8) {
            positions[i + 2] = -3.8;
          }
        }
        dustParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Piezo Buzzer Acoustic Ripple Ring
      if (buzzerRippleRef.current) {
        if (buzzerRippleRef.current.visible) {
          const scale = 1.0 + ((time * 3.5) % 3.0) * 0.8;
          buzzerRippleRef.current.scale.set(scale, scale, 1);
          const opacity = Math.max(0, 1.0 - (scale - 1.0) / 2.4);
          (buzzerRippleRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
        }
      }

      // Render Dynamic OLED Texture
      updateOledCanvas();

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update dynamic OLED Canvas texture whenever telemetry changes
  const updateOledCanvas = () => {
    const canvas = oledTextureCanvasRef.current;
    const texture = oledTextureRef.current;
    if (!canvas || !texture) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // SSD1306 128x64 display styled as crisp monochrome cyan/amber OLED
    ctx.fillStyle = '#050c14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines / pixel borders
    ctx.strokeStyle = '#0ea5e922';
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    // Top status bar
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('ARDUINO UNO Q', 8, 20);

    ctx.fillStyle = '#10b981';
    ctx.font = '12px monospace';
    ctx.fillText(`SEQ:#${telemetry.sequence_id}`, 160, 20);

    // Divider line
    ctx.strokeStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(8, 26);
    ctx.lineTo(248, 26);
    ctx.stroke();

    // Big AQI Score
    const aqi = telemetry.aqi;
    let aqiColor = '#10b981';
    let aqiLabel = 'GOOD';
    if (aqi > 50) { aqiColor = '#facc15'; aqiLabel = 'MODERATE'; }
    if (aqi > 100) { aqiColor = '#fb923c'; aqiLabel = 'UNHEALTHY*'; }
    if (aqi > 150) { aqiColor = '#ef4444'; aqiLabel = 'HAZARDOUS'; }

    ctx.fillStyle = aqiColor;
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`AQI ${aqi}`, 10, 52);

    ctx.font = 'bold 13px monospace';
    ctx.fillText(`[${aqiLabel}]`, 128, 50);

    // Live Sensor Metrics Row
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText(`CO:${telemetry.mq7_co_ppm}ppm  CO2:${telemetry.mg811_co2_ppm}ppm`, 10, 72);
    ctx.fillText(`DUST:${telemetry.gp2y1010_dust}µg  VOC:${telemetry.ags10_tvoc}ppb`, 10, 90);
    ctx.fillText(`T:${telemetry.dht22_temp}°C  RH:${telemetry.dht22_humidity}%`, 10, 108);

    // Bottom Alert or Ticker Banner
    if (telemetry.buzzer_active) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(8, 114, 240, 12);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('! ! HAZARD ALARM ACTIVE ! !', 35, 123);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('SYSTEM HEALTH: 100% ONLINE (ADC 3.3V)', 10, 123);
    }

    texture.needsUpdate = true;
  };

  // Sync Buzzer Ripple visibility
  useEffect(() => {
    if (buzzerRippleRef.current) {
      buzzerRippleRef.current.visible = telemetry.buzzer_active;
    }
  }, [telemetry.buzzer_active]);

  // Wire Harness visibility
  useEffect(() => {
    if (wireGroupRef.current) {
      wireGroupRef.current.visible = showWires;
    }
  }, [showWires]);

  // Camera Presets handler — starts a transition, lerp stops when camera arrives
  useEffect(() => {
    if (!controlsRef.current) return;
    switch (cameraPreset) {
      case 'uno_q':
        targetCamPos.current.set(0, 5.2, 5.0);
        targetLookAt.current.set(0, 0.45, 0);
        break;
      case 'mq_array':
        targetCamPos.current.set(-0.5, 6.0, -1.0);
        targetLookAt.current.set(-0.5, 0.5, -4.5);
        break;
      case 'sharp_dust':
        targetCamPos.current.set(6.5, 4.0, -1.8);
        targetLookAt.current.set(6.5, 0.55, -4.3);
        break;
      case 'digital_display':
        targetCamPos.current.set(-1.0, 4.5, 5.5);
        targetLookAt.current.set(-1.0, 0.45, 2.5);
        break;
      case 'full':
      default:
        targetCamPos.current.set(0, 11, 14);
        targetLookAt.current.set(0, 0, 0);
        break;
    }
    isCameraTransitioning.current = true;
  }, [cameraPreset]);

  // When a component is selected from outside, smoothly pan camera to it
  useEffect(() => {
    if (!selectedComponentId) return;
    const comp = HARDWARE_COMPONENTS.find((c) => c.id === selectedComponentId);
    if (comp) {
      targetCamPos.current.set(comp.position[0], comp.position[1] + 3.8, comp.position[2] + 4.2);
      targetLookAt.current.set(comp.position[0], comp.position[1], comp.position[2]);
      isCameraTransitioning.current = true;
    }
  }, [selectedComponentId]);

  // Click & Hover raycasting
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const hitTargets = Object.entries(interactiveObjectsRef.current).map(([id, obj]) => ({
      id,
      obj,
    }));

    const objectsToTest = hitTargets.map((h) => h.obj);
    const intersects = raycaster.intersectObjects(objectsToTest, true);

    if (intersects.length > 0) {
      let topHit = intersects[0].object;
      while (topHit.parent && !topHit.userData?.componentId && topHit.parent !== sceneRef.current) {
        topHit = topHit.parent;
      }
      const componentId = topHit.userData?.componentId as HardwareEntityId | undefined;
      if (componentId) {
        onSelectComponent(componentId);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const objectsToTest = Object.values(interactiveObjectsRef.current);
    const intersects = raycaster.intersectObjects(objectsToTest, true);

    if (intersects.length > 0) {
      let topHit = intersects[0].object;
      while (topHit.parent && !topHit.userData?.componentId && topHit.parent !== sceneRef.current) {
        topHit = topHit.parent;
      }
      const componentId = topHit.userData?.componentId as HardwareEntityId | undefined;
      setHoveredId(componentId || null);
      container.style.cursor = componentId ? 'pointer' : 'default';
    } else {
      setHoveredId(null);
      container.style.cursor = 'default';
    }
  };

  // Helper: Create the dark acrylic chassis
  const createAcrylicChassis = (scene: THREE.Scene) => {
    // Acrylic slab (20 x 14 units)
    const baseGeo = new THREE.BoxGeometry(18.5, 0.35, 12.5);
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c111d,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.75,
      opacity: 0.95,
      transparent: true,
      reflectivity: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const basePlate = new THREE.Mesh(baseGeo, baseMat);
    basePlate.position.set(0, 0, 0);
    basePlate.receiveShadow = true;
    scene.add(basePlate);

    // Laser-etched grid lines
    const gridHelper = new THREE.GridHelper(18, 36, 0x0284c7, 0x1e293b);
    gridHelper.position.set(0, 0.19, 0);
    scene.add(gridHelper);

    // 4 Corner Brass Standoffs with hex caps
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.88,
      roughness: 0.28,
    });
    const standoffCorners = [
      [-8.6, -5.6],
      [8.6, -5.6],
      [-8.6, 5.6],
      [8.6, 5.6],
    ];

    standoffCorners.forEach(([cx, cz]) => {
      const colGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.7, 16);
      const standoff = new THREE.Mesh(colGeo, brassMat);
      standoff.position.set(cx, 0.15, cz);
      standoff.castShadow = true;
      scene.add(standoff);

      const screwHeadGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.12, 6);
      const screwHead = new THREE.Mesh(screwHeadGeo, brassMat);
      screwHead.position.set(cx, 0.54, cz);
      scene.add(screwHead);
    });

    // Outer laboratory bench floor with shadow catcher
    const benchGeo = new THREE.PlaneGeometry(60, 60);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.85,
      metalness: 0.05,
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.rotation.x = -Math.PI / 2;
    bench.position.y = -0.22;
    bench.receiveShadow = true;
    scene.add(bench);
  };

  // Helper: Create all 12 entities
  const createAllHardwareEntities = (scene: THREE.Scene, map: { [key: string]: THREE.Object3D }) => {
    // 1. Arduino UNO Q Board
    const unoQGroup = buildArduinoUnoQ();
    scene.add(unoQGroup);
    map['uno_q'] = unoQGroup;

    // 2. External 5V Regulated Power Supply Module
    const psuGroup = buildPowerSupplyModule();
    scene.add(psuGroup);
    map['power_supply'] = psuGroup;

    // 3. MQ135 Hazardous Gas & Air Quality Sensor
    const mq135Group = buildMoxSensor('mq135', '#1e3a8a', 0x94a3b8, 'MQ-135', [-4.6, 0.45, -4.5]);
    scene.add(mq135Group);
    map['mq135'] = mq135Group;

    // 4. MQ7 Carbon Monoxide (CO) Sensor (Orange Ring Cap)
    const mq7Group = buildMq7Sensor([-2.4, 0.45, -4.5]);
    scene.add(mq7Group);
    map['mq7'] = mq7Group;

    // 5. MG811 Solid Electrolyte CO2 Sensor
    const mg811Group = buildMg811Sensor([-0.2, 0.45, -4.5]);
    scene.add(mg811Group);
    map['mg811'] = mg811Group;

    // 6. MQ2 Combustible Gas & Smoke Sensor
    const mq2Group = buildMoxSensor('mq2', '#1e3a8a', 0x94a3b8, 'MQ-2', [2.0, 0.45, -4.5]);
    scene.add(mq2Group);
    map['mq2'] = mq2Group;

    // 7. MQ6 LPG & Isobutane Gas Sensor
    const mq6Group = buildMoxSensor('mq6', '#1e3a8a', 0x94a3b8, 'MQ-6', [4.2, 0.45, -4.5]);
    scene.add(mq6Group);
    map['mq6'] = mq6Group;

    // 8. GP2Y1010AU0F Sharp Optical Dust Sensor
    const dustGroup = buildSharpDustSensor([6.5, 0.45, -4.3]);
    scene.add(dustGroup);
    map['gp2y1010'] = dustGroup;

    // 9. DHT22 / AM2302 Precision Climate Sensor
    const dhtGroup = buildDht22Sensor([-5.5, 0.45, 0.5]);
    scene.add(dhtGroup);
    map['dht22'] = dhtGroup;

    // 10. Piezo Acoustic Alarm Buzzer
    const buzzerGroup = buildPiezoBuzzer([-3.6, 0.45, 2.8]);
    scene.add(buzzerGroup);
    map['buzzer'] = buzzerGroup;

    // 11. 0.96" I2C Monochrome OLED Display (SSD1306)
    const oledGroup = buildOledDisplay([0.0, 0.45, 3.5]);
    scene.add(oledGroup);
    map['oled'] = oledGroup;

    // 12. AGS10 Digital MEMS TVOC Sensor
    const agsGroup = buildAgs10Sensor([4.6, 0.38, 1.2]);
    scene.add(agsGroup);
    map['ags10'] = agsGroup;
  };

  // 1. Build Arduino UNO Q
  const buildArduinoUnoQ = (): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(0, 0.38, 0);
    group.userData = { componentId: 'uno_q' };

    // Iconic Arduino Teal/Navy PCB
    const pcbGeo = new THREE.BoxGeometry(4.8, 0.16, 3.8);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x008184, // Official Arduino teal
      roughness: 0.35,
      metalness: 0.1,
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.castShadow = true;
    pcb.receiveShadow = true;
    group.add(pcb);

    // Silkscreen white text canvas on PCB
    const silkscreenCanvas = document.createElement('canvas');
    silkscreenCanvas.width = 512;
    silkscreenCanvas.height = 384;
    const sctx = silkscreenCanvas.getContext('2d');
    if (sctx) {
      sctx.fillStyle = '#008184';
      sctx.fillRect(0, 0, 512, 384);

      // Gold traces simulation
      sctx.strokeStyle = '#b45309';
      sctx.lineWidth = 3;
      sctx.beginPath();
      sctx.moveTo(80, 50); sctx.lineTo(240, 50); sctx.lineTo(240, 180);
      sctx.moveTo(120, 320); sctx.lineTo(380, 320);
      sctx.stroke();

      // Silkscreen text
      sctx.fillStyle = '#ffffff';
      sctx.font = 'bold 28px sans-serif';
      sctx.fillText('ARDUINO UNO Q', 140, 100);
      sctx.font = 'bold 36px sans-serif';
      sctx.fillText('∞', 90, 100); // Infinity logo
      sctx.font = '16px monospace';
      sctx.fillText('DUAL-CORE ARM + NPU SoC', 140, 130);
      sctx.fillText('ADC 3.3V SAFE LOGIC BUS', 140, 155);

      // Pin labels
      sctx.font = 'bold 12px monospace';
      sctx.fillText('D0 D1 D2 D3 D4 D5 D6 D7 D8 D9 D10 D11 D12 D13 GND AREF SDA SCL', 20, 24);
      sctx.fillText('IOREF RST 3V3 5V GND GND VIN    A0 A1 A2 A3 A4 A5', 50, 365);
    }
    const silkTexture = new THREE.CanvasTexture(silkscreenCanvas);
    const silkMat = new THREE.MeshBasicMaterial({ map: silkTexture });
    const silkPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.7, 3.7), silkMat);
    silkPlane.rotation.x = -Math.PI / 2;
    silkPlane.position.y = 0.085;
    group.add(silkPlane);

    // Silver metallic RF Shield over Dual-Core ARM Cortex + Linux NPU SoC
    const shieldGeo = new THREE.BoxGeometry(1.6, 0.22, 1.6);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.95,
      roughness: 0.22,
    });
    const rfShield = new THREE.Mesh(shieldGeo, shieldMat);
    rfShield.position.set(-0.2, 0.18, -0.1);
    rfShield.castShadow = true;
    group.add(rfShield);

    // ATmega / Secondary MCU chip with gold legs
    const mcuGeo = new THREE.BoxGeometry(0.9, 0.14, 0.9);
    const mcuMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4 });
    const mcu = new THREE.Mesh(mcuGeo, mcuMat);
    mcu.position.set(1.4, 0.15, -0.3);
    group.add(mcu);

    // Dual USB-C metallic jacks (left edge)
    const usbMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.9, roughness: 0.2 });
    [-0.6, 0.4].forEach((zOff) => {
      const usbGeo = new THREE.BoxGeometry(0.8, 0.32, 0.55);
      const usb = new THREE.Mesh(usbGeo, usbMat);
      usb.position.set(-2.4, 0.22, zOff);
      group.add(usb);
    });

    // 5.5mm DC Barrel Power Jack (bottom-left edge)
    const dcJackGeo = new THREE.BoxGeometry(1.1, 0.6, 0.75);
    const dcJackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });
    const dcJack = new THREE.Mesh(dcJackGeo, dcJackMat);
    dcJack.position.set(-2.2, 0.36, 1.3);
    group.add(dcJack);

    // Black female pin header strips
    const headerMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });
    // Top Digital Header
    const topHeader = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.45, 0.26), headerMat);
    topHeader.position.set(0, 0.3, -1.72);
    group.add(topHeader);

    // Bottom Power & Analog Headers
    const botHeader1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.26), headerMat);
    botHeader1.position.set(-1.1, 0.3, 1.72);
    group.add(botHeader1);

    const botHeader2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.26), headerMat);
    botHeader2.position.set(1.2, 0.3, 1.72);
    group.add(botHeader2);

    // Hardware indicator LEDs: Pin 13 Heartbeat (Green)
    const pin13Geo = new THREE.BoxGeometry(0.12, 0.08, 0.16);
    const pin13Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.5,
    });
    const pin13Led = new THREE.Mesh(pin13Geo, pin13Mat);
    pin13Led.position.set(-0.8, 0.14, -1.2);
    group.add(pin13Led);
    pin13LedRef.current = pin13Led;

    const pin13Light = new THREE.PointLight(0x10b981, 1.0, 1.8);
    pin13Light.position.set(-0.8, 0.3, -1.2);
    group.add(pin13Light);
    pin13LightRef.current = pin13Light;

    // Amber TX/RX LEDs
    const txRxMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.0,
    });
    const txRxLed = new THREE.Mesh(pin13Geo, txRxMat);
    txRxLed.position.set(-0.5, 0.14, -1.2);
    group.add(txRxLed);
    txRxLedRef.current = txRxLed;

    // 10kΩ/20kΩ Resistor Divider Arrays (Simulated onboard step-downs)
    const resGeo = new THREE.BoxGeometry(0.12, 0.08, 0.22);
    const resMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
    [-0.4, -0.1, 0.2, 0.5, 0.8, 1.1].forEach((rx) => {
      const res = new THREE.Mesh(resGeo, resMat);
      res.position.set(rx, 0.12, 1.35);
      group.add(res);
    });

    return group;
  };

  // 2. Build External 5V Regulated Power Supply Module
  const buildPowerSupplyModule = (): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(-6.8, 0.38, -4.5);
    group.userData = { componentId: 'power_supply' };

    // Red industrial enclosure
    const boxGeo = new THREE.BoxGeometry(1.9, 0.85, 2.3);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.3,
      metalness: 0.2,
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.castShadow = true;
    group.add(box);

    // Green dual-screw terminal block
    const termGeo = new THREE.BoxGeometry(0.7, 0.55, 1.2);
    const termMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
    const term = new THREE.Mesh(termGeo, termMat);
    term.position.set(0.9, 0.12, 0);
    group.add(term);

    // Screw cylinders
    const screwMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    [-0.3, 0.3].forEach((sz) => {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 12), screwMat);
      screw.position.set(0.9, 0.45, sz);
      group.add(screw);
    });

    // Silkscreen Label
    const psuLabel = createTextBadge('+5V HEATER PSU', '#fee2e2');
    psuLabel.position.set(0, 0.48, 0);
    group.add(psuLabel);

    return group;
  };

  // 3, 6, 7. Standard MOX Breakout Sensor Builder (MQ135, MQ2, MQ6)
  const buildMoxSensor = (
    id: HardwareEntityId,
    pcbColor: string,
    meshColor: number,
    label: string,
    pos: [number, number, number]
  ): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(...pos);
    group.userData = { componentId: id };

    // Blue square breakout PCB
    const pcbGeo = new THREE.BoxGeometry(1.6, 0.14, 1.6);
    const pcbMat = new THREE.MeshStandardMaterial({ color: pcbColor, roughness: 0.3 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.castShadow = true;
    group.add(pcb);

    // Silver base ring
    const ringGeo = new THREE.CylinderGeometry(0.62, 0.65, 0.18, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.15;
    group.add(ring);

    // Circular stainless steel mesh sensor dome
    const domeGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.8, 24);
    const domeMat = new THREE.MeshStandardMaterial({
      color: meshColor,
      metalness: 0.7,
      roughness: 0.35,
      wireframe: false,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.58;
    dome.castShadow = true;
    group.add(dome);

    // Top metal cap
    const capGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.08, 24);
    const cap = new THREE.Mesh(capGeo, ringMat);
    cap.position.y = 1.0;
    group.add(cap);

    // Header pins (3 pins)
    const pinsGeo = new THREE.BoxGeometry(0.5, 0.35, 0.15);
    const pinsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const pins = new THREE.Mesh(pinsGeo, pinsMat);
    pins.position.set(0, -0.05, 0.68);
    group.add(pins);

    // Label on PCB
    const badge = createTextBadge(label, '#93c5fd');
    badge.position.set(0, 0.1, -0.55);
    group.add(badge);

    return group;
  };

  // 4. Build MQ7 Carbon Monoxide (CO) Sensor with ORANGE TOP RING & Thermal Glow
  const buildMq7Sensor = (pos: [number, number, number]): THREE.Group => {
    const group = buildMoxSensor('mq7', '#1e3a8a', 0x94a3b8, 'MQ-7 (CO)', pos);

    // Distinctive Orange Top Ring
    const orangeRingGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.16, 24);
    const orangeRingMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.25,
      metalness: 0.4,
    });
    const orangeRing = new THREE.Mesh(orangeRingGeo, orangeRingMat);
    orangeRing.position.y = 0.98;
    group.add(orangeRing);

    // Internal active heating coil with thermal amber glow
    const coilGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 1.8,
    });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.position.y = 0.55;
    group.add(coil);
    mq7GlowRef.current = coil;

    return group;
  };

  // 5. Build MG811 Solid Electrolyte CO2 Sensor
  const buildMg811Sensor = (pos: [number, number, number]): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(...pos);
    group.userData = { componentId: 'mg811' };

    // Green square breakout PCB
    const pcbGeo = new THREE.BoxGeometry(1.7, 0.14, 1.7);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.35 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.castShadow = true;
    group.add(pcb);

    // Silver circular mesh dome housing NASICON solid electrolyte
    const baseGeo = new THREE.CylinderGeometry(0.68, 0.72, 0.2, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.85, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.16;
    group.add(base);

    const domeGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.9, 24);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.75, roughness: 0.3 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.65;
    dome.castShadow = true;
    group.add(dome);

    // NASICON cell top cap
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.08, 24), baseMat);
    topCap.position.y = 1.12;
    group.add(topCap);

    // Label
    const badge = createTextBadge('MG-811 CO2', '#86efac');
    badge.position.set(0, 0.1, -0.6);
    group.add(badge);

    return group;
  };

  // 8. Build GP2Y1010AU0F Sharp Optical Dust Sensor
  const buildSharpDustSensor = (pos: [number, number, number]): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(...pos);
    group.userData = { componentId: 'gp2y1010' };

    // Molded black rectangular housing with chamfered corners
    const bodyGeo = new THREE.BoxGeometry(2.1, 1.3, 1.7);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.45,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.65;
    body.castShadow = true;
    group.add(body);

    // Dual circular optical lens ports
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2 });
    [-0.45, 0.45].forEach((lx) => {
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.2, 16), lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(lx, 0.75, 0.85);
      group.add(lens);
    });

    // Pulsed infrared/UV scattering beam inside
    const beamGeo = new THREE.CylinderGeometry(0.08, 0.14, 1.5, 12);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.7,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = Math.PI / 2;
    beam.position.set(0, 0.75, 0);
    group.add(beam);
    dustBeamRef.current = beam;

    // Metal shield clips
    const clipMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.32, 0.5), clipMat);
    clip.position.set(-0.9, 0.65, 0);
    group.add(clip);

    // Silkscreen
    const badge = createTextBadge('SHARP GP2Y1010', '#c084fc');
    badge.position.set(0, 1.35, 0);
    group.add(badge);

    return group;
  };

  // 9. Build DHT22 / AM2302 Precision Climate Sensor
  const buildDht22Sensor = (pos: [number, number, number]): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(...pos);
    group.userData = { componentId: 'dht22' };

    // White rectangular housing
    const bodyGeo = new THREE.BoxGeometry(1.3, 1.8, 0.7);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.05,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    // Slotted ventilation grille
    const slotMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    for (let i = 0; i < 5; i++) {
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.06, 0.05), slotMat);
      slot.position.set(0, 0.55 + i * 0.18, 0.36);
      group.add(slot);
    }

    // Header pins (3 pins)
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.85 });
    [-0.25, 0, 0.25].forEach((px) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), pinMat);
      p.position.set(px, -0.1, 0);
      group.add(p);
    });

    const badge = createTextBadge('DHT22 / AM2302', '#38bdf8');
    badge.position.set(0, 1.85, 0);
    group.add(badge);

    return group;
  };

  // 10. Build Piezo Acoustic Alarm Buzzer
  const buildPiezoBuzzer = (pos: [number, number, number]): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(...pos);
    group.userData = { componentId: 'buzzer' };

    // Black cylindrical sound transducer
    const bodyGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.55, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.45,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.28;
    body.castShadow = true;
    group.add(body);

    // Central audio emission aperture
    const holeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.position.y = 0.56;
    group.add(hole);

    // Animated expanding sound wave ripple ring
    const rippleGeo = new THREE.RingGeometry(0.75, 0.95, 32);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ripple = new THREE.Mesh(rippleGeo, rippleMat);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.y = 0.58;
    ripple.visible = false;
    group.add(ripple);
    buzzerRippleRef.current = ripple;

    const badge = createTextBadge('PIEZO SIREN', '#f87171');
    badge.position.set(0, 0.7, 0);
    group.add(badge);

    return group;
  };

  // 11. Build 0.96" I2C Monochrome OLED Display (SSD1306)
  const buildOledDisplay = (pos: [number, number, number]): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(...pos);
    group.userData = { componentId: 'oled' };

    // Blue breakout PCB
    const pcbGeo = new THREE.BoxGeometry(2.4, 0.14, 2.4);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.castShadow = true;
    group.add(pcb);

    // Top pin header (4 pins: VCC, GND, SDA, SCL)
    const pinStrip = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.35, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x09090b })
    );
    pinStrip.position.set(0, 0.22, -1.0);
    group.add(pinStrip);

    // Dark OLED display glass
    const glassGeo = new THREE.BoxGeometry(2.0, 0.08, 1.4);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x050c14,
      roughness: 0.1,
      metalness: 0.3,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 0.12, 0.1);
    group.add(glass);

    // Dynamic CanvasTexture Screen
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    oledTextureCanvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.NearestFilter;
    oledTextureRef.current = texture;

    const screenMat = new THREE.MeshBasicMaterial({ map: texture });
    const screenGeo = new THREE.PlaneGeometry(1.88, 1.25);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.rotation.x = -Math.PI / 2;
    screenMesh.position.set(0, 0.17, 0.1);
    group.add(screenMesh);

    return group;
  };

  // 12. Build AGS10 Digital MEMS TVOC Sensor
  const buildAgs10Sensor = (pos: [number, number, number]): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(...pos);
    group.userData = { componentId: 'ags10' };

    // Compact green PCB
    const pcbGeo = new THREE.BoxGeometry(1.3, 0.12, 1.3);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.35 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.castShadow = true;
    group.add(pcb);

    // MEMS Gas Sensor IC with gold contact pads
    const icGeo = new THREE.BoxGeometry(0.55, 0.18, 0.55);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.2,
      metalness: 0.7,
    });
    const ic = new THREE.Mesh(icGeo, icMat);
    ic.position.set(0, 0.14, 0);
    group.add(ic);

    // Gold contact pads
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.15 });
    [-0.45, 0.45].forEach((px) => {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.9), goldMat);
      pad.position.set(px, 0.08, 0);
      group.add(pad);
    });

    const badge = createTextBadge('AGS10 TVOC', '#2dd4bf');
    badge.position.set(0, 0.35, 0);
    group.add(badge);

    return group;
  };

  // Helper: Text Badge Sprite
  const createTextBadge = (text: string, colorHex: string): THREE.Mesh => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 256, 64);
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 252, 60);

      ctx.fillStyle = colorHex;
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.3), mat);
    plane.rotation.x = -Math.PI / 2;
    return plane;
  };

  // 8. Dust Particle System Inside Optical Cavity
  const createDustParticleSystem = (): THREE.Points => {
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = 6.5 + (Math.random() - 0.5) * 0.8;
      positions[i + 1] = 0.75 + (Math.random() - 0.5) * 0.4;
      positions[i + 2] = -4.3 + (Math.random() - 0.5) * 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
  };

  // 3D Color-Coded Continuous Wiring Harness
  const createWiringHarness = (): THREE.Group => {
    const wireGroup = new THREE.Group();

    // Helper to create a smooth Catmull-Rom tube
    const addWire = (points: THREE.Vector3[], color: number, radius = 0.035) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, radius, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.15,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      tubeMesh.castShadow = true;
      wireGroup.add(tubeMesh);
    };

    // 1. Red Wires (+5V Rail from External PSU)
    const psuOrigin = new THREE.Vector3(-5.9, 0.6, -4.5);
    const topSensors5V = [
      new THREE.Vector3(-4.6, 0.4, -3.8), // MQ135
      new THREE.Vector3(-2.4, 0.4, -3.8), // MQ7
      new THREE.Vector3(-0.2, 0.4, -3.8), // MG811
      new THREE.Vector3(2.0, 0.4, -3.8),  // MQ2
      new THREE.Vector3(4.2, 0.4, -3.8),  // MQ6
      new THREE.Vector3(5.7, 0.4, -4.3),  // GP2Y1010
    ];

    topSensors5V.forEach((dest) => {
      const mid = new THREE.Vector3((psuOrigin.x + dest.x) / 2, 0.85, (psuOrigin.z + dest.z) / 2);
      addWire([psuOrigin, mid, dest], 0xef4444);
    });

    // 2. Black Wires (Common Ground Bus)
    const arduinoGnd = new THREE.Vector3(-0.7, 0.55, 1.7);
    const gndTargets = [
      new THREE.Vector3(-6.0, 0.5, -4.5), // PSU GND
      new THREE.Vector3(-4.6, 0.4, -3.6), // MQ135
      new THREE.Vector3(-2.4, 0.4, -3.6), // MQ7
      new THREE.Vector3(-0.2, 0.4, -3.6), // MG811
      new THREE.Vector3(2.0, 0.4, -3.6),  // MQ2
      new THREE.Vector3(4.2, 0.4, -3.6),  // MQ6
      new THREE.Vector3(5.7, 0.4, -4.1),  // GP2Y1010
      new THREE.Vector3(-5.5, 0.4, 0.9),  // DHT22
      new THREE.Vector3(-3.6, 0.4, 3.2),  // Buzzer
      new THREE.Vector3(-0.3, 0.4, 2.6),  // OLED
      new THREE.Vector3(4.4, 0.35, 1.8),  // AGS10
    ];

    gndTargets.forEach((dest) => {
      const mid = new THREE.Vector3((arduinoGnd.x + dest.x) / 2, 0.65, (arduinoGnd.z + dest.z) / 2);
      addWire([arduinoGnd, mid, dest], 0x1e293b, 0.038);
    });

    // 3. Pink / Light Blue Wires (3.3V Logic Rail from UNO Q 3.3V pin)
    const arduino3v3 = new THREE.Vector3(-1.1, 0.55, 1.7);
    const targets3v3 = [
      new THREE.Vector3(-5.3, 0.4, 0.8), // DHT22
      new THREE.Vector3(-0.1, 0.4, 2.6), // OLED
      new THREE.Vector3(4.5, 0.35, 1.7), // AGS10
    ];
    targets3v3.forEach((dest) => {
      const mid = new THREE.Vector3((arduino3v3.x + dest.x) / 2, 0.75, (arduino3v3.z + dest.z) / 2);
      addWire([arduino3v3, mid, dest], 0x38bdf8);
    });

    // 4. Green Wires (Analog Signals A0–A5)
    const analogPins = [
      { name: 'A0', pin: new THREE.Vector3(0.5, 0.55, 1.7),  src: new THREE.Vector3(-4.4, 0.4, -3.6) }, // MQ135
      { name: 'A1', pin: new THREE.Vector3(0.7, 0.55, 1.7),  src: new THREE.Vector3(-2.2, 0.4, -3.6) }, // MQ7
      { name: 'A2', pin: new THREE.Vector3(0.9, 0.55, 1.7),  src: new THREE.Vector3(0.0, 0.4, -3.6) },  // MG811
      { name: 'A3', pin: new THREE.Vector3(1.1, 0.55, 1.7),  src: new THREE.Vector3(2.2, 0.4, -3.6) },  // MQ2
      { name: 'A4', pin: new THREE.Vector3(1.3, 0.55, 1.7),  src: new THREE.Vector3(4.4, 0.4, -3.6) },  // MQ6
      { name: 'A5', pin: new THREE.Vector3(1.5, 0.55, 1.7),  src: new THREE.Vector3(6.0, 0.4, -3.6) },  // GP2Y1010
    ];
    analogPins.forEach(({ pin, src }) => {
      const mid1 = new THREE.Vector3(src.x, 0.9, src.z + 1.5);
      const mid2 = new THREE.Vector3(pin.x, 0.8, pin.z - 0.8);
      addWire([src, mid1, mid2, pin], 0x22c55e);
    });

    // 5. Yellow Wire (GP2Y1010 LED pin -> Arduino D4)
    addWire(
      [
        new THREE.Vector3(5.8, 0.4, -4.0),
        new THREE.Vector3(3.5, 1.1, -2.5),
        new THREE.Vector3(-0.6, 0.55, -1.72),
      ],
      0xeab308
    );

    // 6. Cyan Wire (DHT22 DATA pin -> Arduino D2)
    addWire(
      [
        new THREE.Vector3(-5.3, 0.4, 0.5),
        new THREE.Vector3(-3.0, 0.85, -0.6),
        new THREE.Vector3(-1.0, 0.55, -1.72),
      ],
      0x06b6d4
    );

    // 7. Purple Wire (Buzzer transistor drive -> Arduino D3)
    addWire(
      [
        new THREE.Vector3(-3.4, 0.4, 2.6),
        new THREE.Vector3(-2.2, 0.75, 0.5),
        new THREE.Vector3(-0.8, 0.55, -1.72),
      ],
      0xa855f7
    );

    // 8. Violet & Blue Wires (Shared I2C Bus: D20 SDA & D21 SCL)
    const pinSda = new THREE.Vector3(1.9, 0.55, -1.72);
    const pinScl = new THREE.Vector3(2.1, 0.55, -1.72);

    // SDA (Violet) to OLED & AGS10
    addWire([pinSda, new THREE.Vector3(1.2, 0.8, 0.8), new THREE.Vector3(0.2, 0.4, 2.6)], 0x8b5cf6);
    addWire([new THREE.Vector3(0.2, 0.4, 2.6), new THREE.Vector3(2.5, 0.7, 2.0), new THREE.Vector3(4.6, 0.35, 1.8)], 0x8b5cf6);

    // SCL (Blue) to OLED & AGS10
    addWire([pinScl, new THREE.Vector3(1.4, 0.8, 0.9), new THREE.Vector3(0.4, 0.4, 2.6)], 0x3b82f6);
    addWire([new THREE.Vector3(0.4, 0.4, 2.6), new THREE.Vector3(2.7, 0.7, 2.1), new THREE.Vector3(4.8, 0.35, 1.8)], 0x3b82f6);

    return wireGroup;
  };

  return (
    <div className="relative w-full h-full min-h-[580px] bg-slate-950 rounded-2xl overflow-hidden select-none border border-slate-800 shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Component Labels Overlay */}
      {showLabels && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {HARDWARE_COMPONENTS.map((comp) => {
            const isHovered = hoveredId === comp.id;
            const isSelected = selectedComponentId === comp.id;

            return (
              <div
                key={comp.id}
                style={{
                  display: 'none', // Handled via raycast tooltips or badges
                }}
              />
            );
          })}
        </div>
      )}

      {/* Hover Information Chip in 3D Viewport */}
      {hoveredId && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-white backdrop-blur-xl shadow-xl animate-in fade-in duration-150 font-mono text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00e5ff]" />
          <div>
            <span className="font-semibold text-cyan-300">
              {HARDWARE_COMPONENTS.find((c) => c.id === hoveredId)?.name}
            </span>
            <span className="text-slate-400 ml-2">
              (Click to inspect hardware & live telemetry)
            </span>
          </div>
        </div>
      )}

      {/* Legend / Status Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 text-[11px] font-mono pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-black/75 border border-white/10 text-slate-300 backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ARDUINO UNO Q ADC: 3.3V SAFE</span>
        </div>
        <div className="px-3 py-1 rounded-lg bg-black/60 border border-white/5 text-slate-400 backdrop-blur-md">
          Left-drag: Orbit | Right-drag: Pan | Scroll: Zoom
        </div>
      </div>
    </div>
  );
};
