import React from "react";
import { getInitials } from "../utils/getInitials";

const AvatarGroup = ({ avatars, users, maxVisible = 3 }) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => {
        // If avatar exists, show image
        if (avatar) {
          return (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index}`}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white -ml-2 first:ml-0 object-cover"
            />
          );
        } else {
          const userName = users?.[index]?.name || "Unknown";
          const userColor = users?.[index]?.profileColor || "#30b5b2";
          return (
            <div
              key={index}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-white text-xs font-medium border-2 border-white -ml-2 first:ml-0"
              style={{ backgroundColor: userColor }}
            >
              {getInitials(userName)}
            </div>
          );
        }
      })}
      {avatars.length > maxVisible && (
        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-2">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  )
};

export default AvatarGroup;