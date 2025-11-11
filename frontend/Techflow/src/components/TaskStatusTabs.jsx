import React from "react";

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab, onBadgeClick }) => {
  return (
    <div className="my-2">
      <div className="flex flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
              activeTab === tab.label
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            } cursor-pointer`}
            onClick={() => setActiveTab(tab.label)}
          >
            <div className="flex items-center">
              <span className="text-xs whitespace-nowrap">{tab.label}</span>
              <span
                className={`text-xs ml-2 px-2 py-0.5 rounded-full whitespace-nowrap ${
                  activeTab === tab.label
                    ? 'bg-primary text-white'
                    : 'bg-gray-200/70 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
              
              {/* Warning badge */}
              {tab.showBadge && (
                <div 
                  className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBadgeClick?.(tab.label);
                  }}
                  title="Click to view warning"
                >
                  !
                </div>
              )}
            </div>
            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusTabs;