import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../Modal";
import { getInitials } from "../../utils/getInitials";
import { FaUserMd } from "react-icons/fa";

// Cache providers at module level to avoid repeated fetches
let cachedProviders = null;
let providerCacheTimestamp = null;
const CACHE_DURATION = 60000; // 1 minute

const SelectProvider = ({ selectedProviderId, onProviderSelect, placeholder = "Select Provider", label }) => {
  const [allProviders, setAllProviders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedProvider = allProviders.find(provider => provider._id === selectedProviderId);

  const getAllProviders = async () => {
    if (cachedProviders && providerCacheTimestamp && (Date.now() - providerCacheTimestamp < CACHE_DURATION)) {
      setAllProviders(cachedProviders);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.PROVIDERS.GET_ALL_PROVIDERS);
      if (response.data?.length > 0) {
        cachedProviders = response.data;
        providerCacheTimestamp = Date.now();
        setAllProviders(response.data);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (providerId) => {
    onProviderSelect(providerId);
    setIsModalOpen(false);
  };

  const handleClear = () => {
    onProviderSelect(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    getAllProviders();
  }, []);

  return (
    <div className="space-y-4 flex justify-end">
      {!selectedProvider && (
        <div>
        <button 
          className="w-8 h-8 flex items-center justify-center gap-1 text-sm text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 rounded-full border border-gray-200/50 cursor-pointer whitespace-nowrap" 
          onClick={() => setIsModalOpen(true)}
        >
          <FaUserMd className="flex-shrink-0 text-sm" />
        </button>
        </div>
      )}

      {selectedProvider && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center justify-end">
            <div 
              className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-medium"
              style={{ backgroundColor: selectedProvider.profileColor || "#30b5b2" }}
            >
              {getInitials(selectedProvider.name)}
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={label || "Select Reading Provider"}
      >
        <div className="h-[60vh] overflow-y-auto pr-4 pl-4">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-300">Loading Providers...</p>
          ) : (
            <>
              {/* Clear selection option */}
              <div
                className="flex items-center gap-4 p-3 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={handleClear}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 dark:bg-gray-100">
                  <span className="text-white dark:text-gray-500 text-sm">—</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">Select None</p>
                  <p className="text-[13px] text-gray-500 dark:text-gray-300">Clear selection</p>
                </div>
                {selectedProviderId === null && (
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                )}
              </div>
              
              {allProviders.map((provider) => (
                <div
                  key={provider._id}
                  className="flex items-center gap-4 p-3 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleProviderSelect(provider._id)}
                >
                  <div 
                    className="w-10 h-10 flex items-center justify-center rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: provider.profileColor || "#30b5b2" }}
                  >
                    {getInitials(provider.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-white truncate">Dr. {provider.name}</p>
                    <p className="text-[13px] text-gray-500 dark:text-gray-300 truncate">Reading Provider</p>
                  </div>
                  {selectedProviderId === provider._id && (
                    <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        
        <div className="flex justify-end gap-4 pt-4 pr-4 border-t border-gray-200 dark:border-gray-600">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            CANCEL
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectProvider;