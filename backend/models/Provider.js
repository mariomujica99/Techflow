const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profileColor: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Provider', ProviderSchema);