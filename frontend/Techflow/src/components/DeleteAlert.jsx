import React from "react";

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
      <p className="text-sm dark:text-white">{content}</p>
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-red-500 hover:text-white whitespace-nowrap bg-red-50 hover:bg-red-400 border border-red-100 hover:border-red-400 rounded-lg px-4 py-2 cursor-pointer"
          onClick={onDelete}
        >Delete</button>
      </div>
    </div>
  )
};

export default DeleteAlert;