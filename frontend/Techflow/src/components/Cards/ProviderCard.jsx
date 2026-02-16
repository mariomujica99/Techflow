import React, { useState } from "react";
import { LuTrash2, LuPlus } from "react-icons/lu";
import { FaPhone, FaPager } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { formatPhoneNumber, displayPhoneNumber, isPhoneNumber } from "../../utils/phoneFormatter";
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
  onProviderCreated,
  isDemoAccount = false
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: providerInfo?.name || '',
    profileColor: providerInfo?.profileColor || '#30b5b2',
    email: providerInfo?.email || '',
    phoneNumber: providerInfo?.phoneNumber || '',
    pagerNumber: providerInfo?.pagerNumber || '',
  });

  const colors = [
    '#30b5b2', '#8D51FF', '#FF6B6B', '#4ECDC4', 
    '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'
  ];

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phoneNumber: formatted }));
  };

  const handlePagerChange = (value) => {
    // Check if it's a phone number or text
    if (isPhoneNumber(value)) {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, pagerNumber: formatted }));
    } else {
      // Allow text input (e.g., "Perfect Serve")
      setFormData(prev => ({ ...prev, pagerNumber: value }));
    }
  };

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
        setFormData({ 
          name: '', 
          profileColor: '#30b5b2',
          email: '',
          phoneNumber: '',
          pagerNumber: '',
        });
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
      <div className="bg-white p-4 rounded-xl shadow-md shadow-gray-100 border border-gray-200/50">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Provider Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-2 placeholder:text-gray-500"
          />

          <input
            type="email"
            placeholder="Enter Email (Optional)"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-2 placeholder:text-gray-500"
          />

          <input
            type="text"
            placeholder="(123) 456-7890"
            value={formData.phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            maxLength={14}
            className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-2 placeholder:text-gray-500"
          />

          <input
            type="text"
            placeholder="(123) 456-7890 or text"
            value={formData.pagerNumber}
            onChange={(e) => handlePagerChange(e.target.value)}
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
    <div className={`bg-white p-4 rounded-xl shadow-md shadow-gray-100 border border-gray-200/50 ${!isEditMode ? 'flex items-center' : ''}`}>
      <div className="flex items-center justify-between gap-2">
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
                className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-1 placeholder:text-gray-500"
              />
            ) : (
              <>
                <p className="text-sm font-bold text-gray-500 truncate">Dr. {providerInfo?.name}</p>
                {providerInfo?.email && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MdEmail className="text-xs" />
                    <span className="truncate">{providerInfo.email}</span>
                  </div>
                )}
                {providerInfo?.phoneNumber && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <FaPhone className="text-xs" />
                    <span>{displayPhoneNumber(providerInfo.phoneNumber)}</span>
                  </div>
                )}
                {providerInfo?.pagerNumber && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <FaPager className="text-xs" />
                    <span>{providerInfo.pagerNumber}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {isEditMode && (
          <button
            className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded-full px-2 py-2 border border-rose-100 hover:border-rose-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setOpenDeleteAlert(true)}
            disabled={isDemoAccount}
          >
            <LuTrash2 className="text-base" />
          </button>
        )}
      </div>

      {isEditMode && (
        <div className="space-y-3 mt-2">
          <input
            type="email"
            placeholder="Enter Email (Optional)"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-2 placeholder:text-gray-500"
          />

          <input
            type="text"
            placeholder="(123) 456-7890"
            value={formData.phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            maxLength={14}
            className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-2 placeholder:text-gray-500"
          />

          <input
            type="text"
            placeholder="(123) 456-7890 or text"
            value={formData.pagerNumber}
            onChange={(e) => handlePagerChange(e.target.value)}
            className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-2 placeholder:text-gray-500"
          />

          <div>
            <label className="text-xs text-gray-500 block mb-2">Background Color</label>
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