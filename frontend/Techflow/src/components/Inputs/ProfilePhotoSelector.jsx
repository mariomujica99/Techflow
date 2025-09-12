import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update the image state
      setImage(file);

      // Generate preview URL from the file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="relative">
        {!image ? (
          <div 
            className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer"
            onClick={onChooseFile}
          >
            <LuUser className="text-4xl text-primary" />

            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
              onClick={onChooseFile}
            >
              <LuUpload />
            </button>
          </div>
        ) : (
          <div className="relative">
            <img
              src={previewUrl}
              alt="profile photo"
              className="w-20 h-20 rounded-full object-cover cursor-pointer"
              onClick={onChooseFile}
            />

            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
              onClick={handleRemoveImage}
            >
              <LuTrash />
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">Profile Photo</p>
    </div>
  );
};

export default ProfilePhotoSelector;