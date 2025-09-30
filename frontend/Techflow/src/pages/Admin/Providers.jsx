import React, { useContext, useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ProviderCard from "../../components/Cards/ProviderCard";
import { UserContext } from "../../context/userContext";

const Providers = () => {
  const { user } = useContext(UserContext);
  const [providers, setProviders] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleProviderDeleted = (deletedProviderId) => {
    setProviders(prev => prev.filter(provider => provider._id !== deletedProviderId));
  };

  const handleProviderUpdated = (updatedProvider) => {
    setProviders(prev => prev.map(provider => 
      provider._id === updatedProvider._id ? updatedProvider : provider
    ));
  };

  const handleProviderCreated = (newProvider) => {
    setProviders(prev => [...prev, newProvider].sort((a, b) => {
      const firstNameA = a.name.split(' ')[0];
      const firstNameB = b.name.split(' ')[0];
      return firstNameA.localeCompare(firstNameB);
    }));
  };

  const getAllProviders = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PROVIDERS.GET_ALL_PROVIDERS);
      if (response.data?.length > 0) {
        const sortedProviders = response.data.sort((a, b) => {
          const firstNameA = a.name.split(' ')[0];
          const firstNameB = b.name.split(' ')[0];
          return firstNameA.localeCompare(firstNameB);
        });
        setProviders(sortedProviders);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const handleManageProviders = () => {
    if (isEditMode) {
      getAllProviders();
    }
    setIsEditMode(!isEditMode);
  };

  useEffect(() => {
    getAllProviders();
  }, []);

  return (
    <DashboardLayout activeMenu="Reading Providers">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-xl font-medium text-gray-700">Reading Providers</h2>
            <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-white">
                {providers.length}
              </span>
            </div>
          </div>

          {user?.role === 'admin' && (
            <button className="card-btn" onClick={handleManageProviders}>
              {isEditMode ? "Done" : "Edit"}
            </button>
          )}
        </div>

        <h1 className="text-base md:text-lg text-gray-400 my-2">
          Neurophysiology Department
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {providers?.map((provider) => (
            <ProviderCard 
              key={provider._id}
              providerInfo={provider}
              isEditMode={isEditMode}
              onProviderDeleted={handleProviderDeleted}
              onProviderUpdated={handleProviderUpdated}
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