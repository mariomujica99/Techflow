import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuChevronDown } from "react-icons/lu";
import { TODO_DROPDOWN_OPTIONS } from "../../utils/data";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [editableText, setEditableText] = useState("");
  const [customText, setCustomText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showEditableInput, setShowEditableInput] = useState(false);

  // Handle template selection from dropdown
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setEditableText(template);
    setShowEditableInput(true);
    setIsDropdownOpen(false);
  };

  // Handle adding template/editable item
  const handleAddTemplate = () => {
    if (editableText.trim()) {
      setTodoList([...todoList, editableText.trim()]);
      setEditableText("");
      setSelectedTemplate("");
      setShowEditableInput(false);
    }
  };

  // Handle adding custom item
  const handleAddCustom = () => {
    if (customText.trim()) {
      setTodoList([...todoList, customText.trim()]);
      setCustomText("");
    }
  };

  // Handle deleting an item
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div>
      {/* Display existing todo items */}
      {todoList.map((item, index) => (
        <div
          key={item}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <p className="text-xs text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      {/* Template Dropdown Section */}
      <div className="mt-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">
          Select Template
        </label>
        
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-3 py-2 rounded-md flex justify-between items-center"
          >
            {selectedTemplate || "Choose from templates..."}
            <LuChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10 max-h-48 overflow-y-auto">
              {TODO_DROPDOWN_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleTemplateSelect(option.value)}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editable text input when template is selected */}
        {showEditableInput && (
          <div className="flex items-center gap-3 mt-3">
            <input
              type="text"
              placeholder="Edit template text..."
              value={editableText}
              onChange={({ target }) => setEditableText(target.value)}
              className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
            />
            <button className="card-btn text-nowrap" onClick={handleAddTemplate}>
              <HiMiniPlus className="text-lg" /> Add
            </button>
          </div>
        )}
      </div>

      {/* Custom Text Input Section */}
      <div className="mt-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">
          Enter Custom Task
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter custom task"
            value={customText}
            onChange={({ target }) => setCustomText(target.value)}
            className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
          />
          <button className="card-btn text-nowrap" onClick={handleAddCustom}>
            <HiMiniPlus className="text-lg" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoListInput;