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
    warningColor: '#ff8c00',
    description: '大地震颤，破坏城市和建筑',
    longDescription: '地震是由于星球内部地质构造运动引发的剧烈地面震动。震波从震中向四周扩散，对地表建筑造成结构性破坏。地震的破坏程度取决于震级、震源深度以及建筑的抗震能力。',
    causes: [
      '星球板块运动和碰撞',
      '地下熔岩活动引发的地壳应力',
      '大型陨石撞击引发的次生灾害',
      '冰川融化导致的地壳压力变化'
    ],
    damageRadius: 1.2,
    baseDamage: 50,
    affectedBuildings: [
      { buildingType: 'city', damageMultiplier: 1.5, description: '城市建筑结构复杂，地震中极易坍塌' },
      { buildingType: 'glacier', damageMultiplier: 0.8, description: '冰川在地震中可能出现裂缝和崩塌' },
      { buildingType: 'forest', damageMultiplier: 0.3, description: '森林受地震影响较小，但可能引发山体滑坡' },
    ],
    minInterval: 25000,
    maxInterval: 45000,
    probability: 0.3,
    warningTime: 5000,
    tips: [
      '⚠️ 不要将城市集中建造在地震频发区域',
      '🏙️ 分散城市布局，降低连锁破坏风险',
      '🏔️ 在冰川附近建造城市要格外小心',
      '🌲 森林可以在一定程度上减轻地震的次生危害'
    ],
    historicalEvents: [
      '公元2023年：土耳其-叙利亚边境发生7.8级地震，造成重大人员伤亡',
      '公元2011年：日本东北9.0级地震引发巨大海啸，导致福岛核事故',
      '公元2008年：中国汶川8.0级地震，近7万人遇难'
    ]
  },
  volcano: {
    type: 'volcano',
    name: '火山喷发',
    icon: '🔥',
    color: '#ff4500',
    warningColor: '#ff6347',
    description: '火山喷发，烧毁周围的森林和草地',
    longDescription: '火山喷发是星球内部熔融物质通过火山口喷出地表的自然现象。喷发时会释放灼热的熔岩流、火山灰和有毒气体，对周围生态造成毁灭性打击。熔岩温度可达1200°C，所到之处寸草不生。',
    causes: [
      '星球内部热点活动',
      '板块俯冲带的熔融物质上涌',
      '地震引发的火山活动',
      '地下岩浆房压力累积'
    ],
    damageRadius: 1.5,
    baseDamage: 70,
    affectedBuildings: [
      { buildingType: 'forest', damageMultiplier: 2.0, description: '森林在熔岩和高温下瞬间化为灰烬' },
      { buildingType: 'grassland', damageMultiplier: 1.8, description: '草地被火山灰覆盖，植物全部死亡' },
      { buildingType: 'city', damageMultiplier: 0.6, description: '城市建筑可能被火山灰压垮或被熔岩摧毁' },
    ],
    minInterval: 35000,
    maxInterval: 60000,
    probability: 0.22,
    warningTime: 7000,
    tips: [
      '🌲 不要在火山口附近大规模造林',
      '🏙️ 城市应远离历史火山区',
      '🌿 草地恢复能力强，是火山后最先恢复的生态',
      '⚠️ 火山灰会影响很大范围，注意防护'
    ],
    historicalEvents: [
      '公元1883年：印尼喀拉喀托火山爆发，巨响传遍全球',
      '公元1815年：坦博拉火山爆发，导致全球"无夏之年"',
      '公元79年：意大利维苏威火山喷发，庞贝古城被彻底掩埋'
    ]
  },
  flood: {
    type: 'flood',
    name: '洪水',
    icon: '🌊',
    color: '#1e90ff',
    warningColor: '#00bfff',
    description: '洪水泛滥，冲毁低地的城市和草地',
    longDescription: '洪水是由于极端降水或冰川快速融化导致的水体泛滥。大量积水会淹没低洼地区，侵蚀土壤，破坏建筑地基，同时还可能引发滑坡和泥石流等次生灾害。洪水过后往往伴随瘟疫和饥荒。',
    causes: [
      '极端暴雨天气',
      '冰川快速融化导致水量剧增',
      '森林破坏导致水土流失和蓄水能力下降',
      '城市排水系统不堪重负'
    ],
    damageRadius: 1.8,
    baseDamage: 45,
    affectedBuildings: [
      { buildingType: 'grassland', damageMultiplier: 1.6, description: '草地被洪水淹没，植物因缺氧死亡' },
      { buildingType: 'city', damageMultiplier: 1.4, description: '城市建筑地基被水侵蚀，容易倒塌' },
      { buildingType: 'forest', damageMultiplier: 0.7, description: '森林有一定的水土保持能力，但长期浸泡仍会死亡' },
      { buildingType: 'glacier', damageMultiplier: 0.1, description: '冰川几乎不受洪水影响' },
    ],
    minInterval: 30000,
    maxInterval: 50000,
    probability: 0.25,
    warningTime: 8000,
    tips: [
      '🌲 保护森林可以有效减轻洪水灾害',
      '🏙️ 避免在低洼地区建造大城市',
      '🌿 草地可以减缓洪水流速，但无法抵挡大洪水',
      '🏔️ 冰川是天然的水资源调节器，保护冰川就是保护水源'
    ],
    historicalEvents: [
      '公元1931年：中国长江洪水，估计死亡人数达400万',
      '公元1998年：中国特大洪水，影响全国29个省市',
      '公元2022年：巴基斯坦特大洪水，全国三分之一土地被淹'
    ]
  },
  meteor: {
    type: 'meteor',
    name: '陨石撞击',
    icon: '☄️',
    color: '#9400d3',
    warningColor: '#da70d6',
    description: '陨石从天而降，造成毁灭性打击',
    longDescription: '陨石撞击是来自太空的天体以极高速度撞击星球表面的灾难性事件。陨石进入大气层时会产生耀眼的火球，撞击瞬间释放的能量相当于数百万吨TNT炸药，会形成巨大的撞击坑，并引发全球性的环境灾难。',
    causes: [
      '小行星带中的天体偏离轨道',
      '彗星接近星球时的碎片',
      '月球受撞击后飞溅的物质',
      '星际空间中的流浪天体'
    ],
    damageRadius: 2.0,
    baseDamage: 90,
    affectedBuildings: [
      { buildingType: 'forest', damageMultiplier: 1.2, description: '森林在冲击波和高温下大面积被毁' },
      { buildingType: 'glacier', damageMultiplier: 1.1, description: '冰川受撞击后大面积融化，引发洪水' },
      { buildingType: 'city', damageMultiplier: 1.3, description: '城市在撞击冲击波下瞬间被夷为平地' },
      { buildingType: 'grassland', damageMultiplier: 1.0, description: '草地被撞击坑覆盖，完全消失' },
    ],
    minInterval: 50000,
    maxInterval: 80000,
    probability: 0.18,
    warningTime: 10000,
    tips: [
      '⚠️ 陨石撞击是最具毁灭性的自然灾害，几乎无法防御',
      '🌍 分散建筑布局可以降低单次撞击的损失',
      '🏙️ 不要将所有城市集中在一个区域',
      '🌲 多建设不同类型的建筑，保持生态多样性'
    ],
    historicalEvents: [
      '6600万年前：希克苏鲁伯陨石撞击地球，导致恐龙灭绝',
      '公元1908年：通古斯大爆炸，2000多平方公里森林被夷平',
      '公元2013年：俄罗斯车里雅宾斯克陨石坠落，超过1500人受伤'
    ]
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
