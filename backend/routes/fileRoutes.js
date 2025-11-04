const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getFiles, createFolder, uploadFile, deleteFile, downloadFile } = require('../controllers/fileController');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/', protect, getFiles);
router.post('/folder', protect, adminOnly, createFolder);
router.post('/upload', protect, adminOnly, upload.single('file'), uploadFile);
router.delete('/:id', protect, adminOnly, deleteFile);
router.get('/download/:id', protect, downloadFile);

module.exports = router;