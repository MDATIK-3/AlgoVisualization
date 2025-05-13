'use client';

import { useState, useEffect } from 'react';
import Controls from './Controls';
import Legend from './Legend';
import Grid from './Grid';
import PathInfo from './PathInfo';

export default function GridVisualization() {
  const [gridSize, setGridSize] = useState(10);
  const [obstaclePercent, setObstaclePercent] = useState(30);
  const [grid, setGrid] = useState([]);
  const [source, setSource] = useState({ x: 0, y: 0 });
  const [goal, setGoal] = useState({ x: 9, y: 9 });
  const [path, setPath] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCycle, setHasCycle] = useState(false);
  const [cycleDepth, setCycleDepth] = useState(0);
  const [cyclePath, setCyclePath] = useState([]);
  const [cyclePathVisible, setCyclePathVisible] = useState(false);
  const [depthUsed, setDepthUsed] = useState(0);
  const [selectionMode, setSelectionMode] = useState(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [visitedCells, setVisitedCells] = useState(new Set());
  const [visualizationPhase, setVisualizationPhase] = useState('idle');

  const DIRS = [
    { dx: -1, dy: 0, name: "Up" },
    { dx: 1, dy: 0, name: "Down" },
    { dx: 0, dy: -1, name: "Left" },
    { dx: 0, dy: 1, name: "Right" }
  ];

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    if (gridSize !== grid.length) {
      initializeGrid();
    }
  }, [gridSize]);

  const initializeGrid = () => {
    const newGrid = Array(gridSize).fill().map(() => 
      Array(gridSize).fill().map(() => 
        Math.random() >= obstaclePercent / 100 ? '1' : '0'
      )
    );
    
    const newSource = { 
      x: Math.floor(gridSize / 4), 
      y: Math.floor(gridSize / 4)
    };
    
    const newGoal = { 
      x: Math.floor(3 * gridSize / 4), 
      y: Math.floor(3 * gridSize / 4)
    };
    
    newGrid[newSource.x][newSource.y] = '1';
    newGrid[newGoal.x][newGoal.y] = '1';
    
    setGrid(newGrid);
    setSource(newSource);
    setGoal(newGoal);
    resetVisualization();
  };

  const regenerateObstacles = () => {
    const newGrid = grid.map((row, x) => 
      row.map((cell, y) => {
        if ((x === source.x && y === source.y) || (x === goal.x && y === goal.y)) {
          return '1';
        }
        return Math.random() >= obstaclePercent / 100 ? '1' : '0';
      })
    );
    
    setGrid(newGrid);
    resetVisualization();
  };

  const resetGrid = () => {
    initializeGrid();
  };

  const resetVisualization = () => {
    setPath([]);
    setCurrentStep(0);
    setVisitedCells(new Set());
    setHasCycle(false);
    setCycleDepth(0);
    setCyclePath([]);
    setCyclePathVisible(false);
    setDepthUsed(0);
    setVisualizationPhase('idle');
  };

  const handleCellClick = (x, y) => {
    if (isVisualizing) return;
    
    const newGrid = [...grid.map(row => [...row])];
    
    if (selectionMode === 'source') {
      if (newGrid[x][y] === '0') {
        alert("Source cannot be placed on an obstacle!");
        return;
      }
      
      if (x === goal.x && y === goal.y) {
        alert("Source cannot be the same as the goal!");
        return;
      }
      
      setSource({ x, y });
      setSelectionMode(null);
      resetVisualization();
    } 
    else if (selectionMode === 'goal') {
      if (newGrid[x][y] === '0') {
        alert("Goal cannot be placed on an obstacle!");
        return;
      }
      
      if (x === source.x && y === source.y) {
        alert("Goal cannot be the same as the source!");
        return;
      }
      
      setGoal({ x, y });
      setSelectionMode(null);
      resetVisualization();
    } 
    else {
      if ((source.x === x && source.y === y) || (goal.x === x && goal.y === y)) {
        alert("Cannot place obstacle on source or goal!");
        return;
      }
      
      newGrid[x][y] = newGrid[x][y] === '1' ? '0' : '1';
      setGrid(newGrid);
      resetVisualization();
    }
  };

  const isValid = (x, y) => {
    return x >= 0 && x < gridSize && y >= 0 && y < gridSize && grid[x][y] !== '0';
  };

  const sortedDirs = (x, y, goalX, goalY) => {
    return [...DIRS].sort((a, b) => {
      const distA = Math.abs((x + a.dx) - goalX) + Math.abs((y + a.dy) - goalY);
      const distB = Math.abs((x + b.dx) - goalX) + Math.abs((y + b.dy) - goalY);
      return distA - distB;
    });
  };

  const dls = (x, y, goalX, goalY, depth, visited, path) => {
    if (depth < 0) return { found: false, visited };
    
    if (x === goalX && y === goalY) {
      return { 
        found: true, 
        path: [...path, { x, y }],
        visited 
      };
    }
    
    visited.add(`${x},${y}`);
    
    for (const dir of sortedDirs(x, y, goalX, goalY)) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      
      if (isValid(nx, ny) && !visited.has(`${nx},${ny}`)) {
        const result = dls(nx, ny, goalX, goalY, depth - 1, new Set([...visited]), [...path, { x, y }]);
        if (result.found) {
          return result;
        }
      }
    }
    
    return { found: false, visited };
  };

  const runIDDFS = () => {
    const maxDepth = gridSize * gridSize;
    let allVisited = new Set();
    
    for (let depth = 0; depth <= maxDepth; depth++) {
      const { found, path, visited } = dls(
        source.x, source.y,
        goal.x, goal.y,
        depth,
        new Set(),
        []
      );
      
      visited.forEach(cell => allVisited.add(cell));
      
      if (found) {
        setPath(path);
        setVisitedCells(allVisited);
        setDepthUsed(depth);
        return { success: true, depth };
      }
    }
    
    setVisitedCells(allVisited);
    return { success: false, depth: maxDepth };
  };

  const detectCycle = () => {
    const visited = new Set();
    const cycleNodes = [];
    let depthCounter = 0;
    let cycleFound = false;
    
    const findCyclePath = (start) => {
      const parent = {};
      const stack = [start];
      const stackSet = new Set([`${start.x},${start.y}`]);
      
      while (stack.length > 0) {
        const current = stack.pop();
        stackSet.delete(`${current.x},${current.y}`);
        
        for (const dir of DIRS) {
          const nx = current.x + dir.dx;
          const ny = current.y + dir.dy;
          
          if (isValid(nx, ny)) {
            const nodeKey = `${nx},${ny}`;
            
            if (!visited.has(nodeKey)) {
              visited.add(nodeKey);
              parent[nodeKey] = current;
              stack.push({ x: nx, y: ny });
              stackSet.add(nodeKey);
            } 
            else if (stackSet.has(nodeKey)) {
              const cyclePath = [];
              let curr = current;
              
              while (curr && !(curr.x === nx && curr.y === ny)) {
                cyclePath.push(curr);
                const key = `${curr.x},${curr.y}`;
                curr = parent[key];
              }
              
              cyclePath.push({ x: nx, y: ny });
              cyclePath.push(current);
              
              return cyclePath;
            }
          }
        }
      }
      
      return [];
    };
    
    const hasCycleUtil = (x, y, parentX, parentY, visited, onStack) => {
      const key = `${x},${y}`;
      visited.add(key);
      onStack.add(key);
      
      for (const dir of DIRS) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;
        const nextKey = `${nx},${ny}`;
        
        if (isValid(nx, ny)) {
          depthCounter++;
          
          if (!visited.has(nextKey)) {
            if (hasCycleUtil(nx, ny, x, y, visited, onStack)) {
              if (!cycleFound) {
                cycleFound = true;
                const cyclePath = findCyclePath({ x, y });
                setCyclePath(cyclePath);
              }
              return true;
            }
          } 
          else if (onStack.has(nextKey) && (nx !== parentX || ny !== parentY)) {
            if (!cycleFound) {
              cycleFound = true;
              const cyclePath = findCyclePath({ x, y });
              setCyclePath(cyclePath);
            }
            return true;
          }
        }
      }
      
      onStack.delete(key);
      return false;
    };
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] !== '0' && !visited.has(`${i},${j}`)) {
          if (hasCycleUtil(i, j, -1, -1, visited, new Set())) {
            break;
          }
        }
      }
      if (cycleFound) break;
    }
    
    setHasCycle(cycleFound);
    setCycleDepth(depthCounter);
    return { cycleFound, depthCounter };
  };

  const startVisualization = async () => {
    setIsVisualizing(true);
    resetVisualization();
    setVisualizationPhase('path');
    
    const pathResult = runIDDFS();
    
    if (pathResult.success) {
      for (let step = 0; step <= path.length; step++) {
        setCurrentStep(step);
        if (step < path.length) {
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }
      }
    } else {
      alert("No path found from source to goal!");
    }
    
    setVisualizationPhase('cycle');
    const cycleResult = detectCycle();
    
    if (cycleResult.cycleFound) {
      setCyclePathVisible(true);
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    
    setVisualizationPhase('complete');
    setIsVisualizing(false);
  };

  const getDirection = (from, to) => {
    if (!from || !to) return "";
    
    for (const dir of DIRS) {
      if (from.x + dir.dx === to.x && from.y + dir.dy === to.y) {
        return dir.name;
      }
    }
    return "";
  };

  const isCellInCycle = (x, y) => {
    return cyclePathVisible && cyclePath.some(cell => cell.x === x && cell.y === y);
  };

  const getCellType = (x, y) => {
    if (source.x === x && source.y === y) return 'source';
    if (goal.x === x && goal.y === y) return 'goal';
    
    const isInPath = path.findIndex(cell => cell.x === x && cell.y === y) !== -1;
    const pathIndex = path.findIndex(cell => cell.x === x && cell.y === y);
    
    if (isInPath && pathIndex < currentStep) return 'path';
    if (isCellInCycle(x, y)) return 'cycle';
    if (visitedCells.has(`${x},${y}`)) return 'visited';
    if (grid[x][y] === '0') return 'obstacle';
    
    return 'free';
  };

  return (

    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">IDDFS Path Finding Visualization</h1>
      
      <Controls 
        gridSize={gridSize}
        setGridSize={setGridSize}
        obstaclePercent={obstaclePercent}
        setObstaclePercent={setObstaclePercent}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        isVisualizing={isVisualizing}
        regenerateObstacles={regenerateObstacles}
        setSelectionMode={setSelectionMode}
        selectionMode={selectionMode}
        startVisualization={startVisualization}
        resetGrid={resetGrid}
      />
      
      <Legend />
      
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex-1">
          <Grid 
            grid={grid}
            gridSize={gridSize}
            handleCellClick={handleCellClick}
            getCellType={getCellType}
          />
        </div>
        
        <div className="flex-1">
          <PathInfo 
            path={path}
            currentStep={currentStep}
            depthUsed={depthUsed}
            hasCycle={hasCycle}
            cycleDepth={cycleDepth}
            getDirection={getDirection}
            cyclePathVisible={cyclePathVisible}
          />
          
          <div className="mt-4">
            <h3 className="text-md font-bold">Visualization Status:</h3>
            <div className="mt-2">
              {visualizationPhase === 'idle' && <p>Ready to visualize</p>}
              {visualizationPhase === 'path' && <p>Finding path using IDDFS...</p>}
              {visualizationPhase === 'cycle' && <p>Detecting cycles...</p>}
              {visualizationPhase === 'complete' && <p>Visualization complete</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}