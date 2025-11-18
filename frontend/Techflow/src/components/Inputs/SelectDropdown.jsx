import React, { useState, useEffect, useRef } from "react";
import { LuChevronDown } from "react-icons/lu";

const SelectDropdown = ({ options, value, onChange, placeholder, clearable = false, clearLabel = "Clear" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm text-gray-600 outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center cursor-pointer"
      >
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        <span>{isOpen ? <LuChevronDown className="rotate-180" /> : <LuChevronDown />}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full bg-white text-gray-600 border border-slate-100 rounded-md mt-1 shadow-md z-10 max-h-48 overflow-y-auto">
          {/* Clear/Reset Option */}
          {clearable && value && (
            <div
              onClick={() => handleSelect(null)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {clearLabel}
            </div>
          )}

          {/* Regular Options */}
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;