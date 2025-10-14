import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA, ORDER_TYPE_DATA, AUTOMATIC_CHECKLIST_ITEMS, DEFAULT_COMMENTS, ROOM_MAPPINGS } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddCommentsInput from "../../components/Inputs/AddCommentsInput";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import { UserContext } from "../../context/userContext";
import { FaComputer } from "react-icons/fa6";

const formatTimestamp = () => {
  return moment().format('(M/D/YY [at] h:mm A)');
};

const CreateTask = () => {
  const { user } = useContext(UserContext);

  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    orderType: "Routine EEG | IP",
    electrodeType: "Regular Leads",
    adhesiveType: "None", 
    allergyType: "None",
    sleepDeprivationType: "Not Ordered",
    priority: "Routine",
    comStation: "",
    assignedTo: [],
    todoChecklist: [],
    comments: [],
  });

  const [currentTask, setCurrentTask] =useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] =useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] =useState(false);

  const [allComStations, setAllComStations] = useState([]);
  const [showInactiveModal, setShowInactiveModal] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // Reset form
    setTaskData({
      title: "",
      orderType: "Routine EEG | IP",
      electrodeType: "Regular Leads",
      adhesiveType: "None", 
      allergyType: "None",
      sleepDeprivationType: "Not Ordered",
      priority: "Routine",
      comStation: "",
      assignedTo: [],
      todoChecklist: [],
      comments: [],
    });
  };

  const getAllComStations = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.COM_STATION.GET_ALL_COM_STATIONS);
      setAllComStations(response.data || []);
    } catch (error) {
      console.error("Error fetching computer stations:", error);
    }
  };

  const handleComStationChange = (stationId) => {
    const selectedStation = allComStations.find(station => station._id === stationId);
    if (selectedStation && selectedStation.comStationStatus === 'Inactive') {
      setShowInactiveModal(true);
      handleValueChange("comStation", null);
      return;
    }
    handleValueChange("comStation", stationId || null);
  };

  // Create Task
  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        todoChecklist: todolist,
        comStation: taskData.comStation || null,
      });

      toast.success("Task Created Successfully");

      // Handle navigation based on returnTo parameter
      const returnTo = location.state?.returnTo;
      const basePath = user?.role === 'admin' ? '/admin' : '/user';
      
      if (returnTo === 'floor-whiteboard') {
        navigate(`${basePath}/floor-whiteboard`);
      } else {
        clearData();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          todoChecklist: todolist,
          comStation: taskData.comStation || null,
        }
      );

      toast.success("Task Updated Successfully");

      // Handle navigation based on returnTo parameter
      const returnTo = location.state?.returnTo;
      const basePath = user?.role === 'admin' ? '/admin' : '/user';
      
      if (returnTo === 'floor-whiteboard') {
        navigate(`${basePath}/floor-whiteboard`);
      } else {
        navigate(`${basePath}/manage-tasks`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // Input validation
    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.orderType) {
      setError("Order Type is required.");
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one todo task.");
      return;
    }
    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  };

  // Get task info by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          orderType: taskInfo.orderType || "Routine EEG | IP",
          electrodeType: taskInfo.electrodeType || "Regular Leads",
          adhesiveType: taskInfo.adhesiveType || "None",
          allergyType: taskInfo.allergyType || "None",
          sleepDeprivationType: taskInfo.sleepDeprivationType || "Not Ordered",
          priority: taskInfo.priority,
          comStation: taskInfo?.comStation?._id || "",
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          comments: taskInfo?.comments || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Task details deleted successfully");

      const basePath = user?.role === 'admin' ? '/admin' : '/user';
      navigate(`${basePath}/manage-tasks`);
    } catch (error) {
      console.error(
        "Error deleting task:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Handle pre-population based on whiteboard section
  const getPrefilledTodoItems = (sectionType) => {
    switch (sectionType) {
      case 'skinCheck':
        return ["Skin Check | Day "];
      case 'electrodeFixes':
        return ["Fix Electrodes "];
      case 'hyperventilation':
        return ["Hyperventilation "];
      case 'photic':
        return ["Photic Stimulation "];
      case 'disconnects':
        return ["Disconnect "];
      case 'rehooks':
        return ["Rehook "];
      case 'transfers':
        return [`Transfer Patient from ${taskData.title || '[room]'} to `];
      case 'troubleshoots':
        return ["Troubleshoot "];
      default:
        return [];
    }
  };

  // Auto-populate checklist when orderType changes
  useEffect(() => {
    // Skip if this is an auto-selection from room mapping
    const isRoomAutoSelection = ROOM_MAPPINGS[taskData.title]?.orderType === taskData.orderType;
    
    if (taskData.orderType && AUTOMATIC_CHECKLIST_ITEMS[taskData.orderType] && !isRoomAutoSelection) {
      const timestamp = formatTimestamp();
      const automaticItems = AUTOMATIC_CHECKLIST_ITEMS[taskData.orderType].map(item => `${item} ${timestamp}`);
      const existingCustomItems = taskData.todoChecklist.filter(item => 
        !Object.values(AUTOMATIC_CHECKLIST_ITEMS).flat().some(autoItem => item.startsWith(autoItem))
      );
      
      // Reset procedure-dependent based on order type
      let resetData = {
        todoChecklist: [...automaticItems, ...existingCustomItems]
      };
      
      // For Continuous EEG types
      if (taskData.orderType?.includes("Continuous EEG")) {
        resetData = {
          ...resetData,
          electrodeType: "Regular Leads",
          adhesiveType: "Collodion",
          allergyType: "None",
          sleepDeprivationType: "Not Ordered"
        };
      }

      // For Continuous SEEG
      else if (taskData.orderType?.includes("Continuous SEEG")) {
        resetData = {
          ...resetData,
          electrodeType: "Depth Electrodes",
          adhesiveType: "None",
          sleepDeprivationType: "Not Ordered"
        };
      }
      // For all other types
      else {
        resetData = {
          ...resetData,
          adhesiveType: "None",
          allergyType: "None"
        };
      }
      
      setTaskData(prev => ({
        ...prev,
        ...resetData
      }));
    }
  }, [taskData.orderType, taskData.title]);

  // Auto-select order type and computer station based on room number
  useEffect(() => {
    const roomMapping = ROOM_MAPPINGS[taskData.title];
    if (roomMapping && allComStations.length > 0) {
      const matchingStation = allComStations.find(station => 
        station.comStation === roomMapping.comStationName
      );

      // Only auto-select if current values are defaults (not manually changed)
      const shouldAutoSelect = !taskId || (
        taskData.orderType === "Routine EEG | IP" && 
        !taskData.comStation
      );

      if (shouldAutoSelect) {
        // Get the automatic checklist items for EMU
        const timestamp = formatTimestamp();
        const automaticItems = (AUTOMATIC_CHECKLIST_ITEMS[roomMapping.orderType] || []).map(item => `${item} ${timestamp}`);
        const existingCustomItems = taskData.todoChecklist.filter(item => 
          !Object.values(AUTOMATIC_CHECKLIST_ITEMS).flat().some(autoItem => item.startsWith(autoItem))
        );

        setTaskData(prev => ({
          ...prev,
          orderType: roomMapping.orderType,
          comStation: matchingStation?._id || "",
          // Reset procedure-dependent fields for EMU
          electrodeType: "Regular Leads",
          adhesiveType: "Collodion",
          allergyType: "None",
          sleepDeprivationType: "Not Ordered",
          todoChecklist: [...automaticItems, ...existingCustomItems]
        }));
      }
    }
  }, [taskData.title, allComStations, taskId]);

  // Handle floor whiteboard section pre-population
  useEffect(() => {
    if (location.state?.floorWhiteboardSection && taskId) {
      const sectionType = location.state.floorWhiteboardSection;
      const timestamp = formatTimestamp();
      const prefilledItems = getPrefilledTodoItems(sectionType).map(item => `${item} ${timestamp}`);
      
      if (prefilledItems.length > 0) {
        // Add the prefilled items to existing todo list without replacing it
        setTaskData(prev => ({
          ...prev,
          todoChecklist: [...prev.todoChecklist, ...prefilledItems]
        }));
      }
    }
  }, [location.state?.floorWhiteboardSection, taskId]);

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID(taskId);
    }
    return () => {};
  }, [taskId]);

  useEffect(() => {
    getAllComStations();
  }, []);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4 mb-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Room
                </label>

                <input
                  placeholder="6820"
                  className="form-input"
                  value={taskData.title}
                  onChange={({ target }) =>
                    handleValueChange("title", target.value)
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-8">
                <label className="text-xs font-medium text-slate-600">
                  Order Type
                </label>

                <SelectDropdown
                  options={ORDER_TYPE_DATA}
                  value={taskData.orderType}
                  onChange={(value) => handleValueChange("orderType", value)}
                  placeholder="Select Order Type"
                />
              </div>
            </div>

            {/* Procedure-Dependent Section */}
            {(taskData.orderType?.includes("Continuous EEG") || taskData.orderType === "Continuous SEEG" || !taskData.orderType?.includes("Continuous")) && (
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-600 mb-3 block">
                  Procedure-Dependent
                </label>

                {/* One wrapper for ALL checkboxes */}
                <div className="space-y-2">
                  {/* Continuous EEG types show all three checkboxes */}
                  {taskData.orderType?.includes("Continuous EEG") && (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="mri-leads"
                          checked={taskData.electrodeType === "MRI Leads"}
                          onChange={(e) =>
                            handleValueChange("electrodeType", e.target.checked ? "MRI Leads" : "Regular Leads")
                          }
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        <label htmlFor="mri-leads" className="text-sm text-gray-700 cursor-pointer">
                          MRI Leads
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="tensive"
                          checked={taskData.adhesiveType === "Tensive"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleValueChange("adhesiveType", "Tensive");
                            } else {
                              handleValueChange("adhesiveType", "Collodion");
                            }
                          }}
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        <label htmlFor="tensive" className="text-sm text-gray-700 cursor-pointer">
                          Tensive Glue
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="no-adhesive"
                          checked={taskData.adhesiveType === "None"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleValueChange("adhesiveType", "None");
                            } else {
                              handleValueChange("adhesiveType", "Collodion");
                            }
                          }}
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        <label htmlFor="no-adhesive" className="text-sm text-gray-700 cursor-pointer">
                          No Adhesive Glue Used
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="adhesive-allergy"
                          checked={taskData.allergyType === "Adhesive Tape"}
                          onChange={(e) =>
                            handleValueChange("allergyType", e.target.checked ? "Adhesive Tape" : "None")
                          }
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        <label htmlFor="adhesive-allergy" className="text-sm text-gray-700 cursor-pointer">
                          Adhesive Tape Allergy
                        </label>
                      </div>
                    </>
                  )}

                  {/* All other types (except Continuous SEEG) show only Adhesive Tape Allergy */}
                  {!taskData.orderType?.includes("Continuous") && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="adhesive-allergy"
                        checked={taskData.allergyType === "Adhesive Tape"}
                        onChange={(e) =>
                          handleValueChange("allergyType", e.target.checked ? "Adhesive Tape" : "None")
                        }
                        className="w-4 h-4 accent-primary rounded cursor-pointer"
                      />
                      <label htmlFor="adhesive-allergy" className="text-sm text-gray-700 cursor-pointer">
                        Adhesive Tape Allergy
                      </label>
                    </div>
                  )}

                  {/* Sleep Deprivation checkbox */}
                  {(taskData.orderType === "Continuous EEG | LTM" ||
                    taskData.orderType === "Continuous EEG | EMU" ||
                    taskData.orderType === "Continuous EEG | Pediatric" ||
                    taskData.orderType === "Continuous SEEG") && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sleep-deprivation"
                        checked={taskData.sleepDeprivationType === "Ordered"}
                        onChange={(e) =>
                          handleValueChange("sleepDeprivationType", e.target.checked ? "Ordered" : "Not Ordered")
                        }
                        className="w-4 h-4 accent-primary rounded cursor-pointer"
                      />
                      <label htmlFor="sleep-deprivation" className="text-sm text-gray-700 cursor-pointer">
                        Sleep Deprivation
                      </label>
                    </div>
                  )}
                </div>

                {/* Default comments */}
                {DEFAULT_COMMENTS[taskData.orderType] && (
                  <p className="text-xs text-gray-500 mt-2">
                    {DEFAULT_COMMENTS[taskData.orderType]}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Computer Station
                </label>

                <SelectDropdown
                  options={allComStations.map(station => ({
                    label: station.comStation,
                    value: station._id
                  }))}
                  value={taskData.comStation}
                  onChange={handleComStationChange}
                  placeholder="Select Station"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                
                <div className="pt-1">
                  <SelectUsers
                    selectedUsers={taskData.assignedTo}
                    setSelectedUsers={(value) => {
                      handleValueChange("assignedTo", value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Tasks
              </label>

              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
                currentRoom={taskData.title}
              />
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Add Comments
              </label>

              <AddCommentsInput
                comments={taskData?.comments}
                setComments={(value) =>
                  handleValueChange("comments", value)
                }
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>

      <Modal
        isOpen={showInactiveModal}
        onClose={() => setShowInactiveModal(false)}
        title="Inactive Computer Station"
      >
        <p className="text-sm dark:text-white">The selected computer station is currently inactive. You can change the status under the Computer Stations Tab.</p>
        <div className="flex justify-end mt-4">
          <button className="card-btn" onClick={() => setShowInactiveModal(false)}>
            OK
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default CreateTask