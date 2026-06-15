import { GameCanvas } from './components/GameCanvas';
import { BuildPanel } from './components/UI/BuildPanel';
import { StatusBar } from './components/UI/StatusBar';
import { HintText } from './components/UI/HintText';
import { DisasterAlert } from './components/UI/DisasterAlert';
import { useGameState } from './hooks/useGameState';
import { useDisasters } from './hooks/useDisasters';

function App() {
  const { gameState, selectTool, addBuilding, damageBuildings, removeBuildings, resetBuildings } = useGameState();
  
  const { activeDisasters, recentDisaster, triggerRandomDisaster } = useDisasters({
    buildings: gameState.buildings,
    onDamageBuildings: damageBuildings,
    onRemoveBuildings: removeBuildings,
  });

  return (
    <div className="w-full h-screen relative overflow-hidden bg-space-dark">
      <GameCanvas
        buildings={gameState.buildings}
        selectedTool={gameState.selectedTool}
        onAddBuilding={addBuilding}
        lifeIndex={gameState.lifeIndex}
        disasters={activeDisasters}
      />

      <StatusBar
        lifeIndex={gameState.lifeIndex}
        forestCount={gameState.forestCount}
        glacierCount={gameState.glacierCount}
        cityCount={gameState.cityCount}
        grasslandCount={gameState.grasslandCount}
      />

      <BuildPanel
        selectedTool={gameState.selectedTool}
        onSelectTool={selectTool}
        onReset={resetBuildings}
      />

      <HintText />

      <DisasterAlert disaster={recentDisaster} onTriggerRandom={triggerRandomDisaster} />

      <div className="fixed bottom-4 right-4 z-10 text-white/30 text-xs">
        <p>🌍 Planet Rebirth Simulator</p>
      </div>
    </div>
  );
}

export default App;
