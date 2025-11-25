import React, { useState, useEffect } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { SUPPLIES } from "../../utils/data";

const SelectSupplies = ({ selectedItems, onItemsChange, onClose }) => {
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const [customItem, setCustomItem] = useState("");

  useEffect(() => {
    setTempSelectedItems(selectedItems);
  }, [selectedItems]);

  const toggleItemSelection = (item) => {
    setTempSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleAddCustom = () => {
    if (customItem.trim() && !tempSelectedItems.includes(customItem.trim())) {
      setTempSelectedItems((prev) => [...prev, customItem.trim()]);
      setCustomItem("");
    }
  };

  const handleDone = () => {
    onItemsChange(tempSelectedItems);
  };

  const handleClearAll = () => {
    setTempSelectedItems([]);
  };

  const handleCancel = () => {
    setTempSelectedItems(selectedItems);
    onClose();
  };

  return (
    <div>
      <div className="h-[50vh] overflow-y-auto pr-4 pl-4 mb-4">
        {SUPPLIES.map((supply) => (
          <div
            key={supply.value}
            className="flex items-center p-3 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => toggleItemSelection(supply.value)}
          >
            <div className="flex-1">
              <p className="text-sm dark:text-white">{supply.label}</p>
            </div>
            {tempSelectedItems.includes(supply.value) && (
              <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Item Input */}
      <div className={`px-4 pt-3 border-t border-gray-200 dark:border-gray-600 ${
        tempSelectedItems.filter(item => !SUPPLIES.some(s => s.value === item)).length > 0 
          ? 'pb-2' 
          : 'pb-4'
      }`}>
        <label className="text-xs font-medium text-gray-800 dark:text-white block mb-2">
          Add Custom Supply
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter Supply"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            className="flex-1 min-w-0 text-xs md:text-sm text-gray-800 dark:text-white outline-none bg-gray-200 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 px-3 py-1.75 rounded-md placeholder:text-gray-400"
          />
          <button
            className="flex flex-shrink-0 items-center gap-2 text-[12px] font-medium text-gray-600 hover:text-primary bg-gray-200 dark:bg-gray-50 hover:bg-blue-50 px-4 py-1.75 md:py-2 rounded-lg border border-gray-200 dark:border-gray-50 cursor-pointer whitespace-nowrap"
            onClick={handleAddCustom}
          >
            <HiMiniPlus className="text-lg" />
          </button>
        </div>
      </div>

      {/* Display Added Custom Items */}
      {tempSelectedItems.filter(item => !SUPPLIES.some(s => s.value === item)).length > 0 && (
        <div className="px-4 pb-4">
          <label className="text-xs font-medium text-gray-800 dark:text-white block mb-2">
            Custom Supplies
          </label>
          <div className="space-y-2">
            {tempSelectedItems
              .filter(item => !SUPPLIES.some(s => s.value === item))
              .map((item) => (
                <div
                  key={item}
                  className="flex justify-between items-center py-2 px-3 bg-gray-200 dark:bg-gray-600 rounded"
                >
                  <span className="text-sm text-gray-800 dark:text-white">{item}</span>
                  <HiOutlineTrash
                    className="text-lg text-red-500 dark:text-red-400 cursor-pointer flex-shrink-0 hover:text-red-600"
                    onClick={() => setTempSelectedItems(prev => prev.filter(i => i !== item))}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Supplies Count */}
      <div className="text-center md:text-left md:pl-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-sm font-medium text-gray-800 dark:text-white">
          Supplies Selected | {tempSelectedItems.length}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4 pt-4 pr-4">
        <button className="card-btn ml-4" onClick={handleClearAll}>
          CLEAR ALL
        </button>
        <div className="flex gap-2">
          <button className="card-btn" onClick={handleCancel}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleDone}>
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectSupplies;