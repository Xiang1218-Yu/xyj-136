import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { createBarkTexture, createGrassTexture } from '../../utils/texture';
import { useDayNight } from '../../contexts/DayNightContext';
import * as THREE from 'three';

interface BuildingProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

interface TreeProps {
  position?: [number, number, number];
  scale?: number;
}

function Tree({ position = [0, 0, 0], scale = 1 }: TreeProps) {
  const { nightFactor, isNight } = useDayNight();
  const barkTexture = useMemo(() => createBarkTexture(), []);
  const height = 0.4 + Math.random() * 0.2;
  const crownRadius = 0.08 + Math.random() * 0.04;

  const leafNightTint = isNight ? nightFactor * 0.2 : 0;

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, height * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.015, 0.025, height, 8]} />
        <meshStandardMaterial 
          map={barkTexture} 
          roughness={0.95}
          emissive="#2a1810"
          emissiveIntensity={leafNightTint * 0.1}
        />
      </mesh>

      {[-0.03, 0.03, -0.015, 0.015].map((off, i) => (
        <mesh
          key={i}
          position={[
            off * 0.5,
            height * 0.3 + i * 0.02,
            (i % 2 === 0 ? 1 : -1) * off * 0.3
          ]}
          rotation={[0, i * 1.5, i * 0.3 - 0.3]}
          castShadow
        >
          <cylinderGeometry args={[0.004, 0.008, 0.05, 4]} />
          <meshStandardMaterial map={barkTexture} roughness={0.9} />
        </mesh>
      ))}

      <mesh position={[0, height * 0.85, 0]} castShadow>
        <coneGeometry args={[crownRadius * 1.4, crownRadius * 2.2, 8]} />
        <meshStandardMaterial 
          color="#1b5e20" 
          roughness={0.85}
          emissive="#0d2e10"
          emissiveIntensity={leafNightTint}
        />
      </mesh>

      <mesh position={[0, height * 1.05, 0]} castShadow>
        <coneGeometry args={[crownRadius * 1.1, crownRadius * 1.8, 8]} />
        <meshStandardMaterial 
          color="#2e7d32" 
          roughness={0.85}
          emissive="#1a4a1e"
          emissiveIntensity={leafNightTint}
        />
      </mesh>

      <mesh position={[0, height * 1.22, 0]} castShadow>
        <coneGeometry args={[crownRadius * 0.8, crownRadius * 1.4, 8]} />
        <meshStandardMaterial 
          color="#388e3c" 
          roughness={0.8}
          emissive="#1e5e26"
          emissiveIntensity={leafNightTint * 0.8}
        />
      </mesh>

      <mesh position={[0, height * 1.35, 0]} castShadow>
        <coneGeometry args={[crownRadius * 0.45, crownRadius * 0.9, 8]} />
        <meshStandardMaterial 
          color="#43a047" 
          roughness={0.8}
          emissive="#2e7d32"
          emissiveIntensity={leafNightTint * 0.6}
        />
      </mesh>
    </group>
  );
}

function Bush({ position = [0, 0, 0], scale = 1 }: TreeProps) {
  const { nightFactor, isNight } = useDayNight();
  const leafNightTint = isNight ? nightFactor * 0.15 : 0;

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial 
          color="#2e7d32" 
          roughness={0.9}
          emissive="#1a4a1e"
          emissiveIntensity={leafNightTint}
        />
      </mesh>
      <mesh position={[0.04, 0.06, 0.03]} castShadow>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshStandardMaterial 
          color="#388e3c" 
          roughness={0.9}
          emissive="#236b28"
          emissiveIntensity={leafNightTint}
        />
      </mesh>
      <mesh position={[-0.03, 0.055, -0.02]} castShadow>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial 
          color="#43a047" 
          roughness={0.9}
          emissive="#2e7d32"
          emissiveIntensity={leafNightTint}
        />
      </mesh>
    </group>
  );
}

function Firefly({ 
  position, 
  color = '#ffff88' 
}: { 
  position: [number, number, number];
  color?: string;
}) {
  const { nightFactor, isNight } = useDayNight();
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const offset = useRef(Math.random() * Math.PI * 2);
  const basePos = useRef(position);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * 2 + offset.current;
      meshRef.current.position.x = basePos.current[0] + Math.sin(t * 1.3) * 0.03;
      meshRef.current.position.y = basePos.current[1] + Math.sin(t * 0.7) * 0.02 + 0.05;
      meshRef.current.position.z = basePos.current[2] + Math.cos(t * 1.1) * 0.03;
      
      const pulse = 0.5 + Math.sin(t * 3) * 0.5;
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = nightFactor * pulse;
    }
    if (lightRef.current) {
      const t = state.clock.elapsedTime * 2 + offset.current;
      const pulse = 0.5 + Math.sin(t * 3) * 0.5;
      lightRef.current.intensity = nightFactor * pulse * 0.3;
    }
  });

  if (!isNight) return null;

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.006, 6, 6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={nightFactor * 0.8}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={position}
        color={color}
        intensity={nightFactor * 0.2}
        distance={0.3}
        decay={2}
      />
    </group>
  );
}

export function Forest({ position, scale = 1, rotation = [0, 0, 0] }: BuildingProps) {
  const { nightFactor, isNight } = useDayNight();
  const grassTexture = useMemo(() => createGrassTexture(), []);

  const fireflyData = useMemo(() => {
    const fireflies: { pos: [number, number, number]; color: string }[] = [];
    const colors = ['#ffff88', '#aaffaa', '#88ffff', '#ffaa88'];
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.05 + Math.random() * 0.25;
      fireflies.push({
        pos: [
          Math.cos(angle) * dist,
          0.05 + Math.random() * 0.2,
          Math.sin(angle) * dist,
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return fireflies;
  }, []);

  const flowerNightColors = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      index: i,
      nightColor: i % 2 === 0 ? '#ff88bb' : '#ffee88',
    }));
  }, []);

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[0.35, 24]} />
        <meshStandardMaterial map={grassTexture} roughness={1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.3, 0.38, 24]} />
        <meshStandardMaterial color="#2e7d32" transparent opacity={0.5} roughness={1} />
      </mesh>

      <Tree position={[0.1, 0, 0.08]} scale={1.1} />
      <Tree position={[-0.1, 0, 0.12]} scale={0.85} />
      <Tree position={[0.08, 0, -0.12]} scale={1.2} />
      <Tree position={[-0.14, 0, -0.06]} scale={0.75} />

      <Bush position={[0.05, 0, 0.18]} scale={1} />
      <Bush position={[-0.18, 0, 0.02]} scale={0.8} />
      <Bush position={[0.15, 0, -0.05]} scale={0.9} />

      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={`flower-${i}`}
          position={[
            (Math.random() - 0.5) * 0.5,
            0.01,
            (Math.random() - 0.5) * 0.5
          ]}
        >
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#ff69b4' : '#ffeb3b'}
            emissive={isNight ? flowerNightColors[i]?.nightColor || '#ffffff' : (i % 2 === 0 ? '#ff69b4' : '#ffeb3b')}
            emissiveIntensity={isNight ? nightFactor * 0.5 : 0.2}
          />
        </mesh>
      ))}

      {isNight && fireflyData.map((firefly, i) => (
        <Firefly key={`firefly-${i}`} position={firefly.pos} color={firefly.color} />
      ))}

      {isNight && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <circleGeometry args={[0.32, 24]} />
          <meshBasicMaterial
            color="#0a1a0a"
            transparent
            opacity={nightFactor * 0.3}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
