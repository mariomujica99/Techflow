const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profileColor: { type: String, default: null },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    pagerNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Provider', ProviderSchema);