import { createContext, useContext, useRef, useState, useCallback, useEffect, ReactNode } from 'react';
import * as THREE from 'three';

interface DayNightContextType {
  timeOfDay: number;
  daySpeed: number;
  sunPosition: THREE.Vector3;
  moonPosition: THREE.Vector3;
  sunIntensity: number;
  ambientIntensity: number;
  skyColor: THREE.Color;
  sunColor: THREE.Color;
  isNight: boolean;
  isDaytime: boolean;
  isDawn: boolean;
  isDusk: boolean;
  nightFactor: number;
  dayFactor: number;
  setDaySpeed: (speed: number) => void;
  setTimeOfDay: (time: number) => void;
  togglePause: () => void;
  isPaused: boolean;
}

const DayNightContext = createContext<DayNightContextType | null>(null);

const SUN_ORBIT_RADIUS = 15;
const MOON_ORBIT_RADIUS = 12;

function lerpColor(color1: THREE.Color, color2: THREE.Color, t: number): THREE.Color {
  return new THREE.Color().lerpColors(color1, color2, t);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

interface DayNightProviderProps {
  children: ReactNode;
  initialTime?: number;
  initialSpeed?: number;
}

export function DayNightProvider({ 
  children, 
  initialTime = 0.25, 
  initialSpeed = 1 
}: DayNightProviderProps) {
  const [timeOfDay, setTimeOfDayState] = useState(initialTime);
  const [daySpeed, setDaySpeedState] = useState(initialSpeed);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const sunAngle = timeOfDay * Math.PI * 2 - Math.PI / 2;
  const sunPosition = new THREE.Vector3(
    Math.cos(sunAngle) * SUN_ORBIT_RADIUS,
    Math.sin(sunAngle) * SUN_ORBIT_RADIUS,
    0
  );

  const moonAngle = sunAngle + Math.PI;
  const moonPosition = new THREE.Vector3(
    Math.cos(moonAngle) * MOON_ORBIT_RADIUS,
    Math.sin(moonAngle) * MOON_ORBIT_RADIUS,
    0
  );

  const sunHeight = Math.sin(sunAngle);

  const nightColor = new THREE.Color('#0a0e27');
  const dawnColor = new THREE.Color('#ff9966');
  const dayColor = new THREE.Color('#87ceeb');
  const duskColor = new THREE.Color('#ff7e5f');
  const deepNightColor = new THREE.Color('#050814');

  const middaySunColor = new THREE.Color('#fff8e7');
  const dawnSunColor = new THREE.Color('#ff7e5f');
  const duskSunColor = new THREE.Color('#ff6b35');

  let sunIntensity: number;
  let ambientIntensity: number;
  let skyColor: THREE.Color;
  let sunColor: THREE.Color;
  let isNight = false;
  let isDaytime = false;
  let isDawn = false;
  let isDusk = false;
  let nightFactor: number;
  let dayFactor: number;

  if (sunHeight < -0.3) {
    isNight = true;
    nightFactor = 1;
    dayFactor = 0;
    sunIntensity = 0;
    ambientIntensity = 0.12;
    const nightT = Math.min(1, (-sunHeight - 0.3) / 0.4);
    skyColor = lerpColor(nightColor, deepNightColor, nightT);
    sunColor = middaySunColor;
  } else if (sunHeight < -0.1) {
    const t = (sunHeight + 0.3) / 0.2;
    nightFactor = t;
    dayFactor = 0;
    if (timeOfDay > 0.2 && timeOfDay < 0.5) {
      isDawn = true;
      skyColor = lerpColor(nightColor, dawnColor, t);
    } else {
      isDusk = true;
      skyColor = lerpColor(nightColor, duskColor, t);
    }
    sunIntensity = t * 0.5;
    ambientIntensity = 0.12 + t * 0.2;
    sunColor = dawnSunColor;
  } else if (sunHeight < 0.3) {
    const t = (sunHeight + 0.1) / 0.4;
    nightFactor = 0;
    dayFactor = t;
    isDaytime = true;
    if (timeOfDay > 0.2 && timeOfDay < 0.5) {
      isDawn = true;
      skyColor = lerpColor(dawnColor, dayColor, t);
      sunColor = lerpColor(dawnSunColor, middaySunColor, t);
    } else {
      isDusk = true;
      skyColor = lerpColor(duskColor, dayColor, t);
      sunColor = lerpColor(duskSunColor, middaySunColor, t);
    }
    sunIntensity = 0.5 + t * 0.8;
    ambientIntensity = 0.32 + t * 0.28;
  } else if (sunHeight < 0.7) {
    const t = (sunHeight - 0.3) / 0.4;
    nightFactor = 0;
    dayFactor = 1;
    isDaytime = true;
    sunIntensity = 1.3 + t * 0.4;
    ambientIntensity = 0.6 + t * 0.15;
    skyColor = dayColor;
    sunColor = middaySunColor;
  } else {
    nightFactor = 0;
    dayFactor = 1;
    isDaytime = true;
    sunIntensity = 1.7;
    ambientIntensity = 0.75;
    skyColor = dayColor;
    sunColor = middaySunColor;
  }

  const setDaySpeed = useCallback((speed: number) => {
    setDaySpeedState(clamp(speed, 0, 20));
  }, []);

  const setTimeOfDay = useCallback((time: number) => {
    const clamped = ((time % 1) + 1) % 1;
    setTimeOfDayState(clamped);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setTimeOfDayState(prev => {
        return (prev + delta * daySpeed * 0.03) % 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, daySpeed]);

  return (
    <DayNightContext.Provider
      value={{
        timeOfDay,
        daySpeed,
        sunPosition,
        moonPosition,
        sunIntensity,
        ambientIntensity,
        skyColor,
        sunColor,
        isNight,
        isDaytime,
        isDawn,
        isDusk,
        nightFactor,
        dayFactor,
        setDaySpeed,
        setTimeOfDay,
        togglePause,
        isPaused,
      }}
    >
      {children}
    </DayNightContext.Provider>
  );
}

export function useDayNight() {
  const context = useContext(DayNightContext);
  if (!context) {
    throw new Error('useDayNight must be used within a DayNightProvider');
  }
  return context;
}
