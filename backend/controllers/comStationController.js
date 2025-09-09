const ComStation = require('../models/ComStation');

// @desc    Get all computer stations
// @route   GET /api/com-stations
// @access  Private
const getComStations = async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};

    if (type && type !== 'All Computer Stations') {
      if (type === 'EMU Station') {
        filter.comStationType = 'EMU Station';
      } else if (type === 'EEG Cart') {
        filter.comStationType = 'EEG Cart';
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
    const { comStation, comStationType, comStationLocation, graveyardReason } = req.body;

    const existingStation = await ComStation.findOne({ comStation });
    if (existingStation) {
      return res.status(400).json({ message: 'Computer station already exists' });
    }

    const newComStation = await ComStation.create({
      comStation,
      comStationType,
      comStationLocation,
      graveyardReason: comStationLocation === 'Graveyard' ? graveyardReason : ''
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
    const { comStationType, comStationLocation, graveyardReason } = req.body;
    
    const comStation = await ComStation.findById(req.params.id);
    if (!comStation) {
      return res.status(404).json({ message: 'Computer station not found' });
    }

    comStation.comStationType = comStationType || comStation.comStationType;
    comStation.comStationLocation = comStationLocation || comStation.comStationLocation;
    comStation.graveyardReason = comStationLocation === 'Graveyard' ? (graveyardReason || '') : '';

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