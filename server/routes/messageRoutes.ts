
import express from 'express';
import Message from '../models/Message';
import { sendAdminReplyEmail } from '../services/emailService';
import { verifyAdmin } from '../middleware/auth'; // Hypothetical middleware

const router = express.Router();

// Public: Submit Contact Form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Admin: Reply to Message & Send Email
router.post('/:id/reply', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    // 1. Update DB
    msg.adminReply = replyText;
    msg.replyDate = new Date();
    msg.readStatus = true;
    await msg.save();

    // 2. Dispatch Gmail Notification
    await sendAdminReplyEmail(msg.email, msg.name, msg.subject, replyText);

    res.json({ success: true, message: 'Reply saved and email sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during reply processing' });
  }
});

// Admin: Get all messages
router.get('/', verifyAdmin, async (req, res) => {
  const messages = await Message.find().sort({ date: -1 });
  res.json(messages);
});

export default router;
