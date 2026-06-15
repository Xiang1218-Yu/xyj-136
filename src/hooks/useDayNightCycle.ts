import { useState, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface DayNightCycleState {
  timeOfDay: number;
  daySpeed: number;
  sunPosition: THREE.Vector3;
  moonPosition: THREE.Vector3;
  sunIntensity: number;
  ambientIntensity: number;
  skyColor: THREE.Color;
  isNight: boolean;
  isDaytime: boolean;
  isDawn: boolean;
  isDusk: boolean;
}

const SUN_ORBIT_RADIUS = 12;
const MOON_ORBIT_RADIUS = 10;

function lerpColor(color1: THREE.Color, color2: THREE.Color, t: number): THREE.Color {
  return new THREE.Color().lerpColors(color1, color2, t);
}

export function useDayNightCycle(initialSpeed: number = 1) {
  const [timeOfDay, setTimeOfDay] = useState(0.25);
  const [daySpeed, setDaySpeed] = useState(initialSpeed);
  const timeRef = useRef(0.25);

  const sunPosition = new THREE.Vector3();
  const moonPosition = new THREE.Vector3();

  const sunAngle = timeOfDay * Math.PI * 2 - Math.PI / 2;
  sunPosition.x = Math.cos(sunAngle) * SUN_ORBIT_RADIUS;
  sunPosition.y = Math.sin(sunAngle) * SUN_ORBIT_RADIUS;
  sunPosition.z = 0;

  const moonAngle = sunAngle + Math.PI;
  moonPosition.x = Math.cos(moonAngle) * MOON_ORBIT_RADIUS;
  moonPosition.y = Math.sin(moonAngle) * MOON_ORBIT_RADIUS;
  moonPosition.z = 0;

  const sunHeight = Math.sin(sunAngle);
  
  let sunIntensity: number;
  let ambientIntensity: number;
  let skyColor: THREE.Color;
  let isNight = false;
  let isDaytime = false;
  let isDawn = false;
  let isDusk = false;

  const nightColor = new THREE.Color('#0a0e27');
  const dawnColor = new THREE.Color('#ff7e5f');
  const dayColor = new THREE.Color('#87ceeb');
  const duskColor = new THREE.Color('#feb47b');

  if (sunHeight < -0.2) {
    isNight = true;
    sunIntensity = 0;
    ambientIntensity = 0.15;
    skyColor = nightColor;
  } else if (sunHeight < 0.1) {
    const t = (sunHeight + 0.2) / 0.3;
    if (timeOfDay > 0.2 && timeOfDay < 0.5) {
      isDawn = true;
      skyColor = lerpColor(nightColor, dawnColor, t);
    } else {
      isDusk = true;
      skyColor = lerpColor(nightColor, duskColor, t);
    }
    sunIntensity = t * 0.8;
    ambientIntensity = 0.15 + t * 0.25;
  } else if (sunHeight < 0.6) {
    isDaytime = true;
    const t = (sunHeight - 0.1) / 0.5;
    sunIntensity = 0.8 + t * 0.7;
    ambientIntensity = 0.4 + t * 0.2;
    skyColor = lerpColor(dawnColor, dayColor, t);
  } else {
    isDaytime = true;
    sunIntensity = 1.5;
    ambientIntensity = 0.6;
    skyColor = dayColor;
  }

  const advanceTime = useCallback((delta: number) => {
    setTimeOfDay(prev => {
      const next = (prev + delta * daySpeed * 0.02) % 1;
      timeRef.current = next;
      return next;
    });
  }, [daySpeed]);

  const setSpeed = useCallback((speed: number) => {
    setDaySpeed(speed);
  }, []);

  const setTime = useCallback((time: number) => {
    const clamped = ((time % 1) + 1) % 1;
    setTimeOfDay(clamped);
    timeRef.current = clamped;
  }, []);

  return {
    timeOfDay,
    daySpeed,
    sunPosition,
    moonPosition,
    sunIntensity,
    ambientIntensity,
    skyColor,
    isNight,
    isDaytime,
    isDawn,
    isDusk,
    advanceTime,
    setSpeed,
    setTime,
    SUN_ORBIT_RADIUS,
    MOON_ORBIT_RADIUS,
  };
}
