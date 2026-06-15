import { useEffect, useState } from 'react';
import { ActiveDisaster, DisasterWarning, DisasterType } from '../../types/game';
import { DISASTER_CONFIGS, BUILDING_CONFIGS } from '../../utils/helpers';

interface DisasterAlertProps {
  disaster: ActiveDisaster | null;
  warning: DisasterWarning | null;
  warningCountdown: number;
  onTriggerRandom?: () => void;
  onDismissWarning?: () => void;
}

function CountdownDisplay({ seconds, color }: { seconds: number; color: string }) {
  const isUrgent = seconds <= 3;
  return (
    <span
      className={`text-3xl font-bold ${isUrgent ? 'animate-pulse' : ''}`}
      style={{
        color,
        fontFamily: "'Orbitron', sans-serif",
        textShadow: `0 0 15px ${color}`,
      }}
    >
      {seconds.toFixed(1)}s
    </span>
  );
}

function DisasterInfoModal({
  type,
  onClose,
}: {
  type: DisasterType;
  onClose: () => void;
}) {
  const config = DISASTER_CONFIGS[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="relative max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border-2 max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: '#0a0e27',
          borderColor: `${config.color}60`,
          boxShadow: `0 0 60px ${config.color}30`,
        }}
      >
        <div
          className="h-2 flex-shrink-0"
          style={{ backgroundColor: config.color }}
        />
        
        <div className="p-8 overflow-y-auto overflow-x-hidden">
          <div className="flex items-start justify-between mb-6 sticky top-0 z-10 -mt-2 -mx-2 px-2 py-2 bg-opacity-95 backdrop-blur-sm" style={{ backgroundColor: 'rgba(10, 14, 39, 0.95)' }}>
            <div className="flex items-center gap-4">
              <div
                className="text-6xl"
                style={{ filter: `drop-shadow(0 0 20px ${config.color})` }}
              >
                {config.icon}
              </div>
              <div>
                <h2
                  className="text-4xl font-bold mb-1"
                  style={{
                    color: config.color,
                    fontFamily: "'Orbitron', sans-serif",
                    textShadow: `0 0 20px ${config.color}80`,
                  }}
                >
                  {config.name}
                </h2>
                <p className="text-white/60 text-sm">{config.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white text-2xl transition-colors flex-shrink-0"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-xl">📖</span> 灾害详解
              </h3>
              <p className="text-white/80 leading-relaxed">
                {config.longDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white/60 mb-3">🗺️ 影响范围</h3>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {config.damageRadius.toFixed(1)} 单位
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white/60 mb-3">⚡ 基础伤害</h3>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {config.baseDamage}
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🌪️</span> 对建筑的危害
              </h3>
              <div className="space-y-3">
                {config.affectedBuildings.map((info) => {
                  const buildingConfig = BUILDING_CONFIGS[info.buildingType];
                  const multiplierColor = info.damageMultiplier >= 1.5 ? '#ff6b6b' : info.damageMultiplier >= 1.0 ? '#ffa500' : '#7cfc00';
                  return (
                    <div
                      key={info.buildingType}
                      className="flex items-center gap-4 p-3 bg-black/20 rounded-xl"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{
                          backgroundColor: `${buildingConfig.color}20`,
                          border: `2px solid ${buildingConfig.color}50`,
                        }}
                      >
                        {buildingConfig.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold">{buildingConfig.name}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-bold"
                            style={{
                              backgroundColor: `${multiplierColor}20`,
                              color: multiplierColor,
                            }}
                          >
                            {info.damageMultiplier >= 1.5 ? '极危' : info.damageMultiplier >= 1.0 ? '危险' : '低危'}
                          </span>
                        </div>
                        <p className="text-white/60 text-xs">{info.description}</p>
                      </div>
                      <div
                        className="text-xl font-bold"
                        style={{
                          color: multiplierColor,
                          fontFamily: "'Orbitron', sans-serif",
                        }}
                      >
                        ×{info.damageMultiplier.toFixed(1)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🌋</span> 形成原因
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {config.causes.map((cause, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 bg-black/20 rounded-lg"
                  >
                    <span className="text-lg">•</span>
                    <span className="text-white/70 text-sm">{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-5 border border-green-500/30">
              <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span> 防御建议
              </h3>
              <div className="space-y-2">
                {config.tips.map((tip, idx) => (
                  <p key={idx} className="text-green-200/80 text-sm flex items-start gap-2">
                    <span className="text-green-400">▸</span>
                    {tip}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-xl">📜</span> 历史记载
              </h3>
              <div className="space-y-2">
                {config.historicalEvents.map((event, idx) => (
                  <p key={idx} className="text-white/60 text-sm italic border-l-2 border-white/20 pl-3">
                    {event}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DisasterAlert({
  disaster,
  warning,
  warningCountdown,
  onTriggerRandom,
  onDismissWarning,
}: DisasterAlertProps) {
  const [infoModalType, setInfoModalType] = useState<DisasterType | null>(null);
  const [disasterVisible, setDisasterVisible] = useState(false);
  const [disasterShake, setDisasterShake] = useState(false);

  useEffect(() => {
    if (disaster) {
      setDisasterVisible(true);
      setDisasterShake(true);
      const shakeTimer = setTimeout(() => setDisasterShake(false), 1500);
      const hideTimer = setTimeout(() => setDisasterVisible(false), 6000);
      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [disaster]);

  const countdownSeconds = warningCountdown / 1000;
  const isUrgent = countdownSeconds <= 3;

  return (
    <>
      {warning && (
        <div
          className={`fixed top-28 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
            isUrgent ? 'animate-pulse' : ''
          }`}
        >
          <div
            className="rounded-2xl px-8 py-6 shadow-2xl border-2 backdrop-blur-lg min-w-[500px]"
            style={{
              backgroundColor: `${DISASTER_CONFIGS[warning.type].warningColor}15`,
              borderColor: `${DISASTER_CONFIGS[warning.type].warningColor}80`,
              boxShadow: `0 0 50px ${DISASTER_CONFIGS[warning.type].warningColor}40`,
              animation: isUrgent ? 'pulse 0.5s ease-in-out infinite' : 'none',
            }}
          >
            <div className="flex items-center gap-5">
              <div
                className="relative"
              >
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-50"
                  style={{
                    backgroundColor: DISASTER_CONFIGS[warning.type].warningColor,
                  }}
                />
                <div
                  className="relative text-6xl"
                  style={{
                    filter: `drop-shadow(0 0 20px ${DISASTER_CONFIGS[warning.type].warningColor})`,
                  }}
                >
                  {DISASTER_CONFIGS[warning.type].icon}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      color: DISASTER_CONFIGS[warning.type].warningColor,
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: `0 0 15px ${DISASTER_CONFIGS[warning.type].warningColor}80`,
                    }}
                  >
                    ⚠️ {DISASTER_CONFIGS[warning.type].name}预警！
                  </h2>
                  <button
                    onClick={() => setInfoModalType(warning.type)}
                    className="text-white/50 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-full transition-colors"
                  >
                    ℹ️ 详情
                  </button>
                </div>
                <p className="text-white/70 text-sm mb-3">
                  {DISASTER_CONFIGS[warning.type].description}
                </p>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-sm">预计强度</span>
                    <div className="w-28 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(warning.estimatedIntensity * 100)}%`,
                          backgroundColor: DISASTER_CONFIGS[warning.type].warningColor,
                          boxShadow: `0 0 10px ${DISASTER_CONFIGS[warning.type].warningColor}`,
                        }}
                      />
                    </div>
                    <span
                      className="text-base font-bold"
                      style={{
                        color: DISASTER_CONFIGS[warning.type].warningColor,
                        fontFamily: "'Orbitron', sans-serif",
                      }}
                    >
                      {Math.round(warning.estimatedIntensity * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-sm">⏰ 倒计时</span>
                    <CountdownDisplay
                      seconds={countdownSeconds}
                      color={DISASTER_CONFIGS[warning.type].warningColor}
                    />
                  </div>
                  <div className="flex gap-2">
                    {onDismissWarning && (
                      <button
                        onClick={onDismissWarning}
                        className="text-white/60 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all"
                      >
                        忽略
                      </button>
                    )}
                    {onTriggerRandom && (
                      <button
                        onClick={onTriggerRandom}
                        className="text-white text-sm px-4 py-2 rounded-full transition-all font-bold"
                        style={{
                          backgroundColor: DISASTER_CONFIGS[warning.type].warningColor,
                          boxShadow: `0 0 15px ${DISASTER_CONFIGS[warning.type].warningColor}60`,
                        }}
                      >
                        ⚡ 立即触发
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!warning && disaster && disasterVisible && (
        <div
          className={`fixed top-28 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
            disasterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          } ${disasterShake ? 'animate-pulse' : ''}`}
        >
          <div
            className="rounded-2xl px-8 py-5 shadow-2xl border-2 backdrop-blur-lg"
            style={{
              backgroundColor: `${DISASTER_CONFIGS[disaster.type].color}20`,
              borderColor: `${DISASTER_CONFIGS[disaster.type].color}80`,
              boxShadow: `0 0 40px ${DISASTER_CONFIGS[disaster.type].color}40`,
            }}
          >
            <div className="flex items-center gap-5">
              <div
                className={`text-5xl ${disasterShake ? 'animate-bounce' : ''}`}
              >
                {DISASTER_CONFIGS[disaster.type].icon}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      color: DISASTER_CONFIGS[disaster.type].color,
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: `0 0 10px ${DISASTER_CONFIGS[disaster.type].color}80`,
                    }}
                  >
                    ⚠️ {DISASTER_CONFIGS[disaster.type].name}来袭！
                  </h2>
                  <button
                    onClick={() => setInfoModalType(disaster.type)}
                    className="text-white/50 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-full transition-colors"
                  >
                    ℹ️ 详情
                  </button>
                </div>
                <p className="text-white/80 text-sm mb-2">
                  {DISASTER_CONFIGS[disaster.type].description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-xs">强度</span>
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round(disaster.intensity * 100)}%`,
                        backgroundColor: DISASTER_CONFIGS[disaster.type].color,
                        boxShadow: `0 0 8px ${DISASTER_CONFIGS[disaster.type].color}`,
                      }}
                    />
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: DISASTER_CONFIGS[disaster.type].color,
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    {Math.round(disaster.intensity * 100)}%
                  </span>
                </div>
                {disaster.affectedBuildingIds.length > 0 && (
                  <p className="text-xs text-white/50 mt-2">
                    🎯 影响建筑数量: <span className="text-white font-bold">{disaster.affectedBuildingIds.length}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {onTriggerRandom && !warning && !disaster && (
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

      {infoModalType && (
        <DisasterInfoModal
          type={infoModalType}
          onClose={() => setInfoModalType(null)}
        />
      )}
    </>
  );
}
