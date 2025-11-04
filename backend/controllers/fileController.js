const File = require('../models/File');
const fs = require('fs');
const path = require('path');

// Helper function to delete file from server
const deleteFileFromServer = (fileUrl) => {
  if (!fileUrl) return;
  
  try {
    const filename = fileUrl.split('/uploads/')[1];
    if (filename) {
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Helper function to calculate folder size recursively
const calculateFolderSize = async (folderId) => {
  const files = await File.find({ parentFolder: folderId });
  let totalSize = 0;
  
  for (const file of files) {
    if (file.type === 'folder') {
      totalSize += await calculateFolderSize(file._id);
    } else {
      totalSize += file.size || 0;
    }
  }
  
  return totalSize;
};

// @desc    Get all files and folders
// @route   GET /api/files
// @access  Private
const getFiles = async (req, res) => {
  try {
    const { folderId } = req.query;
    
    const filter = {
      parentFolder: folderId || null
    };
    
    const files = await File.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ type: -1, name: 1 }); // Folders first, then alphabetical

    // Calculate folder sizes
    const filesWithSize = await Promise.all(
      files.map(async (file) => {
        if (file.type === 'folder') {
          const folderSize = await calculateFolderSize(file._id);
          return { ...file._doc, size: folderSize };
        }
        return file;
      })
    );

    res.json(filesWithSize);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new folder
// @route   POST /api/files/folder
// @access  Private (Admin)
const createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const newFolder = await File.create({
      name,
      type: 'folder',
      parentFolder: parentFolder || null,
      uploadedBy: req.user._id,
    });

    const populatedFolder = await File.findById(newFolder._id).populate('uploadedBy', 'name');
    res.status(201).json({ message: 'Folder created successfully', file: populatedFolder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Private (Admin)
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { parentFolder } = req.body;
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    
    // Determine file type
    const ext = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'other';
    
    if (['.doc', '.docx'].includes(ext)) fileType = 'doc';
    else if (['.pdf'].includes(ext)) fileType = 'pdf';
    else if (['.ppt', '.pptx'].includes(ext)) fileType = 'ppt';
    else if (['.xls', '.xlsx'].includes(ext)) fileType = 'xls';
    else if (['.jpg', '.jpeg', '.png'].includes(ext)) fileType = 'image';

    const newFile = await File.create({
      name: req.file.originalname,
      type: 'file',
      fileType,
      fileUrl,
      fileName: req.file.filename,
      size: req.file.size,
      parentFolder: parentFolder || null,
      uploadedBy: req.user._id,
    });

    const populatedFile = await File.findById(newFile._id).populate('uploadedBy', 'name');
    res.status(201).json({ message: 'File uploaded successfully', file: populatedFile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a file or folder
// @route   DELETE /api/files/:id
// @access  Private (Admin)
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // If it's a folder, delete all contents recursively
    if (file.type === 'folder') {
      const deleteFolder = async (folderId) => {
        const contents = await File.find({ parentFolder: folderId });
        
        for (const item of contents) {
          if (item.type === 'folder') {
            await deleteFolder(item._id);
          } else {
            deleteFileFromServer(item.fileUrl);
          }
          await item.deleteOne();
        }
      };
      
      await deleteFolder(file._id);
    } else {
      // Delete file from server
      deleteFileFromServer(file.fileUrl);
    }

    await file.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Download a file
// @route   GET /api/files/download/:id
// @access  Private
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file || file.type !== 'file') {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', file.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, file.name);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getFiles,
  createFolder,
  uploadFile,
  deleteFile,
  downloadFile,
};