const express = require('express');
const Note = require('../models/noteModel');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get User's Notes
router.get('/', authMiddleware, async (req, res) => {
    const notes = await Note.find({ userId: req.userId });
    res.json(notes);
});

// Create Note
router.post('/', authMiddleware, async (req, res) => {
    const { content, type } = req.body;
    const newNote = new Note({ userId: req.userId, content, type });
    await newNote.save();
    res.status(201).json(newNote);
});

// Update Note
router.put('/:id', authMiddleware, async (req, res) => {
    const { content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, { content }, { new: true });
    res.json(updatedNote);
});

// Delete Note
router.delete('/:id', authMiddleware, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
});

module.exports = router;
