const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['text', 'audio'], default: 'text' }
});

module.exports = mongoose.model('Note', NoteSchema);