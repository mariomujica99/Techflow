import React from "react";

const CustomLegend = ({payload}) => {
  // Define the desired order
  const order = ['Pending', 'In Progress', 'Completed', 'Disconnected'];
  
  // Sort payload based on the order array
  const sortedPayload = [...payload].sort((a, b) => {
    const indexA = order.indexOf(a.value);
    const indexB = order.indexOf(b.value);
    return indexA - indexB;
  });

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 space-x-6">
      {sortedPayload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center space-x-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-xs text-gray-700 font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
};

export default CustomLegend;