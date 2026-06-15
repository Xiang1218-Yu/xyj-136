import { useState, useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { ActiveDisaster, Building, DisasterType, DisasterWarning } from '../types/game';
import { DISASTER_CONFIGS, PLANET_RADIUS, generateId, getRandomDisasterType } from '../utils/helpers';

interface UseDisastersProps {
  buildings: Building[];
  onDamageBuildings: (damages: { id: string; damage: number }[]) => void;
  onRemoveBuildings: (ids: string[]) => void;
}

export function useDisasters({ buildings, onDamageBuildings, onRemoveBuildings }: UseDisastersProps) {
  const [activeDisasters, setActiveDisasters] = useState<ActiveDisaster[]>([]);
  const [recentDisaster, setRecentDisaster] = useState<ActiveDisaster | null>(null);
  const [currentWarning, setCurrentWarning] = useState<DisasterWarning | null>(null);
  const [warningCountdown, setWarningCountdown] = useState<number>(0);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const triggerDisaster = useCallback((type: DisasterType, position?: [number, number, number], intensity?: number) => {
    const config = DISASTER_CONFIGS[type];
    
    let finalPosition: [number, number, number];
    if (position) {
      finalPosition = position;
    } else {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = PLANET_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = PLANET_RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = PLANET_RADIUS * Math.cos(phi);
      finalPosition = [x, y, z];
    }

    const disasterCenter = new THREE.Vector3(...finalPosition);
    const finalIntensity = intensity ?? (0.5 + Math.random() * 0.5);
    
    const affectedBuildingIds: string[] = [];
    const damages: { id: string; damage: number }[] = [];
    const toRemove: string[] = [];

    buildings.forEach((building) => {
      const damageInfo = config.affectedBuildings.find(
        (info) => info.buildingType === building.type
      );
      
      if (!damageInfo) return;

      const buildingPos = new THREE.Vector3(...building.position);
      const distance = disasterCenter.distanceTo(buildingPos);

      if (distance <= config.damageRadius) {
        const falloff = 1 - (distance / config.damageRadius);
        const baseDamage = Math.floor(config.baseDamage * falloff * finalIntensity);
        const finalDamage = Math.floor(baseDamage * damageInfo.damageMultiplier);
        
        if (finalDamage > 0) {
          affectedBuildingIds.push(building.id);
          
          const newHealth = building.health - finalDamage;
          if (newHealth <= 0) {
            toRemove.push(building.id);
          } else {
            damages.push({ id: building.id, damage: finalDamage });
          }
        }
      }
    });

    const disaster: ActiveDisaster = {
      id: generateId(),
      type,
      position: finalPosition,
      timestamp: Date.now(),
      duration: 4000,
      intensity: finalIntensity,
      affectedBuildingIds,
    };

    setActiveDisasters((prev) => [...prev, disaster]);
    setRecentDisaster(disaster);

    if (damages.length > 0) {
      onDamageBuildings(damages);
    }
    if (toRemove.length > 0) {
      onRemoveBuildings(toRemove);
    }

    const removeTimer = setTimeout(() => {
      setActiveDisasters((prev) => prev.filter((d) => d.id !== disaster.id));
      timersRef.current.delete(disaster.id);
    }, disaster.duration);
    timersRef.current.set(disaster.id, removeTimer);

    setTimeout(() => {
      setRecentDisaster((prev) => (prev && prev.id === disaster.id ? null : prev));
    }, 5000);
  }, [buildings, onDamageBuildings, onRemoveBuildings]);

  const scheduleDisaster = useCallback((type: DisasterType) => {
    const config = DISASTER_CONFIGS[type];
    
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = PLANET_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = PLANET_RADIUS * Math.sin(phi) * Math.sin(theta);
    const z = PLANET_RADIUS * Math.cos(phi);
    const estimatedPosition: [number, number, number] = [x, y, z];
    
    const estimatedIntensity = 0.5 + Math.random() * 0.5;
    
    const warning: DisasterWarning = {
      id: generateId(),
      type,
      estimatedPosition,
      countdown: config.warningTime,
      estimatedIntensity,
      timestamp: Date.now(),
    };

    setCurrentWarning(warning);
    setWarningCountdown(config.warningTime);

    let remaining = config.warningTime;
    countdownIntervalRef.current = setInterval(() => {
      remaining -= 100;
      setWarningCountdown(Math.max(0, remaining));
      
      if (remaining <= 0) {
        clearCountdown();
      }
    }, 100);

    const triggerTimer = setTimeout(() => {
      clearCountdown();
      setCurrentWarning(null);
      
      if (buildings.length > 0) {
        triggerDisaster(type, estimatedPosition, estimatedIntensity);
      }
      
      const nextType = getRandomDisasterType();
      const nextConfig = DISASTER_CONFIGS[nextType];
      const nextInterval = nextConfig.minInterval + Math.random() * (nextConfig.maxInterval - nextConfig.minInterval);
      
      const scheduleTimer = setTimeout(() => {
        scheduleDisaster(nextType);
      }, nextInterval);
      
      timersRef.current.set('next-schedule', scheduleTimer);
    }, config.warningTime);

    timersRef.current.set(warning.id, triggerTimer);
  }, [buildings.length, clearCountdown, triggerDisaster]);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      const type = getRandomDisasterType();
      scheduleDisaster(type);
    }, 15000);
    timersRef.current.set('initial-delay', initialDelay);

    return () => {
      clearCountdown();
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [clearCountdown, scheduleDisaster]);

  const triggerRandomDisaster = useCallback(() => {
    if (buildings.length === 0) return;
    
    if (currentWarning) {
      clearCountdown();
      const warningToTrigger = currentWarning;
      setCurrentWarning(null);
      timersRef.current.forEach((timer, key) => {
        if (key.startsWith('warning-') || key === warningToTrigger.id) {
          clearTimeout(timer);
          timersRef.current.delete(key);
        }
      });
      triggerDisaster(warningToTrigger.type, warningToTrigger.estimatedPosition, warningToTrigger.estimatedIntensity);
    } else {
      const type = getRandomDisasterType();
      triggerDisaster(type);
    }
  }, [buildings.length, clearCountdown, currentWarning, triggerDisaster]);

  const dismissWarning = useCallback(() => {
    clearCountdown();
    setCurrentWarning(null);
  }, [clearCountdown]);

  return {
    activeDisasters,
    recentDisaster,
    currentWarning,
    warningCountdown,
    triggerDisaster,
    triggerRandomDisaster,
    dismissWarning,
  };
}

