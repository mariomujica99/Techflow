import React, { useContext, useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { AUTOMATIC_CHECKLIST_ITEMS } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import { HiMiniPlus } from "react-icons/hi2";
import { LuTrash2, LuChevronDown, LuListChecks, LuArrowRight } from "react-icons/lu";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const FloorWhiteboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState({
    orders: [],
    skinChecks: [],
    electrodeFixes: [],
    disconnects: [],
    rehooks: [],
    hyperventilation: [],
    photic: [],
    transfers: [],
    troubleshoots: []
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({});

  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const [allRoomNumbers, setAllRoomNumbers] = useState([]);

  const [clearedSections, setClearedSections] = useState({
    orders: false,
    skinChecks: false,
    electrodeFixes: false,
    disconnects: false,
    rehooks: false,
    hyperventilation: false,
    photic: false,
    transfers: false,
    troubleshoots: false
  });

  const getAllTasks = async (currentClearedSections = clearedSections) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS_EVERYONE);
      const allTasks = response.data?.tasks || [];
      
      const todayStart = moment().startOf('day');

      // Helper function to check if a todo was created today
      const isTodoCreatedToday = (todo) => {
        const todoDate = moment(todo.createdAt);
        return todoDate.isSameOrAfter(todayStart);
      };

      // Organize tasks by their todo checklist content - filter by todo creation date
      const organizedTasks = {
        orders: currentClearedSections.orders ? [] : (() => {
          // For orders, show if task was created today
          const orderTasks = allTasks.filter(task => {
            const taskDate = moment(task.createdAt);
            return taskDate.isSameOrAfter(todayStart);
          });
          
          // Sort by order type (Continuous first, then Routine), then by creation date
          return orderTasks.sort((a, b) => {
            const aIsContinuous = a.orderType?.startsWith("Continuous");
            const bIsContinuous = b.orderType?.startsWith("Continuous");
            
            if (aIsContinuous && !bIsContinuous) return -1;
            if (!aIsContinuous && bIsContinuous) return 1;
            
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        })(),
        
        skinChecks: currentClearedSections.skinChecks ? [] : allTasks.filter(task =>
          task.todoChecklist?.some(todo =>
            todo.text.toLowerCase().includes("skin check") && isTodoCreatedToday(todo)
          )
        ),
        
        electrodeFixes: currentClearedSections.electrodeFixes ? [] : allTasks.filter(task =>
          task.todoChecklist?.some(todo =>
            todo.text.toLowerCase().includes("fix electrodes") && isTodoCreatedToday(todo)
          )
        ),
        
        disconnects: currentClearedSections.disconnects ? [] : allTasks.filter(task =>
          task.todoChecklist?.some(todo => {
            const isDisconnectTodo = todo.text.toLowerCase().includes("disconnect") || 
                                    todo.text.toLowerCase().includes("discontinue");
            
            // Exclude disconnects from Routine EEG orders (except Neuropsychiatric)
            if (isDisconnectTodo && task.orderType?.startsWith("Routine EEG") && 
                task.orderType !== "Neuropsychiatric EEG") {
              return false;
            }
            
            return isDisconnectTodo && isTodoCreatedToday(todo);
          })
        ),
        
        rehooks: currentClearedSections.rehooks ? [] : allTasks.filter(task =>
          task.todoChecklist?.some(todo =>
            todo.text.toLowerCase().includes("rehook") && isTodoCreatedToday(todo)
          )
        ),
        
        hyperventilation: currentClearedSections.hyperventilation ? [] : allTasks.filter(task =>
          task.todoChecklist?.some(todo =>
            todo.text.toLowerCase().includes("hyperventilation") && isTodoCreatedToday(todo)
          )
        ),
        
        photic: currentClearedSections.photic ? [] : allTasks.filter(task =>
          task.todoChecklist?.some(todo =>
            todo.text.toLowerCase().includes("photic") && isTodoCreatedToday(todo)
          )
        ),
        
        transfers: currentClearedSections.transfers ? [] : allTasks.filter(task =>
          task.todoChecklist?.some(todo =>
            todo.text.toLowerCase().includes("transfer patient from") && isTodoCreatedToday(todo)
          )
        ),
        
        troubleshoots: currentClearedSections.troubleshoots ? [] : allTasks.filter(task =>
          task.todoChecklist?.some(todo =>
            todo.text.toLowerCase().includes("troubleshoot") && isTodoCreatedToday(todo)
          )
        )
      };

      setTasks(organizedTasks);

      // Set last updated time to most recent task or todo update
      const mostRecent = allTasks.reduce((latest, task) => {
        const taskUpdate = new Date(task.updatedAt);
        return (!latest || taskUpdate > new Date(latest)) ? task.updatedAt : latest;
      }, null);
      setLastUpdated(mostRecent);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get all room numbers from ALL tasks (not just today's)
  const getAllRoomNumbers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS_EVERYONE);
      const allTasks = response.data?.tasks || [];
      
      // Extract unique room numbers and sort them
      const roomNumbers = [...new Set(allTasks.map(task => task.title))].sort();
      setAllRoomNumbers(roomNumbers);
    } catch (error) {
      console.error("Error fetching all room numbers:", error);
    }
  };

  // Navigate to create task for orders section
  const handleAddOrder = () => {
    const basePath = user?.role === 'admin' ? '/admin' : '/user';
    navigate(`${basePath}/create-task`, { 
      state: { 
        returnTo: 'floor-whiteboard'
      } 
    });
  };

  // Navigate to update task with specific template
  const handleAddToSection = async (sectionType, roomNumber) => {
    const basePath = user?.role === 'admin' ? '/admin' : '/user';
    
    // First try to find in current Floor Whiteboard tasks
    let targetTask = Object.values(tasks).flat().find(task => task.title === roomNumber);
    
    // If not found in Floor Whiteboard, fetch from all tasks
    if (!targetTask) {
      try {
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS_EVERYONE);
        const allTasks = response.data?.tasks || [];
        targetTask = allTasks.find(task => task.title === roomNumber);
      } catch (error) {
        console.error("Error fetching task for room:", error);
        toast.error("Could not find task for this room");
        return;
      }
    }
    
    if (targetTask) {
      navigate(`${basePath}/create-task`, { 
        state: { 
          taskId: targetTask._id,
          floorWhiteboardSection: sectionType,
          returnTo: 'floor-whiteboard'
        } 
      });
    } else {
      toast.error("No task found for this room");
    }
  };

  // Navigate to task details
  const handleTaskClick = (taskId) => {
    const basePath = user?.role === 'admin' ? '/admin' : '/user';
    navigate(`${basePath}/task-details/${taskId}`, {
      state: { from: "Floor Whiteboard" }
    });
  };

  // Navigate to update task (for LuListChecks in Orders section)
  const handleUpdateTask = (taskId) => {
    const basePath = user?.role === 'admin' ? '/admin' : '/user';
    navigate(`${basePath}/create-task`, { 
      state: { 
        taskId: taskId,
        returnTo: 'floor-whiteboard'
      } 
    });
  };

  // Handle todo completion
  const handleTodoComplete = async (taskId, todoType, isCompleted) => {
    try {
      const targetTask = Object.values(tasks).flat().find(task => task._id === taskId);
      if (!targetTask) return;

      const todoChecklist = [...targetTask.todoChecklist];
      let updated = false;
      let transferRoomUpdate = null;

      // Find and update the specific todo item
      todoChecklist.forEach(todo => {
        if (todoType === 'skinChecks' && todo.text.toLowerCase().includes("skin check")) {
          todo.completed = isCompleted;
          updated = true;
        } else if (todoType === 'electrodeFixes' && todo.text.toLowerCase().includes("fix electrodes")) {
          todo.completed = isCompleted;
          updated = true;
        } else if (todoType === 'disconnects' && (todo.text.toLowerCase().includes("disconnect") || todo.text.toLowerCase().includes("discontinue"))) {
          todo.completed = isCompleted;
          updated = true;
        } else if (todoType === 'rehooks' && todo.text.toLowerCase().includes("rehook")) {
          todo.completed = isCompleted;
          updated = true;
        } else if (todoType === 'hyperventilation' && todo.text.toLowerCase().includes("hyperventilation")) {
          todo.completed = isCompleted;
          updated = true;
        } else if (todoType === 'photic' && todo.text.toLowerCase().includes("photic")) {
          todo.completed = isCompleted;
          updated = true;
        } else if (todoType === 'transfers' && todo.text.toLowerCase().includes("transfer patient")) {
          todo.completed = isCompleted;
          updated = true;
          
          if (isCompleted && todo.text.includes("Transfer Patient from ")) {
            const roomMatch = todo.text.match(/Transfer Patient from .+? to (\d+)/);
            if (roomMatch && roomMatch[1]) {
              transferRoomUpdate = roomMatch[1];
            }
          }
        } else if (todoType === 'troubleshoots' && todo.text.toLowerCase().includes("troubleshoot")) {
          todo.completed = isCompleted;
          updated = true;
        }
      });

      // Handle room number update for transfers
      if (transferRoomUpdate) {
        try {
          await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
            title: transferRoomUpdate
          });
        } catch (error) {
          console.error("Error updating room number:", error);
        }
      }

      // Special handling for DC section - also complete the "Place End Time & Chart | Inform Reading Provider" todo
      if (todoType === 'disconnects' && isCompleted) {
        todoChecklist.forEach(todo => {
          if (todo.text.toLowerCase().includes("place end time") && 
              todo.text.toLowerCase().includes("chart") && 
              todo.text.toLowerCase().includes("inform reading provider")) {
            todo.completed = isCompleted;
            updated = true;
          }
        });
      }

      if (updated) {
        await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          { todoChecklist }
        );
        
        // Refresh the floor whiteboard data
        getAllTasks();
        
        // Show success message
        toast.success(`Task ${isCompleted ? 'completed' : 'unchecked'} successfully`);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update task");
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId, todoType) => {
    try {
      const targetTask = Object.values(tasks).flat().find(task => task._id === taskId);
      if (!targetTask) return;

      const todoChecklist = targetTask.todoChecklist.filter(todo => {
        if (todoType === 'skinCheck') return !todo.text.toLowerCase().includes("skin check");
        if (todoType === 'electrodeFixes') return !todo.text.toLowerCase().includes("fix electrodes");
        if (todoType === 'disconnects') return !(todo.text.toLowerCase().includes("disconnect") || todo.text.toLowerCase().includes("discontinue"));
        if (todoType === 'rehooks') return !todo.text.toLowerCase().includes("rehook");
        if (todoType === 'hyperventilation') return !todo.text.toLowerCase().includes("hyperventilation");
        if (todoType === 'photic') return !todo.text.toLowerCase().includes("photic");
        if (todoType === 'transfers') return !todo.text.toLowerCase().includes("transfer patient");
        if (todoType === 'troubleshoots') return !todo.text.toLowerCase().includes("troubleshoot");
        return true;
      });

      await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
        { todoChecklist }
      );
      getAllTasks();
      toast.success("Task item deleted successfully");
    } catch (error) {
      console.error("Error deleting task item:", error);
      toast.error("Failed to delete task item");
    }
  };

  // Handle order task deletion
  const handleDeleteOrder = (taskId) => {
    setDeleteOrderId(taskId);
    setOpenDeleteAlert(true);
  };

  const confirmDeleteOrder = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(deleteOrderId));
      setOpenDeleteAlert(false);
      setDeleteOrderId(null);
      getAllTasks();
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
    setDropdownStates({});
  };

  const toggleDropdown = (sectionType) => {
    setDropdownStates(prev => ({
      ...prev,
      [sectionType]: !prev[sectionType]
    }));
  };

  useEffect(() => {
    getAllTasks(clearedSections);
    getAllRoomNumbers();
    
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        getAllTasks(clearedSections);
        getAllRoomNumbers();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [clearedSections]);

  const roomNumbers = allRoomNumbers;

  return (
    <DashboardLayout activeMenu="Floor Whiteboard">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4 mb-4">
          <div className="form-card col-span-3">
            <div className="flex md:flex-row md:items-center justify-between mb-0.5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-xl font-medium text-gray-700">Floor Whiteboard</h2>
              </div>
            </div>

            <h1 className="text-base md:text-lg text-gray-400 mb-2">Neurophysiology Department</h1>

            <div className="whiteboard-card">              
              <p className="text-sm text-gray-700 font-medium">
                {moment().format("dddd Do MMMM YYYY")}
              </p>
              
              <p className="text-xs font-medium text-gray-400">Whiteboard Last Updated</p>
              <p className="text-xs text-gray-400 truncate mb-3">
                {lastUpdated ? moment(lastUpdated).format("dddd Do MMM YYYY [at] h:mm A") : "Never Updated"}
              </p>
              
              <div className="flex items-center gap-3">
                <button 
                  className="card-btn"
                  onClick={handleEditModeToggle}
                  disabled={loading}
                >
                  {isEditMode ? "Done" : "Edit"}
                </button>
              </div>
            </div>

            {/* Orders Section - Full Width */}
            <div className="grid grid-cols-1 gap-5 mt-5">
              <OrdersSection 
                title="Orders"
                tasks={tasks.orders}
                isEditMode={isEditMode}
                onAdd={handleAddOrder}
                onTaskClick={handleTaskClick}
                onUpdateTask={handleUpdateTask}
                onDelete={handleDeleteOrder}
              />
            </div>

            {/* Other Sections */}
            <div className="grid grid-cols-2 gap-5 mt-5">
              <WhiteboardSection 
                title="Skin Checks"
                tasks={tasks.skinChecks}
                sectionType="skinCheck"
                isEditMode={isEditMode}
                onAdd={(roomNumber) => handleAddToSection('skinCheck', roomNumber)}
                onTaskClick={handleTaskClick}
                onTodoComplete={(taskId, isCompleted) => handleTodoComplete(taskId, 'skinChecks', isCompleted)}
                onDelete={(taskId) => handleDeleteTask(taskId, 'skinCheck')}
                roomNumbers={roomNumbers}
                dropdownOpen={dropdownStates['skinCheck']}
                onToggleDropdown={() => toggleDropdown('skinCheck')}
              />

              <WhiteboardSection 
                title="Electrode Fixes"
                tasks={tasks.electrodeFixes}
                sectionType="electrodeFixes"
                isEditMode={isEditMode}
                onAdd={(roomNumber) => handleAddToSection('electrodeFixes', roomNumber)}
                onTaskClick={handleTaskClick}
                onTodoComplete={(taskId, isCompleted) => handleTodoComplete(taskId, 'electrodeFixes', isCompleted)}
                onDelete={(taskId) => handleDeleteTask(taskId, 'electrodeFixes')}
                roomNumbers={roomNumbers}
                dropdownOpen={dropdownStates['electrodeFixes']}
                onToggleDropdown={() => toggleDropdown('electrodeFixes')}
              />

              <WhiteboardSection 
                title="DCs"
                tasks={tasks.disconnects}
                sectionType="disconnects"
                isEditMode={isEditMode}
                onAdd={(roomNumber) => handleAddToSection('disconnects', roomNumber)}
                onTaskClick={handleTaskClick}
                onTodoComplete={(taskId, isCompleted) => handleTodoComplete(taskId, 'disconnects', isCompleted)}
                onDelete={(taskId) => handleDeleteTask(taskId, 'disconnects')}
                roomNumbers={roomNumbers}
                dropdownOpen={dropdownStates['disconnects']}
                onToggleDropdown={() => toggleDropdown('disconnects')}
              />

              <WhiteboardSection 
                title="Rehooks"
                tasks={tasks.rehooks}
                sectionType="rehooks"
                isEditMode={isEditMode}
                onAdd={(roomNumber) => handleAddToSection('rehooks', roomNumber)}
                onTaskClick={handleTaskClick}
                onTodoComplete={(taskId, isCompleted) => handleTodoComplete(taskId, 'rehooks', isCompleted)}
                onDelete={(taskId) => handleDeleteTask(taskId, 'rehooks')}
                roomNumbers={roomNumbers}
                dropdownOpen={dropdownStates['rehooks']}
                onToggleDropdown={() => toggleDropdown('rehooks')}
              />

              <WhiteboardSection 
                title="HV"
                tasks={tasks.hyperventilation}
                sectionType="hyperventilation"
                isEditMode={isEditMode}
                onAdd={(roomNumber) => handleAddToSection('hyperventilation', roomNumber)}
                onTaskClick={handleTaskClick}
                onTodoComplete={(taskId, isCompleted) => handleTodoComplete(taskId, 'hyperventilation', isCompleted)}
                onDelete={(taskId) => handleDeleteTask(taskId, 'hyperventilation')}
                roomNumbers={roomNumbers}
                dropdownOpen={dropdownStates['hyperventilation']}
                onToggleDropdown={() => toggleDropdown('hyperventilation')}
              />

              <WhiteboardSection 
                title="Photic"
                tasks={tasks.photic}
                sectionType="photic"
                isEditMode={isEditMode}
                onAdd={(roomNumber) => handleAddToSection('photic', roomNumber)}
                onTaskClick={handleTaskClick}
                onTodoComplete={(taskId, isCompleted) => handleTodoComplete(taskId, 'photic', isCompleted)}
                onDelete={(taskId) => handleDeleteTask(taskId, 'photic')}
                roomNumbers={roomNumbers}
                dropdownOpen={dropdownStates['photic']}
                onToggleDropdown={() => toggleDropdown('photic')}
              />

              <WhiteboardSection 
                title="Transfers"
                tasks={tasks.transfers}
                sectionType="transfers"
                isEditMode={isEditMode}
                onAdd={(roomNumber) => handleAddToSection('transfers', roomNumber)}
                onTaskClick={handleTaskClick}
                onTodoComplete={(taskId, isCompleted) => handleTodoComplete(taskId, 'transfers', isCompleted)}
                onDelete={(taskId) => handleDeleteTask(taskId, 'transfers')}
                roomNumbers={roomNumbers}
                dropdownOpen={dropdownStates['transfers']}
                onToggleDropdown={() => toggleDropdown('transfers')}
              />

              <WhiteboardSection 
                title="Troubleshoots"
                tasks={tasks.troubleshoots}
                sectionType="troubleshoots"
                isEditMode={isEditMode}
                onAdd={(roomNumber) => handleAddToSection('troubleshoots', roomNumber)}
                onTaskClick={handleTaskClick}
                onTodoComplete={(taskId, isCompleted) => handleTodoComplete(taskId, 'troubleshoots', isCompleted)}
                onDelete={(taskId) => handleDeleteTask(taskId, 'troubleshoots')}
                roomNumbers={roomNumbers}
                dropdownOpen={dropdownStates['troubleshoots']}
                onToggleDropdown={() => toggleDropdown('troubleshoots')}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Order"
      >
        <DeleteAlert
          content="Are you sure you want to delete this order? This action cannot be undone."
          onDelete={confirmDeleteOrder}
        />
      </Modal>
    </DashboardLayout>
  );
};

// Orders section component (different from other sections)
const OrdersSection = ({ title, tasks, isEditMode, onAdd, onTaskClick, onUpdateTask, onDelete }) => {
  const getStatusColor = (task) => {
    const orderType = task.orderType;
    const automaticItems = AUTOMATIC_CHECKLIST_ITEMS[orderType];
    
    if (!automaticItems || automaticItems.length === 0) {
      return 'bg-violet-500'; // Default to pending
    }
    
    // Count how many automatic checklist items are completed
    let completedCount = 0;
    automaticItems.forEach(itemText => {
      const matchingTodo = task.todoChecklist?.find(todo => 
        todo.text === itemText && todo.completed
      );
      if (matchingTodo) {
        completedCount++;
      }
    });
    
    // Determine status based on completion
    if (completedCount === 0) {
      return 'bg-violet-500'; // Pending
    } else if (completedCount === automaticItems.length) {
      return 'bg-green-500'; // Completed
    } else {
      return 'bg-cyan-500'; // In Progress
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'STAT': return 'text-red-500';
      case 'ASAP': return 'text-orange-500';
      default: return 'text-lime-500';
    }
  };

  const formatOrderDisplay = (task) => {
    const orderType = task.orderType || '';
    const roomNumber = task.title || '';
    
    let prefix = '';
    let remainingType = orderType;
    
    if (orderType.startsWith('Routine EEG')) {
      prefix = 'R';
      remainingType = orderType.replace('Routine EEG | ', '');
    } else if (orderType.startsWith('Continuous EEG')) {
      prefix = 'C';
      remainingType = orderType.replace('Continuous EEG | ', '');
    } else if (orderType === 'Continuous SEEG') {
      prefix = 'C';
      remainingType = 'SEEG';
    } else if (orderType === 'Neuropsychiatric EEG') {
      prefix = 'C';
      remainingType = 'NP';
    }
    
    return {
      roomWithPrefix: `${prefix} ${roomNumber}`,
      orderTypeShort: remainingType
    };
  };

  return (
    <div className="whiteboard-card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base md:text-lg font-medium text-gray-700">{title}</h2>
        <div className="flex items-center gap-2">
          <button 
            className="flex items-center gap-1 text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 pl-3 pr-2 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
            onClick={onAdd}
          >
            New <HiMiniPlus className="text-base md:text-lg" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {tasks.map((task) => {
          const { roomWithPrefix, orderTypeShort } = formatOrderDisplay(task);
          
          return (
            <div 
              key={task._id}
              className="flex justify-between items-center py-2 px-5 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onTaskClick(task._id)}
            >
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(task)}`}></div>
                <span className="text-xs md:text-sm text-gray-700 font-medium">{roomWithPrefix}</span>
                <span className="text-xs text-gray-500">| {orderTypeShort} |</span>
                <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {!isEditMode && (
                  <LuListChecks 
                    className="text-lg md:text-xl text-gray-400 hover:text-primary cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTask(task._id);
                    }}
                  />
                )}
                {isEditMode && (
                  <LuTrash2 
                    className="text-red-500 hover:text-red-300 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task._id);
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
        
        {tasks.length === 0 && (
          <p className="text-xs md:text-sm text-gray-400">No orders</p>
        )}
      </div>
    </div>
  );
};

// Regular section component
const WhiteboardSection = ({ 
  title, 
  tasks, 
  sectionType, 
  isEditMode, 
  onAdd, 
  onTaskClick, 
  onTodoComplete, 
  onDelete,
  roomNumbers,
  dropdownOpen,
  onToggleDropdown
}) => {
  
  const getRelevantTodoText = (task, sectionType) => {
    const relevantTodo = task.todoChecklist?.find(todo => {
      switch (sectionType) {
        case 'skinCheck':
          return todo.text.toLowerCase().includes("skin check");
        case 'electrodeFixes':
          return todo.text.toLowerCase().includes("fix electrodes");
        case 'disconnects':
          return todo.text.toLowerCase().includes("disconnect") || todo.text.toLowerCase().includes("discontinue");
        case 'rehooks':
          return todo.text.toLowerCase().includes("rehook");
        case 'hyperventilation':
          return todo.text.toLowerCase().includes("hyperventilation");
        case 'photic':
          return todo.text.toLowerCase().includes("photic");
        case 'transfers':
          return todo.text.toLowerCase().includes("transfer patient");
        case 'troubleshoots':
          return todo.text.toLowerCase().includes("troubleshoot");
        default:
          return false;
      }
    });
    return relevantTodo?.text || '';
  };

  const formatDisplayText = (task, sectionType) => {
    const todoText = getRelevantTodoText(task, sectionType);
    const roomNumber = task.title;
    
    switch (sectionType) {
      case 'skinCheck':
        const dayMatch = todoText.match(/Day (\d+)/i);
        return (
          <span className="whitespace-normal break-words">
            {roomNumber}
            {dayMatch && (
              <>
                <span className="text-primary"> | </span>
                Day {dayMatch[1]}
              </>
            )}
          </span>
        );
      
      case 'transfers':
        const transferMatch = todoText.match(/Transfer Patient from\s+(.+?)\s+to\s+(\S+)(?:\s*\|\s*(.+))?/i);
        if (transferMatch) {
          const fromRoom = transferMatch[1];
          const toRoom = transferMatch[2];
          const comment = transferMatch[3];
          return (
            <span className="flex flex-wrap items-center gap-1">
              {fromRoom}
              <LuArrowRight className="text-xs md:text-sm flex-shrink-0" />
              {toRoom}
              {comment && (
                <span className="whitespace-normal break-words">
                  <span className="text-primary">| </span>
                  {comment}
                </span>
              )}
            </span>
          );
        }
        return `${roomNumber}`;
      
      case 'electrodeFixes':
      case 'rehooks':  
      case 'hyperventilation':
      case 'photic':
      case 'disconnects':
      case 'troubleshoots':
        const commentMatch = todoText.match(/\|\s*(.+)$/);
        return (
          <span className="flex flex-wrap items-center gap-1">
            {roomNumber}
            {commentMatch && (
              <span className="whitespace-normal break-words">
                <span className="text-primary">| </span>
                {commentMatch[1]}
              </span>
            )}
          </span>
        );
      default:
        return roomNumber;
    }
  };

  // Sort tasks by room number
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sectionType === 'transfers') {
      // For transfers, extract the "from" room number
      const getFromRoom = (task) => {
        const relevantTodo = task.todoChecklist?.find(todo =>
          todo.text.toLowerCase().includes("transfer patient from")
        );
        if (relevantTodo) {
          const match = relevantTodo.text.match(/Transfer Patient from\s+([\d-]+)/i);
          return match ? match[1] : '';
        }
        return '';
      };
      const roomA = getFromRoom(a);
      const roomB = getFromRoom(b);
      
      // Natural sort (treats "8826-1" and "8826-2" correctly)
      return roomA.localeCompare(roomB, undefined, { numeric: true, sensitivity: 'base' });
    } else {
      // For all other sections, sort by room number (task.title)
      const roomA = a.title || '';
      const roomB = b.title || '';
      
      // Natural sort (treats "8826-1" and "8826-2" correctly)
      return roomA.localeCompare(roomB, undefined, { numeric: true, sensitivity: 'base' });
    }
  });

  return (
    <div className="whiteboard-card">
      <h2 className="text-base md:text-lg font-medium text-gray-700 mb-2">
        {title === "Troubleshoots" ? (
          <>
            Trouble<wbr />shoots
          </>
        ) : (
          title
        )}
      </h2>
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <button 
            className="flex items-center gap-1 text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 pl-3 pr-2 py-1 rounded-lg border border-gray-200/50 cursor-pointer"
            onClick={onToggleDropdown}
          >
            Add <LuChevronDown className={`text-xs md:text-sm transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && roomNumbers.length > 0 && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-24 max-h-48 overflow-y-auto">
              {roomNumbers.map(roomNumber => (
                <button
                  key={roomNumber}
                  className="block w-full text-left px-3 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onAdd(roomNumber);
                    onToggleDropdown();
                  }}
                >
                  {roomNumber}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {sortedTasks.map((task) => {
          const relevantTodo = task.todoChecklist?.find(todo => {
            switch (sectionType) {
              case 'skinCheck':
                return todo.text.toLowerCase().includes("skin check");
              case 'electrodeFixes':
                return todo.text.toLowerCase().includes("fix electrodes");
              case 'disconnects':
                return todo.text.toLowerCase().includes("disconnect") || todo.text.toLowerCase().includes("discontinue");
              case 'rehooks':
                return todo.text.toLowerCase().includes("rehook");
              case 'hyperventilation':
                return todo.text.toLowerCase().includes("hyperventilation");
              case 'photic':
                return todo.text.toLowerCase().includes("photic");
              case 'transfers':
                return todo.text.toLowerCase().includes("transfer patient");
              case 'troubleshoots':
                return todo.text.toLowerCase().includes("troubleshoot");
              default:
                return false;
            }
          });

          return (
            <div 
              key={task._id}
              className={`flex justify-between items-center py-2 px-3 rounded cursor-pointer transition-colors ${
                relevantTodo?.completed 
                  ? 'bg-green-50 hover:bg-green-100' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => onTaskClick(task._id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={`text-xs md:text-sm font-medium ${
                  relevantTodo?.completed 
                    ? 'text-green-700' 
                    : 'text-gray-700'
                }`}>
                  {formatDisplayText(task, sectionType)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isEditMode && relevantTodo && (
                  <input
                    type="checkbox"
                    checked={relevantTodo.completed}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onTodoComplete(task._id, !relevantTodo.completed);
                    }}
                    readOnly
                    className="w-4 h-4 ml-1 accent-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
                  />
                )}
                {isEditMode && (
                  <LuTrash2 
                    className="text-red-500 hover:text-red-300 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task._id);
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
        
        {sortedTasks.length === 0 && (
          <p className="text-xs md:text-sm text-gray-400">No tasks</p>
        )}
      </div>
    </div>
  );
};

export default FloorWhiteboard;