import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANET_RADIUS } from '../utils/helpers';
import { Building } from '../types/game';
import { Forest } from './Buildings/Forest';
import { Glacier } from './Buildings/Glacier';
import { City } from './Buildings/City';
import { Grassland } from './Buildings/Grassland';

interface PlanetProps {
  onClick?: (point: THREE.Vector3) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  lifeIndex: number;
  buildings?: Building[];
}

export function Planet({ onClick, onPointerOver, onPointerOut, lifeIndex, buildings = [] }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const groundColor = useMemo(() => {
    const t = lifeIndex / 100;
    const r = 0.5 + t * 0.1;
    const g = 0.4 + t * 0.35;
    const b = 0.3 + t * 0.1;
    return new THREE.Color(r, g, b);
  }, [lifeIndex]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.02;
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    if (onClick && groupRef.current) {
      const localPoint = groupRef.current.worldToLocal(event.point.clone());
      onClick(localPoint);
    }
  };

  return (
    <group ref={groupRef}>
      <mesh
        ref={planetRef}
        onClick={handleClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[PLANET_RADIUS + 0.03, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {buildings.map((building) => {
        const normal = new THREE.Vector3(...building.position).normalize();
        const surfacePos = normal.clone().multiplyScalar(PLANET_RADIUS + 0.02);
        const position: [number, number, number] = [
          surfacePos.x,
          surfacePos.y,
          surfacePos.z,
        ];
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          normal
        );

        if (building.type === 'forest') {
          return (
            <group key={building.id} position={position} quaternion={quaternion} scale={building.scale}>
              <Forest position={[0, 0, 0]} scale={1} />
            </group>
          );
        }
        if (building.type === 'glacier') {
          return (
            <group key={building.id} position={position} quaternion={quaternion} scale={building.scale}>
              <Glacier position={[0, 0, 0]} scale={1} />
            </group>
          );
        }
        if (building.type === 'city') {
          return (
            <group key={building.id} position={position} quaternion={quaternion} scale={building.scale}>
              <City position={[0, 0, 0]} scale={1} />
            </group>
          );
        }
        if (building.type === 'grassland') {
          return (
            <group key={building.id} position={position} quaternion={quaternion} scale={building.scale}>
              <Grassland position={[0, 0, 0]} scale={1} />
            </group>
          );
        }
        return null;
      })}

      <mesh ref={atmosphereRef} scale={1.08}>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#8ec5ff"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh scale={1.18}>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#5aa8ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh scale={1.3}>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#3d8bff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
