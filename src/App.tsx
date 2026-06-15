import { GameCanvas } from './components/GameCanvas';
import { BuildPanel } from './components/UI/BuildPanel';
import { StatusBar } from './components/UI/StatusBar';
import { HintText } from './components/UI/HintText';
import { DisasterAlert } from './components/UI/DisasterAlert';
import { DisasterInfoPanel } from './components/UI/DisasterInfoPanel';
import { TimeControlPanel } from './components/UI/TimeControlPanel';
import { useGameState } from './hooks/useGameState';
import { useDisasters } from './hooks/useDisasters';
import { DayNightProvider } from './contexts/DayNightContext';

function AppContent() {
  const { gameState, selectTool, addBuilding, damageBuildings, removeBuildings, removeBuilding, resetBuildings } = useGameState();
  
  const {
    activeDisasters,
    recentDisaster,
    currentWarning,
    warningCountdown,
    triggerRandomDisaster,
    dismissWarning,
  } = useDisasters({
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
        onRemoveBuilding={removeBuilding}
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

      <DisasterAlert
        disaster={recentDisaster}
        warning={currentWarning}
        warningCountdown={warningCountdown}
        onTriggerRandom={triggerRandomDisaster}
        onDismissWarning={dismissWarning}
      />

      <DisasterInfoPanel />

      <TimeControlPanel />

      <div className="fixed bottom-4 right-4 z-10 text-white/30 text-xs">
        <p>🌍 Planet Rebirth Simulator</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <DayNightProvider initialTime={0.3} initialSpeed={1}>
      <AppContent />
    </DayNightProvider>
  );
}

export default App;
