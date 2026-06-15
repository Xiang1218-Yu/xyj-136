import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDayNight } from '../contexts/DayNightContext';

function Crater({ position, size }: { position: [number, number, number]; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { nightFactor, isNight } = useDayNight();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
    }
  }, []);

  const visibleOpacity = isNight ? nightFactor * 0.8 : 0;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color="#888888"
        roughness={0.95}
        emissive="#666666"
        emissiveIntensity={visibleOpacity * 0.1}
      />
    </mesh>
  );
}

export function Moon() {
  const { moonPosition, isNight, nightFactor } = useDayNight();
  const moonRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const cratersGroupRef = useRef<THREE.Group>(null);

  const moonGeometry = useMemo(() => new THREE.SphereGeometry(0.5, 64, 64), []);
  const glowGeometry = useMemo(() => new THREE.SphereGeometry(0.65, 32, 32), []);

  const craters = useMemo(() => {
    const craterData: { pos: [number, number, number]; size: number; depth: number }[] = [];
    for (let i = 0; i < 15; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.5;
      craterData.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        size: 0.03 + Math.random() * 0.08,
        depth: 0.01 + Math.random() * 0.02,
      });
    }
    return craterData;
  }, []);

  useFrame((state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.05;
    }
    if (cratersGroupRef.current) {
      cratersGroupRef.current.rotation.y += delta * 0.05;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const visibleOpacity = isNight ? nightFactor * 0.8 : 0;

  return (
    <group position={[moonPosition.x, moonPosition.y, moonPosition.z]}>
      <mesh ref={moonRef}>
        <primitive object={moonGeometry} attach="geometry" />
        <meshStandardMaterial
          color="#c0c0c0"
          roughness={0.9}
          metalness={0.1}
          emissive="#aabbcc"
          emissiveIntensity={visibleOpacity * 0.15}
        />
      </mesh>

      <group ref={cratersGroupRef}>
        {craters.map((crater, i) => (
          <Crater key={i} position={crater.pos} size={crater.size} />
        ))}
      </group>

      <mesh ref={glowRef}>
        <primitive object={glowGeometry} attach="geometry" />
        <meshBasicMaterial
          color="#ffeedd"
          transparent
          opacity={visibleOpacity * 0.25}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        color="#aabbdd"
        intensity={visibleOpacity * 0.5}
        distance={20}
        decay={2}
      />
    </group>
  );
}
