'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      enum: ['student', 'assistant', 'teacher'],
      type: String,
      required: true,
      default: 'student'
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
