export type BuildingType = 'forest' | 'glacier' | 'city' | 'grassland';
export type ToolType = BuildingType | 'delete';

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
  selectedTool: ToolType | null;
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

export interface DisasterDamageInfo {
  buildingType: BuildingType;
  damageMultiplier: number;
  description: string;
}

export interface DisasterConfig {
  type: DisasterType;
  name: string;
  icon: string;
  color: string;
  warningColor: string;
  description: string;
  longDescription: string;
  causes: string[];
  damageRadius: number;
  baseDamage: number;
  affectedBuildings: DisasterDamageInfo[];
  minInterval: number;
  maxInterval: number;
  probability: number;
  warningTime: number;
  tips: string[];
  historicalEvents: string[];
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

export interface DisasterWarning {
  id: string;
  type: DisasterType;
  estimatedPosition: [number, number, number];
  countdown: number;
  estimatedIntensity: number;
  timestamp: number;
}

