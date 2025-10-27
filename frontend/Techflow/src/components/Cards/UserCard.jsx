import React, { useState } from "react";
import { getInitials } from "../../utils/getInitials";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DeleteAlert from "../DeleteAlert";
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import Modal from "../Modal";

const UserCard = ({userInfo, onUserDeleted, showAdminBadge = false}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // Delete User
  const deleteUser = async () => {
    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userInfo._id));

      setOpenDeleteAlert(false);
      toast.success("User deleted successfully");

      if (onUserDeleted) {
        onUserDeleted(userInfo._id);
      }
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="user-card p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0 my-2">
          <div className="relative flex-shrink-0">
            {userInfo?.profileImageUrl ? (
              <img
                src={userInfo?.profileImageUrl}
                alt={userInfo?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold text-base"
              style={{ backgroundColor: userInfo?.profileColor || "#30b5b2" }}>
                {getInitials(userInfo?.name)}
              </div>
            )}

            {showAdminBadge && userInfo?.role === "admin" && (
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-[9px] font-medium text-white bg-indigo-500 px-2.5 py-0.5 rounded">
                Admin
              </div>
            )}
          </div>

          <div className="truncate min-w-0 mt-1">
            <p className="text-sm font-medium truncate">{userInfo?.name}</p>
            <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
          </div>
        </div>

        {/* Delete button */}
        <button
          className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded-full px-2 py-2 border border-rose-100 hover:border-rose-300 cursor-pointer"
          onClick={() => setOpenDeleteAlert(true)}
        >
          <LuTrash2 className="text-base" />
        </button>

        <Modal
          isOpen={openDeleteAlert}
          onClose={() => setOpenDeleteAlert(false)}
          title="Delete User"
        >
          <DeleteAlert
            content="Are you sure you want to delete this user? This action cannot be undone."
            onDelete={() => deleteUser()}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50";
      case "Completed":
        return "text-green-500 bg-gray-50";
      default:
        return "text-violet-500 bg-gray-50";
    }
  };

  return (
    <div
      className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-3 py-0.5 rounded text-center`}
    >
      <span className="text-[12px] font-semibold">{count}</span> <br />
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
};