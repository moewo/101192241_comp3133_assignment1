const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true
  },
  date_of_joining: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  employee_photo: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
