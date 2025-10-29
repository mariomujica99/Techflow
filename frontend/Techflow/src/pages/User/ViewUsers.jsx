import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getInitials } from "../../utils/getInitials";
import { MdEmail } from "react-icons/md";
import { FaPager, FaPhone } from "react-icons/fa6";
import { displayPhoneNumber } from "../../utils/phoneFormatter";

const ViewUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsersAlphabetically = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        const sortedUsers = response.data.sort((a, b) => {
          const firstNameA = a.name.split(' ')[0];
          const firstNameB = b.name.split(' ')[0];
          return firstNameA.localeCompare(firstNameB);
        });
        setAllUsers(sortedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsersAlphabetically();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-xl text-gray-500 font-bold mt-1">Team Members</h2>
          <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-white">
              {allUsers.length}
            </span>
          </div>
        </div>

        <h1 className="text-base md:text-lg text-gray-400 mt-1 mb-2">
          Neurophysiology Department
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <ViewUserCard key={user._id} userInfo={user} showAdminBadge={true} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewUsers;

const ViewUserCard = ({ userInfo, showAdminBadge = false }) => {
  return (
    <div className="user-card relative">
      <div className="flex items-center gap-3 min-w-0 w-full">
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
            <p className="text-sm font-medium truncate">{userInfo?.name}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MdEmail className="text-xs flex-shrink-0" />
            <span className="truncate">{userInfo?.email}</span>
          </div>
          {userInfo?.phoneNumber && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <FaPhone className="text-xs flex-shrink-0" />
              <span className="truncate">{displayPhoneNumber(userInfo.phoneNumber)}</span>
            </div>
          )}
          {userInfo?.pagerNumber && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <FaPager className="text-xs flex-shrink-0" />
              <span className="truncate">{displayPhoneNumber(userInfo.pagerNumber)}</span>
            </div>
          )}
        </div>
      </div>

      {showAdminBadge && userInfo?.role === 'admin' && (
        <span className="absolute bottom-4 right-4 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
          Admin
        </span>
      )}
    </div>
  );
};