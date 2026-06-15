import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDayNight } from '../contexts/DayNightContext';

export function Sun() {
  const { sunPosition, sunColor, sunIntensity, isNight } = useDayNight();
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);

  const sunGeometry = useMemo(() => new THREE.SphereGeometry(1.2, 64, 64), []);
  const glowGeometry = useMemo(() => new THREE.SphereGeometry(1.6, 32, 32), []);
  const coronaGeometry = useMemo(() => new THREE.SphereGeometry(2.2, 32, 32), []);

  const rayData = useMemo(() => {
    const rays: { angle: number; length: number; width: number; speed: number }[] = [];
    for (let i = 0; i < 12; i++) {
      rays.push({
        angle: (i / 12) * Math.PI * 2,
        length: 0.8 + Math.random() * 0.5,
        width: 0.08 + Math.random() * 0.04,
        speed: 0.5 + Math.random() * 1,
      });
    }
    return rays;
  }, []);

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05;
    }
    if (raysRef.current) {
      raysRef.current.rotation.z += delta * 0.1;
    }
    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  if (isNight) return null;

  return (
    <group position={[sunPosition.x, sunPosition.y, sunPosition.z]}>
      <mesh ref={sunRef}>
        <primitive object={sunGeometry} attach="geometry" />
        <meshBasicMaterial color={sunColor} toneMapped={false} />
      </mesh>

      <mesh ref={glowRef}>
        <primitive object={glowGeometry} attach="geometry" />
        <meshBasicMaterial
          color={sunColor}
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={coronaRef}>
        <primitive object={coronaGeometry} attach="geometry" />
        <meshBasicMaterial
          color={sunColor}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      <group ref={raysRef}>
        {rayData.map((ray, i) => (
          <mesh
            key={i}
            rotation={[0, 0, ray.angle]}
            position={[Math.cos(ray.angle) * (1.2 + ray.length / 2), Math.sin(ray.angle) * (1.2 + ray.length / 2), 0]}
          >
            <planeGeometry args={[ray.width, ray.length]} />
            <meshBasicMaterial
              color={sunColor}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      <pointLight
        color={sunColor}
        intensity={sunIntensity * 2}
        distance={50}
        decay={0.5}
      />
    </group>
  );
}
