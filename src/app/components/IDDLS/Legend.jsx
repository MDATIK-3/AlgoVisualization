const Legend = () => {
  const items = [
    { color: 'bg-green-500', label: 'Source' },
    { color: 'bg-red-500', label: 'Goal' },
    { color: 'bg-gray-800', label: 'Obstacle' },
    { color: 'bg-blue-500', label: 'Path' },
    { color: 'bg-blue-100', label: 'Visited' },
    { color: 'bg-purple-500', label: 'Cycle' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-4 h-4 ${item.color} mr-2`}></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
export default Legend;