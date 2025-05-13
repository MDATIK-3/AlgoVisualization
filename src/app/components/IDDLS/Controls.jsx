const Controls = ({
    gridSize,
    setGridSize,
    obstaclePercent,
    setObstaclePercent,
    animationSpeed,
    setAnimationSpeed,
    isVisualizing,
    setSelectionMode,
    selectionMode,
    startVisualization,
    resetGrid
}) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-4 w-full">
            <div className="flex flex-col">
                <label className="text-sm mb-1">Grid Size</label>
                <input
                    type="number"
                    min="5"
                    max="20"
                    value={gridSize}
                    disabled={isVisualizing}
                    onChange={(e) => setGridSize(Math.min(20, Math.max(5, parseInt(e.target.value) || 5)))}
                    className="border p-1 w-20"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm mb-1">Obstacle %</label>
                <input
                    type="number"
                    min="0"
                    max="50"
                    value={obstaclePercent}
                    disabled={isVisualizing}
                    onChange={(e) => setObstaclePercent(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="border p-1 w-20"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm mb-1">Animation Speed (ms)</label>
                <input
                    type="number"
                    min="100"
                    max="2000"
                    step="100"
                    value={animationSpeed}
                    disabled={isVisualizing}
                    onChange={(e) => setAnimationSpeed(Math.min(2000, Math.max(100, parseInt(e.target.value) || 500)))}
                    className="border p-1 w-20"
                />
            </div>

            <button
                onClick={resetGrid}
                disabled={isVisualizing}
                className="bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
                Reset Grid
            </button>

            <button
                onClick={() => setSelectionMode('source')}
                disabled={isVisualizing}
                className={`px-4 py-2 rounded ${selectionMode === 'source' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
                Set Source
            </button>

            <button
                onClick={() => setSelectionMode('goal')}
                disabled={isVisualizing}
                className={`px-4 py-2 rounded ${selectionMode === 'goal' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
                Set Goal
            </button>

            <button
                onClick={startVisualization}
                disabled={isVisualizing}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
                {isVisualizing ? 'Visualizing...' : 'Start Visualization'}
            </button>
        </div>
    );
};

export default Controls;