import React, { useState, useEffect, useRef } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuChevronDown } from "react-icons/lu";
import { TODO_DROPDOWN_OPTIONS, TODO_DC_CHART } from "../../utils/data";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [editableText, setEditableText] = useState("");
  const [customText, setCustomText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showEditableInput, setShowEditableInput] = useState(false);

  const [editableTextRef, setEditableTextRef] = useState(null);
  const [customTextRef, setCustomTextRef] = useState(null);

  const [showTemplateInputs, setShowTemplateInputs] = useState(false);
  const [templateInputs, setTemplateInputs] = useState({
    day: '',
    room: '',
    comment: ''
  });

  const [templateErrors, setTemplateErrors] = useState({
    day: '',
    room: '',
    comment: ''
  });

  // Handle template selection from dropdown
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowTemplateInputs(true);
    setIsDropdownOpen(false);
    
    // Reset template inputs
    setTemplateInputs({
      day: '',
      room: '',
      comment: ''
    });
  };

  // Determine what inputs to show
  const getTemplateInputConfig = (template) => {
    switch (template) {
      case "Skin Check | Day ":
        return { 
          showDay: true, 
          dayRequired: true,
          showComment: true,
          commentLabel: "Comment",
          commentPlaceholder: "Ex: Fz Cz Pz"
        };
      case "Transfer Patient to ":
        return { 
          showRoom: true, 
          roomRequired: true,
          showComment: true,
          commentLabel: "Comment",
          commentPlaceholder: "Ex: @2:00pm"
        };
      case "Troubleshoot ":
        return { 
          showComment: true,
          commentRequired: true,
          commentLabel: "Comment",
          commentPlaceholder: "Ex: Replace gray cord"
        };
      case "Fix Electrodes ":
      case "Photic Stimulation ":
      case "Hyperventilation ":
      case "Disconnect ":
      case "Rehook ":
        return { 
          showComment: true,
          commentLabel: "Comment",
          commentPlaceholder: getCommentPlaceholder(template)
        };
      default:
        return {};
    }
  };

  // Helper function for comment placeholders
  const getCommentPlaceholder = (template) => {
    switch (template) {
      case "Fix Electrodes ": return "Ex: Fz Cz Pz";
      case "Photic Stimulation ": return "Ex: Prolonged";
      case "Hyperventilation ": return "Ex: 5min";
      case "Disconnect ": return "Ex: @2:00pm";
      case "Rehook ": return "Ex: MRI Leads";
      default: return "Enter comment";
    }
  };

  // Handle adding template/editable item
  const handleAddTemplate = () => {
    const config = getTemplateInputConfig(selectedTemplate);
    
    // Reset errors
    setTemplateErrors({ day: '', room: '', comment: '' });
    
    // Validation with error messages
    let hasErrors = false;
    const errors = { day: '', room: '', comment: '' };
    
    if (config.dayRequired && !templateInputs.day.trim()) {
      errors.day = 'Day is required';
      hasErrors = true;
    }
    
    if (config.roomRequired && !templateInputs.room.trim()) {
      errors.room = 'Room number is required';
      hasErrors = true;
    }
    
    if (config.commentRequired && !templateInputs.comment.trim()) {
      errors.comment = 'Comment is required';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setTemplateErrors(errors);
      return;
    }

    // Build the final text
    let finalText = selectedTemplate;
    
    if (config.showDay && templateInputs.day.trim()) {
      finalText = finalText.replace("Day ", `Day ${templateInputs.day.trim()}`);
    }
    
    if (config.showRoom && templateInputs.room.trim()) {
      finalText = finalText.replace("to ", `to ${templateInputs.room.trim()}`);
    }
    
    if (config.showComment && templateInputs.comment.trim()) {
      finalText += ` | ${templateInputs.comment.trim()}`;
    }

    if (selectedTemplate === "Disconnect ") {
      setTodoList([...todoList, finalText, TODO_DC_CHART]);
    } else {
      setTodoList([...todoList, finalText]);
    }

    // Reset everything
    setSelectedTemplate("");
    setShowTemplateInputs(false);
    setTemplateInputs({ day: '', room: '', comment: '' });
    setTemplateErrors({ day: '', room: '', comment: '' });
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

  const autoResize = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (editableTextRef) {
      autoResize(editableTextRef);
    }
  }, [editableText, editableTextRef]);

  return (
    <div>
      {/* Display existing todo items */}
      {todoList.map((item, index) => (
        <div
          key={item}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <div className="flex flex-1 mr-3">
            <span className="text-xs text-gray-400 font-semibold mr-2 flex-shrink-0">
              {index + 1}
            </span>
            <p className="text-xs text-black flex-1">
              {item}
            </p>
          </div>
          
          <button
            className="cursor-pointer flex-shrink-0"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      {/* Template Dropdown Section */}
      <div className="mt-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">
          Select Task Template
        </label>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center cursor-pointer"
          >
            {selectedTemplate ? 
              TODO_DROPDOWN_OPTIONS.find(opt => opt.value === selectedTemplate)?.label || "Select Task"
              : "Select Task"
            }
            <LuChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10 max-h-48 overflow-y-auto">
              {TODO_DROPDOWN_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleTemplateSelect(option.value)}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-left"
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Template Input Fields */}
        {showTemplateInputs && selectedTemplate && (() => {
          const config = getTemplateInputConfig(selectedTemplate);
          return (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.showDay && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      Day {config.dayRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      placeholder="1"
                      value={templateInputs.day}
                      onChange={(e) => {
                        setTemplateInputs(prev => ({ ...prev, day: e.target.value }));
                        // Clear error when user starts typing
                        if (templateErrors.day) {
                          setTemplateErrors(prev => ({ ...prev, day: '' }));
                        }
                      }}
                      className={`w-full text-sm text-black outline-none bg-white border px-3 py-2 rounded-md placeholder:text-gray-500 ${
                        templateErrors.day ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {templateErrors.day && (
                      <p className="text-xs text-red-500 mt-1">{templateErrors.day}</p>
                    )}
                  </div>
                )}

                {config.showRoom && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      New Room {config.roomRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      placeholder="3846"
                      value={templateInputs.room}
                      onChange={(e) => {
                        setTemplateInputs(prev => ({ ...prev, room: e.target.value }));
                        // Clear error when user starts typing
                        if (templateErrors.room) {
                          setTemplateErrors(prev => ({ ...prev, room: '' }));
                        }
                      }}
                      className={`w-full text-sm text-black outline-none bg-white border px-3 py-2 rounded-md placeholder:text-gray-500 ${
                        templateErrors.room ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {templateErrors.room && (
                      <p className="text-xs text-red-500 mt-1">{templateErrors.room}</p>
                    )}
                  </div>
                )}

                {config.showComment && (
                  <div className={!config.showDay && !config.showRoom ? "md:col-span-2" : ""}>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      {config.commentLabel} {config.commentRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      placeholder={config.commentPlaceholder}
                      value={templateInputs.comment}
                      onChange={(e) => {
                        setTemplateInputs(prev => ({ ...prev, comment: e.target.value }));
                        // Clear error when user starts typing
                        if (templateErrors.comment) {
                          setTemplateErrors(prev => ({ ...prev, comment: '' }));
                        }
                      }}
                      className={`w-full text-sm text-black outline-none bg-white border px-3 py-2 rounded-md placeholder:text-gray-500 ${
                        templateErrors.comment ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {templateErrors.comment && (
                      <p className="text-xs text-red-500 mt-1">{templateErrors.comment}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600 mb-1 block">Preview</label>
                <div className="text-sm text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-md">
                  {(() => {
                    let preview = selectedTemplate;
                    if (config.showDay && templateInputs.day.trim()) {
                      preview = preview.replace("Day ", `Day ${templateInputs.day.trim()}`);
                    }
                    if (config.showRoom && templateInputs.room.trim()) {
                      preview = preview.replace("to ", `to ${templateInputs.room.trim()}`);
                    }
                    if (config.showComment && templateInputs.comment.trim()) {
                      preview += ` | ${templateInputs.comment.trim()}`;
                    }
                    return preview;
                  })()}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button 
                  className="flex items-center gap-2 text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-100 hover:bg-blue-50 px-4 py-2 rounded-lg border border-gray-300 cursor-pointer" 
                  onClick={() => {
                    setShowTemplateInputs(false);
                    setSelectedTemplate("");
                    setTemplateInputs({ day: '', room: '', comment: '' });
                    setTemplateErrors({ day: '', room: '', comment: '' });
                  }}
                >
                  Cancel
                </button>
                
                <button 
                  className="flex items-center gap-2 text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-4 py-2 rounded-lg border border-gray-200/50 cursor-pointer" 
                  onClick={handleAddTemplate}
                >
                  <HiMiniPlus className="text-lg" /> Add Task
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Custom Text Input Section */}
      <div className="mt-4">
        <div className="flex items-start gap-3">
          <textarea
            ref={(el) => setCustomTextRef(el)}
            placeholder="Type a Custom Task"
            value={customText}
            onChange={({ target }) => setCustomText(target.value)}
            className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md resize-none min-h-[40px] overflow-hidden"
            rows="1"
            onInput={(e) => autoResize(e.target)}
          />
          
          <button className="flex items-center gap-2 text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-4 py-2.5 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap" onClick={handleAddCustom}>
            <HiMiniPlus className="text-lg" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoListInput;