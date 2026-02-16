
import express from 'express';
import { MockDB } from '../../services/mockDb';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await MockDB.login(username, password);

    if (result) {
      res.json({
        success: true,
        token: result.token,
        user: result.user
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

export default router;
