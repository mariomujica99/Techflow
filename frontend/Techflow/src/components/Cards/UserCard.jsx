import React, { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { FaPhone, FaPager } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { getInitials } from "../../utils/getInitials";
import Modal from "../Modal";
import DeleteAlert from "../DeleteAlert";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { displayPhoneNumber } from "../../utils/phoneFormatter";

const UserCard = ({ userInfo, onUserDeleted, showAdminBadge = false, isDemoAccount = false }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const deleteUser = async () => {
    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userInfo._id));
      setOpenDeleteAlert(false);
      toast.success("User deleted successfully");
      onUserDeleted(userInfo._id);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

return (
  <div className="relative flex items-center bg-white p-4 rounded-xl shadow-md shadow-gray-100 border border-gray-200/50">
    <div className="flex items-center gap-3 min-w-0 w-full pr-10">
      {userInfo?.profileImageUrl ? (
        <img
          src={userInfo.profileImageUrl}
          alt={userInfo.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div
          className="w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold text-base flex-shrink-0"
          style={{ backgroundColor: userInfo?.profileColor || '#30b5b2' }}
        >
          {getInitials(userInfo?.name)}
        </div>
      )}
      <div className="truncate min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-gray-500 truncate">{userInfo?.name}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MdEmail className="text-xs flex-shrink-0" />
          <span className="truncate">{userInfo?.email}</span>
        </div>
        {userInfo?.phoneNumber && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <FaPhone className="text-xs flex-shrink-0" />
            <span>{displayPhoneNumber(userInfo.phoneNumber)}</span>
          </div>
        )}
        {userInfo?.pagerNumber && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <FaPager className="text-xs flex-shrink-0" />
            <span>{displayPhoneNumber(userInfo.pagerNumber)}</span>
          </div>
        )}
      </div>
    </div>

    {showAdminBadge && userInfo?.role === 'admin' && (
      <span className="absolute bottom-4 right-4 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
        Admin
      </span>
    )}

    {showAdminBadge && (
      <button
        className="absolute top-4 right-4 flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded-full px-2 py-2 border border-rose-100 hover:border-rose-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setOpenDeleteAlert(true)}
        disabled={isDemoAccount}
      >
        <LuTrash2 className="text-base" />
      </button>
    )}

    <Modal
      isOpen={openDeleteAlert}
      onClose={() => setOpenDeleteAlert(false)}
      title="Delete User"
    >
      <DeleteAlert
        content="Are you sure you want to delete this user? This action cannot be undone."
        onDelete={deleteUser}
      />
    </Modal>
  </div>
);
};

export default UserCard;