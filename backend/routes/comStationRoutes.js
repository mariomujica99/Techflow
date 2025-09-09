const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { 
  getComStations, 
  createComStation, 
  updateComStation, 
  deleteComStation,
} = require('../controllers/comStationController');

const router = express.Router();

router.get('/', protect, getComStations);
router.post('/', protect, createComStation);
router.put('/:id', protect, updateComStation);
router.delete('/:id', protect, deleteComStation);

module.exports = router;