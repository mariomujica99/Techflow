import React, { useState } from "react";
import { LuTrash2, LuPlus } from "react-icons/lu";
import { getInitials } from "../../utils/getInitials";
import Modal from "../Modal";
import DeleteAlert from "../DeleteAlert";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ProviderCard = ({ 
  providerInfo, 
  isEditMode, 
  isAddCard = false,
  onProviderDeleted,
  onProviderUpdated,
  onProviderCreated 
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: providerInfo?.name || '',
    profileColor: providerInfo?.profileColor || '#30b5b2'
  });

  const colors = [
    '#30b5b2', '#8D51FF', '#FF6B6B', '#4ECDC4', 
    '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'
  ];

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Provider name is required");
      return;
    }

    try {
      let response;
      if (isAddCard) {
        response = await axiosInstance.post(API_PATHS.PROVIDERS.CREATE_PROVIDER, formData);
        toast.success("Provider created successfully");
        onProviderCreated(response.data.provider);
        setFormData({ name: '', profileColor: '#30b5b2' });
      } else {
        response = await axiosInstance.put(
          API_PATHS.PROVIDERS.UPDATE_PROVIDER(providerInfo._id), 
          formData
        );
        toast.success("Provider updated successfully");
        onProviderUpdated(response.data.provider);
      }
    } catch (error) {
      console.error("Error saving provider:", error);
      toast.error(error.response?.data?.message || "Failed to save provider");
    }
  };

  const deleteProvider = async () => {
    try {
      await axiosInstance.delete(API_PATHS.PROVIDERS.DELETE_PROVIDER(providerInfo._id));
      setOpenDeleteAlert(false);
      toast.success("Provider deleted successfully");
      onProviderDeleted(providerInfo._id);
    } catch (error) {
      console.error("Error deleting provider:", error);
      toast.error("Failed to delete provider");
    }
  };

  if (isAddCard) {
    return (
      <div className="provider-card p-4 bg-white rounded-lg">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Provider Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-2 placeholder:text-gray-500"
          />

          <div>
            <label className="text-xs text-gray-500 block mb-2">Background Color</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                    formData.profileColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, profileColor: color }))}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/80 cursor-pointer"
          >
            <LuPlus className="text-sm" />
            Add Provider
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-card p-4 bg-white rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className="w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold text-base flex-shrink-0"
            style={{ backgroundColor: formData.profileColor }}
          >
            {getInitials(formData.name || providerInfo?.name)}
          </div>
          <div className="truncate min-w-0">
            {isEditMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-2 placeholder:text-gray-500"
              />
            ) : (
              <p className="text-sm font-medium truncate">Dr. {providerInfo?.name}</p>
            )}
          </div>
        </div>

        {isEditMode && (
          <button
            className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded-full px-2 py-2 border border-rose-100 hover:border-rose-300 cursor-pointer"
            onClick={() => setOpenDeleteAlert(true)}
          >
            <LuTrash2 className="text-base" />
          </button>
        )}
      </div>

      {isEditMode && (
        <div>
          <label className="text-xs text-gray-500 block mb-2 mt-3">Background Color</label>
          <div className="flex gap-2 mb-4">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                  formData.profileColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setFormData(prev => ({ ...prev, profileColor: color }))}
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/80 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      )}

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Provider"
      >
        <DeleteAlert
          content="Are you sure you want to delete this EEG reading provider? This action cannot be undone."
          onDelete={deleteProvider}
        />
      </Modal>
    </div>
  );
};

export default ProviderCard;