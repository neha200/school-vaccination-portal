const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');

// Create a new drive
router.post('/', async (req, res) => {
  const { vaccineName, date, dosesAvailable, applicableClasses } = req.body;

  // Ensure drive is at least 15 days in future
  const driveDate = new Date(date);
  const today = new Date();
  const diffDays = (driveDate - today) / (1000 * 60 * 60 * 24);

  if (diffDays < 15) {
    return res.status(400).json({ error: 'Drive must be scheduled at least 15 days in advance.' });
  }

  try {
    const newDrive = new Drive({ vaccineName, date, dosesAvailable, applicableClasses });
    await newDrive.save();
    res.status(201).json(newDrive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get upcoming drives (next 30 days)
router.get('/upcoming', async (req, res) => {
  const now = new Date();
  const next30 = new Date();
  next30.setDate(now.getDate() + 30);

  const drives = await Drive.find({
    date: { $gte: now, $lte: next30 }
  });

  res.json(drives);
});

// Update a drive (if not past)
router.put('/:id', async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (new Date(drive.date) < new Date()) {
      return res.status(400).json({ error: 'Cannot edit past drives' });
    }

    const updated = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
