const Cell = ({ x, y, type, onClick }) => {
  const getCellClass = () => {
    switch (type) {
      case 'source': return 'bg-green-500 text-white';
      case 'goal': return 'bg-red-500 text-white';
      case 'path': return 'bg-blue-500 text-white';
      case 'visited': return 'bg-blue-100';
      case 'cycle': return 'bg-purple-500 text-white';
      case 'obstacle': return 'bg-gray-800';
      default: return 'bg-white';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        w-full h-8 border cursor-pointer flex items-center justify-center
        ${getCellClass()}
      `}
      title={`(${x}, ${y})`}
    >
      {type === 'source' && 'S'}
      {type === 'goal' && 'G'}
    </div>
  );
};
export default Cell;