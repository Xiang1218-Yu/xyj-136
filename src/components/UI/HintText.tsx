export function HintText() {
  return (
    <div className="fixed bottom-52 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <div className="flex items-center gap-6 text-white/50 text-sm">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-white/10 rounded text-xs">拖拽</span>
          <span>旋转视角</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-white/10 rounded text-xs">滚轮</span>
          <span>缩放画面</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-white/10 rounded text-xs">右键</span>
          <span>平移画面</span>
        </div>
      </div>
    </div>
  );
}
