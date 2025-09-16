import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getInitials } from "../../utils/getInitials";

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
          <h2 className="text-xl md:text-xl font-medium text-gray-700">Team Members</h2>
          <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-white">
              {allUsers.length}
            </span>
          </div>
        </div>

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
    <div className="user-card p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-start gap-3 min-w-0">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {userInfo?.profileImageUrl ? (
            <img
              src={userInfo?.profileImageUrl}
              alt={userInfo?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold text-base"
              style={{ backgroundColor: userInfo?.profileColor || "#30b5b2" }}
            >
              {getInitials(userInfo?.name)}
            </div>
          )}
        </div>

        {/* Info + Badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {/* Name + Email stacked */}
            <div className="min-w-0 mt-1">
              <p className="text-sm font-medium truncate">{userInfo?.name}</p>
              <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
            </div>

            {/* Badge */}
            {showAdminBadge && userInfo?.role === "admin" && (
              <div className="flex-shrink-0 ml-2 text-[9px] font-medium text-white bg-indigo-500 px-2.5 py-1 rounded">
                Admin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};