const mongoose = require('mongoose');

const comStationSchema = new mongoose.Schema(
  {
    comStation: { type: String, required: true, unique: true },
    comStationType: { type: String, enum: ['EMU Station', 'EEG Cart'], required: true },
    comStationLocation: { type: String, enum: ['Inpatient', 'Outpatient', 'Bellevue'], required: true },
    comStationStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    issueDescription: { type: String, default: '' },
    hasTicket: { type: Boolean, default: false },
    ticketNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ComStation', comStationSchema);