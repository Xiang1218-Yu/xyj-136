import { BuildingType, BuildingConfig, DisasterType, DisasterConfig, ToolType } from '../types/game';

interface ToolConfig {
  type: ToolType;
  name: string;
  color: string;
  icon: string;
  description?: string;
  lifeValue?: number;
}

export const BUILDING_CONFIGS: Record<BuildingType, BuildingConfig> = {
  forest: {
    type: 'forest',
    name: '森林',
    color: '#2d5a27',
    icon: '🌲',
    lifeValue: 15,
    description: '郁郁葱葱的森林，为星球带来生机',
    baseHealth: 80,
  },
  glacier: {
    type: 'glacier',
    name: '冰川',
    color: '#87ceeb',
    icon: '🏔️',
    lifeValue: 10,
    description: '晶莹剔透的冰川，调节星球气候',
    baseHealth: 100,
  },
  city: {
    type: 'city',
    name: '城市',
    color: '#ffa500',
    icon: '🏙️',
    lifeValue: 20,
    description: '繁华的城市，文明的象征',
    baseHealth: 120,
  },
  grassland: {
    type: 'grassland',
    name: '草地',
    color: '#7cfc00',
    icon: '🌿',
    lifeValue: 8,
    description: '翠绿的草地，覆盖大地',
    baseHealth: 60,
  },
};

export const DISASTER_CONFIGS: Record<DisasterType, DisasterConfig> = {
  earthquake: {
    type: 'earthquake',
    name: '地震',
    icon: '🌋',
    color: '#8b4513',
    description: '大地震颤，破坏城市和建筑',
    damageRadius: 1.2,
    baseDamage: 50,
    affectedBuildings: ['city', 'glacier'],
    minInterval: 25000,
    maxInterval: 45000,
    probability: 0.3,
  },
  volcano: {
    type: 'volcano',
    name: '火山喷发',
    icon: '🔥',
    color: '#ff4500',
    description: '火山喷发，烧毁周围的森林和草地',
    damageRadius: 1.5,
    baseDamage: 70,
    affectedBuildings: ['forest', 'grassland'],
    minInterval: 35000,
    maxInterval: 60000,
    probability: 0.22,
  },
  flood: {
    type: 'flood',
    name: '洪水',
    icon: '🌊',
    color: '#1e90ff',
    description: '洪水泛滥，冲毁低地的城市和草地',
    damageRadius: 1.8,
    baseDamage: 45,
    affectedBuildings: ['city', 'grassland', 'forest'],
    minInterval: 30000,
    maxInterval: 50000,
    probability: 0.25,
  },
  meteor: {
    type: 'meteor',
    name: '陨石撞击',
    icon: '☄️',
    color: '#9400d3',
    description: '陨石从天而降，造成毁灭性打击',
    damageRadius: 2.0,
    baseDamage: 90,
    affectedBuildings: ['forest', 'glacier', 'city', 'grassland'],
    minInterval: 50000,
    maxInterval: 80000,
    probability: 0.18,
  },
};

export const PLANET_RADIUS = 2;

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function calculateLifeIndex(
  forestCount: number,
  glacierCount: number,
  cityCount: number,
  grasslandCount: number
): number {
  const total =
    forestCount * 15 +
    glacierCount * 10 +
    cityCount * 20 +
    grasslandCount * 8;
  return Math.min(100, total / 5);
}

export function getRandomDisasterType(): DisasterType {
  const types = Object.keys(DISASTER_CONFIGS) as DisasterType[];
  const totalProbability = types.reduce((sum, t) => sum + DISASTER_CONFIGS[t].probability, 0);
  let random = Math.random() * totalProbability;
  
  for (const type of types) {
    random -= DISASTER_CONFIGS[type].probability;
    if (random <= 0) {
      return type;
    }
  }
  
  return types[0];
}

export function getRandomDisasterInterval(type: DisasterType): number {
  const config = DISASTER_CONFIGS[type];
  return config.minInterval + Math.random() * (config.maxInterval - config.minInterval);
}

export const TOOL_CONFIGS: Record<ToolType, ToolConfig> = {
  ...BUILDING_CONFIGS,
  delete: {
    type: 'delete',
    name: '删除',
    color: '#ef4444',
    icon: '🗑️',
    description: '点击建筑即可删除',
  },
};
