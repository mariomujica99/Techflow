const Whiteboard = require('../models/Whiteboard');

// @desc    Get whiteboard data
// @route   GET /api/whiteboard
// @access  Private
const getWhiteboard = async (req, res) => {
  try {
    let whiteboard = await Whiteboard.findOne()
      .populate('coverage.onCall', 'name profileImageUrl profileColor')
      .populate('coverage.surgCall', 'name profileImageUrl profileColor')
      .populate('coverage.scanning', 'name profileImageUrl profileColor')
      .populate('coverage.surgicals', 'name profileImageUrl profileColor')
      .populate('coverage.wada', 'name profileImageUrl profileColor')
      .populate('outpatients.np8am', 'name profileImageUrl profileColor')
      .populate('outpatients.op8am1', 'name profileImageUrl profileColor')
      .populate('outpatients.op8am2', 'name profileImageUrl profileColor')
      .populate('outpatients.op10am', 'name profileImageUrl profileColor')
      .populate('outpatients.op12pm', 'name profileImageUrl profileColor')
      .populate('outpatients.op2pm', 'name profileImageUrl profileColor')
      .populate('readingProviders.emu', 'name profileColor')
      .populate('readingProviders.ltm', 'name profileColor')
      .populate('readingProviders.routine', 'name profileColor')
      .populate('lastUpdatedBy', 'name');

    // If no whiteboard exists, create a default one with np8am
    if (!whiteboard) {
      whiteboard = await Whiteboard.create({
        coverage: {},
        outpatients: {
          np8am: [],
        },
        readingProviders: {},
        lastUpdatedBy: req.user._id,
        comments: [],
      });
      
      whiteboard = await Whiteboard.findById(whiteboard._id)
        .populate('lastUpdatedBy', 'name');
    }

    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update whiteboard
// @route   PUT /api/whiteboard
// @access  Private
const updateWhiteboard = async (req, res) => {
  try {
    const { coverage, outpatients, readingProviders } = req.body;

    let whiteboard = await Whiteboard.findOne();

    if (!whiteboard) {
      // Create a new whiteboard if none exists
      whiteboard = await Whiteboard.create({
        coverage: {
          onCall: (coverage && coverage.onCall) || [],
          surgCall: (coverage && coverage.surgCall) || [],
          scanning: (coverage && coverage.scanning) || [],
          surgicals: (coverage && coverage.surgicals) || [],
          wada: (coverage && coverage.wada) || [],
        },
        outpatients: {
          np8am: (outpatients && outpatients.np8am) || [],
          op8am1: (outpatients && outpatients.op8am1) || [],
          op8am2: (outpatients && outpatients.op8am2) || [],
          op10am: (outpatients && outpatients.op10am) || [],
          op12pm: (outpatients && outpatients.op12pm) || [],
          op2pm: (outpatients && outpatients.op2pm) || [],
        },
        readingProviders: readingProviders || {},
        lastUpdatedBy: req.user._id,
        comments: req.body.comments || [],
      });
    } else {
      // Update coverage arrays if provided
      if (coverage) {
        whiteboard.coverage = {
          onCall: coverage.onCall || [],
          surgCall: coverage.surgCall || [],
          scanning: coverage.scanning || [],
          surgicals: coverage.surgicals || [],
          wada: coverage.wada || [],
        };
      }

      // Update outpatient arrays if provided
      if (outpatients) {
        whiteboard.outpatients = {
          np8am: outpatients.np8am || [],
          op8am1: outpatients.op8am1 || [],
          op8am2: outpatients.op8am2 || [],
          op10am: outpatients.op10am || [],
          op12pm: outpatients.op12pm || [],
          op2pm: outpatients.op2pm || [],
        };
      }

      // Reading providers
      if (readingProviders) whiteboard.readingProviders = readingProviders;

      whiteboard.lastUpdatedBy = req.user._id;
      whiteboard.comments = req.body.comments || whiteboard.comments;

      await whiteboard.save();

      // Handle NP task AFTER whiteboard is saved
      if (outpatients && outpatients.np8am !== undefined) {
        // Don't await - let it run asynchronously
        handleNPTask(outpatients.np8am, req.user._id).catch(err => {
          console.error('Failed to create/update NP task:', err);
        });
      }      
    }

    // Populate the response
    const updatedWhiteboard = await Whiteboard.findById(whiteboard._id)
      .populate('coverage.onCall', 'name profileImageUrl profileColor')
      .populate('coverage.surgCall', 'name profileImageUrl profileColor')
      .populate('coverage.scanning', 'name profileImageUrl profileColor')
      .populate('coverage.surgicals', 'name profileImageUrl profileColor')
      .populate('coverage.wada', 'name profileImageUrl profileColor')
      .populate('outpatients.np8am', 'name profileImageUrl profileColor')
      .populate('outpatients.op8am1', 'name profileImageUrl profileColor')
      .populate('outpatients.op8am2', 'name profileImageUrl profileColor')
      .populate('outpatients.op10am', 'name profileImageUrl profileColor')
      .populate('outpatients.op12pm', 'name profileImageUrl profileColor')
      .populate('outpatients.op2pm', 'name profileImageUrl profileColor')
      .populate('readingProviders.emu', 'name profileColor')
      .populate('readingProviders.ltm', 'name profileColor')
      .populate('readingProviders.routine', 'name profileColor')
      .populate('lastUpdatedBy', 'name');

    res.json({ message: 'Whiteboard updated successfully', whiteboard: updatedWhiteboard });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to create or update NP task
const handleNPTask = async (np8amUsers, userId) => {
  try {
    const Task = require('../models/Task');
    
    // Check if users are assigned to NP slot
    if (np8amUsers && np8amUsers.length > 0) {
      // Check if NP task exists for today
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      
      let npTask = await Task.findOne({
        title: 'NP',
        createdAt: { $gte: todayStart, $lte: todayEnd }
      });
      
      const formatTimestamp = () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const year = now.getFullYear().toString().slice(-2);
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        
        return `(${month}/${day}/${year} at ${hours}:${minutes} ${ampm})`;
      };
      
      // If NP task doesn't exist, create it
      if (!npTask) {
        const timestamp = formatTimestamp();
        const todoChecklist = [
          { text: `Hook-Up ${timestamp}`, completed: true },
          { text: `Transfer Patient ${timestamp}`, completed: true },
          { text: `Place Charge & Chart ${timestamp}`, completed: true },
          { text: `Disconnect ${timestamp}`, completed: false }
        ];
        
        await Task.create({
          title: 'NP',
          orderType: 'Neuropsychiatric EEG',
          electrodeType: 'Regular Leads',
          adhesiveType: 'None',
          allergyType: 'None',
          sleepDeprivationType: 'Not Ordered',
          priority: 'Routine',
          comStation: null,
          assignedTo: np8amUsers,
          createdBy: userId,
          todoChecklist: todoChecklist,
          comments: null,
          status: 'In Progress',
          progress: 75 // 3 out of 4 items completed
        });
      } else {
        // Update assigned users if task exists
        npTask.assignedTo = np8amUsers;
        await npTask.save();
      }
    }
  } catch (error) {
    console.error('Error handling NP task:', error);
    // Don't throw the error - just log it so whiteboard update can continue
  }
};

module.exports = {
  getWhiteboard,
  updateWhiteboard,
};