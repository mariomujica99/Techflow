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
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    // Determine resource type
    let resourceType = 'raw'; // Default to raw for documents
    let folder = 'techflow/documents';
    
    // Images need 'image' resource type
    if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      resourceType = 'image';
      folder = 'techflow/images';
    } else if (fileExtension === 'pdf') {
      folder = 'techflow/pdfs';
      // PDFs stay as 'raw'
    }
    
    return {
      folder: folder,
      resource_type: resourceType, // 'image' or 'raw'
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