import React, { useContext, useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import moment from "moment";
import toast from "react-hot-toast";
import { HiMiniPlus } from "react-icons/hi2";
import { LuTrash2 } from "react-icons/lu";

const FloorWhiteboard = () => {
  const { user } = useContext(UserContext);
  const [whiteboardData, setWhiteboardData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const getWhiteboardData = async () => {
    try {
    } catch (error) {
      console.error("Error fetching whiteboard data:", error);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
    } catch (error) {
      console.error("Error updating whiteboard:", error);
      toast.error("Failed to update whiteboard");
    } finally {
      setLoading(false);
    }
  };

  const handleEditModeToggle = () => {
    if (isEditMode && !loading) {
      getWhiteboardData();
    }
    setIsEditMode(!isEditMode);
  };

  useEffect(() => {
    getWhiteboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Floor Whiteboard">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4 mb-4">
          <div className="form-card col-span-3">
            <div className="flex md:flex-row md:items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-xl font-medium text-gray-700">Floor Whiteboard</h2>
              </div>
              
              <div className="flex items-center gap-3">
                {isEditMode && (
                  <button 
                    className="card-btn-fill"
                    onClick={handleSaveChanges}
                    disabled={loading}
                  >
                    {loading ? "Saving" : "Save Changes"}
                  </button>
                )}
                <button 
                  className="card-btn"
                  onClick={handleEditModeToggle}
                  disabled={loading}
                >
                  {isEditMode ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            <div className="whiteboard-card">
              <p className="text-xs font-medium text-gray-700">
                Whiteboard Last Updated
              </p>
              <p className="text-xs text-gray-400 truncate">
                {whiteboardData?.updatedAt ? moment(whiteboardData.updatedAt).format("dddd Do MMM YYYY [at] h:mm A") : "Never Updated"} 
                {whiteboardData?.lastUpdatedBy && ` by ${whiteboardData.lastUpdatedBy.name}`}
              </p>
            </div>


            <div className="grid grid-cols-4 md:grid-cols-4 gap-5 mt-5">
              {/* Skin Checks Section */}
              <div className="whiteboard-card col-span-2">
                <div>

                  <div className="flex justify-between items-center">
                    <h2 className="text-base md:text-lg font-medium text-gray-700 mb-1">Skin Checks</h2>
                    {isEditMode ? (
                    <button className="flex items-center text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-0.5 py-0.5 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap"
                      onClick={() => {
                    }}>
                      <HiMiniPlus className="text-lg" />
                    </button>
                    ) : (
                        <p></p>
                      )}
                  </div>


                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">

                      <p>6820</p>
                      {isEditMode ? (
                        <button
                          className="trashcan-btn"
                        >
                          <LuTrash2 className="text-base" />
                        </button>
                      ) : (
                        <input
                          type="checkbox"
                          className="checkbox"
                        />
                      )}
                    </div>

                  </div>
                </div>
              </div>



              {/* Orders Section */}
              <div className="whiteboard-card col-span-2">
                <div>

                  <div className="flex justify-between items-center">
                    <h2 className="text-base md:text-lg font-medium text-gray-700 mb-1">Orders</h2>
                    {isEditMode ? (
                    <button className="flex items-center text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-0.5 py-0.5 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap"
                      onClick={() => {
                    }}>
                      <HiMiniPlus className="text-lg" />
                    </button>
                    ) : (
                        <p></p>
                      )}
                  </div>


                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">

                      <p>6820</p>
                      {isEditMode ? (
                        <button
                          className="trashcan-btn"
                        >
                          <LuTrash2 className="text-base" />
                        </button>
                      ) : (
                        <input
                          type="checkbox"
                          className="checkbox"
                        />
                      )}
                    </div>

                  </div>
                </div>
              </div>



              {/* HV/Photic Section */}
              <div className="whiteboard-card col-span-2">
                <div>

                  <div className="flex justify-between items-center">
                    <h2 className="text-base md:text-lg font-medium text-gray-700 mb-1">HV/Photic</h2>
                    {isEditMode ? (
                    <button className="flex items-center text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-0.5 py-0.5 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap"
                      onClick={() => {
                    }}>
                      <HiMiniPlus className="text-lg" />
                    </button>
                    ) : (
                        <p></p>
                      )}
                  </div>


                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">

                      <p>6820</p>
                      {isEditMode ? (
                        <button
                          className="trashcan-btn"
                        >
                          <LuTrash2 className="text-base" />
                        </button>
                      ) : (
                        <input
                          type="checkbox"
                          className="checkbox"
                        />
                      )}
                    </div>

                  </div>
                </div>
              </div>



              {/* Discontinue Section */}
              <div className="whiteboard-card col-span-2">
                <div>

                  <div className="flex justify-between items-center">
                    <h2 className="text-base md:text-lg font-medium text-gray-700 mb-1">DCs</h2>
                    {isEditMode ? (
                    <button className="flex items-center text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-0.5 py-0.5 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap"
                      onClick={() => {
                    }}>
                      <HiMiniPlus className="text-lg" />
                    </button>
                    ) : (
                        <p></p>
                      )}
                  </div>


                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">

                      <p>6820</p>
                      {isEditMode ? (
                        <button
                          className="trashcan-btn"
                        >
                          <LuTrash2 className="text-base" />
                        </button>
                      ) : (
                        <input
                          type="checkbox"
                          className="checkbox"
                        />
                      )}
                    </div>

                  </div>
                </div>
              </div>



              {/* Transfers Section */}
              <div className="whiteboard-card col-span-2">
                <div>

                  <div className="flex justify-between items-center">
                    <h2 className="text-base md:text-lg font-medium text-gray-700 mb-1">Transfers</h2>
                    {isEditMode ? (
                    <button className="flex items-center text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-0.5 py-0.5 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap"
                      onClick={() => {
                    }}>
                      <HiMiniPlus className="text-lg" />
                    </button>
                    ) : (
                        <p></p>
                      )}
                  </div>


                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">

                      <p>6820</p>
                      {isEditMode ? (
                        <button
                          className="trashcan-btn"
                        >
                          <LuTrash2 className="text-base" />
                        </button>
                      ) : (
                        <input
                          type="checkbox"
                          className="checkbox"
                        />
                      )}
                    </div>

                  </div>
                </div>
              </div>



              {/* Rehooks Section */}
              <div className="whiteboard-card col-span-2">
                <div>

                  <div className="flex justify-between items-center">
                    <h2 className="text-base md:text-lg font-medium text-gray-700 mb-1">Rehooks</h2>
                    {isEditMode ? (
                    <button className="flex items-center text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-0.5 py-0.5 rounded-lg border border-gray-200/50 cursor-pointer whitespace-nowrap"
                      onClick={() => {
                    }}>
                      <HiMiniPlus className="text-lg" />
                    </button>
                    ) : (
                        <p></p>
                      )}
                  </div>


                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">

                      <p>6820</p>
                      {isEditMode ? (
                        <button
                          className="trashcan-btn"
                        >
                          <LuTrash2 className="text-base" />
                        </button>
                      ) : (
                        <input
                          type="checkbox"
                          className="checkbox"
                        />
                      )}
                    </div>

                  </div>
                </div>
              </div>


            </div>
                  

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FloorWhiteboard;