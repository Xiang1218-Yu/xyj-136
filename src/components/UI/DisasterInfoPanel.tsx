import { useState } from 'react';
import { DisasterType } from '../../types/game';
import { DISASTER_CONFIGS, BUILDING_CONFIGS } from '../../utils/helpers';

export function DisasterInfoPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DisasterType | null>(null);

  const disasters = Object.values(DISASTER_CONFIGS);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 left-6 z-50 group"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-lg group-hover:bg-blue-500/50 transition-all duration-300" />
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-3 rounded-full shadow-lg border border-blue-400/50 transition-all duration-300 hover:scale-105">
            <span className="text-lg">📚</span>
            <span className="text-sm font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              灾害图鉴
            </span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className="relative max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl border-2 max-h-[90vh] flex flex-col"
            style={{
              backgroundColor: '#0a0e27',
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <div className="bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-cyan-600/30 h-2 flex-shrink-0" />
            
            <div className="p-8 overflow-y-auto overflow-x-hidden">
              <div className="flex items-center justify-between mb-8 sticky top-0 z-10 -mt-2 -mx-2 px-2 py-3 backdrop-blur-sm" style={{ backgroundColor: 'rgba(10, 14, 39, 0.95)' }}>
                <div>
                  <h2
                    className="text-4xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    🌍 自然灾害图鉴
                  </h2>
                  <p className="text-white/60">
                    了解各种自然灾害的特性、危害和防御策略
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedType(null);
                  }}
                  className="text-white/40 hover:text-white text-3xl transition-colors flex-shrink-0 ml-4"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                {disasters.map((config) => (
                  <button
                    key={config.type}
                    onClick={() => setSelectedType(selectedType === config.type ? null : config.type)}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                      selectedType === config.type
                        ? 'scale-105'
                        : 'hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: selectedType === config.type 
                        ? `${config.color}25` 
                        : 'rgba(255,255,255,0.03)',
                      borderColor: selectedType === config.type 
                        ? `${config.color}80` 
                        : 'rgba(255,255,255,0.1)',
                      boxShadow: selectedType === config.type 
                        ? `0 0 30px ${config.color}30` 
                        : 'none',
                    }}
                  >
                    <div
                      className="text-5xl mb-3"
                      style={{
                        filter: `drop-shadow(0 0 10px ${config.color}80)`,
                      }}
                    >
                      {config.icon}
                    </div>
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{
                        color: config.color,
                        fontFamily: "'Orbitron', sans-serif",
                      }}
                    >
                      {config.name}
                    </h3>
                    <p className="text-white/50 text-xs line-clamp-2">
                      {config.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">基础伤害</span>
                        <span className="text-white font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          {config.baseDamage}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedType && (
                <div
                  className="rounded-2xl p-6 border-2"
                  style={{
                    backgroundColor: `${DISASTER_CONFIGS[selectedType].color}08`,
                    borderColor: `${DISASTER_CONFIGS[selectedType].color}40`,
                  }}
                >
                  {(() => {
                    const config = DISASTER_CONFIGS[selectedType];
                    return (
                      <div className="space-y-6">
                        <div className="flex items-start gap-6">
                          <div
                            className="text-7xl flex-shrink-0"
                            style={{ filter: `drop-shadow(0 0 25px ${config.color})` }}
                          >
                            {config.icon}
                          </div>
                          <div className="flex-1">
                            <h3
                              className="text-3xl font-bold mb-2"
                              style={{
                                color: config.color,
                                fontFamily: "'Orbitron', sans-serif",
                                textShadow: `0 0 15px ${config.color}60`,
                              }}
                            >
                              {config.name}
                            </h3>
                            <p className="text-white/80 leading-relaxed mb-4">
                              {config.longDescription}
                            </p>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-black/30 rounded-xl p-4">
                                <p className="text-white/50 text-xs mb-1">影响范围</p>
                                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                                  {config.damageRadius.toFixed(1)}
                                </p>
                              </div>
                              <div className="bg-black/30 rounded-xl p-4">
                                <p className="text-white/50 text-xs mb-1">基础伤害</p>
                                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                                  {config.baseDamage}
                                </p>
                              </div>
                              <div className="bg-black/30 rounded-xl p-4">
                                <p className="text-white/50 text-xs mb-1">预警时间</p>
                                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                                  {(config.warningTime / 1000).toFixed(0)}s
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-black/20 rounded-xl p-5">
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                              <span>🌪️</span> 建筑危害表
                            </h4>
                            <div className="space-y-3">
                              {config.affectedBuildings.map((info) => {
                                const buildingConfig = BUILDING_CONFIGS[info.buildingType];
                                const multiplierColor = info.damageMultiplier >= 1.5 ? '#ff6b6b' : info.damageMultiplier >= 1.0 ? '#ffa500' : '#7cfc00';
                                const riskLevel = info.damageMultiplier >= 1.5 ? '极危' : info.damageMultiplier >= 1.0 ? '危险' : '低危';
                                return (
                                  <div
                                    key={info.buildingType}
                                    className="flex items-center gap-4 p-3 bg-black/30 rounded-xl"
                                  >
                                    <div
                                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                                      style={{
                                        backgroundColor: `${buildingConfig.color}20`,
                                        border: `2px solid ${buildingConfig.color}50`,
                                      }}
                                    >
                                      {buildingConfig.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white font-bold">{buildingConfig.name}</span>
                                        <span
                                          className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                                          style={{
                                            backgroundColor: `${multiplierColor}20`,
                                            color: multiplierColor,
                                          }}
                                        >
                                          {riskLevel}
                                        </span>
                                      </div>
                                      <p className="text-white/50 text-xs truncate">{info.description}</p>
                                    </div>
                                    <div
                                      className="text-xl font-bold flex-shrink-0"
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

                          <div className="space-y-4">
                            <div className="bg-black/20 rounded-xl p-5">
                              <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <span>🌋</span> 形成原因
                              </h4>
                              <div className="space-y-2">
                                {config.causes.map((cause, idx) => (
                                  <p key={idx} className="text-white/70 text-sm flex items-start gap-2">
                                    <span className="text-white/40">•</span>
                                    {cause}
                                  </p>
                                ))}
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-xl p-5 border border-green-500/20">
                              <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                                <span>💡</span> 防御建议
                              </h4>
                              <div className="space-y-2">
                                {config.tips.map((tip, idx) => (
                                  <p key={idx} className="text-green-200/80 text-sm flex items-start gap-2">
                                    <span className="text-green-400">▸</span>
                                    {tip}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-xl p-5">
                          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span>📜</span> 历史记载
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            {config.historicalEvents.map((event, idx) => (
                              <div key={idx} className="bg-black/30 rounded-xl p-4 border-l-4 border-white/20">
                                <p className="text-white/60 text-sm italic">{event}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {!selectedType && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-30">👆</div>
                  <p className="text-white/40 text-lg">
                    点击上方的灾害卡片查看详细信息
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
