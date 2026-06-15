import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ActiveDisaster, DisasterType } from '../types/game';
import { DISASTER_CONFIGS, PLANET_RADIUS } from '../utils/helpers';

interface DisasterEffectProps {
  disaster: ActiveDisaster;
}

function EarthquakeEffect({ disaster }: DisasterEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());
  const ringRef = useRef<THREE.Mesh>(null);
  const fadeOutTime = 800;

  useFrame(() => {
    if (!groupRef.current) return;
    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(1, elapsed / disaster.duration);
    const shake = (1 - progress) * 0.08 * Math.sin(elapsed * 0.05);
    
    groupRef.current.rotation.x = shake * (Math.random() - 0.5) * 2;
    groupRef.current.rotation.z = shake * (Math.random() - 0.5) * 2;
    groupRef.current.scale.setScalar(1 + shake * 0.3);

    let opacity = 0.4;
    if (elapsed > disaster.duration - fadeOutTime) {
      const fadeProgress = (elapsed - (disaster.duration - fadeOutTime)) / fadeOutTime;
      opacity = Math.max(0, 0.4 * (1 - fadeProgress));
    }

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = opacity;
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
    <group position={disaster.position} quaternion={quaternion} ref={groupRef}>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.1, DISASTER_CONFIGS.earthquake.damageRadius * 0.85, 48]} />
        <meshBasicMaterial 
          color="#8b4513" 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * DISASTER_CONFIGS.earthquake.damageRadius * 0.7,
          0.02,
          (Math.random() - 0.5) * DISASTER_CONFIGS.earthquake.damageRadius * 0.7,
        ]}>
          <boxGeometry args={[0.12, 0.06, 0.12]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}
    </group>
  );
}

function VolcanoEffect({ disaster }: DisasterEffectProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const startTime = useRef(Date.now());
  const ringRef = useRef<THREE.Mesh>(null);
  const count = 250;
  const fadeOutTime = 1000;

  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45;
      const speed = 0.015 + Math.random() * 0.045;
      
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0.15;
      positions[i * 3 + 2] = 0;
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed + 0.01;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.35) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.15; colors[i * 3 + 2] = 0;
      } else if (colorChoice < 0.65) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0;
      } else {
        colors[i * 3] = 0.5; colors[i * 3 + 1] = 0.5; colors[i * 3 + 2] = 0.5;
      }
      
      sizes[i] = 0.04 + Math.random() * 0.08;
    }
    
    return { positions, velocities, colors, sizes };
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(1, elapsed / disaster.duration);
    
    let opacityMultiplier = 1;
    if (elapsed > disaster.duration - fadeOutTime) {
      const fadeProgress = (elapsed - (disaster.duration - fadeOutTime)) / fadeOutTime;
      opacityMultiplier = Math.max(0, 1 - fadeProgress);
    }
    
    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const particleProgress = Math.min(1, (elapsed * (0.5 + Math.random() * 0.5)) / disaster.duration);
      posArray[i * 3] += velocities[i * 3] * (1 - progress * 0.4);
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * (1 - progress * 0.4) - 0.0008 * progress;
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * (1 - progress * 0.4);
    }
    
    posAttr.needsUpdate = true;
    
    const mat = particlesRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.85 * opacityMultiplier;

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 * opacityMultiplier;
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
      <mesh>
        <coneGeometry args={[0.28, 0.55, 10]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ff4500" />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.2, DISASTER_CONFIGS.volcano.damageRadius * 0.92, 48]} />
        <meshBasicMaterial 
          color="#ff4500" 
          transparent 
          opacity={0.25} 
          side={THREE.DoubleSide}
          depthWrite={false}
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
          size={0.07}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function FloodEffect({ disaster }: DisasterEffectProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const wavesRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());
  const fadeOutTime = 1200;

  useFrame((state, delta) => {
    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(1, elapsed / disaster.duration);
    
    const targetScale = DISASTER_CONFIGS.flood.damageRadius * (0.25 + progress * 0.75);
    
    let opacityMultiplier = 1;
    if (elapsed > disaster.duration - fadeOutTime) {
      const fadeProgress = (elapsed - (disaster.duration - fadeOutTime)) / fadeOutTime;
      opacityMultiplier = Math.max(0, 1 - fadeProgress);
    }
    
    if (waterRef.current) {
      waterRef.current.scale.setScalar(targetScale);
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = (0.32 + Math.sin(elapsed * 0.004) * 0.08) * opacityMultiplier;
    }
    
    if (wavesRef.current) {
      wavesRef.current.scale.setScalar(targetScale * (1.05 + Math.sin(elapsed * 0.008) * 0.05));
      const mat = wavesRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 * (1 - Math.abs(progress - 0.5) * 1.5) * opacityMultiplier;
      if (mat.opacity < 0) mat.opacity = 0;
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

  useEffect(() => {
    return () => {
      if (waterRef.current) {
        waterRef.current.geometry.dispose();
        (waterRef.current.material as THREE.Material).dispose();
      }
      if (wavesRef.current) {
        wavesRef.current.geometry.dispose();
        (wavesRef.current.material as THREE.Material).dispose();
      }
    };
  }, []);

  return (
    <group position={disaster.position} quaternion={quaternion}>
      <mesh ref={waterRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial
          color="#1e90ff"
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
          metalness={0.25}
          roughness={0.15}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={wavesRef} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.88, 1, 64]} />
        <meshBasicMaterial
          color="#87ceeb"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
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
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());
  const particleCount = 350;
  const fadeOutTime = 1500;

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.025 + Math.random() * 0.065;
      
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 0.2;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.2; colors[i * 3 + 2] = 0.05;
      } else {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.9;
      }
    }
    
    return { positions, velocities, colors };
  }, []);

  useFrame((state) => {
    const elapsed = Date.now() - startTime.current;
    const impactTime = 700;
    const totalProgress = Math.min(1, elapsed / disaster.duration);
    
    let opacityMultiplier = 1;
    if (elapsed > disaster.duration - fadeOutTime) {
      const fadeProgress = (elapsed - (disaster.duration - fadeOutTime)) / fadeOutTime;
      opacityMultiplier = Math.max(0, 1 - fadeProgress);
    }
    
    if (elapsed < impactTime) {
      const approach = elapsed / impactTime;
      const offset = (1 - approach) * 10;
      
      if (meteorRef.current) {
        meteorRef.current.position.set(0, offset, 0);
        meteorRef.current.scale.setScalar(1 + (1 - approach) * 0.4);
        const mat = meteorRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.8 + (1 - approach) * 0.5;
      }
      
      if (trailRef.current) {
        trailRef.current.position.set(0, offset + 2, 0);
        trailRef.current.scale.setScalar(0.8 + approach * 0.4);
        const mat = trailRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = approach * 0.7 * opacityMultiplier;
      }
    } else {
      if (meteorRef.current) {
        meteorRef.current.visible = false;
      }
      if (trailRef.current) {
        trailRef.current.visible = false;
      }
      
      const explosionProgress = Math.min(1, (elapsed - impactTime) / 1800);
      
      if (craterRef.current) {
        craterRef.current.scale.setScalar(DISASTER_CONFIGS.meteor.damageRadius * Math.min(1, explosionProgress * 1.6));
        const mat = craterRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.45 * (1 - explosionProgress * 0.6) * opacityMultiplier;
      }

      if (shockwaveRef.current) {
        shockwaveRef.current.scale.setScalar(DISASTER_CONFIGS.meteor.damageRadius * 0.5 + explosionProgress * DISASTER_CONFIGS.meteor.damageRadius * 0.8);
        const mat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.6 * (1 - explosionProgress) * opacityMultiplier;
      }
      
      if (explosionRef.current) {
        const posAttr = explosionRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        
        for (let i = 0; i < particleCount; i++) {
          posArray[i * 3] += velocities[i * 3] * (1 - explosionProgress * 0.55);
          posArray[i * 3 + 1] += velocities[i * 3 + 1] * (1 - explosionProgress * 0.55) - 0.0015;
          posArray[i * 3 + 2] += velocities[i * 3 + 2] * (1 - explosionProgress * 0.55);
        }
        posAttr.needsUpdate = true;
        
        const mat = explosionRef.current.material as THREE.PointsMaterial;
        mat.opacity = (1 - explosionProgress) * 0.95 * opacityMultiplier;
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

  useEffect(() => {
    return () => {
      if (explosionRef.current) {
        explosionRef.current.geometry.dispose();
        (explosionRef.current.material as THREE.Material).dispose();
      }
    };
  }, []);

  return (
    <group position={disaster.position} quaternion={quaternion}>
      <mesh ref={meteorRef}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial 
          color="#4a3a6e" 
          emissive="#9400d3" 
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      <mesh ref={trailRef}>
        <coneGeometry args={[0.14, 4, 10]} />
        <meshBasicMaterial 
          color="#9400d3" 
          transparent 
          opacity={0.7} 
        />
      </mesh>
      
      <mesh ref={craterRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 1, 64]} />
        <meshBasicMaterial 
          color="#ff4500" 
          transparent 
          opacity={0.45} 
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={shockwaveRef} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1, 32]} />
        <meshBasicMaterial 
          color="#ff6b6b" 
          transparent 
          opacity={0.6} 
          side={THREE.DoubleSide}
          depthWrite={false}
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
          size={0.09}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
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
