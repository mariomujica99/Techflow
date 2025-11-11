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

const WorkedOnTasks = () => {
  const { user } = useContext(UserContext);

  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const [showDisconnectedWarning, setShowDisconnectedWarning] = useState(false);
  const [disconnectedCount, setDisconnectedCount] = useState(0);
  const [showCompletedWarning, setShowCompletedWarning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

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
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
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

  const handleClick = (taskId) => {
    const basePath = user?.role === 'admin' ? 'admin' : 'user';
    navigate(`/${basePath}/task-details/${taskId}`, { state: { from: "Worked-On Tasks" } });
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem('disconnectedWarning_WorkedOnTasks');
    
    if (filterStatus === "Disconnected" && !hasSeenWarning && disconnectedCount >= 15) {
      setShowDisconnectedWarning(true);
      sessionStorage.setItem('disconnectedWarning_WorkedOnTasks', 'true');
    }
  }, [filterStatus, disconnectedCount]);

  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem('completedWarning_WorkedOnTasks');
    
    if (filterStatus === "Completed" && !hasSeenWarning && completedCount >= 25) {
      setShowCompletedWarning(true);
      sessionStorage.setItem('completedWarning_WorkedOnTasks', 'true');
    }
  }, [filterStatus, completedCount]);

  return (
    <DashboardLayout activeMenu="Worked-On Tasks">
      <div className="mt-2.5 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl text-gray-500 font-bold flex-shrink-0 whitespace-nowrap mr-10">Worked-On Tasks</h2>

          <div className="min-h-[3.5rem] flex items-end">
            {tabs?.[0]?.count > 0 ? (
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
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-2 md:mt-4">
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
                handleClick(item._id);
              }}
            />
          ))}
        </div>
      </div>

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
    </DashboardLayout>
  );
};

export default WorkedOnTasks;