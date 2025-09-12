import React, { useState } from "react";
import { LuPalette } from "react-icons/lu";

const ProfileColorSelector = ({ selectedColor, setSelectedColor, onColorSelect }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    '#30b5b2', // Primary
    '#8D51FF', // Purple
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FECA57', // Yellow
    '#FF9FF3', // Pink
    '#54A0FF', // Light Blue
    '#5F27CD', // Dark Purple
    '#00D2D3', // Cyan
    '#FF9F43', // Orange
  ];

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setShowColorPicker(false);
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Color Circle */}
        <div
          className="w-20 h-20 rounded-full border-4 border-white shadow-md cursor-pointer relative"
          style={{ backgroundColor: selectedColor || '#30b5b2' }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <LuPalette className="text-white text-2xl" />
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <LuPalette className="text-sm" />
        </button>
      </div>

      {/* Color Picker Dropdown */}
      {showColorPicker && (
        <div className="absolute mt-24 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-600 mb-3">Choose Background Color</p>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform ${
                  selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2 text-center">Background Color</p>
    </div>
  );
};

export default ProfileColorSelector;