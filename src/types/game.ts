export type BuildingType = 'forest' | 'glacier' | 'city' | 'grassland';

export type DisasterType = 'earthquake' | 'volcano' | 'flood' | 'meteor';

export interface Building {
  id: string;
  type: BuildingType;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  health: number;
  maxHealth: number;
  damaged: boolean;
}

export interface GameState {
  buildings: Building[];
  selectedTool: BuildingType | null;
  lifeIndex: number;
  forestCount: number;
  glacierCount: number;
  cityCount: number;
  grasslandCount: number;
}

export interface BuildingConfig {
  type: BuildingType;
  name: string;
  color: string;
  icon: string;
  lifeValue: number;
  description: string;
  baseHealth: number;
}

export interface DisasterConfig {
  type: DisasterType;
  name: string;
  icon: string;
  color: string;
  description: string;
  damageRadius: number;
  baseDamage: number;
  affectedBuildings: BuildingType[];
  minInterval: number;
  maxInterval: number;
  probability: number;
}

export interface ActiveDisaster {
  id: string;
  type: DisasterType;
  position: [number, number, number];
  timestamp: number;
  duration: number;
  intensity: number;
  affectedBuildingIds: string[];
}
