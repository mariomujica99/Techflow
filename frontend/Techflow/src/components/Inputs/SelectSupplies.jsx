import React, { useState, useEffect } from "react";
import { HiMiniPlus } from "react-icons/hi2";
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
            className="flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-800"
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
      <div className="px-4 pb-4 pt-3 border-t dark:border-gray-600">
        <label className="text-xs font-medium dark:text-white block mb-2">
          Add Custom Supply Item
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter custom supply item"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            className="flex-1 min-w-0 text-xs md:text-sm text-black outline-none dark:bg-white border border-slate-100 px-3 py-1.75 rounded-md placeholder:text-gray-500"
          />
          <button
            className="flex flex-shrink-0 items-center gap-2 text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-4 py-1.75 md:py-2 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap"
            onClick={handleAddCustom}
          >
            <HiMiniPlus className="text-lg" />
          </button>
        </div>
      </div>

      {/* Supplies Count */}
      <div className="text-center md:text-left md:pl-4 pt-4 border-t dark:border-gray-600">
        <p className="text-sm font-medium dark:text-white">
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