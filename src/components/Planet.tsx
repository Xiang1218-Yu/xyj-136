import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANET_RADIUS } from '../utils/helpers';
import { createPlanetTexture, createCloudTexture } from '../utils/texture';
import { Building, ActiveDisaster, ToolType } from '../types/game';
import { Forest } from './Buildings/Forest';
import { Glacier } from './Buildings/Glacier';
import { City } from './Buildings/City';
import { Grassland } from './Buildings/Grassland';
import { DisasterEffect } from './DisasterEffect';

interface PlanetProps {
  onClick?: (point: THREE.Vector3) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onRemoveBuilding?: (id: string) => void;
  selectedTool?: ToolType | null;
  lifeIndex: number;
  buildings?: Building[];
  disasters?: ActiveDisaster[];
}

function createTerrainGeometry(radius: number, widthSeg: number, heightSeg: number): THREE.SphereGeometry {
  const geometry = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
  const positions = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i);
    const noise =
      Math.sin(vertex.x * 2.5) * Math.cos(vertex.y * 2.5) * 0.015 +
      Math.sin(vertex.x * 5 + vertex.y * 3) * Math.cos(vertex.z * 4) * 0.008 +
      Math.cos(vertex.y * 6) * Math.sin(vertex.z * 6) * 0.005;

    vertex.normalize().multiplyScalar(radius + noise);
    positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function BuildingHealthBar({ health, maxHealth }: { health: number; maxHealth: number }) {
  const percent = health / maxHealth;
  const color = percent > 0.6 ? '#7cfc00' : percent > 0.3 ? '#ffa500' : '#ff6b6b';
  
  return (
    <group position={[0, 0.18, 0]}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.2, 0.025]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-(0.1 - 0.1 * percent), 0, 0.001]}>
        <planeGeometry args={[0.2 * percent, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export function Planet({ onClick, onPointerOver, onPointerOut, onRemoveBuilding, selectedTool, lifeIndex, buildings = [], disasters = [] }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const terrainRef = useRef<THREE.Mesh>(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);

  const planetTexture = useMemo(() => createPlanetTexture(), []);
  const cloudTexture = useMemo(() => createCloudTexture(), []);

  const terrainGeometry = useMemo(
    () => createTerrainGeometry(PLANET_RADIUS + 0.005, 128, 128),
    []
  );

  useEffect(() => {
    const t = lifeIndex / 100;
    if (planetRef.current) {
      const mat = planetRef.current.material as THREE.MeshStandardMaterial;
      mat.color.setRGB(
        0.35 + t * 0.15,
        0.3 + t * 0.35,
        0.4 + t * 0.05
      );
    }
  }, [lifeIndex]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.015;
    }
    if (terrainRef.current) {
      terrainRef.current.rotation.y += delta * 0.03;
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
        <sphereGeometry args={[PLANET_RADIUS, 128, 128]} />
        <meshStandardMaterial
          map={planetTexture}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      <mesh ref={terrainRef} receiveShadow>
        <primitive object={terrainGeometry} attach="geometry" />
        <meshStandardMaterial
          map={planetTexture}
          transparent
          opacity={0.6}
          roughness={0.95}
          metalness={0}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[PLANET_RADIUS + 0.05, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          color="#ffffff"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      {buildings.map((building) => {
        const normal = new THREE.Vector3(...building.position).normalize();
        const surfacePos = normal.clone().multiplyScalar(PLANET_RADIUS + 0.03);
        const position: [number, number, number] = [
          surfacePos.x,
          surfacePos.y,
          surfacePos.z,
        ];
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          normal
        );

        const healthPercent = building.health / building.maxHealth;
        const isDamaged = building.damaged;
        const buildingOpacity = isDamaged ? 0.7 + Math.sin(Date.now() * 0.005) * 0.1 : 1;
        const isDeleteMode = selectedTool === 'delete';
        const isHovered = hoveredBuildingId === building.id;

        let BuildingComponent;
        if (building.type === 'forest') BuildingComponent = Forest;
        else if (building.type === 'glacier') BuildingComponent = Glacier;
        else if (building.type === 'city') BuildingComponent = City;
        else BuildingComponent = Grassland;

        const handleBuildingClick = (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (isDeleteMode && onRemoveBuilding) {
            onRemoveBuilding(building.id);
          }
        };

        const handleBuildingPointerOver = (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (isDeleteMode) {
            setHoveredBuildingId(building.id);
            document.body.style.cursor = 'pointer';
          }
        };

        const handleBuildingPointerOut = (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (isDeleteMode) {
            setHoveredBuildingId(null);
            document.body.style.cursor = 'auto';
          }
        };

        return (
          <group 
            key={building.id} 
            position={position} 
            quaternion={quaternion} 
            scale={building.scale}
            onClick={handleBuildingClick}
            onPointerOver={handleBuildingPointerOver}
            onPointerOut={handleBuildingPointerOut}
          >
            <group scale={healthPercent < 0.3 ? [0.85, 0.85, 0.85] : [1, 1, 1]}>
              <BuildingComponent position={[0, 0, 0]} scale={1} />
            </group>
            {isDamaged && (
              <BuildingHealthBar health={building.health} maxHealth={building.maxHealth} />
            )}
            {isDamaged && (
              <mesh position={[0, 0.08, 0]}>
                <sphereGeometry args={[0.02 + Math.random() * 0.01, 8, 8]} />
                <meshBasicMaterial color="#666666" transparent opacity={0.6} />
              </mesh>
            )}
            {isDeleteMode && isHovered && (
              <mesh position={[0, 0.05, 0]}>
                <ringGeometry args={[0.15, 0.17, 32]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.9} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}

      {disasters.map((disaster) => (
        <DisasterEffect key={disaster.id} disaster={disaster} />
      ))}

      <mesh scale={1.06}>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#a8d8ff"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.15}>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#6ab0ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.28}>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

