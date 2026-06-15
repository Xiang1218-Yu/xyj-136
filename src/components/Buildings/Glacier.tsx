import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { createIceTexture } from '../../utils/texture';
import { useDayNight } from '../../contexts/DayNightContext';
import * as THREE from 'three';

interface BuildingProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

interface IcebergProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

function Iceberg({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: IcebergProps) {
  const { nightFactor, isNight } = useDayNight();
  const iceTexture = useMemo(() => createIceTexture(), []);

  const height = 0.25 + Math.random() * 0.15;
  const radius = 0.1 + Math.random() * 0.05;

  const iceEmissiveIntensity = isNight ? nightFactor * 0.4 : 0.1;
  const iceTransmission = isNight ? 0.2 + nightFactor * 0.3 : 0.3;

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh position={[0, height * 0.55, 0]} castShadow receiveShadow>
        <coneGeometry args={[radius, height * 1.1, 6]} />
        <meshPhysicalMaterial
          color="#e0f0ff"
          map={iceTexture}
          transparent
          opacity={0.88}
          roughness={0.15}
          metalness={0.05}
          transmission={iceTransmission}
          thickness={0.5}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          emissive="#88ccff"
          emissiveIntensity={iceEmissiveIntensity}
        />
      </mesh>

      <mesh position={[0, height * 0.1, 0]} castShadow receiveShadow>
        <coneGeometry args={[radius * 1.15, height * 0.5, 6]} />
        <meshPhysicalMaterial
          color="#b8d8ff"
          transparent
          opacity={0.75}
          roughness={0.1}
          metalness={0}
          transmission={iceTransmission * 1.2}
          thickness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#66aadd"
          emissiveIntensity={iceEmissiveIntensity * 0.8}
        />
      </mesh>

      <mesh position={[radius * 0.3, height * 0.25, radius * 0.2]} rotation={[0.3, 0.8, 0.2]} castShadow>
        <boxGeometry args={[radius * 0.3, radius * 0.4, radius * 0.25]} />
        <meshPhysicalMaterial
          color="#d0e8ff"
          transparent
          opacity={0.9}
          roughness={0.08}
          metalness={0}
          transmission={iceTransmission}
          thickness={0.3}
          clearcoat={0.9}
          emissive="#99ddff"
          emissiveIntensity={iceEmissiveIntensity * 0.6}
        />
      </mesh>

      <mesh position={[-radius * 0.25, height * 0.4, -radius * 0.15]} rotation={[-0.2, -0.6, 0.15]} castShadow>
        <octahedronGeometry args={[radius * 0.22, 0]} />
        <meshPhysicalMaterial
          color="#e8f4ff"
          transparent
          opacity={0.92}
          roughness={0.05}
          metalness={0}
          transmission={iceTransmission * 0.8}
          thickness={0.4}
          clearcoat={1}
          emissive="#aaeeff"
          emissiveIntensity={iceEmissiveIntensity * 0.7}
        />
      </mesh>

      {isNight && (
        <mesh position={[radius * 0.15, height * 0.9, 0]}>
          <sphereGeometry args={[radius * 0.1, 6, 6]} />
          <meshStandardMaterial
            color="#a8d0ff"
            emissive="#6ab0ff"
            emissiveIntensity={nightFactor * 0.8}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

function IceCrystal({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: IcebergProps) {
  const { nightFactor, isNight } = useDayNight();
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 0.5;
      crystalRef.current.rotation.x += delta * 0.3;
    }
  });

  const crystalEmissive = isNight ? nightFactor * 0.6 : 0.1;

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh ref={crystalRef} castShadow>
        <octahedronGeometry args={[0.03, 0]} />
        <meshPhysicalMaterial
          color="#c0e0ff"
          transparent
          opacity={0.85}
          roughness={0.05}
          metalness={0}
          transmission={isNight ? 0.4 + nightFactor * 0.3 : 0.6}
          thickness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1}
          emissive="#88ddff"
          emissiveIntensity={crystalEmissive}
        />
      </mesh>
      <mesh position={[0.015, -0.01, 0.01]} rotation={[0.5, 0.3, 0]} castShadow>
        <tetrahedronGeometry args={[0.02, 0]} />
        <meshPhysicalMaterial
          color="#d0e8ff"
          transparent
          opacity={0.9}
          roughness={0.05}
          transmission={isNight ? 0.3 + nightFactor * 0.2 : 0.5}
          clearcoat={1}
          emissive="#99eeff"
          emissiveIntensity={crystalEmissive * 0.8}
        />
      </mesh>
      
      {isNight && (
        <pointLight
          position={[0, 0, 0]}
          color="#88ccff"
          intensity={nightFactor * 0.15}
          distance={0.3}
          decay={2}
        />
      )}
    </group>
  );
}

export function Glacier({ position, scale = 1, rotation = [0, 0, 0] }: BuildingProps) {
  const { nightFactor, isNight } = useDayNight();
  const iceTexture = useMemo(() => createIceTexture(), []);

  const sparkleData = useMemo(() => {
    const sparkles: {
      pos: [number, number, number];
      size: number;
      color: string;
      speed: number;
    }[] = [];
    for (let i = 0; i < 15; i++) {
      sparkles.push({
        pos: [
          (Math.random() - 0.5) * 0.6,
          0.02 + Math.random() * 0.15,
          (Math.random() - 0.5) * 0.6,
        ],
        size: 0.005 + Math.random() * 0.005,
        color: Math.random() > 0.5 ? '#ffffff' : '#aaddff',
        speed: 0.5 + Math.random() * 2,
      });
    }
    return sparkles;
  }, []);

  const sparkleRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    sparkleRefs.current.forEach((ref, i) => {
      if (ref && sparkleData[i]) {
        const t = state.clock.elapsedTime * sparkleData[i].speed;
        const pulse = 0.3 + Math.sin(t + i) * 0.7;
        const mat = ref.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isNight ? nightFactor * pulse : 0.2;
      }
    });
  });

  const groundEmissive = isNight ? nightFactor * 0.2 : 0.05;

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[0.38, 24]} />
        <meshStandardMaterial
          map={iceTexture}
          color="#d0e8ff"
          transparent
          opacity={0.7}
          roughness={0.2}
          emissive="#88bbdd"
          emissiveIntensity={groundEmissive}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.32, 0.4, 24]} />
        <meshPhysicalMaterial
          color="#88bbee"
          transparent
          opacity={0.5}
          roughness={0.1}
          transmission={isNight ? 0.2 + nightFactor * 0.2 : 0.4}
          thickness={0.5}
          clearcoat={0.8}
          emissive="#6699cc"
          emissiveIntensity={groundEmissive * 1.5}
        />
      </mesh>

      <Iceberg position={[0.08, 0, 0.05]} scale={1.1} rotation={[0, 0.3, 0]} />
      <Iceberg position={[-0.1, 0, 0.1]} scale={0.85} rotation={[0, -0.4, 0]} />
      <Iceberg position={[0.05, 0, -0.12]} scale={1.3} rotation={[0, 0.8, 0]} />
      <Iceberg position={[-0.15, 0, -0.08]} scale={0.7} rotation={[0, -0.2, 0.1]} />

      <IceCrystal position={[0.2, 0.01, 0.15]} scale={1} rotation={[0.2, 0.5, 0.3]} />
      <IceCrystal position={[-0.18, 0.008, 0.18]} scale={0.8} rotation={[0.1, -0.3, 0.5]} />
      <IceCrystal position={[0.12, 0.012, -0.18]} scale={1.2} rotation={[0.4, 0.2, -0.2]} />
      <IceCrystal position={[-0.22, 0.01, -0.15]} scale={0.9} rotation={[-0.3, 0.6, 0.1]} />
      <IceCrystal position={[0, 0.005, 0.22]} scale={0.7} rotation={[0.1, 0.1, 0.8]} />

      {sparkleData.map((sparkle, i) => (
        <mesh
          key={`sparkle-${i}`}
          ref={(el) => (sparkleRefs.current[i] = el)}
          position={sparkle.pos}
        >
          <sphereGeometry args={[sparkle.size, 4, 4]} />
          <meshStandardMaterial
            color={sparkle.color}
            emissive="#88ccff"
            emissiveIntensity={isNight ? nightFactor * 0.8 : 0.3}
            transparent
            opacity={isNight ? 0.7 + nightFactor * 0.3 : 0.5}
            toneMapped={false}
          />
        </mesh>
      ))}

      {isNight && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <circleGeometry args={[0.35, 24]} />
          <meshBasicMaterial
            color="#4488aa"
            transparent
            opacity={nightFactor * 0.15}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
