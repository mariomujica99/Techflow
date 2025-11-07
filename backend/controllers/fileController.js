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
    const fileSize = req.file.size || req.file.bytes || 0;
    
    // Preserve original filename with extension
    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase();
    let fileType = 'other';
    
    if (['.doc', '.docx'].includes(ext)) fileType = 'doc';
    else if (['.pdf'].includes(ext)) fileType = 'pdf';
    else if (['.ppt', '.pptx'].includes(ext)) fileType = 'ppt';
    else if (['.xls', '.xlsx'].includes(ext)) fileType = 'xls';
    else if (['.jpg', '.jpeg', '.png'].includes(ext)) fileType = 'image';

    const newFile = await File.create({
      name: originalName, // Keep original filename with extension
      type: 'file',
      fileType,
      fileUrl: fileUrl,
      fileName: cloudinaryId,
      size: fileSize,
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

// @desc    Download a file
// @route   GET /api/files/download/:id
// @access  Private
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file || file.type !== 'file') {
      return res.status(404).json({ message: 'File not found' });
    }

    // Map file extensions to proper MIME types
    const mimeTypes = {
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'pdf': 'application/pdf',
      'image': 'image/*'
    };

    const mimeType = mimeTypes[file.fileType] || 'application/octet-stream';

    // Return file info WITH mime type for frontend to handle
    res.json({
      fileUrl: file.fileUrl,
      fileName: file.name,
      fileType: file.fileType,
      size: file.size,
      mimeType: mimeType
    });
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