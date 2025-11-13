import React, { useContext, useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import { UserContext } from "../../context/userContext";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import toast from "react-hot-toast";

const ManageTasks = () => {
  const { user } = useContext(UserContext);
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [showDisconnectedWarning, setShowDisconnectedWarning] = useState(false);
  const [disconnectedCount, setDisconnectedCount] = useState(0);
  const [showCompletedWarning, setShowCompletedWarning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const navigate = useNavigate();

  // Sort tasks by room number (title)
  const sortTasksByRoom = (tasks) => {
    return tasks.sort((a, b) => {
      const titleA = a.title || '';
      const titleB = b.title || '';
      return titleA.localeCompare(titleB);
    });
  };

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS_EVERYONE, {
        params: {
          status: filterStatus === "All" || filterStatus === "Disconnected" ? "" : filterStatus,
        },
      });

      let tasks = response.data?.tasks || [];
      
      // Filter disconnected tasks on frontend
      if (filterStatus === "Disconnected") {
        tasks = tasks.filter(task => task.status === "Disconnected");
      } else if (filterStatus === "Completed") {
        // Exclude disconnected from completed
        tasks = tasks.filter(task => task.status === "Completed");
      } else if (filterStatus === "Pending") {
        tasks = tasks.filter(task => task.status === "Pending");
      } else if (filterStatus === "In Progress") {
        tasks = tasks.filter(task => task.status === "In Progress");
      }

      // Sort tasks by room number
      tasks = sortTasksByRoom(tasks);

      setAllTasks(tasks);

      // Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {};

      const statusArrary = [
        { label: "All", count: statusSummary.all || 0, showBadge: false },
        { label: "Pending", count: statusSummary.pendingTasks || 0, showBadge: false },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0, showBadge: false },
        { 
          label: "Completed", 
          count: statusSummary.completedTasks || 0, 
          showBadge: (statusSummary.completedTasks || 0) >= 25 
        },
        { 
          label: "Disconnected", 
          count: statusSummary.disconnectedTasks || 0, 
          showBadge: (statusSummary.disconnectedTasks || 0) >= 15
        },
      ];

      setTabs(statusArrary);

      // Store disconnected count for badge
      setDisconnectedCount(statusSummary.disconnectedTasks || 0);

      // Store completed count for badge
      setCompletedCount(statusSummary.completedTasks || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleClick = (taskData) => {
    const basePath = user?.role === 'admin' ? '/admin' : '/user';
    navigate(`${basePath}/create-task`, { state: { taskId: taskData._id } });
  };

  const handleDeleteClick = (taskId) => {
    setDeleteTaskId(taskId);
    setOpenDeleteAlert(true);
  };

  // Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(deleteTaskId));

      setOpenDeleteAlert(false);
      toast.success("Task details deleted successfully");

      getAllTasks(filterStatus);
    } catch (error) {
      console.error(
        "Error deleting task:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to delete task. Please try again.");
    }
  };

  // Handle delete all tasks
  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      const response = await axiosInstance.delete(
        API_PATHS.TASKS.DELETE_TASKS_BY_STATUS(filterStatus)
      );
      
      setShowDeleteAllModal(false);
      toast.success(response.data.message || `All ${filterStatus} tasks deleted successfully`);
      getAllTasks();
    } catch (error) {
      console.error("Error deleting tasks:", error);
      toast.error(error.response?.data?.message || "Failed to delete tasks");
    } finally {
      setDeletingAll(false);
    }
  };

  // Download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading task details.", error);
      toast.error("Failed to download task details. Please try again.");
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem('disconnectedWarning_ManageTasks');
    
    if (filterStatus === "Disconnected" && !hasSeenWarning && disconnectedCount >= 15) {
      setShowDisconnectedWarning(true);
      sessionStorage.setItem('disconnectedWarning_ManageTasks', 'true');
    }
  }, [filterStatus, disconnectedCount]);

  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem('completedWarning_ManageTasks');
    
    if (filterStatus === "Completed" && !hasSeenWarning && completedCount >= 25) {
      setShowCompletedWarning(true);
      sessionStorage.setItem('completedWarning_ManageTasks', 'true');
    }
  }, [filterStatus, completedCount]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="mt-2.5 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl text-gray-500 font-bold flex-shrink-0 whitespace-nowrap mr-10">Manage Tasks</h2>

            {user?.role === 'admin' && (
              <button
                className="flex md:hidden download-btn shrink-0"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            )}
          </div>

          <div className="min-h-[3.5rem] flex items-end">
            {tabs?.[0]?.count > 0 ? (
              <div className="relative flex items-center gap-3">
                <TaskStatusTabs
                  tabs={tabs}
                  activeTab={filterStatus}
                  setActiveTab={setFilterStatus}
                  onBadgeClick={(tabLabel) => {
                    if (tabLabel === "Disconnected") {
                      setShowDisconnectedWarning(true);
                    } else if (tabLabel === "Completed") {
                      setShowCompletedWarning(true);
                    }
                  }}
                />

                {user?.role === 'admin' && (
                  <button
                    className="hidden md:flex download-btn shrink-0"
                    onClick={handleDownloadReport}
                  >
                    <LuFileSpreadsheet className="text-lg" />
                    Download Report
                  </button>
                )}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Delete All Button - Shows for Completed and Disconnected tabs */}
        {(filterStatus === "Completed" || filterStatus === "Disconnected") && allTasks.length > 0 && (
          <div className="flex justify-end mt-3 mb-2">
            <button
              className="w-full lg:w-auto flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 hover:bg-rose-100 cursor-pointer"
              onClick={() => setShowDeleteAllModal(true)}
            >
              <LuTrash2 className="text-base" />
              Delete All {filterStatus}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-2 md:mt-4">
          {allTasks?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              orderType={item.orderType}
              electrodeType={item.electrodeType}
              adhesiveType={item.adhesiveType}
              allergyType={item.allergyType}
              sleepDeprivationType={item.sleepDeprivationType}
              priority={item.priority}
              comStation={item.comStation}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              completedOn={item.completedOn}
              assignedTo={item.assignedTo || []}
              commentCount={item.comments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => {
                handleClick(item);
              }}
              onDelete={() => handleDeleteClick(item._id)}
              showDeleteButton={true}
            />
          ))}
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
        isOpen={showDisconnectedWarning}
        onClose={() => setShowDisconnectedWarning(false)}
        title="Disconnected Studies Warning"
      >
        <div>
          <p className="text-sm dark:text-white mb-4">
            Several studies are currently marked as Disconnected. Please remove any that are no longer needed.
          </p>
          <div className="flex justify-end">
            <button 
              className="card-btn" 
              onClick={() => setShowDisconnectedWarning(false)}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showCompletedWarning}
        onClose={() => setShowCompletedWarning(false)}
        title="Completed Studies Warning"
      >
        <div>
          <p className="text-sm dark:text-white mb-4">
            Several studies are currently marked as Completed. Please remove any that are no longer needed.
          </p>
          <div className="flex justify-end">
            <button 
              className="card-btn" 
              onClick={() => setShowCompletedWarning(false)}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        title={`Delete All ${filterStatus} Tasks`}
      >
        <DeleteAlert
          content={`Are you sure you want to delete all ${filterStatus.toLowerCase()} tasks? This will permanently remove ${allTasks.length} task${allTasks.length !== 1 ? 's' : ''}. This action cannot be undone.`}
          onDelete={handleDeleteAll}
        />
        {deletingAll && (
          <p className="text-xs text-gray-500 mt-2">Deleting tasks</p>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default ManageTasks