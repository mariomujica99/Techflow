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
              className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover"
            />
          );
        } else {
          // Show initials when no avatar
          const userName = users?.[index]?.name || "Unknown";
          return (
            <div
              key={index}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white text-xs font-medium border-2 border-white -ml-3 first:ml-0"
            >
              {getInitials(userName)}
            </div>
          );
        }
      })}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  )
};

export default AvatarGroup;