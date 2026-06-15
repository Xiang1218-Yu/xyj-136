import { useEffect, useState } from 'react';
import { ActiveDisaster } from '../../types/game';
import { DISASTER_CONFIGS } from '../../utils/helpers';

interface DisasterAlertProps {
  disaster: ActiveDisaster | null;
  onTriggerRandom?: () => void;
}

export function DisasterAlert({ disaster, onTriggerRandom }: DisasterAlertProps) {
  const [visible, setVisible] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (disaster) {
      setVisible(true);
      setShake(true);
      const shakeTimer = setTimeout(() => setShake(false), 1500);
      const hideTimer = setTimeout(() => setVisible(false), 5000);
      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [disaster]);

  if (!disaster) return null;

  const config = DISASTER_CONFIGS[disaster.type];
  const intensityPercent = Math.round(disaster.intensity * 100);

  return (
    <>
      {visible && (
        <div
          className={`fixed top-28 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          } ${shake ? 'animate-pulse' : ''}`}
        >
          <div
            className="rounded-2xl px-8 py-5 shadow-2xl border-2 backdrop-blur-lg"
            style={{
              backgroundColor: `${config.color}20`,
              borderColor: `${config.color}80`,
              boxShadow: `0 0 40px ${config.color}40`,
            }}
          >
            <div className="flex items-center gap-5">
              <div
                className={`text-5xl ${shake ? 'animate-bounce' : ''}`}
              >
                {config.icon}
              </div>
              
              <div>
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{
                    color: config.color,
                    fontFamily: "'Orbitron', sans-serif",
                    textShadow: `0 0 10px ${config.color}80`,
                  }}
                >
                  ⚠️ {config.name}来袭！
                </h2>
                <p className="text-white/80 text-sm mb-2">{config.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-xs">强度</span>
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${intensityPercent}%`,
                        backgroundColor: config.color,
                        boxShadow: `0 0 8px ${config.color}`,
                      }}
                    />
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: config.color,
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    {intensityPercent}%
                  </span>
                </div>
                {disaster.affectedBuildingIds.length > 0 && (
                  <p className="text-xs text-white/50 mt-2">
                    影响建筑数量: {disaster.affectedBuildingIds.length}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {onTriggerRandom && (
        <button
          onClick={onTriggerRandom}
          className="fixed bottom-28 right-6 z-50 group"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-500/30 blur-lg group-hover:bg-red-500/50 transition-all duration-300" />
            <div className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-5 py-3 rounded-full shadow-lg border border-red-400/50 transition-all duration-300 hover:scale-105">
              <span className="text-lg">💥</span>
              <span className="text-sm font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                触发灾害
              </span>
            </div>
          </div>
        </button>
      )}
    </>
  );
}
