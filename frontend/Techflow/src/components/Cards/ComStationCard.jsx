import React, { useState, useEffect, useRef } from "react";
import { LuTrash2, LuPlus, LuChevronDown } from "react-icons/lu";
import { FaComputer } from "react-icons/fa6";
import Modal from "../Modal";
import DeleteAlert from "../DeleteAlert";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ComStationCard = ({ 
  comStationInfo, 
  isEditMode, 
  isAddCard = false,
  onComStationDeleted,
  onComStationUpdated,
  onComStationCreated,
  userRole,
  isDemoAccount = false
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // For each dropdown
  const typeDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  
  // Form states for add/edit
  const [formData, setFormData] = useState({
    comStation: comStationInfo?.comStation || '',
    comStationType: comStationInfo?.comStationType || 'EEG Cart',
    comStationLocation: comStationInfo?.comStationLocation || 'Inpatient',
    comStationStatus: comStationInfo?.comStationStatus || 'Active',
    issueDescription: comStationInfo?.issueDescription || '',
    hasTicket: comStationInfo?.hasTicket || false,
    ticketNumber: comStationInfo?.ticketNumber || ''
  });

  const [dropdownStates, setDropdownStates] = useState({
    type: false,
    location: false
  });

  const typeOptions = ['EMU Station', 'EEG Cart'];
  const locationOptions = ['Inpatient', 'Outpatient', 'Bellevue'];

  // Handle dropdown selection
  const handleDropdownSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDropdownStates(prev => ({ ...prev, [field.replace('comStation', '').toLowerCase()]: false }));
  };

  // Handle status toggle
  const handleStatusToggle = () => {
    const newStatus = formData.comStationStatus === 'Active' ? 'Inactive' : 'Active';
    setFormData(prev => ({ 
      ...prev, 
      comStationStatus: newStatus,
      // Clear issue fields when switching to Active
      issueDescription: newStatus === 'Active' ? '' : prev.issueDescription,
      hasTicket: newStatus === 'Active' ? false : prev.hasTicket,
      ticketNumber: newStatus === 'Active' ? '' : prev.ticketNumber
    }));
  };

  // Handle ticket toggle
  const handleTicketToggle = () => {
    setFormData(prev => ({
      ...prev,
      hasTicket: !prev.hasTicket,
      // Clear ticket number when toggling off
      ticketNumber: !prev.hasTicket ? prev.ticketNumber : ''
    }));
  };

  // Handle form submission for add/edit
  const handleSubmit = async () => {
    if (!formData.comStation.trim()) {
      toast.error("Computer station name is required");
      return;
    }

    try {
      let response;
      if (isAddCard) {
        response = await axiosInstance.post(API_PATHS.COM_STATION.CREATE_COM_STATION, formData);
        toast.success("Computer station created successfully");
        onComStationCreated(response.data.comStation);
        setFormData({
          comStation: '',
          comStationType: 'EEG Cart',
          comStationLocation: 'Inpatient',
          comStationStatus: 'Active',
          issueDescription: '',
          hasTicket: false,
          ticketNumber: ''
        });
      } else {
        response = await axiosInstance.put(
          API_PATHS.COM_STATION.UPDATE_COM_STATION(comStationInfo._id), 
          {
            comStationType: formData.comStationType,
            comStationLocation: formData.comStationLocation,
            comStationStatus: formData.comStationStatus,
            issueDescription: formData.issueDescription,
            hasTicket: formData.hasTicket,
            ticketNumber: formData.ticketNumber
          }
        );
        toast.success("Computer station updated successfully");
        onComStationUpdated(response.data.comStation);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving computer station:", error);
      toast.error(error.response?.data?.message || "Failed to save computer station");
    }
  };

  // Handle delete
  const deleteComStation = async () => {
    try {
      await axiosInstance.delete(API_PATHS.COM_STATION.DELETE_COM_STATION(comStationInfo._id));
      setOpenDeleteAlert(false);
      toast.success("Computer station deleted successfully");
      onComStationDeleted(comStationInfo._id);
    } catch (error) {
      console.error("Error deleting computer station:", error);
      toast.error("Failed to delete computer station");
    }
  };

  // Get status indicator color
  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-500' : 'bg-red-500';
  };

  // Click-outside dropdown handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setDropdownStates(prev => ({ ...prev, type: false }));
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setDropdownStates(prev => ({ ...prev, location: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAddCard) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md shadow-gray-100 border border-gray-200/50">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <FaComputer className="text-gray-400 text-xl flex-shrink-0" />
            <input
              type="text"
              placeholder="Enter Station Title"
              value={formData.comStation}
              onChange={(e) => setFormData(prev => ({ ...prev, comStation: e.target.value }))}
              className="w-full text-sm text-black outline-none bg-white border border-slate-100 rounded-md px-2 py-1 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Type</label>
              <div className="relative">
                <button
                  onClick={() => setDropdownStates(prev => ({ ...prev, type: !prev.type }))}
                  className="w-full text-sm bg-white border border-slate-100 rounded-md px-2 py-1 flex justify-between items-center cursor-pointer"
                >
                  {formData.comStationType}
                  <LuChevronDown className={`transition-transform ${dropdownStates.type ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownStates.type && (
                  <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
                    {typeOptions.map(option => (
                      <div
                        key={option}
                        onClick={() => handleDropdownSelect('comStationType', option)}
                        className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Location</label>
              <div className="relative">
                <button
                  onClick={() => setDropdownStates(prev => ({ ...prev, location: !prev.location }))}
                  className="w-full text-sm bg-white border border-slate-100 rounded-md px-2 py-1 flex justify-between items-center cursor-pointer"
                >
                  {formData.comStationLocation}
                  <LuChevronDown className={`transition-transform ${dropdownStates.location ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownStates.location && (
                  <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
                    {locationOptions.map(option => (
                      <div
                        key={option}
                        onClick={() => handleDropdownSelect('comStationLocation', option)}
                        className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Status</label>
              <button
                onClick={handleStatusToggle}
                className={`w-full text-sm font-medium px-3 py-2 rounded-md flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  formData.comStationStatus === 'Active'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${getStatusColor(formData.comStationStatus)}`}></div>
                {formData.comStationStatus}
              </button>
            </div>

            {formData.comStationStatus === 'Inactive' && (
              <>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Issue</label>
                  <textarea
                    placeholder="Describe the current issue"
                    value={formData.issueDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
                    className="w-full text-xs bg-white border border-slate-100 rounded-md px-2 py-2 h-16 resize-none focus:outline-none placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500">Ticket Placed</label>
                    <button
                      onClick={handleTicketToggle}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        formData.hasTicket ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          formData.hasTicket ? 'transform translate-x-5' : ''
                        }`}
                      ></div>
                    </button>
                  </div>

                  {formData.hasTicket && (
                    <input
                      type="text"
                      placeholder="Enter ticket number (optional)"
                      value={formData.ticketNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, ticketNumber: e.target.value }))}
                      className="w-full text-xs bg-white border border-slate-100 rounded-md px-2 py-2 focus:outline-none placeholder:text-gray-500"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/80 cursor-pointer"
          >
            <LuPlus className="text-sm" />
            Add Station
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md shadow-gray-100 border border-gray-200/50">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <FaComputer className="text-gray-700 text-xl" />
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(comStationInfo?.comStationStatus)} rounded-full border-2 border-white`}></div>
          </div>
          <div>
            <p className="text-sm font-medium">{comStationInfo?.comStation}</p>
            <p className="text-xs text-gray-500">{comStationInfo?.comStationStatus}</p>
          </div>
        </div>

        {isEditMode && userRole === 'admin' && (
          <button
            className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded-full px-2 py-2 border border-rose-100 hover:border-rose-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setOpenDeleteAlert(true)}
            disabled={isDemoAccount}
          >
            <LuTrash2 className="text-base" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Type</label>
          {isEditMode ? (
            <div className="relative" ref={typeDropdownRef}>
              <button
                onClick={() => setDropdownStates(prev => ({ ...prev, type: !prev.type }))}
                className="w-full text-sm bg-white border border-slate-100 rounded-md px-2 py-1 flex justify-between items-center cursor-pointer"
              >
                {formData.comStationType}
                <LuChevronDown className={`transition-transform ${dropdownStates.type ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownStates.type && (
                <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
                  {typeOptions.map(option => (
                    <div
                      key={option}
                      onClick={() => handleDropdownSelect('comStationType', option)}
                      className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-700">{comStationInfo?.comStationType}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Location</label>
          {isEditMode ? (
            <div className="relative" ref={locationDropdownRef}>
              <button
                onClick={() => setDropdownStates(prev => ({ ...prev, location: !prev.location }))}
                className="w-full text-sm bg-white border border-slate-100 rounded-md px-2 py-1 flex justify-between items-center cursor-pointer"
              >
                {formData.comStationLocation}
                <LuChevronDown className={`transition-transform ${dropdownStates.location ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownStates.location && (
                <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
                  {locationOptions.map(option => (
                    <div
                      key={option}
                      onClick={() => handleDropdownSelect('comStationLocation', option)}
                      className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-700">{comStationInfo?.comStationLocation}</p>
          )}
        </div>

        {isEditMode && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">Status</label>
            <button
              onClick={handleStatusToggle}
              className={`w-full text-sm font-medium px-3 py-2 rounded-md flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                formData.comStationStatus === 'Active'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${getStatusColor(formData.comStationStatus)}`}></div>
              {formData.comStationStatus}
            </button>
          </div>
        )}

        {(comStationInfo?.comStationStatus === 'Inactive' || formData.comStationStatus === 'Inactive') && (
          <>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Issue</label>
              {isEditMode ? (
                <textarea
                  placeholder="Describe the current issue"
                  value={formData.issueDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
                  className="w-full text-xs bg-white border border-slate-100 rounded-md px-2 py-2 h-16 resize-none focus:outline-none placeholder:text-gray-500"          
                />
              ) : (
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  {comStationInfo?.issueDescription || 'No issue provided'}
                </p>
              )}
            </div>

            {isEditMode && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500">Ticket Placed</label>
                  <button
                    onClick={handleTicketToggle}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      formData.hasTicket ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData.hasTicket ? 'transform translate-x-5' : ''
                      }`}
                    ></div>
                  </button>
                </div>

                {formData.hasTicket && (
                  <input
                    type="text"
                    placeholder="Enter ticket number (optional)"
                    value={formData.ticketNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, ticketNumber: e.target.value }))}
                    className="w-full text-xs bg-white border border-slate-100 rounded-md px-2 py-2 focus:outline-none placeholder:text-gray-500"
                  />
                )}
              </div>
            )}

            {!isEditMode && comStationInfo?.hasTicket && comStationInfo?.ticketNumber && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">Ticket Number</label>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  {comStationInfo?.ticketNumber}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {isEditMode && !isAddCard && (
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isDemoAccount}
        >
          Save Changes
        </button>
      )}

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Computer Station"
      >
        <DeleteAlert
          content="Are you sure you want to delete this computer station? This action cannot be undone."
          onDelete={deleteComStation}
        />
      </Modal>
    </div>
  );
};

export default ComStationCard;