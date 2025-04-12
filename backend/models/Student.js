const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  driveId: String,
  vaccineName: String,
  date: Date
});

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: String,
  class: String,
  age: Number,
  gender: String,
  vaccinations: [vaccinationSchema]
});

module.exports = mongoose.model('Student', studentSchema);
