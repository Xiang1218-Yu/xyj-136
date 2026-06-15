import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ActiveDisaster, DisasterType } from '../types/game';
import { DISASTER_CONFIGS, PLANET_RADIUS } from '../utils/helpers';

interface DisasterEffectProps {
  disaster: ActiveDisaster;
}

function EarthquakeEffect({ disaster }: DisasterEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(disaster.timestamp);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(1, elapsed / disaster.duration);
    const shake = (1 - progress) * 0.08 * Math.sin(elapsed * 0.05);
    
    groupRef.current.rotation.x = shake * (Math.random() - 0.5) * 2;
    groupRef.current.rotation.z = shake * (Math.random() - 0.5) * 2;
    groupRef.current.scale.setScalar(1 + shake * 0.5);
  });

  const normal = useMemo(() => 
    new THREE.Vector3(...disaster.position).normalize(),
    [disaster.position]
  );

  return (
    <group position={disaster.position} ref={groupRef}>
      <mesh>
        <ringGeometry args={[0.1, DISASTER_CONFIGS.earthquake.damageRadius * 0.8, 32]} />
        <meshBasicMaterial 
          color="#8b4513" 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide}
        />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * DISASTER_CONFIGS.earthquake.damageRadius,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * DISASTER_CONFIGS.earthquake.damageRadius,
        ]}>
          <boxGeometry args={[0.15, 0.08, 0.15]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}
    </group>
  );
}

function VolcanoEffect({ disaster }: DisasterEffectProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const startTime = useRef(disaster.timestamp);
  const count = 200;

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.4;
      const speed = 0.02 + Math.random() * 0.04;
      
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.2; colors[i * 3 + 2] = 0;
      } else if (colorChoice < 0.6) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0;
      } else {
        colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.4;
      }
    }
    
    return { positions, velocities, colors };
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(1, elapsed / disaster.duration);
    
    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const opacity = 1 - progress;
    
    for (let i = 0; i < count; i++) {
      posArray[i * 3] += velocities[i * 3] * (1 - progress * 0.5);
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * (1 - progress * 0.5) - 0.001 * progress;
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * (1 - progress * 0.5);
    }
    
    posAttr.needsUpdate = true;
    
    const mat = particlesRef.current.material as THREE.PointsMaterial;
    mat.opacity = opacity * 0.9;
  });

  return (
    <group position={disaster.position}>
      <mesh>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ff4500" />
      </mesh>
      <mesh>
        <ringGeometry args={[0.2, DISASTER_CONFIGS.volcano.damageRadius * 0.9, 32]} />
        <meshBasicMaterial 
          color="#ff4500" 
          transparent 
          opacity={0.25} 
          side={THREE.DoubleSide}
        />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function FloodEffect({ disaster }: DisasterEffectProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const wavesRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(disaster.timestamp);

  useFrame((state, delta) => {
    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(1, elapsed / disaster.duration);
    
    const targetScale = DISASTER_CONFIGS.flood.damageRadius * (0.3 + progress * 0.7);
    
    if (waterRef.current) {
      waterRef.current.scale.setScalar(targetScale);
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.35 + Math.sin(elapsed * 0.005) * 0.1;
    }
    
    if (wavesRef.current) {
      wavesRef.current.scale.setScalar(targetScale * 1.1);
      const mat = wavesRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.2 * (1 - Math.abs(progress - 0.5) * 2);
    }
  });

  const normal = useMemo(() => 
    new THREE.Vector3(...disaster.position).normalize(),
    [disaster.position]
  );

  const quaternion = useMemo(() => 
    new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      normal
    ),
    [normal]
  );

  return (
    <group position={disaster.position} quaternion={quaternion}>
      <mesh ref={waterRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 48]} />
        <meshStandardMaterial
          color="#1e90ff"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={wavesRef} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial
          color="#87ceeb"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function MeteorEffect({ disaster }: DisasterEffectProps) {
  const trailRef = useRef<THREE.Mesh>(null);
  const meteorRef = useRef<THREE.Mesh>(null);
  const explosionRef = useRef<THREE.Points>(null);
  const craterRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(disaster.timestamp);
  const particleCount = 300;

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.03 + Math.random() * 0.06;
      
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 0.2;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.2; colors[i * 3 + 2] = 0.1;
      } else {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 0.8;
      }
    }
    
    return { positions, velocities, colors };
  }, []);

  useFrame((state) => {
    const elapsed = Date.now() - startTime.current;
    const impactTime = 800;
    const progress = Math.min(1, elapsed / disaster.duration);
    
    if (elapsed < impactTime) {
      const approach = elapsed / impactTime;
      const offset = (1 - approach) * 8;
      
      if (meteorRef.current) {
        meteorRef.current.position.set(0, offset, 0);
        meteorRef.current.scale.setScalar(1 + (1 - approach) * 0.5);
      }
      
      if (trailRef.current) {
        trailRef.current.position.set(0, offset + 1.5, 0);
        trailRef.current.scale.setScalar(1 * approach + 0.5);
        const mat = trailRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = approach * 0.6;
      }
    } else {
      if (meteorRef.current) {
        meteorRef.current.visible = false;
      }
      if (trailRef.current) {
        trailRef.current.visible = false;
      }
      
      const explosionProgress = Math.min(1, (elapsed - impactTime) / 1500);
      
      if (craterRef.current) {
        craterRef.current.scale.setScalar(DISASTER_CONFIGS.meteor.damageRadius * Math.min(1, explosionProgress * 1.5));
        const mat = craterRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.5 * (1 - explosionProgress * 0.5);
      }
      
      if (explosionRef.current) {
        const posAttr = explosionRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        
        for (let i = 0; i < particleCount; i++) {
          posArray[i * 3] += velocities[i * 3] * (1 - explosionProgress * 0.6);
          posArray[i * 3 + 1] += velocities[i * 3 + 1] * (1 - explosionProgress * 0.6) - 0.002;
          posArray[i * 3 + 2] += velocities[i * 3 + 2] * (1 - explosionProgress * 0.6);
        }
        posAttr.needsUpdate = true;
        
        const mat = explosionRef.current.material as THREE.PointsMaterial;
        mat.opacity = (1 - explosionProgress) * 0.95;
      }
    }
  });

  const normal = useMemo(() => 
    new THREE.Vector3(...disaster.position).normalize(),
    [disaster.position]
  );

  const quaternion = useMemo(() => 
    new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      normal
    ),
    [normal]
  );

  return (
    <group position={disaster.position} quaternion={quaternion}>
      <mesh ref={meteorRef}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#4a3a6e" emissive="#9400d3" emissiveIntensity={0.8} />
      </mesh>
      
      <mesh ref={trailRef}>
        <coneGeometry args={[0.15, 3, 8]} />
        <meshBasicMaterial 
          color="#9400d3" 
          transparent 
          opacity={0.6} 
        />
      </mesh>
      
      <mesh ref={craterRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 1, 48]} />
        <meshBasicMaterial 
          color="#ff4500" 
          transparent 
          opacity={0.5} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <points ref={explosionRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export function DisasterEffect({ disaster }: DisasterEffectProps) {
  switch (disaster.type) {
    case 'earthquake':
      return <EarthquakeEffect disaster={disaster} />;
    case 'volcano':
      return <VolcanoEffect disaster={disaster} />;
    case 'flood':
      return <FloodEffect disaster={disaster} />;
    case 'meteor':
      return <MeteorEffect disaster={disaster} />;
    default:
      return null;
  }
}
