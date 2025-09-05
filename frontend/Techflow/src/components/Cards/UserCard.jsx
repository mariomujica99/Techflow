import React, { useState } from "react";
import { getInitials } from "../../utils/getInitials";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DeleteAlert from "../DeleteAlert"; // adjust path if needed
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import Modal from "../Modal";

const UserCard = ({userInfo, onUserDeleted}) => {
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
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {userInfo?.profileImageUrl ? (
            <img
              src={userInfo?.profileImageUrl}
              alt={userInfo?.name}
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white font-semibold text-base border-2 border-white">
              {getInitials(userInfo?.name)}
            </div>
          )}

          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>

        {/* Delete button */}
        <button
          className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
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

      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  )
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
      className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-3 py-0.5 rounded`}
    >
      <span className="text-[12px] font-semibold">{count}</span> <br /> {label}
    </div>
  )
}