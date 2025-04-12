const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Drive = require('../models/Drive');

router.get('/summary', async (req, res) => {
  const totalStudents = await Student.countDocuments();
  const vaccinatedStudents = await Student.countDocuments({ "vaccinations.0": { $exists: true } });

  const now = new Date();
  const next30 = new Date();
  next30.setDate(now.getDate() + 30);

  const upcomingDrives = await Drive.find({ date: { $gte: now, $lte: next30 } });

  res.json({
    totalStudents,
    vaccinatedStudents,
    vaccinationRate: totalStudents === 0 ? 0 : Math.round((vaccinatedStudents / totalStudents) * 100),
    upcomingDrives
  });
});

module.exports = router;
