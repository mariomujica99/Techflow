import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";
import { getInitials } from "../../utils/getInitials";

const SelectCoverageUser = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const handleClear = () => {
    setTempSelectedUsers([]);
  };

  const selectedUserData = allUsers
    .filter((user) => selectedUsers.includes(user._id));

  const selectedUserAvatars = selectedUserData.map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedUsers(selectedUsers);
    }
  }, [isModalOpen, selectedUsers]);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }

    return () => {};
  }, [selectedUsers]);

  return (
    <div className="flex space-y-4 justify-end">
      {selectedUserAvatars.length === 0 && (
        <button className="w-10 py-2 flex items-center justify-center gap-1 text-xs text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="flex-shrink-0 text-xs" />
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <CoverageAvatarGroup
            avatars={selectedUserAvatars} 
            users={selectedUserData}
            maxVisible={3} 
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Member"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto pr-4 pl-4">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200"
            >
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: user.profileColor || "#30b5b2" }}
                >
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 accent-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-4 pt-4 pr-4">
          <button className="card-btn" onClick={handleClear}>
            CLEAR ALL
          </button>
          <div className="flex gap-2">
            <button className="card-btn" onClick={() => setIsModalOpen(false)}>
              CANCEL
            </button>
            <button className="card-btn-fill" onClick={handleAssign}>
              DONE
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SelectCoverageUser;

const CoverageAvatarGroup = ({ avatars, users, maxVisible = 3 }) => {
  return (
    <div className="flex items-center justify-end">
      {avatars.slice(0, maxVisible).map((avatar, index) => {
        // If avatar exists, show image
        if (avatar) {
          return (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index}`}
              className="w-8 h-8 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover"
            />
          );
        } else {
          const userName = users?.[index]?.name || "Unknown";
          const userColor = users?.[index]?.profileColor || "#30b5b2";
          return (
            <div
              key={index}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-medium border-2 border-white -ml-3 first:ml-0"
              style={{ backgroundColor: userColor }}
            >
              {getInitials(userName)}
            </div>
          );
        }
      })}
      {avatars.length > maxVisible && (
        <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-xs font-medium rounded-full border-2 border-white -ml-3">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  )
};