import { Router } from 'express';
import create  from '../model/Flow.js';
import agenda from '../agenda.js';
const router = Router();

router.post('/save-flow', async (req, res) => {
  const { nodes, edges } = req.body;
  await create({ nodes, edges });
  res.json({ message: 'Flow saved successfully' });
});

router.post('/schedule-email', async (req, res) => {
  const { to, subject, body, delay } = req.body;
  await agenda.schedule(delay, 'send email', { to, subject, body });
  res.json({ message: 'Email scheduled successfully' });
});

export default router;
