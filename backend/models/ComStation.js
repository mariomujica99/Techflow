const mongoose = require('mongoose');

const comStationSchema = new mongoose.Schema(
  {
    comStation: { type: String, required: true, unique: true },
    comStationType: { type: String, enum: ['EMU Station', 'EEG Cart'], required: true },
    comStationLocation: { type: String, enum: ['Inpatient', 'Outpatient', 'Bellevue', 'Graveyard'], required: true },
    comStationStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    graveyardReason: { type: String, default: '' },
  },
  { timestamps: true }
);

// Pre-save middleware to set status based on location
comStationSchema.pre('save', function(next) {
  if (this.comStationLocation === 'Graveyard') {
    this.comStationStatus = 'Inactive';
  } else {
    this.comStationStatus = 'Active';
    this.graveyardReason = ''; // Clear graveyard reason if not in graveyard
  }
  next();
});

module.exports = mongoose.model('ComStation', comStationSchema);