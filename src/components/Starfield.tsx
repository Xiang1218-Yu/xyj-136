import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Starfield() {
  const starsRef = useRef<THREE.Points>(null);
  const galaxyRef = useRef<THREE.Points>(null);

  const [starPositions, starColors] = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else if (colorChoice < 0.8) {
        colors[i3] = 0.8;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 1;
      } else {
        colors[i3] = 1;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 0.8;
      }
    }

    return [positions, colors];
  }, []);

  const galaxyPositions = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 80;
      const spread = (Math.random() - 0.5) * 20;
      const armOffset = Math.sin(angle * 3) * 10;

      positions[i3] = Math.cos(angle) * (radius + armOffset);
      positions[i3 + 1] = spread;
      positions[i3 + 2] = Math.sin(angle) * (radius + armOffset);

      const colorT = Math.random();
      colors[i3] = 0.5 + colorT * 0.5;
      colors[i3 + 1] = 0.3 + colorT * 0.4;
      colors[i3 + 2] = 0.8 + colorT * 0.2;
    }

    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.01;
    }
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starColors.length / 3}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      <points ref={galaxyRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={galaxyPositions.positions.length / 3}
            array={galaxyPositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={galaxyPositions.colors.length / 3}
            array={galaxyPositions.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
