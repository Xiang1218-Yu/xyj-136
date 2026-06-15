import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { createGrassTexture } from '../../utils/texture';
import { useDayNight } from '../../contexts/DayNightContext';
import * as THREE from 'three';

interface BuildingProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

interface GrassBladeProps {
  position: [number, number, number];
  height?: number;
  color?: string;
  rotation?: number;
  lean?: number;
}

function GrassBlade({
  position,
  height = 0.06,
  color = '#4caf50',
  rotation = 0,
  lean = 0,
}: GrassBladeProps) {
  const { nightFactor, isNight } = useDayNight();
  const grassNightTint = isNight ? nightFactor * 0.15 : 0;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh rotation={[lean * 0.3, 0, 0]} position={[0, height / 2, 0]} castShadow>
        <coneGeometry args={[0.006, height, 4]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.9}
          emissive="#1a4a1e"
          emissiveIntensity={grassNightTint}
        />
      </mesh>
      <mesh rotation={[lean * 0.5, 0, 0]} position={[0.004, height * 0.6, 0.002]} castShadow>
        <coneGeometry args={[0.004, height * 0.7, 4]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.9}
          emissive="#1e5e26"
          emissiveIntensity={grassNightTint * 0.8}
        />
      </mesh>
    </group>
  );
}

function Flower({
  position,
  color = '#ff69b4',
  glowColor = '#ff88bb',
}: {
  position: [number, number, number];
  color?: string;
  glowColor?: string;
}) {
  const { nightFactor, isNight } = useDayNight();

  const glowIntensity = isNight ? nightFactor * 0.8 : 0.3;

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.003, 0.004, 0.1, 4]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={glowIntensity}
        />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={glowIntensity * 0.8} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 5) * 0.012,
            0.11,
            Math.sin((i * Math.PI * 2) / 5) * 0.012,
          ]}
        >
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={glowColor}
            emissiveIntensity={glowIntensity * 0.7}
          />
        </mesh>
      ))}
      
      {isNight && (
        <mesh position={[0, 0.11, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={nightFactor * 0.3}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

function Mushroom({
  position,
  capColor = '#e57373',
  glowColor = '#ffaa88',
}: {
  position: [number, number, number];
  capColor?: string;
  glowColor?: string;
}) {
  const { nightFactor, isNight } = useDayNight();

  const glowIntensity = isNight ? nightFactor * 0.5 : 0.1;

  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.01, 0.04, 6]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.045, 0]} castShadow>
        <sphereGeometry args={[0.02, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={capColor} 
          roughness={0.8}
          emissive={glowColor}
          emissiveIntensity={glowIntensity}
        />
      </mesh>
      <mesh position={[0.008, 0.048, 0]}>
        <sphereGeometry args={[0.004, 6, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={glowIntensity * 0.5} />
      </mesh>
      <mesh position={[-0.006, 0.05, 0.005]}>
        <sphereGeometry args={[0.003, 6, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={glowIntensity * 0.5} />
      </mesh>
    </group>
  );
}

function GlowingMushroom({
  position,
}: {
  position: [number, number, number];
}) {
  const { nightFactor, isNight } = useDayNight();
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      lightRef.current.intensity = nightFactor * pulse * 0.2;
    }
  });

  if (!isNight) return null;

  return (
    <group position={position}>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.005, 0.006, 0.03, 6]} />
        <meshStandardMaterial
          color="#88ffaa"
          emissive="#44ff88"
          emissiveIntensity={nightFactor * 0.8}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <sphereGeometry args={[0.015, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#66ff99"
          emissive="#22ff66"
          emissiveIntensity={nightFactor}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.03, 0]}
        color="#44ff88"
        intensity={nightFactor * 0.2}
        distance={0.2}
        decay={2}
      />
    </group>
  );
}

function Firefly({
  position,
  color = '#ffff88',
}: {
  position: [number, number, number];
  color?: string;
}) {
  const { nightFactor, isNight } = useDayNight();
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = useRef(Math.random() * Math.PI * 2);
  const basePos = useRef(position);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * 2.5 + offset.current;
      meshRef.current.position.x = basePos.current[0] + Math.sin(t * 1.5) * 0.04;
      meshRef.current.position.y = basePos.current[1] + Math.sin(t * 0.8) * 0.025 + 0.05;
      meshRef.current.position.z = basePos.current[2] + Math.cos(t * 1.2) * 0.04;
      
      const pulse = 0.4 + Math.sin(t * 4) * 0.6;
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = nightFactor * pulse;
    }
  });

  if (!isNight) return null;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.005, 6, 6]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={nightFactor * 0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

export function Grassland({ position, scale = 1, rotation = [0, 0, 0] }: BuildingProps) {
  const { nightFactor, isNight } = useDayNight();
  const grassTexture = useMemo(() => createGrassTexture(), []);

  const grassData = useMemo(() => {
    const blades: {
      pos: [number, number, number];
      height: number;
      color: string;
      rotation: number;
      lean: number;
    }[] = [];
    const colors = [
      '#4caf50', '#66bb6a', '#81c784',
      '#388e3c', '#2e7d32', '#43a047',
      '#9ccc65', '#aed581',
    ];

    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 0.3;
      blades.push({
        pos: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        height: 0.04 + Math.random() * 0.07,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        lean: (Math.random() - 0.5) * 0.6,
      });
    }
    return blades;
  }, []);

  const flowerData = useMemo(() => {
    const colorPairs = [
      { color: '#ff69b4', glow: '#ff88bb' },
      { color: '#ffeb3b', glow: '#ffee88' },
      { color: '#ff5722', glow: '#ff8866' },
      { color: '#e91e63', glow: '#ff6699' },
      { color: '#9c27b0', glow: '#cc66ff' },
      { color: '#00bcd4', glow: '#66eeff' },
    ];
    const flowers: { pos: [number, number, number]; color: string; glow: string }[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.08 + Math.random() * 0.22;
      const pair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
      flowers.push({
        pos: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        color: pair.color,
        glow: pair.glow,
      });
    }
    return flowers;
  }, []);

  const mushroomData = useMemo(() => {
    const capColorPairs = [
      { cap: '#e57373', glow: '#ffaa88' },
      { cap: '#ff9800', glow: '#ffcc88' },
      { cap: '#8d6e63', glow: '#ccaa88' },
      { cap: '#795548', glow: '#bb9977' },
    ];
    const mushrooms: { pos: [number, number, number]; capColor: string; glowColor: string }[] = [];
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.1 + Math.random() * 0.2;
      const pair = capColorPairs[Math.floor(Math.random() * capColorPairs.length)];
      mushrooms.push({
        pos: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        capColor: pair.cap,
        glowColor: pair.glow,
      });
    }
    return mushrooms;
  }, []);

  const glowingMushroomData = useMemo(() => {
    const mushrooms: [number, number, number][] = [];
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.05 + Math.random() * 0.25;
      mushrooms.push([Math.cos(angle) * dist, 0, Math.sin(angle) * dist]);
    }
    return mushrooms;
  }, []);

  const fireflyData = useMemo(() => {
    const fireflies: { pos: [number, number, number]; color: string }[] = [];
    const colors = ['#ffff88', '#aaffaa', '#88ffff', '#ffaa88'];
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 0.3;
      fireflies.push({
        pos: [Math.cos(angle) * dist, 0.03 + Math.random() * 0.1, Math.sin(angle) * dist],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return fireflies;
  }, []);

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[0.35, 24]} />
        <meshStandardMaterial map={grassTexture} roughness={1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.3, 0.38, 24]} />
        <meshStandardMaterial
          color="#388e3c"
          transparent
          opacity={0.5}
          roughness={1}
        />
      </mesh>

      {grassData.map((blade, i) => (
        <GrassBlade
          key={`grass-${i}`}
          position={blade.pos}
          height={blade.height}
          color={blade.color}
          rotation={blade.rotation}
          lean={blade.lean}
        />
      ))}

      {flowerData.map((flower, i) => (
        <Flower 
          key={`flower-${i}`} 
          position={flower.pos} 
          color={flower.color}
          glowColor={flower.glow}
        />
      ))}

      {mushroomData.map((mushroom, i) => (
        <Mushroom
          key={`mushroom-${i}`}
          position={mushroom.pos}
          capColor={mushroom.capColor}
          glowColor={mushroom.glowColor}
        />
      ))}

      {isNight && glowingMushroomData.map((pos, i) => (
        <GlowingMushroom key={`glow-mushroom-${i}`} position={pos} />
      ))}

      {isNight && fireflyData.map((firefly, i) => (
        <Firefly key={`firefly-${i}`} position={firefly.pos} color={firefly.color} />
      ))}

      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`stone-${i}`}
          position={[
            (Math.random() - 0.5) * 0.5,
            0.01,
            (Math.random() - 0.5) * 0.5,
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.015 + Math.random() * 0.015, 0]} />
          <meshStandardMaterial color="#888888" roughness={0.95} />
        </mesh>
      ))}

      {isNight && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <circleGeometry args={[0.32, 24]} />
          <meshBasicMaterial
            color="#0a1a0a"
            transparent
            opacity={nightFactor * 0.25}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
