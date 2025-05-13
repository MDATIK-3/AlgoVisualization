const PathInfo = ({ path, currentStep, depthUsed, hasCycle, cycleDepth, getDirection, cyclePathVisible }) => {
  return (
    <div className="mt-4 w-full max-w-md">
      <h2 className="text-lg font-bold mb-2">Path Information</h2>
      {path.length > 0 ? (
        <div>
          <p>Path Length: {path.length}</p>
          <p>Depth Used: {depthUsed}</p>
          <p>Cycle Detected: {hasCycle ? 'Yes' : 'No'}</p>
          <p>Cycle Detection Depth: {cycleDepth}</p>
          
          <h3 className="text-md font-bold mt-2">Path Steps:</h3>
          <ul className="mt-1">
            {path.slice(0, currentStep).map((cell, idx) => {
              const nextCell = idx < path.length - 1 ? path[idx + 1] : null;
              const direction = nextCell ? getDirection(cell, nextCell) : "GOAL";
              
              return (
                <li key={idx} className="text-sm">
                  {idx + 1}. ({cell.x}, {cell.y}) 
                  {direction && ` → ${direction}`}
                </li>
              );
            })}
          </ul>
          
          {hasCycle && cyclePathVisible && (
            <>
              <h3 className="text-md font-bold mt-4">Cycle Details:</h3>
              <p className="text-sm">Cycle detected in the grid (highlighted in purple)</p>
            </>
          )}
        </div>
      ) : (
        <p>No path found yet. Click "Start Visualization" to find a path.</p>
      )}
    </div>
  );
};
export default PathInfo;