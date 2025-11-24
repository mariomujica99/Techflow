import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";
import { getInitials } from "../../utils/getInitials";

// Cache users at module level to avoid repeated fetches
let cachedUsers = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 1 minute

const SelectCoverageUser = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    // Check if cache is still valid
    if (cachedUsers && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      setAllUsers(cachedUsers);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        const sortedUsers = response.data.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        cachedUsers = sortedUsers;
        cacheTimestamp = Date.now();
        setAllUsers(sortedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
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
  }, [selectedUsers]);

  return (
    <div className="flex space-y-4 justify-end">
      {selectedUserAvatars.length === 0 && (
        <button 
          className="w-8 h-8 p-2 flex items-center justify-center gap-1 text-sm text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 rounded-full border border-gray-200/50 cursor-pointer whitespace-nowrap" 
          onClick={() => setIsModalOpen(true)}
        >
          <LuUsers className="flex-shrink-0 text-sm" />
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
        <div className="h-[60vh] overflow-y-auto pr-4 pl-4">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-300">Loading Members...</p>
          ) : (
            allUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 p-3 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => toggleUserSelection(user._id)}
              >
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 flex items-center justify-center rounded-full text-white text-sm font-medium flex-shrink-0"
                    style={{ backgroundColor: user.profileColor || "#30b5b2" }}
                  >
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white truncate">{user.name}</p>
                  <p className="text-[13px] text-gray-500 dark:text-gray-300 truncate">{user.email}</p>
                </div>

                {tempSelectedUsers.includes(user._id) && (
                  <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0"></div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="text-center md:text-left md:pl-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            Members Selected | {tempSelectedUsers.length}
          </p>
        </div>

        <div className="flex justify-between gap-4 pt-1 pr-4">
          <button className="card-btn ml-4" onClick={handleClear}>
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
              className="w-8 h-8 rounded-full object-cover ml-1"
            />
          );
        } else {
          const userName = users?.[index]?.name || "Unknown";
          const userColor = users?.[index]?.profileColor || "#30b5b2";
          return (
            <div
              key={index}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-medium ml-1"
              style={{ backgroundColor: userColor }}
            >
              {getInitials(userName)}
            </div>
          );
        }
      })}
      {avatars.length > maxVisible && (
        <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-xs font-medium rounded-full ml-1">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  )
};