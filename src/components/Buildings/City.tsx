import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { createWindowTexture, createGrassTexture } from '../../utils/texture';
import { useDayNight } from '../../contexts/DayNightContext';
import * as THREE from 'three';

interface BuildingProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

interface SkyscraperProps {
  position: [number, number, number];
  width?: number;
  depth?: number;
  height?: number;
  color?: string;
  windowLitRatio?: number;
  nightWindowColor?: string;
}

function Skyscraper({
  position,
  width = 0.1,
  depth = 0.1,
  height = 0.4,
  color = '#708090',
  windowLitRatio = 0.6,
  nightWindowColor = '#ffeb99',
}: SkyscraperProps) {
  const { nightFactor, isNight } = useDayNight();
  const windowTex1 = useMemo(() => createWindowTexture(windowLitRatio), [windowLitRatio]);
  const windowTex2 = useMemo(() => createWindowTexture(windowLitRatio * 0.9), [windowLitRatio]);

  const windowEmissiveIntensity = isNight ? 0.8 + nightFactor * 0.7 : 0.3;
  const buildingNightTint = isNight ? nightFactor * 0.3 : 0;

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.7} 
          metalness={0.3}
          emissive={nightWindowColor}
          emissiveIntensity={buildingNightTint * 0.1}
        />
      </mesh>

      <mesh position={[0, height / 2, depth / 2 + 0.001]}>
        <planeGeometry args={[width * 0.9, height * 0.95]} />
        <meshStandardMaterial
          map={windowTex1}
          emissive={nightWindowColor}
          emissiveIntensity={windowEmissiveIntensity}
          transparent
        />
      </mesh>

      <mesh position={[0, height / 2, -depth / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.9, height * 0.95]} />
        <meshStandardMaterial
          map={windowTex2}
          emissive={nightWindowColor}
          emissiveIntensity={windowEmissiveIntensity * 0.9}
          transparent
        />
      </mesh>

      <mesh position={[width / 2 + 0.001, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth * 0.9, height * 0.95]} />
        <meshStandardMaterial
          map={windowTex1}
          emissive={nightWindowColor}
          emissiveIntensity={windowEmissiveIntensity * 0.8}
          transparent
        />
      </mesh>

      <mesh position={[-width / 2 - 0.001, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth * 0.9, height * 0.95]} />
        <meshStandardMaterial
          map={windowTex2}
          emissive={nightWindowColor}
          emissiveIntensity={windowEmissiveIntensity * 0.7}
          transparent
        />
      </mesh>

      {height > 0.3 && (
        <>
          <mesh position={[0, height + 0.015, 0]} castShadow>
            <boxGeometry args={[width * 0.4, 0.03, depth * 0.4]} />
            <meshStandardMaterial color="#555" roughness={0.8} metalness={0.5} />
          </mesh>

          <mesh position={[width * 0.15, height + 0.04, -depth * 0.1]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.05, 6]} />
            <meshStandardMaterial color="#888" roughness={0.6} metalness={0.8} />
          </mesh>

          <mesh position={[-width * 0.1, height + 0.05, depth * 0.12]} castShadow>
            <boxGeometry args={[0.015, 0.08, 0.015]} />
            <meshStandardMaterial color="#666" roughness={0.7} metalness={0.7} />
          </mesh>

          {windowLitRatio > 0.5 && (
            <mesh position={[0, height + 0.06, 0]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial 
                color="#ff3333" 
                transparent 
                opacity={isNight ? 0.9 + nightFactor * 0.1 : 0.6}
              />
            </mesh>
          )}

          {isNight && (
            <mesh position={[width * 0.25, height + 0.02, 0]}>
              <sphereGeometry args={[0.008, 6, 6]} />
              <meshBasicMaterial color="#ff0000" transparent opacity={nightFactor * 0.8} />
            </mesh>
          )}
        </>
      )}
    </group>
  );
}

function StreetLight({ position }: { position: [number, number, number] }) {
  const { nightFactor, isNight } = useDayNight();
  const lightRef = useRef<THREE.PointLight>(null);

  const lightIntensity = isNight ? 1.5 + nightFactor * 2 : 0.3;
  const bulbOpacity = isNight ? 0.9 + nightFactor * 0.1 : 0.5;

  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.008, 0.16, 6]} />
        <meshStandardMaterial color="#333333" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh position={[0.025, 0.15, 0]} castShadow>
        <boxGeometry args={[0.04, 0.006, 0.006]} />
        <meshStandardMaterial color="#444444" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh position={[0.04, 0.14, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial
          color="#ffeb99"
          emissive="#ffcc33"
          emissiveIntensity={lightIntensity}
          transparent
          opacity={bulbOpacity}
        />
      </mesh>
      
      {isNight && (
        <>
          <pointLight
            ref={lightRef}
            position={[0.04, 0.13, 0]}
            color="#ffcc33"
            intensity={nightFactor * 0.8}
            distance={0.8}
            decay={2}
          />
          <mesh position={[0.04, 0.13, 0]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial
              color="#ffeb99"
              transparent
              opacity={nightFactor * 0.3}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

function NeonSign({ 
  position, 
  color, 
  text = '' 
}: { 
  position: [number, number, number]; 
  color: string;
  text?: string;
}) {
  const { nightFactor, isNight } = useDayNight();
  
  if (!isNight) return null;

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.06, 0.02, 0.005]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={nightFactor * 0.9}
        />
      </mesh>
      <mesh position={[0, 0, 0.003]}>
        <boxGeometry args={[0.065, 0.025, 0.002]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={nightFactor * 0.3}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0.01]}
        color={color}
        intensity={nightFactor * 0.3}
        distance={0.5}
        decay={2}
      />
    </group>
  );
}

export function City({ position, scale = 1, rotation = [0, 0, 0] }: BuildingProps) {
  const { nightFactor, isNight } = useDayNight();
  const grassTexture = useMemo(() => createGrassTexture(), []);

  const neonSigns = useMemo(() => [
    { pos: [-0.12, 0.25, 0.095] as [number, number, number], color: '#ff0066' },
    { pos: [0.08, 0.18, 0.115] as [number, number, number], color: '#00ffff' },
    { pos: [0.02, 0.3, -0.13] as [number, number, number], color: '#ffff00' },
  ], []);

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[0.4, 24]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.95} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.34, 0.42, 24]} />
        <meshStandardMaterial map={grassTexture} transparent opacity={0.7} roughness={1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[0.05, 0.28, 24, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>

      <Skyscraper
        position={[-0.12, 0, 0.05]}
        width={0.1}
        depth={0.09}
        height={0.45}
        color="#607080"
        windowLitRatio={0.7}
        nightWindowColor="#ffeb99"
      />

      <Skyscraper
        position={[0.08, 0, 0.08]}
        width={0.07}
        depth={0.07}
        height={0.32}
        color="#696969"
        windowLitRatio={0.55}
        nightWindowColor="#b3e0ff"
      />

      <Skyscraper
        position={[0.02, 0, -0.08]}
        width={0.11}
        depth={0.1}
        height={0.52}
        color="#556b6f"
        windowLitRatio={0.65}
        nightWindowColor="#ffcc99"
      />

      <Skyscraper
        position={[-0.05, 0, 0.13]}
        width={0.06}
        depth={0.06}
        height={0.26}
        color="#707080"
        windowLitRatio={0.5}
        nightWindowColor="#e6e6ff"
      />

      <StreetLight position={[0.15, 0, 0.02]} />
      <StreetLight position={[-0.18, 0, 0.1]} />
      <StreetLight position={[0.05, 0, -0.15]} />

      {isNight && neonSigns.map((sign, i) => (
        <NeonSign key={i} position={sign.pos} color={sign.color} />
      ))}

      <mesh position={[0.22, 0.008, 0.1]} castShadow>
        <boxGeometry args={[0.03, 0.015, 0.06]} />
        <meshStandardMaterial color="#e63946" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0.22, 0.008, 0.1]} castShadow>
        <boxGeometry args={[0.028, 0.005, 0.02]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {isNight && (
        <mesh position={[0.22, 0.012, 0.12]}>
          <sphereGeometry args={[0.005, 4, 4]} />
          <meshBasicMaterial color="#ff3300" transparent opacity={nightFactor * 0.8} />
        </mesh>
      )}

      <mesh position={[-0.2, 0.008, -0.05]} castShadow>
        <boxGeometry args={[0.025, 0.012, 0.05]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.3} roughness={0.6} />
      </mesh>

      {isNight && (
        <group>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const dist = 0.3 + Math.random() * 0.05;
            return (
              <mesh
                key={`street-light-glow-${i}`}
                position={[
                  Math.cos(angle) * dist,
                  0.02,
                  Math.sin(angle) * dist,
                ]}
              >
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshBasicMaterial
                  color="#ffcc33"
                  transparent
                  opacity={nightFactor * 0.15}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
