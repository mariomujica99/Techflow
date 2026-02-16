const Provider = require('../models/Provider');
const bcrypt = require('bcryptjs');

// Demo account emails that have restricted access
const DEMO_EMAILS = ['userdemo@gmail.com', 'admindemo@gmail.com'];

// Helper function to check if user is a demo account
const isDemoAccount = (email) => DEMO_EMAILS.includes(email);

// @desc    Get all providers
// @route   GET /api/providers
// @access  Private
const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find().sort({ name: 1 });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get provider by ID
// @route   GET /api/providers/:id
// @access  Private
const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
      if (!provider) return res.status(404).json({ message: 'Provider not found' });
      res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Create provider
// @route POST /api/providers
// @access Private
const createProvider = async (req, res) => {
  try {
    const { name, profileColor, email, phoneNumber, pagerNumber } = req.body;

    const existingProvider = await Provider.findOne({ name });
    if (existingProvider) {
      return res.status(400).json({ message: 'Provider already exists' });
    }

    const newProvider = await Provider.create({
      name,
      profileColor: profileColor || '#30b5b2',
      email: email || '',
      phoneNumber: phoneNumber || '',
      pagerNumber: pagerNumber || '',
    });

    res.status(201).json({ message: 'Provider created successfully', provider: newProvider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Update provider
// @route PUT /api/providers/:id
// @access Private
const updateProvider = async (req, res) => {
  try {
    const { name, profileColor, email, phoneNumber, pagerNumber } = req.body;
    
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.name = name || provider.name;
    provider.profileColor = profileColor || provider.profileColor;
    provider.email = email !== undefined ? email : provider.email;
    provider.phoneNumber = phoneNumber !== undefined ? phoneNumber : provider.phoneNumber;
    provider.pagerNumber = pagerNumber !== undefined ? pagerNumber : provider.pagerNumber;

    const updatedProvider = await provider.save();
    res.json({ message: 'Provider updated successfully', provider: updatedProvider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a provider (Admin only)
// @route   DELETE /api/providers/:id
// @access  Private (Admin only)
const deleteProvider = async (req, res) => {
  try {
        // Check if demo account
    if (isDemoAccount(req.user.email)) {
      return res.status(403).json({ 
        message: 'Demo accounts cannot delete providers.' 
      });
    }
    const provider = await Provider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    await provider.deleteOne();
    res.json({ message: "Provider deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getProviders, getProviderById, createProvider, updateProvider, deleteProvider };