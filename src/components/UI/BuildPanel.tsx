import { ToolType, BuildingType } from '../../types/game';
import { BUILDING_CONFIGS, TOOL_CONFIGS } from '../../utils/helpers';

interface BuildPanelProps {
  selectedTool: ToolType | null;
  onSelectTool: (tool: ToolType | null) => void;
  onReset: () => void;
}

export function BuildPanel({ selectedTool, onSelectTool, onReset }: BuildPanelProps) {
  const buildingTools: BuildingType[] = ['forest', 'glacier', 'city', 'grassland'];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-4 bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-2xl">
        {buildingTools.map((tool) => {
          const config = BUILDING_CONFIGS[tool];
          const isSelected = selectedTool === tool;

          return (
            <button
              key={tool}
              onClick={() => onSelectTool(isSelected ? null : tool)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300
                ${isSelected
                  ? 'bg-white/20 scale-110 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                }
              `}
              style={{
                boxShadow: isSelected ? `0 0 30px ${config.color}50` : 'none',
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-full text-2xl"
                style={{
                  backgroundColor: `${config.color}30`,
                  border: `2px solid ${config.color}`,
                }}
              >
                {config.icon}
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: isSelected ? config.color : '#fff',
                  textShadow: isSelected ? `0 0 10px ${config.color}` : 'none',
                }}
              >
                {config.name}
              </span>
              {isSelected && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}

        <div className="w-px h-16 bg-white/20 mx-2" />

        {(() => {
          const config = TOOL_CONFIGS.delete;
          const isSelected = selectedTool === 'delete';
          return (
            <button
              onClick={() => onSelectTool(isSelected ? null : 'delete')}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300
                ${isSelected
                  ? 'bg-red-500/30 scale-110 shadow-lg'
                  : 'bg-white/5 hover:bg-red-500/20 hover:scale-105'
                }
              `}
              style={{
                boxShadow: isSelected ? `0 0 30px ${config.color}80` : 'none',
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-full text-2xl"
                style={{
                  backgroundColor: `${config.color}30`,
                  border: `2px solid ${config.color}`,
                }}
              >
                {config.icon}
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: isSelected ? config.color : '#fff',
                  textShadow: isSelected ? `0 0 10px ${config.color}` : 'none',
                }}
              >
                {config.name}
              </span>
              {isSelected && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })()}

        <div className="w-px h-16 bg-white/20 mx-2" />

        <button
          onClick={onReset}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-red-500/20 transition-all duration-300 hover:scale-105"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-2xl bg-red-500/30 border-2 border-red-400">
            🔄
          </div>
          <span className="text-sm font-medium text-white">重置</span>
        </button>
      </div>

      {selectedTool && (
        <div className="mt-4 text-center">
          <p className="text-white/70 text-sm">
            已选择 <span style={{ color: TOOL_CONFIGS[selectedTool].color }} className="font-bold">
              {TOOL_CONFIGS[selectedTool].name}
            </span>
            {' '}- {selectedTool === 'delete' ? '点击建筑将其删除' : '点击星球表面放置'}
          </p>
        </div>
      )}
    </div>
  );
}
