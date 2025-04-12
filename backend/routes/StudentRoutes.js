const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Add a student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /students/:id/vaccination
router.patch('/:id/vaccination', async (req, res) => {
  const { driveId, vaccineName, date } = req.body;
  const student = await Student.findById(req.params.id);

  // Prevent duplicate vaccination for same drive/vaccine
  const alreadyVaccinated = student.vaccinations.some(v => v.driveId === driveId || v.vaccineName === vaccineName);

  if (alreadyVaccinated) {
    return res.status(400).json({ error: 'Student already vaccinated for this drive/vaccine' });
  }

  student.vaccinations.push({ driveId, vaccineName, date });
  await student.save();
  res.json(student);
});


const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

// POST /students/upload (CSV)
router.post('/upload', upload.single('file'), async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Student.insertMany(results);
        res.status(201).json({ message: 'Bulk upload successful', count: results.length });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
});

module.exports = router;
