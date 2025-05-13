import Cell from './Cell';
const Grid = ({ grid, gridSize, handleCellClick, getCellType }) => {
  return (
    <div 
      className="grid gap-1" 
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(24px, 32px))` }}
    >
      {grid.map((row, x) => 
        row.map((cell, y) => (
          <Cell
            key={`${x}-${y}`}
            x={x}
            y={y}
            type={getCellType(x, y)}
            onClick={() => handleCellClick(x, y)}
          />
        ))
      )}
    </div>
  );
};
export default Grid;