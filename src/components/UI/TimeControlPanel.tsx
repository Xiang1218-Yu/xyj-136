import { useDayNight } from '../../contexts/DayNightContext';

export function TimeControlPanel() {
  const { 
    timeOfDay, 
    daySpeed, 
    setDaySpeed, 
    setTimeOfDay, 
    togglePause, 
    isPaused,
    isNight,
    isDaytime,
    isDawn,
    isDusk,
  } = useDayNight();

  const hours = Math.floor(timeOfDay * 24);
  const minutes = Math.floor((timeOfDay * 24 - hours) * 60);
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const getTimePeriodText = () => {
    if (isDawn) return '🌅 黎明';
    if (isDusk) return '🌇 黄昏';
    if (isNight) return '🌙 夜晚';
    if (isDaytime) return '☀️ 白天';
    return '';
  };

  const speedPresets = [
    { label: '暂停', value: 0, icon: '⏸️' },
    { label: '慢速', value: 0.5, icon: '🐢' },
    { label: '正常', value: 1, icon: '⏩' },
    { label: '快速', value: 3, icon: '⚡' },
    { label: '极速', value: 10, icon: '🚀' },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-4 text-white shadow-2xl border border-white/10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {isNight ? '🌙' : isDawn || isDusk ? '🌅' : '☀️'}
            </span>
            <div className="text-center">
              <div className="text-2xl font-bold tracking-wider">{timeString}</div>
              <div className="text-xs text-white/60">{getTimePeriodText()}</div>
            </div>
          </div>

          <div className="w-full">
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
              className="w-48 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, 
                  #0a0e27 0%, 
                  #ff7e5f 20%, 
                  #87ceeb 35%, 
                  #87ceeb 65%, 
                  #ff7e5f 80%, 
                  #0a0e27 100%)`,
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">速度:</span>
            <div className="flex gap-1">
              {speedPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    if (preset.value === 0) {
                      togglePause();
                    } else {
                      if (isPaused) togglePause();
                      setDaySpeed(preset.value);
                    }
                  }}
                  className={`px-2 py-1 rounded-lg text-xs transition-all duration-200 ${
                    (preset.value === 0 && isPaused) || 
                    (preset.value !== 0 && !isPaused && Math.abs(daySpeed - preset.value) < 0.01)
                      ? 'bg-blue-500/80 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  title={preset.label}
                >
                  {preset.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full">
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={daySpeed}
              onChange={(e) => {
                if (isPaused && parseFloat(e.target.value) > 0) {
                  togglePause();
                }
                setDaySpeed(parseFloat(e.target.value));
              }}
              className="w-48 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>0x</span>
              <span>{daySpeed.toFixed(1)}x</span>
              <span>20x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
