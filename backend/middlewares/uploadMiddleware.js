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
];

const ALLOWED_EXTENSIONS = [
  'jpg', 'jpeg', 'png',           // Images
  'pdf',                          // PDF
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
    } else if (fileExtension === 'pdf') {
      folder = 'techflow/pdfs';
    }
    
    return {
      folder: folder,
      allowed_formats: ALLOWED_EXTENSIONS,
      resource_type: resourceType, // 'image', 'raw', or 'auto'
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