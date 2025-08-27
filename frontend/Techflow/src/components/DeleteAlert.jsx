import React from "react";

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
      <p className="text-sm">{content}</p>
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-red-500 whitespace-nowrap bg-red-50 border border-red-100 rounded-lg px-4 py-2 cursor-pointer"
          onClick={onDelete}
        >Delete</button>
      </div>
    </div>
  )
};

export default DeleteAlert;