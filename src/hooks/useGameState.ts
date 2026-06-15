import { useState, useCallback } from 'react';
import * as THREE from 'three';
import { Building, BuildingType, GameState } from '../types/game';
import { generateId, calculateLifeIndex, PLANET_RADIUS, BUILDING_CONFIGS } from '../utils/helpers';

function createInitialBuildings(): Building[] {
  const buildings: Building[] = [];

  const forestPositions: [number, number, number][] = [
    [0.5, 1.5, 1.2],
    [-0.8, 1.0, 1.5],
    [1.2, 0.5, 1.3],
  ];

  forestPositions.forEach((pos, i) => {
    const normalized = new THREE.Vector3(...pos).normalize().multiplyScalar(PLANET_RADIUS);
    const baseHealth = BUILDING_CONFIGS.forest.baseHealth;
    buildings.push({
      id: `forest-${i}`,
      type: 'forest',
      position: [normalized.x, normalized.y, normalized.z],
      scale: 2,
      rotation: [0, Math.random() * Math.PI * 2, 0],
      health: baseHealth,
      maxHealth: baseHealth,
      damaged: false,
    });
  });

  const glacierPositions: [number, number, number][] = [
    [-0.3, 1.8, 0.8],
    [0.6, -1.6, 1.0],
  ];

  glacierPositions.forEach((pos, i) => {
    const normalized = new THREE.Vector3(...pos).normalize().multiplyScalar(PLANET_RADIUS);
    const baseHealth = BUILDING_CONFIGS.glacier.baseHealth;
    buildings.push({
      id: `glacier-${i}`,
      type: 'glacier',
      position: [normalized.x, normalized.y, normalized.z],
      scale: 2,
      rotation: [0, Math.random() * Math.PI * 2, 0],
      health: baseHealth,
      maxHealth: baseHealth,
      damaged: false,
    });
  });

  const cityPositions: [number, number, number][] = [
    [1.5, 0.3, 1.0],
    [-1.0, -0.5, 1.5],
  ];

  cityPositions.forEach((pos, i) => {
    const normalized = new THREE.Vector3(...pos).normalize().multiplyScalar(PLANET_RADIUS);
    const baseHealth = BUILDING_CONFIGS.city.baseHealth;
    buildings.push({
      id: `city-${i}`,
      type: 'city',
      position: [normalized.x, normalized.y, normalized.z],
      scale: 2,
      rotation: [0, Math.random() * Math.PI * 2, 0],
      health: baseHealth,
      maxHealth: baseHealth,
      damaged: false,
    });
  });

  const grasslandPositions: [number, number, number][] = [
    [0.2, 1.2, 1.6],
    [-1.2, 0.8, 1.2],
    [0.8, -1.0, 1.5],
  ];

  grasslandPositions.forEach((pos, i) => {
    const normalized = new THREE.Vector3(...pos).normalize().multiplyScalar(PLANET_RADIUS);
    const baseHealth = BUILDING_CONFIGS.grassland.baseHealth;
    buildings.push({
      id: `grassland-${i}`,
      type: 'grassland',
      position: [normalized.x, normalized.y, normalized.z],
      scale: 2,
      rotation: [0, Math.random() * Math.PI * 2, 0],
      health: baseHealth,
      maxHealth: baseHealth,
      damaged: false,
    });
  });

  return buildings;
}

function updateCountsAndLifeIndex(buildings: Building[]) {
  const forestCount = buildings.filter(b => b.type === 'forest').length;
  const glacierCount = buildings.filter(b => b.type === 'glacier').length;
  const cityCount = buildings.filter(b => b.type === 'city').length;
  const grasslandCount = buildings.filter(b => b.type === 'grassland').length;
  const lifeIndex = calculateLifeIndex(forestCount, glacierCount, cityCount, grasslandCount);
  return { forestCount, glacierCount, cityCount, grasslandCount, lifeIndex };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialBuildings = createInitialBuildings();
    const { forestCount, glacierCount, cityCount, grasslandCount, lifeIndex } = updateCountsAndLifeIndex(initialBuildings);

    return {
      buildings: initialBuildings,
      selectedTool: null,
      lifeIndex,
      forestCount,
      glacierCount,
      cityCount,
      grasslandCount,
    };
  });

  const selectTool = useCallback((tool: BuildingType | null) => {
    setGameState(prev => ({ ...prev, selectedTool: tool }));
  }, []);

  const addBuilding = useCallback((type: BuildingType, position: [number, number, number]) => {
    const baseHealth = BUILDING_CONFIGS[type].baseHealth;
    const building: Building = {
      id: generateId(),
      type,
      position,
      scale: 1,
      rotation: [0, Math.random() * Math.PI * 2, 0],
      health: baseHealth,
      maxHealth: baseHealth,
      damaged: false,
    };

    setGameState(prev => {
      const newBuildings = [...prev.buildings, building];
      const counts = updateCountsAndLifeIndex(newBuildings);
      return { ...prev, buildings: newBuildings, ...counts };
    });
  }, []);

  const damageBuildings = useCallback((damages: { id: string; damage: number }[]) => {
    setGameState(prev => {
      const damageMap = new Map(damages.map(d => [d.id, d.damage]));
      const newBuildings = prev.buildings.map(b => {
        const damage = damageMap.get(b.id);
        if (damage !== undefined) {
          const newHealth = Math.max(0, b.health - damage);
          return {
            ...b,
            health: newHealth,
            damaged: newHealth < b.maxHealth * 0.6,
          };
        }
        return b;
      });
      const counts = updateCountsAndLifeIndex(newBuildings);
      return { ...prev, buildings: newBuildings, ...counts };
    });
  }, []);

  const removeBuildings = useCallback((ids: string[]) => {
    setGameState(prev => {
      const idSet = new Set(ids);
      const newBuildings = prev.buildings.filter(b => !idSet.has(b.id));
      const counts = updateCountsAndLifeIndex(newBuildings);
      return { ...prev, buildings: newBuildings, ...counts };
    });
  }, []);

  const resetBuildings = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      buildings: [],
      forestCount: 0,
      glacierCount: 0,
      cityCount: 0,
      grasslandCount: 0,
      lifeIndex: 0,
    }));
  }, []);

  return {
    gameState,
    selectTool,
    addBuilding,
    damageBuildings,
    removeBuildings,
    resetBuildings,
  };
}

