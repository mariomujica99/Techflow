const mongoose = require('mongoose');
const { create } = require('./User');

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    orderType: { type: String },
    electrodeType: { type: String, enum: ['Regular Leads', 'MRI Leads', 'Depth Electrodes'], default: 'Regular Leads' },
    adhesiveType: { type: String, enum: ['Collodion', 'Tensive', 'None'], default: 'Collodion' },
    allergyType: { type: String, enum: ['None', 'Adhesive Tape'], default: 'None' },
    sleepDeprivationType: { type: String, enum: ['Not Ordered', 'Ordered'], default: 'Not Ordered' },
    priority: { type: String, enum: ['Routine', 'ASAP', 'STAT'], default: 'Routine' },
    comStation: { type: mongoose.Schema.Types.ObjectId, ref: 'ComStation', default: null },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [{ type: String }], // Text comments
    todoChecklist: [todoSchema], // Sub-document for todos
    progress: { type: Number, default: 0 }, // Progress percentage
    completedOn: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);