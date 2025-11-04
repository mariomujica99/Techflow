const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['folder', 'file'], required: true },
    fileType: { type: String }, // 'doc', 'pdf', 'ppt', 'xls', 'image'
    fileUrl: { type: String }, // URL to the uploaded file
    fileName: { type: String }, // Actual filename on server
    size: { type: Number, default: 0 }, // Size in bytes
    parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', FileSchema);