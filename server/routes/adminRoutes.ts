
import express from 'express';
import Message from '../models/Message';
import Announcement from '../models/Announcement';
import Staff from '../models/Staff';
import Gallery from '../models/Gallery';
import { verifyAdmin } from '../middleware/auth';

const router = express.Router();

const getModel = (type: string) => {
  switch(type) {
    case 'messages': return Message;
    case 'announcements': return Announcement;
    case 'staff': return Staff;
    case 'gallery': return Gallery;
    default: throw new Error('Invalid type');
  }
};

// --- Lifecycle Endpoints ---

// Soft Delete (Move to Trash)
router.delete('/:type/:id', verifyAdmin, async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    const item = await Model.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
    res.json({ success: true, message: 'Moved to trash', item });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
});

// Restore from Trash
router.put('/:type/:id/restore', verifyAdmin, async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    const item = await Model.findByIdAndUpdate(req.params.id, { deletedAt: null }, { new: true });
    res.json({ success: true, message: 'Item restored', item });
  } catch (err) {
    res.status(500).json({ error: 'Restore failed' });
  }
});

// Permanent Delete
router.delete('/:type/:id/permanent', verifyAdmin, async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    await Model.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Permanently deleted from server' });
  } catch (err) {
    res.status(500).json({ error: 'Permanent deletion failed' });
  }
});

// Get Trash Contents
router.get('/:type/trash', verifyAdmin, async (req, res) => {
  try {
    const Model = getModel(req.params.type);
    const trash = await Model.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
    res.json(trash);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch trash' });
  }
});

export default router;
