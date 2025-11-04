import React, { useState, useEffect } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuMessageSquareText } from "react-icons/lu";

const AddCommentsInput = ({ comments, setComments }) => {
  const [option, setOption] = useState("");
  const [commentRef, setCommentRef] = useState(null);

  const autoResize = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (commentRef) {
      autoResize(commentRef);
    }
  }, [option, commentRef]);

  return (
    <div>
      {comments.map((item, index) => (
        <div
          key={item}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <div className="flex flex-1 mr-3">
            <LuMessageSquareText className="text-gray-400 flex-shrink-0 mr-2 mt-0.5" />
            <p className="text-xs text-black flex-1">{item}</p>
          </div>

          <button
            className="cursor-pointer flex-shrink-0"
            onClick={() => {
              const updatedArr = comments.filter((_, idx) => idx !== index);
              setComments(updatedArr);
            }}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-start gap-3 mt-2">
        <div className="flex-1 flex items-start gap-3 border border-gray-100 rounded-md px-3 py-2 min-h-[40px]">
          <LuMessageSquareText className="text-gray-400 flex-shrink-0 mt-1" />

          <textarea
            ref={(el) => setCommentRef(el)}
            placeholder="Add Comment"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-white rounded-md resize-none pt-0.25 min-h-[20px] overflow-hidden"
            rows="1"
            onInput={(e) => autoResize(e.target)}
          />
        </div>

        <button className="flex items-center gap-1 md:gap-2 text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-2.5 md:px-4 py-2.5 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap" onClick={() => {
          if (option.trim()) {
            setComments([...comments, option.trim()]);
            setOption("");
          }
        }}>
          <HiMiniPlus className="text-base md:text-lg" />
          <span className="hidden md:inline">Add</span>
        </button>
      </div>
    </div>
  );
};

export default AddCommentsInput;