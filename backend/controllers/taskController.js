const Task = require('../models/Task');

// Determine if a task is disconnected
const isTaskDisconnected = (task) => {
  if (!task.todoChecklist || task.todoChecklist.length === 0) return false;
  
  // Check if both disconnect-related todos are completed
  const hasDisconnect = task.todoChecklist.some(todo => {
    const text = todo.text.replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+at\s+\d{1,2}:\d{2}\s+[AP]M\)\s*$/, '').trim().toLowerCase();
    return (text.includes('disconnect') || text.includes('discontinue')) && todo.completed;
  });
  
  const hasEndTimeChart = task.todoChecklist.some(todo => {
    const text = todo.text.replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+at\s+\d{1,2}:\d{2}\s+[AP]M\)\s*$/, '').trim().toLowerCase();
    return text.includes('place end time') && text.includes('chart') && text.includes('inform reading provider') && todo.completed;
  });
  
  return hasDisconnect && hasEndTimeChart;
};

// @desc    Get tasks assigned to the current user (always user-specific)
// @route   GET /api/tasks/
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    // Always restrict to current user, even if admin
    let tasks = await Task.find({ ...filter, assignedTo: req.user._id })
    .populate('assignedTo', 'name email profileImageUrl profileColor')
    .populate('comStation', 'comStation comStationStatus')

    // Add completed todoChecklist count and recalculate progress and status
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        const totalCount = task.todoChecklist.length;
        const actualProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        
        // Check if task is disconnected
        let actualStatus = task.status;
        if (isTaskDisconnected(task)) {
          actualStatus = 'Disconnected';
        } else if (actualProgress === 100) {
          actualStatus = 'Completed';
        } else if (actualProgress > 0) {
          actualStatus = 'In Progress';
        } else {
          actualStatus = 'Pending';
        }
        
        return { 
          ...task._doc, 
          completedTodoCount: completedCount,
          progress: actualProgress,
          status: actualStatus
        };
      })
    );

    // Status summary counts (always user-specific)
    const allUserTasks = await Task.find({ assignedTo: req.user._id });

    // Recalculate all statuses to get accurate counts
    let pendingCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let disconnectedCount = 0;

    allUserTasks.forEach(task => {
      if (isTaskDisconnected(task)) {
        disconnectedCount++;
      } else {
        const completedTodoCount = task.todoChecklist.filter(item => item.completed).length;
        const totalTodoCount = task.todoChecklist.length;
        const progress = totalTodoCount > 0 ? Math.round((completedTodoCount / totalTodoCount) * 100) : 0;
        
        if (progress === 100) {
          completedCount++;
        } else if (progress > 0) {
          inProgressCount++;
        } else {
          pendingCount++;
        }
      }
    });

    const allTasks = allUserTasks.length;

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks: pendingCount,
        inProgressTasks: inProgressCount,
        completedTasks: completedCount,
        disconnectedTasks: disconnectedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Get all tasks for all users (Admin and User access)
// @route   GET /api/tasks/all
// @access  Private
const getAllTasksForEveryone = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    // Get all tasks regardless of role
    const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email profileImageUrl profileColor')
    .populate('comStation', 'comStation comStationStatus')

    // Add completed todoChecklist count and recalculate progress and status
    const tasksWithCount = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        const totalCount = task.todoChecklist.length;
        const actualProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        
        // Check if task is disconnected
        let actualStatus = task.status;
        if (isTaskDisconnected(task)) {
          actualStatus = 'Disconnected';
        } else if (actualProgress === 100) {
          actualStatus = 'Completed';
        } else if (actualProgress > 0) {
          actualStatus = 'In Progress';
        } else {
          actualStatus = 'Pending';
        }
        
        return { 
          ...task._doc, 
          completedTodoCount: completedCount,
          progress: actualProgress,
          status: actualStatus
        };
      })
    );

    // Status summary counts for all tasks
    const allTasksList = await Task.find();

    // Recalculate all statuses to get accurate counts
    let pendingCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let disconnectedCount = 0;

    allTasksList.forEach(task => {
      if (isTaskDisconnected(task)) {
        disconnectedCount++;
      } else {
        const completedTodoCount = task.todoChecklist.filter(item => item.completed).length;
        const totalTodoCount = task.todoChecklist.length;
        const progress = totalTodoCount > 0 ? Math.round((completedTodoCount / totalTodoCount) * 100) : 0;
        
        if (progress === 100) {
          completedCount++;
        } else if (progress > 0) {
          inProgressCount++;
        } else {
          pendingCount++;
        }
      }
    });

    const allTasks = allTasksList.length;

    res.json({
      tasks: tasksWithCount,
      statusSummary: {
        all: allTasks,
        pendingTasks: pendingCount,
        inProgressTasks: inProgressCount,
        completedTasks: completedCount,
        disconnectedTasks: disconnectedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email profileImageUrl profileColor')
    .populate('comStation', 'comStation comStationStatus')

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Recalculate status to check if disconnected
    let actualStatus = task.status;
    if (isTaskDisconnected(task)) {
      actualStatus = 'Disconnected';
    }
    
    // Return task with recalculated status
    const taskData = {
      ...task._doc,
      status: actualStatus
    };

    res.json(taskData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new task (Admin only)
// @route   POST /api/tasks/
// @access  Private (Admin)
const createTask = async (req, res) => {
  try {
    const {
      title,
      orderType,
      electrodeType,
      adhesiveType,
      allergyType,
      sleepDeprivationType,
      priority,
      comStation,
      assignedTo,
      comments,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({ message: 'assignedTo must be an array of user IDs' });
    }

    const task = await Task.create({
      title,
      orderType,
      electrodeType,
      adhesiveType,
      allergyType,
      sleepDeprivationType,
      priority,
      comStation,
      assignedTo,
      createdBy: req.user._id,
      todoChecklist,
      comments,
    });
    
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = req.body.title || task.title;
    task.orderType = req.body.orderType || task.orderType;
    task.electrodeType = req.body.electrodeType || task.electrodeType;
    task.adhesiveType = req.body.adhesiveType || task.adhesiveType;
    task.allergyType = req.body.allergyType || task.allergyType;
    task.sleepDeprivationType = req.body.sleepDeprivationType || task.sleepDeprivationType;
    task.priority = req.body.priority || task.priority;
    task.comStation = req.body.comStation || task.comStation;
    task.comments = req.body.comments || task.comments;

    // Handle todoChecklist - preserve timestamps for existing todos
    if (req.body.todoChecklist) {
      const prevTodoChecklist = task.todoChecklist || [];
      
      task.todoChecklist = req.body.todoChecklist.map((item) => {
        const itemText = typeof item === 'string' ? item : item.text;
        const matchedTask = prevTodoChecklist.find((todo) => todo.text === itemText);
        
        if (matchedTask) {
          // Preserve existing todo with its timestamps
          return matchedTask;
        } else {
          // Return new todo - Mongoose will add timestamps on save
          return {
            text: itemText,
            completed: false,
          };
        }
      });
    }

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({ message: 'assignedTo must be an array of user IDs' });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({ message: 'Task updated successfully', updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a task (Admin only)
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized' });
    }

    task.status = req.body.status || task.status;

    if (task.status === 'Completed') {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: 'Task status updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // if (!task.assignedTo.includes(req.user._id) && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'You are not authorized to update this checklist' });
    // }

    // Auto-assign user to task if they're not already assigned
    if (!task.assignedTo.includes(req.user._id)) {
      task.assignedTo.push(req.user._id);
    }

    task.todoChecklist = todoChecklist; // Replace with updated checklist

    // Auto-update progress based on checklist completion
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoChecklist.length;
    task.progress = 
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
    
    // Auto-mark task as completed if all items are checked
    if (task.progress === 100) {
      task.status = 'Completed';
      if (!task.completedOn) {
        const today = new Date();
        const localDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());        
        task.completedOn = localDate;
      }
    } else if (task.progress > 0) {
      task.status = 'In Progress';
      task.completedOn = null; // Remove completion date if not fully completed
    } else {
      task.status = 'Pending';
      task.completedOn = null; // Remove completion date if not fully completed
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email profileImageUrl profileColor')
    .populate('comStation', 'comStation comStationStatus')

    res.json({ message: 'Task checklist updated successfully', task:updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard data (Admin only)
// @route   GET /api/tasks/dashboard-data
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    // Fetch statistics
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    // Ensure all possible statuses are included
    const taskStatuses = ['Pending', 'In Progress', 'Completed'];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ''); // Remove spaces for response keys
      acc[formattedKey] = 
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution['All'] = totalTasks; // Add total count to taskDistribution

    // Ensure all priority levels are included
    const taskPriorities = ['Routine', 'ASAP', 'STAT'];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title status priority createdAt')
    
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard data (User-specific)
// @route   GET /api/tasks/user-dashboard-data
// @access  Private
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id; // Only fetch data for the logged-in user

    // Fetch statistics for user-specific tasks
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'Pending' });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'Completed' });

    // Task distribution by status
    const taskStatuses = ['Pending', 'In Progress', 'Completed'];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, '');
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution['All'] = totalTasks;

    // Task distribution by priority
    const taskPriorities = ['Routine', 'ASAP', 'STAT'];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 tasks for the logged-in user
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title status priority createdAt');
    
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTasks,
  getAllTasksForEveryone,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};