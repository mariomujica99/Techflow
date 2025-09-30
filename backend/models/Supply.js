const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema(
  {
    storageRoom: {
      type: String,
      required: true,
      enum: ['Department', 'Outpatient Rooms', '2nd Floor Storage', '6th Floor Storage', '8th Floor Storage']
    },
    items: [{ type: String }],
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supply', supplySchema);