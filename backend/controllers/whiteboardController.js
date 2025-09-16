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
      .populate('outpatients.op8am1', 'name profileImageUrl profileColor')
      .populate('outpatients.op8am2', 'name profileImageUrl profileColor')
      .populate('outpatients.op10am', 'name profileImageUrl profileColor')
      .populate('outpatients.op12pm', 'name profileImageUrl profileColor')
      .populate('outpatients.op2pm', 'name profileImageUrl profileColor')
      .populate('readingProviders.emu', 'name profileColor')
      .populate('readingProviders.ltm', 'name profileColor')
      .populate('readingProviders.routine', 'name profileColor')
      .populate('lastUpdatedBy', 'name');

    // If no whiteboard exists, create a default one
    if (!whiteboard) {
      whiteboard = await Whiteboard.create({
        coverage: {},
        outpatients: {},
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
    }

    // Populate the response
    const updatedWhiteboard = await Whiteboard.findById(whiteboard._id)
      .populate('coverage.onCall', 'name profileImageUrl profileColor')
      .populate('coverage.surgCall', 'name profileImageUrl profileColor')
      .populate('coverage.scanning', 'name profileImageUrl profileColor')
      .populate('coverage.surgicals', 'name profileImageUrl profileColor')
      .populate('coverage.wada', 'name profileImageUrl profileColor')
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

module.exports = {
  getWhiteboard,
  updateWhiteboard,
};