interface BuildingProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export function City({ position, scale = 1, rotation = [0, 0, 0] }: BuildingProps) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[-0.12, 0.2, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#708090" emissive="#ffd700" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.08, 0.15, 0.08]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#696969" emissive="#87ceeb" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.02, 0.25, -0.08]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color="#556b2f" emissive="#ffa500" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-0.05, 0.12, 0.12]} castShadow>
        <boxGeometry args={[0.06, 0.24, 0.06]} />
        <meshStandardMaterial color="#808080" emissive="#e0ffff" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}
