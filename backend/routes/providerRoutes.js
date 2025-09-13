const express = require('express');
const { adminOnly, protect } = require('../middlewares/authMiddleware');
const { getProviders, getProviderById, createProvider, updateProvider, deleteProvider } = require('../controllers/providerController');
const router = express.Router();

// Provider Management routes
router.get('/', protect, getProviders); // Get all providers
router.get('/:id', protect, getProviderById); // Get a specific provider by ID
router.post('/', protect, createProvider); // Create a provider
router.put('/:id', protect, updateProvider); // Update a provider
router.delete('/:id', protect, adminOnly, deleteProvider); // Delete a provider (Admin only)

module.exports = router;