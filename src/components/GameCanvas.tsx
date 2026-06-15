import { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Planet } from './Planet';
import { Moon } from './Moon';
import { Starfield } from './Starfield';
import { Building, BuildingType } from '../types/game';
import { PLANET_RADIUS } from '../utils/helpers';

interface GameCanvasProps {
  buildings: Building[];
  selectedTool: BuildingType | null;
  onAddBuilding: (type: BuildingType, position: [number, number, number]) => void;
  lifeIndex: number;
}

function SceneContent({
  buildings,
  selectedTool,
  onAddBuilding,
  lifeIndex,
}: GameCanvasProps) {
  const [hovered, setHovered] = useState(false);

  const handlePlanetClick = (point: THREE.Vector3) => {
    if (selectedTool) {
      const normalized = point.clone().normalize();
      const surfacePoint = normalized.multiplyScalar(PLANET_RADIUS);
      onAddBuilding(selectedTool, [surfacePoint.x, surfacePoint.y, surfacePoint.z]);
    }
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.5}
        color="#fff8e7"
        castShadow
      />
      <pointLight position={[-5, 2, -5]} intensity={0.4} color="#6a9eff" />
      <hemisphereLight args={['#87ceeb', '#5d7a5d', 0.4]} />

      <Starfield />
      <Moon />

      <Planet
        onClick={handlePlanetClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        lifeIndex={lifeIndex}
        buildings={buildings}
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
          intensity={0.6}
          luminanceThreshold={0.2}
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
      style={{ background: 'linear-gradient(to bottom, #0a0e27, #1a1f4e)' }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      shadows
    >
      <SceneContent {...props} />
    </Canvas>
  );
}
