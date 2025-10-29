const ComStation = require('../models/ComStation');

// @desc    Get all computer stations
// @route   GET /api/com-stations
// @access  Private
const getComStations = async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};

    if (type && type !== 'All Computer Stations') {
      if (type === 'All Inactive Stations') {
        filter.comStationStatus = 'Inactive';
      } else if (type === 'EMU Station') {
        filter.comStationType = 'EMU Station';
      } else if (type === 'EEG Cart - All') {
        filter.comStationType = 'EEG Cart';
      } else if (type === 'EEG Cart - Inpatient') {
        filter.comStationType = 'EEG Cart';
        filter.comStationLocation = 'Inpatient';
      } else if (type === 'EEG Cart - Outpatient') {
        filter.comStationType = 'EEG Cart';
        filter.comStationLocation = 'Outpatient';
      } else if (type === 'EEG Cart - Bellevue') {
        filter.comStationType = 'EEG Cart';
        filter.comStationLocation = 'Bellevue';
      }
    }

    const comStations = await ComStation.find(filter).sort({ createdAt: -1 });
    res.json(comStations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create computer station
// @route   POST /api/com-stations
// @access  Private
const createComStation = async (req, res) => {
  try {
    const { comStation, comStationType, comStationLocation, comStationStatus, issueDescription, hasTicket, ticketNumber } = req.body;

    const existingStation = await ComStation.findOne({ comStation });
    if (existingStation) {
      return res.status(400).json({ message: 'Computer station already exists' });
    }

    const newComStation = await ComStation.create({
      comStation,
      comStationType,
      comStationLocation,
      comStationStatus: comStationStatus || 'Active',
      issueDescription: comStationStatus === 'Inactive' ? issueDescription : '',
      hasTicket: comStationStatus === 'Inactive' ? (hasTicket || false) : false,
      ticketNumber: comStationStatus === 'Inactive' && hasTicket ? ticketNumber : ''
    });

    res.status(201).json({ message: 'Computer station created successfully', comStation: newComStation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update computer station
// @route   PUT /api/com-stations/:id
// @access  Private
const updateComStation = async (req, res) => {
  try {
    const { comStationType, comStationLocation, comStationStatus, issueDescription, hasTicket, ticketNumber } = req.body;
    
    const comStation = await ComStation.findById(req.params.id);
    if (!comStation) {
      return res.status(404).json({ message: 'Computer station not found' });
    }

    comStation.comStationType = comStationType || comStation.comStationType;
    comStation.comStationLocation = comStationLocation || comStation.comStationLocation;
    comStation.comStationStatus = comStationStatus || comStation.comStationStatus;
    
    // Clear issue-related fields if status is Active
    if (comStationStatus === 'Active') {
      comStation.issueDescription = '';
      comStation.hasTicket = false;
      comStation.ticketNumber = '';
    } else {
      comStation.issueDescription = issueDescription || '';
      comStation.hasTicket = hasTicket || false;
      comStation.ticketNumber = hasTicket ? (ticketNumber || '') : '';
    }

    const updatedComStation = await comStation.save();
    res.json({ message: 'Computer station updated successfully', comStation: updatedComStation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete computer station
// @route   DELETE /api/com-stations/:id
// @access  Private
const deleteComStation = async (req, res) => {
  try {
    const comStation = await ComStation.findById(req.params.id);
    if (!comStation) {
      return res.status(404).json({ message: 'Computer station not found' });
    }

    await comStation.deleteOne();
    res.json({ message: 'Computer station deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getComStations,
  createComStation,
  updateComStation,
  deleteComStation,
};