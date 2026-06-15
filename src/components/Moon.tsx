import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.1;
    }
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={moonRef} position={[8, 2, 0]} castShadow>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial
          color="#c0c0c0"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[8, 2, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshBasicMaterial
          color="#ffeedd"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh position={[8, 2, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
