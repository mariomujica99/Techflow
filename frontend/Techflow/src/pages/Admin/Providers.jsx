import React, { useContext, useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import ProviderCard from "../../components/Cards/ProviderCard";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LiaEdit } from "react-icons/lia";

const Providers = () => {
  const { user } = useContext(UserContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [allProviders, setAllProviders] = useState([]);
  const isDemoAccount = user?.email === 'admindemo@gmail.com';

  const handleProviderDeleted = (deletedProviderId) => {
    setAllProviders(prev => prev.filter(provider => provider._id !== deletedProviderId));
  };

  const handleProviderUpdated = (updatedProvider) => {
    setAllProviders(prev => prev.map(provider => 
      provider._id === updatedProvider._id ? updatedProvider : provider
    ));
  };

  const handleProviderCreated = (newProvider) => {
    setAllProviders(prev => [...prev, newProvider]);
  };

  const handleManageProviders = () => {
    if (isEditMode) {
      getAllProviders();
    }
    setIsEditMode(!isEditMode);
  };

  const getAllProviders = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PROVIDERS.GET_ALL_PROVIDERS);
      setAllProviders(response.data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_PROVIDERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reading_providers_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading providers report.", error);
      toast.error("Failed to download providers report. Please try again.");
    }
  };

  useEffect(() => {
    getAllProviders();
  }, []);

  return (
    <DashboardLayout activeMenu="Reading Providers">
      <div className="mt-5 mb-10">
        {/* Demo Alert */}
        {isDemoAccount && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800">
              <strong>Demo Account:</strong> Provider deletion is disabled.
            </p>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:justify-between mb-2 gap-3">
          <div>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-xl md:text-xl text-gray-500 font-bold">Reading Providers</h2>
              <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
                <span className="text-sm font-semibold text-white">
                  {allProviders.length}
                </span>
              </div>
            </div>
            <h1 className="text-base md:text-lg text-gray-400 mt-1">
              Neurophysiology Department
            </h1>
          </div>

          <div className="flex items-center justify-between gap-2">
            {user?.role === 'admin' && (
              <button className="flex download-btn" onClick={handleDownloadReport}>
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            )}
            
            {user?.role === 'admin' && (
              <button className="edit-btn" onClick={handleManageProviders}>
                {isEditMode ? (
                  <>
                    <IoMdCheckmarkCircleOutline />
                  </>
                ) : (
                  <>
                    <LiaEdit />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {allProviders?.map((provider) => (
            <ProviderCard 
              key={provider._id}
              providerInfo={provider}
              isEditMode={isEditMode}
              onProviderDeleted={handleProviderDeleted}
              onProviderUpdated={handleProviderUpdated}
              isDemoAccount={isDemoAccount}
            />
          ))}
          
          {isEditMode && (
            <ProviderCard 
              isAddCard={true}
              onProviderCreated={handleProviderCreated}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Providers;