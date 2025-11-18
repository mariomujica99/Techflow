import React, { useContext, useEffect, useState, useRef } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuChevronDown, LuFileSpreadsheet } from "react-icons/lu";
import ComStationCard from "../../components/Cards/ComStationCard";
import { COM_STATIONS_DROPDOWN_OPTIONS } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LiaEdit } from "react-icons/lia";

const ComStations = () => {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Computer Stations");
  const [isEditMode, setIsEditMode] = useState(false);
  const [allComStations, setAllComStations] = useState([]);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelectedFilter(option);
    setIsOpen(false);
  };

  const handleComStationDeleted = (deletedComStationId) => {
    setAllComStations(prev => prev.filter(station => station._id !== deletedComStationId));
  };

  const handleComStationUpdated = (updatedComStation) => {
    setAllComStations(prev => prev.map(station => 
      station._id === updatedComStation._id ? updatedComStation : station
    ));
  };

  const handleComStationCreated = (newComStation) => {
    setAllComStations(prev => [...prev, newComStation]);
  };

  const handleManageComStations = () => {
    if (isEditMode) {
      getAllComStations(); // Refresh data when exiting edit mode
    }
    setIsEditMode(!isEditMode);
  };

  const getAllComStations = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.COM_STATION.GET_ALL_COM_STATIONS, {
        params: { type: selectedFilter }
      });
      setAllComStations(response.data || []);
    } catch (error) {
      console.error("Error fetching computer stations:", error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_COM_STATIONS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "computer_stations.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading computer stations.", error);
      toast.error("Failed to download computer stations. Please try again.");
    }
  };

  const getTotalCount = () => {
    return allComStations.length;
  };

  const getActiveCount = () => {
    return allComStations.filter(station => station.comStationStatus === 'Active').length;
  };

  const getInactiveCount = () => {
    return allComStations.filter(station => station.comStationStatus === 'Inactive').length;
  };

  const getHeaderText = () => {
    const activeCount = getActiveCount();
    switch (selectedFilter) {
      case "All Inactive Stations":
        return `All Inactive`;   
      case "EMU Station":
        return `EMU Stations`;
      case "EEG Cart - All":
        return `Carts (All)`;
      case "EEG Cart - Inpatient":
        return `Carts (IP)`;
      case "EEG Cart - Outpatient":
        return `Carts (OP)`;
      case "EEG Cart - Bellevue":
        return `Carts (BMC)`;
      default:
        return `All Stations`;
    }
  };

  useEffect(() => {
    if (isEditMode) {
      // Reset any form states when entering edit mode
    }
  }, [isEditMode]);

  useEffect(() => {
    getAllComStations();
  }, [selectedFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <DashboardLayout activeMenu="Computer Stations">
      <div className="mt-5 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-xl md:text-xl text-gray-500 font-bold">{getHeaderText()}</h2>
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full w-fit">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-500">
                  {getTotalCount()}
                </span>
              </div>          
              <span className="text-sm text-gray-500 font-semibold">
                Total
              </span>              
              <div className="flex items-center gap-2">
                <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-primary">
                  {getActiveCount()}
                </span>
              </div>          
              <span className="text-sm text-primary font-semibold">
                Active
              </span>
              <div className="flex items-center gap-2">
                <div className="ml-2 w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-rose-400">
                  {getInactiveCount()}
                </span>
              </div>
              <span className="text-sm text-rose-400 font-semibold">
                Inactive
              </span>                           
            </div>
          </div>

          {user?.role === 'admin' && (
            <button className="flex flex-shrink-0 download-btn w-fit" onClick={handleDownloadReport}>
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          )}
        </div>

        <div className="flex md:flex-row md:items-center justify-between mt-3">
          <div className="relative w-64" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-3 py-2 rounded-md flex justify-between items-center cursor-pointer"
            >
              {COM_STATIONS_DROPDOWN_OPTIONS.find(option => option.value === selectedFilter)?.label || selectedFilter}
              <LuChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        
            {isOpen && (
              <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
                {COM_STATIONS_DROPDOWN_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button className="edit-btn" onClick={handleManageComStations}>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {allComStations?.map((comStation) => (
            <ComStationCard 
              key={comStation._id}
              comStationInfo={comStation}
              isEditMode={isEditMode}
              onComStationDeleted={handleComStationDeleted}
              onComStationUpdated={handleComStationUpdated}
              userRole={user?.role}
            />
          ))}
          
          {isEditMode && user?.role === 'admin' && (
            <ComStationCard 
              isAddCard={true}
              onComStationCreated={handleComStationCreated}
              userRole={user?.role}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComStations;