const File = require('../models/File');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Upload file using Cloudinary
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { parentFolder } = req.body;
    
    const fileUrl = req.file.path;
    const cloudinaryId = req.file.filename;
    
    // Determine file type from original filename
    const ext = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'other';
    
    if (['.jpg', '.jpeg', '.png'].includes(ext)) fileType = 'image';
    else if (['.pdf'].includes(ext)) fileType = 'pdf';

    const newFile = await File.create({
      name: req.file.originalname,
      type: 'file',
      fileType,
      fileUrl: fileUrl,
      fileName: cloudinaryId,
      size: req.file.size,
      parentFolder: parentFolder || null,
      uploadedBy: req.user._id,
    });

    const populatedFile = await File.findById(newFile._id).populate('uploadedBy', 'name');
    
    res.status(201).json({ message: 'File uploaded successfully', file: populatedFile });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete file deletes from Cloudinary
const deleteFileFromCloudinary = async (cloudinaryId, fileType) => {
  if (!cloudinaryId) return;
  
  try {
    // Determine resource_type based on file type
    let resourceType = 'raw'; // For documents (PDF, Word, etc.)
    if (fileType === 'image') {
      resourceType = 'image';
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(cloudinaryId, { 
      resource_type: resourceType 
    });
    
    console.log(`Deleted from Cloudinary: ${cloudinaryId}`);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

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
            // Delete file from Cloudinary
            await deleteFileFromCloudinary(item.fileName, item.fileType);
          }
          await item.deleteOne();
        }
      };
      
      await deleteFolder(file._id);
    } else {
      // Delete single file from Cloudinary
      await deleteFileFromCloudinary(file.fileName, file.fileType);
    }

    await file.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download file redirects to Cloudinary URL
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file || file.type !== 'file') {
      return res.status(404).json({ message: 'File not found' });
    }

    // Redirect to the URL. Cloudinary handles the download
    res.redirect(file.fileUrl);
    
    // Alternative: Force download with attachment flag
    // const downloadUrl = file.fileUrl.replace('/upload/', '/upload/fl_attachment/');
    // res.redirect(downloadUrl);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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

module.exports = {
  getFiles,
  createFolder,
  uploadFile,
  deleteFile,
  downloadFile,
};