require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Reuse one DB connection (needed on Vercel serverless)
let connecting;
const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connecting) connecting = mongoose.connect(process.env.MONGODB_URI).catch(e => { connecting = null; throw e; });
  return connecting;
};
app.use('/api', async (_req, res, next) => {
  try { await connectDB(); next(); }
  catch { res.status(500).json({ error: 'Database connection failed' }); }
});

const requireAdmin = (req, res, next) =>
  req.get('x-admin-key') && req.get('x-admin-key') === process.env.ADMIN_KEY
    ? next() : res.status(401).json({ error: 'Invalid admin key' });

app.get('/api/projects', async (_req, res) => {
  try { res.json(await Project.find().sort({ createdAt: -1 })); }
  catch { res.status(500).json({ error: 'Could not load projects' }); }
});
app.post('/api/projects', requireAdmin, async (req, res) => {
  try { res.status(201).json(await Project.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  try { await Project.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch { res.status(400).json({ error: 'Invalid id' }); }
});
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !/^\S+@\S+\.\S+$/.test(email || '') || !message)
    return res.status(400).json({ error: 'Enter your name, a valid email, and a message.' });
  try { await Message.create({ name, email, message }); res.status(201).json({ ok: true }); }
  catch { res.status(500).json({ error: 'Could not send your message. Try again.' }); }
});

module.exports = app;

// Run a normal server only for local use (npm start)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
}
