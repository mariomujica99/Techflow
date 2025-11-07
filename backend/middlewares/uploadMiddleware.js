const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Allowed file types
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/jpg',
  
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  
  // Presentations
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  
  // Spreadsheets
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const ALLOWED_EXTENSIONS = [
  'jpg', 'jpeg', 'png',           // Images
  'pdf',                          // PDF
  'doc', 'docx',                  // Word
  'ppt', 'pptx',                  // PowerPoint
  'xls', 'xlsx'                   // Excel
];

// Cloudinary storage configuration
// Files are uploaded directly to Cloudinary
// Cloudinary returns a URL which is stored in MongoDB
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Get file extension
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    let resourceType = 'auto';
    
    // Organize by file type in Cloudinary folders
    let folder = 'techflow/documents';
    if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      folder = 'techflow/images';
      resourceType = 'image';
    } else if (fileExtension === 'pdf') {
      folder = 'techflow/pdfs';
      resourceType = 'image'; // PDF preview works with 'image' type
    } else {
      resourceType = 'raw'; // For doc, docx, xls, xlsx, ppt, pptx
    }
    
    // Create a clean public_id from original filename
    const timestamp = Date.now();
    const cleanFileName = file.originalname
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9]/g, '_') // Replace special chars with underscore
      .substring(0, 50); // Limit length
    
    const publicId = `${cleanFileName}_${timestamp}`;
    
    return {
      folder: folder,
      allowed_formats: ALLOWED_EXTENSIONS,
      resource_type: resourceType,
      public_id: publicId,
      // Force original filename for downloads
      use_filename: true,
      unique_filename: false
    };
  }
});

// File validation filter. Runs before upload to validate file type
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error(
        'Invalid file type. Only images, PDFs, Word, PowerPoint, and Excel files are allowed'
      ),
      false
    );
  }
};

// Multer configuration
const upload = multer({
  storage: storage,              // Use Cloudinary storage
  fileFilter: fileFilter,        // Validate file types
  limits: {
    fileSize: 50 * 1024 * 1024,  // 50MB max file size
    files: 5                      // Max 5 files per request (for multiple uploads)
  }
});

module.exports = upload;