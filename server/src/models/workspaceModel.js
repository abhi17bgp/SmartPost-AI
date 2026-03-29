const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workspace must have a name'],
    trim: true,
    default: 'My Workspace'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Workspace must belong to a user']
  }
}, {
  timestamps: true
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
module.exports = Workspace;
