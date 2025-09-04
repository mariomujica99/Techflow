const mongoose = require('mongoose');
const { create } = require('./User');

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    orderType: { type: String },
    electrodeType: { type: String, enum: ['Regular Leads', 'MRI Leads'], default: 'Regular Leads' },
    adhesiveType: { type: String, enum: ['Collodion', 'Tensive'], default: 'Collodion' },
    allergyType: { type: String, enum: ['None', 'Adhesive Allergy'], default: 'None' },
    priority: { type: String, enum: ['Routine', 'ASAP', 'STAT'], default: 'Routine' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    // dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attachments: [{ type: String }], // URLs to files
    todoChecklist: [todoSchema], // Sub-document for todos
    progress: { type: Number, default: 0 }, // Progress percentage
    completedOn: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);