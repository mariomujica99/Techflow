const mongoose = require('mongoose');

const whiteboardSchema = new mongoose.Schema(
  {
    coverage: {
      onCall: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      surgCall: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      scanning: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      surgicals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      wada: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    outpatients: {
      np8am: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      op8am1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      op8am2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      op10am: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      op12pm: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      op2pm: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    readingProviders: {
      emu: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', default: null },
      ltm: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', default: null },
      routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', default: null },
    },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: String }], // Text comments
  },
  { timestamps: true }
);

module.exports = mongoose.model('Whiteboard', whiteboardSchema);