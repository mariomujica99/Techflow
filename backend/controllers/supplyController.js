const Supply = require('../models/Supply');

// @desc    Get all supplies
// @route   GET /api/supplies
// @access  Private
const getSupplies = async (req, res) => {
  try {
    const supplies = await Supply.find().populate('lastUpdatedBy', 'name');
    res.json(supplies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update supplies for a storageRoom
// @route   PUT /api/supplies/:storageRoom
// @access  Private
const updateSupplies = async (req, res) => {
  try {
    const { storageRoom } = req.params;
    const { items } = req.body;

    let supply = await Supply.findOne({ storageRoom });

    if (!supply) {
      supply = await Supply.create({
        storageRoom,
        items,
        lastUpdatedBy: req.user._id,
      });
    } else {
      supply.items = items;
      supply.lastUpdatedBy = req.user._id;
      await supply.save();
    }

    const updatedSupply = await Supply.findById(supply._id).populate('lastUpdatedBy', 'name');
    res.json({ message: 'Supplies updated successfully', supply: updatedSupply });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSupplies,
  updateSupplies,
};