import React, { useContext, useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import { UserContext } from "../../context/userContext";
import { Navigate } from "react-router-dom";

const ManageUsers = () => {
  const { user } = useContext(UserContext);

  // Handle user deletion
  const handleUserDeleted = (deletedUserId) => {
    setAllUsers(prevUsers => prevUsers.filter(user => user._id !== deletedUserId));
  };
  
  // Redirect non-admin users
  if (user?.role !== 'admin') {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} />;
  }

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

  // Download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading team details.", error);
      toast.error("Failed to download team details. Please try again.");
    }
  };

  useEffect(() => {
    getAllUsersAlphabetically();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-xl font-medium text-gray-700">Team Members</h2>
            <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-white">
                {allUsers.length}
              </span>
            </div>
          </div>

          <button className="flex md:flex download-btn" onClick={handleDownloadReport}>
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard key={user._id} userInfo={user} onUserDeleted={handleUserDeleted} showAdminBadge={true} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;