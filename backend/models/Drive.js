const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  vaccineName: String,
  date: Date,
  dosesAvailable: Number,
  applicableClasses: [String],
  isExpired: { type: Boolean, default: false }
});

module.exports = mongoose.model('Drive', driveSchema);
