import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import moment from "moment";
import toast from "react-hot-toast";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuFileSpreadsheet } from "react-icons/lu";
import Modal from "../../components/Modal";
import SelectSupplies from "../../components/Inputs/SelectSupplies";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LiaEdit } from "react-icons/lia";
import { MdChecklistRtl } from "react-icons/md";

const STORAGE_ROOMS = [
  "Department",
  "Outpatient Rooms",
  "2nd Floor Storage",
  "6th Floor Storage",
  "8th Floor Storage",
];

const Supplies = () => {
  const { user } = useContext(UserContext);
  const [suppliesData, setSuppliesData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [lastUpdatedBy, setLastUpdatedBy] = useState(null);

  const [currentStorageRoom, setCurrentStorageRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempItems, setTempItems] = useState([]);

  const getSuppliesData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SUPPLIES.GET_ALL_SUPPLIES);
      const supplies = response.data || [];

      // Organize by storage room
      const organized = {};
      supplies.forEach((supply) => {
        organized[supply.storageRoom] = {
          items: supply.items || [],
          updatedAt: supply.updatedAt,
          lastUpdatedBy: supply.lastUpdatedBy,
        };
      });

      setSuppliesData(organized);

      // Find most recent update
      const mostRecent = supplies.reduce((latest, supply) =>
        (!latest || new Date(supply.updatedAt) > new Date(latest))
          ? supply.updatedAt
          : latest,
        null
      );
      setLastUpdated(mostRecent);

      // Get last updated by name
      if (supplies.length > 0) {
        const recentSupply = supplies.find(s => s.updatedAt === mostRecent);
        setLastUpdatedBy(recentSupply?.lastUpdatedBy?.name || null);
      }
    } catch (error) {
      console.error("Error fetching supplies data:", error);
    }
  };

  const handleOpenModal = (storageRoom) => {
    setCurrentStorageRoom(storageRoom);
    setTempItems(suppliesData[storageRoom]?.items || []);
    setIsModalOpen(true);
  };

  const handleSaveItems = async (items) => {
    try {
      await axiosInstance.put(
        API_PATHS.SUPPLIES.UPDATE_SUPPLIES(currentStorageRoom),
        { items }
      );

      setIsModalOpen(false);
      toast.success("Supplies updated successfully");
      getSuppliesData();
    } catch (error) {
      console.error("Error updating supplies:", error);
      toast.error("Failed to update supplies");
    }
  };

  const handleDeleteItem = async (storageroom, itemToDelete) => {
    try {
      const currentItems = suppliesData[storageroom]?.items || [];
      const updatedItems = currentItems.filter((item) => item !== itemToDelete);

      await axiosInstance.put(
        API_PATHS.SUPPLIES.UPDATE_SUPPLIES(storageroom),
        { items: updatedItems }
      );

      toast.success("Supply item deleted successfully");
      getSuppliesData();
    } catch (error) {
      console.error("Error deleting supply item:", error);
      toast.error("Failed to delete supply item");
    }
  };

  const handleCheckItem = async (storageroom, itemToCheck) => {
    try {
      const currentItems = suppliesData[storageroom]?.items || [];
      const updatedItems = currentItems.filter((item) => item !== itemToCheck);

      await axiosInstance.put(
        API_PATHS.SUPPLIES.UPDATE_SUPPLIES(storageroom),
        { items: updatedItems }
      );

      // Brief visual feedback
      toast.success("Supply item checked off");
      getSuppliesData();
    } catch (error) {
      console.error("Error checking supply item:", error);
      toast.error("Failed to check off supply item");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_SUPPLIES, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "needed_supplies.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report. Please try again.");
    }
  };

  const handleEditModeToggle = () => {
    if (isEditMode && !loading) {
      getSuppliesData();
    }
    setIsEditMode(!isEditMode);
  };

  const handleCheckAll = async (storageRoom) => {
    try {
      await axiosInstance.put(
        API_PATHS.SUPPLIES.UPDATE_SUPPLIES(storageRoom),
        { items: [] }
      );

      toast.success("All supplies checked successfully");
      getSuppliesData();
    } catch (error) {
      console.error("Error checking supplies:", error);
      toast.error("Failed to check supplies");
    }
  };

  useEffect(() => {
    getSuppliesData();
  }, []);

  return (
    <DashboardLayout activeMenu="Needed Supplies">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4 mb-4">
          <div className="form-card col-span-3">
            <div className="flex md:flex-row  justify-between mb-2">
              <div>
                <h2 className="text-xl md:text-xl font-medium text-gray-700">Needed Supplies</h2>

                <h1 className="text-base md:text-lg text-gray-400">Neurophysiology Department</h1>
              </div>

              <div>
                <button 
                  className="edit-btn flex items-center gap-2"
                  onClick={handleEditModeToggle}
                  disabled={loading}
                >
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
            </div>

            {user?.role === "admin" && (
              <div className="flex items-center gap-3 mb-3">
                <button
                  className="flex download-btn"
                  onClick={handleDownloadReport}
                >
                  <LuFileSpreadsheet className="text-lg" />
                  Download Report
                </button>              
              </div>
            )}

            <div className="whiteboard-card">
              <p className="text-sm md:text-base text-gray-700 font-medium">
                {moment().format("dddd Do MMMM YYYY")}
              </p>

              <p className="text-xs font-medium text-gray-400">Supply Lists Last Updated</p>
              <p className="text-xs text-gray-400 truncate">
                {lastUpdated
                  ? `${moment(lastUpdated).format("dddd Do MMM YYYY [at] h:mm A")}${
                      lastUpdatedBy ? ` by ${lastUpdatedBy}` : ""
                    }`
                  : "Never Updated"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 mb-5 mt-5">
              {STORAGE_ROOMS.map((storageRoom) => (
                <StorageRoomSection
                  key={storageRoom}
                  title={storageRoom}
                  items={suppliesData[storageRoom]?.items || []}
                  isEditMode={isEditMode}
                  onAddClick={() => handleOpenModal(storageRoom)}
                  onDeleteItem={(item) => handleDeleteItem(storageRoom, item)}
                  onCheckItem={(item) => handleCheckItem(storageRoom, item)}
                  onCheckAll={() => handleCheckAll(storageRoom)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add Supplies For ${currentStorageRoom}`}
      >
        <SelectSupplies
          selectedItems={tempItems}
          onItemsChange={(items) => {
            handleSaveItems(items);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
};

const StorageRoomSection = ({
  title,
  items,
  isEditMode,
  onAddClick,
  onDeleteItem,
  onCheckItem,
  onCheckAll,
}) => {
  return (
    <div className="whiteboard-card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base md:text-lg font-medium text-gray-700">
          {title}
        </h2>
        {isEditMode ? (
          <button
            className="flex items-center text-[12px] gap-1 font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 pl-3 pr-2 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
            onClick={onAddClick}
          >
            Add <HiMiniPlus className="text-base md:text-lg" />
          </button>
        ) : (
          items.length > 0 && (
            <button
              className="flex items-center text-[12px] gap-1 font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
              onClick={onCheckAll}
            >
              Check All <MdChecklistRtl className="text-sm md:text-base" />
            </button>
          )
        )}
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item}
              className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
            >
              <span className="text-xs md:text-sm text-gray-700">{item}</span>

              {isEditMode ? (
                <HiOutlineTrash
                  className="text-red-500 hover:text-red-300 cursor-pointer flex-shrink-0"
                  onClick={() => onDeleteItem(item)}
                />
              ) : (
                <input
                  type="checkbox"
                  checked={false}
                  onChange={(e) => {
                    e.preventDefault();
                    onCheckItem(item);
                  }}
                  className="w-4 h-4 accent-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer flex-shrink-0"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-xs md:text-sm text-gray-400">No supplies needed</p>
        )}
      </div>
    </div>
  );
};

export default Supplies;