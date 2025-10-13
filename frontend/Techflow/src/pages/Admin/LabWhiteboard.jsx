import React, { useContext, useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import moment from "moment";
import SelectCoverageUser from "../../components/Inputs/SelectCoverageUser";
import SelectProvider from "../../components/Inputs/SelectProvider";
import { getInitials } from "../../utils/getInitials";
import toast from "react-hot-toast";
import AddCommentsInput from "../../components/Inputs/AddCommentsInput";

const LabWhiteboard = () => {
  const { user } = useContext(UserContext);
  const [whiteboardData, setWhiteboardData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editData, setEditData] = useState({
    coverage: {
      onCall: [],
      surgCall: [],
      scanning: [],
      surgicals: [],
      wada: [],
    },
    outpatients: {
      op8am1: [],
      op8am2: [],
      op10am: [],
      op12pm: [],
      op2pm: [],
    },
    readingProviders: {
      emu: null,
      ltm: null,
      routine: null,
    },
    comments: [],
  });

  const getWhiteboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.WHITEBOARD.GET_WHITEBOARD);
      setWhiteboardData(response.data);
      
      setEditData({
        coverage: {
          onCall: response.data?.coverage?.onCall?.map(user => user._id) || [],
          surgCall: response.data?.coverage?.surgCall?.map(user => user._id) || [],
          scanning: response.data?.coverage?.scanning?.map(user => user._id) || [],
          surgicals: response.data?.coverage?.surgicals?.map(user => user._id) || [],
          wada: response.data?.coverage?.wada?.map(user => user._id) || [],
        },
        outpatients: {
          op8am1: response.data?.outpatients?.op8am1?.map(user => user._id) || [],
          op8am2: response.data?.outpatients?.op8am2?.map(user => user._id) || [],
          op10am: response.data?.outpatients?.op10am?.map(user => user._id) || [],
          op12pm: response.data?.outpatients?.op12pm?.map(user => user._id) || [],
          op2pm: response.data?.outpatients?.op2pm?.map(user => user._id) || [],
        },
        readingProviders: {
          emu: response.data?.readingProviders?.emu?._id || null,
          ltm: response.data?.readingProviders?.ltm?._id || null,
          routine: response.data?.readingProviders?.routine?._id || null,
        },
        comments: response.data?.comments || [],
      });
    } catch (error) {
      console.error("Error fetching whiteboard data:", error);
    }
  };

  const preloadUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      // This just primes the cache in SelectCoverageUser
    } catch (error) {
      console.error("Error preloading users:", error);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const updatePayload = {
        coverage: editData.coverage,
        outpatients: editData.outpatients,
        readingProviders: editData.readingProviders,
        comments: editData.comments,
      };

      await axiosInstance.put(API_PATHS.WHITEBOARD.UPDATE_WHITEBOARD, updatePayload);
      
      toast.success("Whiteboard updated successfully");
      setIsEditMode(false);
      getWhiteboardData();
    } catch (error) {
      console.error("Error updating whiteboard:", error);
      toast.error("Failed to update whiteboard");
    } finally {
      setLoading(false);
    }
  };

  const handleEditModeToggle = () => {
    if (isEditMode) {
      handleSaveChanges();
    } else {
      setIsEditMode(true);
    }
  };

  const handleClearReadingProviders = () => {
    setEditData(prev => ({
      ...prev,
      readingProviders: {
        emu: null,
        ltm: null,
        routine: null,
      }
    }));
  };

  const handleClearOutpatients = () => {
    setEditData(prev => ({
      ...prev,
      outpatients: {
        op8am1: [],
        op8am2: [],
        op10am: [],
        op12pm: [],
        op2pm: [],
      }
    }));
  };

  const handleClearCoverage = () => {
    setEditData(prev => ({
      ...prev,
      coverage: {
        onCall: [],
        surgCall: [],
        scanning: [],
        surgicals: [],
        wada: [],
      }
    }));
  };

  const renderUserDisplay = (userDataArray) => {
    if (!userDataArray || userDataArray.length === 0) return <span className="text-gray-400">—</span>;
    
    // Sort alphabetically by name
    const sortedUsers = [...userDataArray].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    return (
      <div className="flex items-center gap-1 flex-wrap justify-end">
        {sortedUsers.map((userData, index) => (
          <div key={userData._id || index} className="flex items-center">
            {userData.profileImageUrl ? (
              <img
                src={userData.profileImageUrl}
                alt={userData.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-medium"
                style={{ backgroundColor: userData.profileColor || "#30b5b2" }}
              >
                {getInitials(userData.name)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderProviderDisplay = (providerData) => {
    if (!providerData) return <span className="text-gray-400">—</span>;
    
    const lastName = providerData.name.split(' ').pop();
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Dr. {lastName}</span>
        <div 
          className="w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-medium"
          style={{ backgroundColor: providerData.profileColor || "#30b5b2" }}
        >
          {getInitials(providerData.name)}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWhiteboardData();
    preloadUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Lab Whiteboard">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4 mb-4">
          <div className="form-card col-span-3">
            <div className="flex md:flex-row md:items-center justify-between mb-0.5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-xl font-medium text-gray-700">Lab Whiteboard</h2>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  className="card-btn"
                  onClick={handleEditModeToggle}
                  disabled={loading}
                >
                  {isEditMode ? (loading ? "Saving" : "Done") : "Edit"}
                </button>
              </div>
            </div>

            <h1 className="text-base md:text-lg text-gray-400 mb-2">Neurophysiology Department</h1>

            <div className="whiteboard-card">
              <p className="text-xs font-medium text-gray-700">
                Whiteboard Last Updated
              </p>
              <p className="text-xs text-gray-400 truncate">
                {whiteboardData?.updatedAt ? moment(whiteboardData.updatedAt).format("dddd Do MMM YYYY [at] h:mm A") : "Never Updated"} 
                {whiteboardData?.lastUpdatedBy && ` by ${whiteboardData.lastUpdatedBy.name}`}
              </p>
            </div>
                  
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5 mt-5">
              {/* Reading Providers Section */}
              <div className="whiteboard-card col-span-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base md:text-lg font-medium text-gray-700">Reading Providers</h2>
                    {isEditMode && (
                      <button
                        className="text-xs font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
                        onClick={handleClearReadingProviders}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">
                      <p>EMU</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectProvider
                            selectedProviderId={editData.readingProviders.emu}
                            onProviderSelect={(providerId) => setEditData(prev => ({
                              ...prev,
                              readingProviders: { ...prev.readingProviders, emu: providerId }
                            }))}
                            placeholder="Select"
                          />
                        </div>
                      ) : (
                        renderProviderDisplay(whiteboardData?.readingProviders?.emu)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p>LTM</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectProvider
                            selectedProviderId={editData.readingProviders.ltm}
                            onProviderSelect={(providerId) => setEditData(prev => ({
                              ...prev,
                              readingProviders: { ...prev.readingProviders, ltm: providerId }
                            }))}
                            placeholder="Select"
                          />
                        </div>
                      ) : (
                        renderProviderDisplay(whiteboardData?.readingProviders?.ltm)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p>ROUTINE</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectProvider
                            selectedProviderId={editData.readingProviders.routine}
                            onProviderSelect={(providerId) => setEditData(prev => ({
                              ...prev,
                              readingProviders: { ...prev.readingProviders, routine: providerId }
                            }))}
                            placeholder="Select"
                          />
                        </div>
                      ) : (
                        renderProviderDisplay(whiteboardData?.readingProviders?.routine)
                      )}
                    </div>
                  </div>
                </div>
              </div>



              {/* Outpatients Section */}
              <div className="whiteboard-card col-span-4 md:col-span-2">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base md:text-lg font-medium text-gray-700">Outpatients</h2>
                    {isEditMode && (
                      <button
                        className="text-xs font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
                        onClick={handleClearOutpatients}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">8 AM</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.outpatients.op8am1}
                            setSelectedUsers={(userIds) => {
                              setEditData(prev => ({
                                ...prev,
                                outpatients: { ...prev.outpatients, op8am1: userIds }
                              }));
                            }}
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.outpatients?.op8am1)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">8 AM</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.outpatients.op8am2}
                            setSelectedUsers={(userIds) => {
                              setEditData(prev => ({
                                ...prev,
                                outpatients: { ...prev.outpatients, op8am2: userIds }
                              }));
                            }}
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.outpatients?.op8am2)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">10 AM</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.outpatients.op10am}
                            setSelectedUsers={(userIds) => {
                              setEditData(prev => ({
                                ...prev,
                                outpatients: { ...prev.outpatients, op10am: userIds }
                              }));
                            }}
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.outpatients?.op10am)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">12 PM</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.outpatients.op12pm}
                            setSelectedUsers={(userIds) => {
                              setEditData(prev => ({
                                ...prev,
                                outpatients: { ...prev.outpatients, op12pm: userIds }
                              }));
                            }}
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.outpatients?.op12pm)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">2 PM</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.outpatients.op2pm}
                            setSelectedUsers={(userIds) => {
                              setEditData(prev => ({
                                ...prev,
                                outpatients: { ...prev.outpatients, op2pm: userIds }
                              }));
                            }}
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.outpatients?.op2pm)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            


              {/* Coverage Section */}
              <div className="whiteboard-card col-span-4 md:col-span-2">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base md:text-lg font-medium text-gray-700">Coverage</h2>
                    {isEditMode && (
                      <button
                        className="text-xs font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
                        onClick={handleClearCoverage}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">ON CALL</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.coverage.onCall}
                            setSelectedUsers={(userIds) => setEditData(prev => ({
                              ...prev,
                              coverage: { ...prev.coverage, onCall: userIds }
                            }))}
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.coverage?.onCall)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">SURG CALL</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.coverage.surgCall}
                            setSelectedUsers={(userIds) => setEditData(prev => ({
                              ...prev,
                              coverage: { ...prev.coverage, surgCall: userIds }
                            }))}                            
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.coverage?.surgCall)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">SCANNING</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.coverage.scanning}
                            setSelectedUsers={(userIds) => setEditData(prev => ({
                              ...prev,
                              coverage: { ...prev.coverage, scanning: userIds }
                            }))}
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.coverage?.scanning)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">SURGICALS</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.coverage.surgicals}
                            setSelectedUsers={(userIds) => setEditData(prev => ({
                              ...prev,
                              coverage: { ...prev.coverage, surgicals: userIds }
                            }))}
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.coverage?.surgicals)
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="whitespace-nowrap">WADA</p>
                      {isEditMode ? (
                        <div className="w-32">
                          <SelectCoverageUser
                            selectedUsers={editData.coverage.wada}
                            setSelectedUsers={(userIds) => setEditData(prev => ({
                              ...prev,
                              coverage: { ...prev.coverage, wada: userIds }
                            }))}
                          />
                        </div>
                      ) : (
                        renderUserDisplay(whiteboardData?.coverage?.wada)
                      )}
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Comments Section */}
            <div className="whiteboard-card">
              <div>
                <h2 className="text-base md:text-lg mb-2 font-medium text-gray-700">Comments</h2>
                {!isEditMode ? (
                  <>
                    {whiteboardData?.comments?.length > 0 ? (
                      <div className="mt-4">
                        {whiteboardData.comments.map((comment, index) => (
                          <Comment key={`comment_${index}`} comment={comment} index={index} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No comments for today</p>
                    )}
                  </>
                ) : (
                  <AddCommentsInput
                    comments={editData.comments}
                    setComments={(newComments) =>
                      setEditData((prev) => ({ ...prev, comments: newComments }))
                    }
                  />
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LabWhiteboard;

const Comment = ({ comment, index }) => {
  return <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2">
    <div className="flex items-start gap-3">
      <p className="text-xs text-black flex-1">{comment}</p>
    </div>
  </div>
}