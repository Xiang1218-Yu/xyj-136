import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Planet } from './Planet';
import { Moon } from './Moon';
import { Sun } from './Sun';
import { Starfield } from './Starfield';
import { Building, BuildingType, ToolType, ActiveDisaster } from '../types/game';
import { PLANET_RADIUS } from '../utils/helpers';
import { useDayNight } from '../contexts/DayNightContext';

interface GameCanvasProps {
  buildings: Building[];
  selectedTool: ToolType | null;
  onAddBuilding: (type: BuildingType, position: [number, number, number]) => void;
  onRemoveBuilding: (id: string) => void;
  lifeIndex: number;
  disasters?: ActiveDisaster[];
}

function DynamicLighting() {
  const { sunPosition, sunIntensity, ambientIntensity, sunColor, isNight, nightFactor } = useDayNight();
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const hemisphereLightRef = useRef<THREE.HemisphereLight>(null);
  const moonLightRef = useRef<THREE.PointLight>(null);

  const moonPosition = useMemo(() => {
    return new THREE.Vector3(-sunPosition.x, -sunPosition.y, sunPosition.z).normalize().multiplyScalar(10);
  }, [sunPosition]);

  useFrame(() => {
    if (directionalLightRef.current) {
      directionalLightRef.current.position.copy(sunPosition);
      directionalLightRef.current.intensity = sunIntensity;
      directionalLightRef.current.color.copy(sunColor);
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientIntensity;
      if (isNight) {
        ambientLightRef.current.color.set('#334466');
      } else {
        ambientLightRef.current.color.set('#ffffff');
      }
    }
    if (hemisphereLightRef.current) {
      const intensity = 0.3 + ambientIntensity * 0.5;
      hemisphereLightRef.current.intensity = isNight ? intensity * 0.4 : intensity;
      if (isNight) {
        hemisphereLightRef.current.color.set('#223344');
        hemisphereLightRef.current.groundColor.set('#1a2a1a');
      } else {
        hemisphereLightRef.current.color.set('#87ceeb');
        hemisphereLightRef.current.groundColor.set('#5d7a5d');
      }
    }
    if (moonLightRef.current) {
      moonLightRef.current.position.copy(moonPosition);
      moonLightRef.current.intensity = isNight ? nightFactor * 0.8 : 0;
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={ambientIntensity} />
      <directionalLight
        ref={directionalLightRef}
        position={[sunPosition.x, sunPosition.y, sunPosition.z]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <hemisphereLight ref={hemisphereLightRef} args={['#87ceeb', '#5d7a5d', 0.4]} />
      <pointLight
        ref={moonLightRef}
        position={[moonPosition.x, moonPosition.y, moonPosition.z]}
        color="#aabbdd"
        intensity={0}
        distance={30}
        decay={2}
      />
    </>
  );
}

function DynamicSky() {
  const { skyColor, isNight } = useDayNight();
  const { scene } = useThree();

  useFrame(() => {
    scene.background = skyColor;
    scene.fog = new THREE.Fog(skyColor, 20, 50);
  });

  return null;
}

function SceneContent({
  buildings,
  selectedTool,
  onAddBuilding,
  onRemoveBuilding,
  lifeIndex,
  disasters = [],
}: GameCanvasProps) {
  const [hovered, setHovered] = useState(false);

  const handlePlanetClick = (point: THREE.Vector3) => {
    if (selectedTool && selectedTool !== 'delete') {
      const normalized = point.clone().normalize();
      const surfacePoint = normalized.multiplyScalar(PLANET_RADIUS);
      onAddBuilding(selectedTool, [surfacePoint.x, surfacePoint.y, surfacePoint.z]);
    }
  };

  return (
    <>
      <DynamicSky />
      <DynamicLighting />

      <Starfield />
      <Sun />
      <Moon />

      <Planet
        onClick={handlePlanetClick}
        onRemoveBuilding={onRemoveBuilding}
        selectedTool={selectedTool}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        lifeIndex={lifeIndex}
        buildings={buildings}
        disasters={disasters}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={50}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI - 0.1}
        enableDamping
        dampingFactor={0.05}
      />

      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette
          offset={0.5}
          darkness={0.5}
        />
      </EffectComposer>
    </>
  );
}

export function GameCanvas(props: GameCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      shadows
    >
      <SceneContent {...props} />
    </Canvas>
  );
}
