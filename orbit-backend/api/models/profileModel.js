// api/models/profileModel.js

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    // This creates a reference to the User model.
    // Every profile will be linked to a specific user.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    company: {
      type: String,
    },
    location: {
      type: String,
    },
    // Example: "Software Engineer", "Marketing Manager", "Student"
    status: {
      type: String,
      required: true,
    },
    locationCoords: {
    latitude: { type: Number },
    longitude: { type: Number },
    },
    skills: {
      type: [String], // An array of strings
      required: true,
    },
    bio: {
      type: String,
    },
    // An array of education objects
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldofstudy: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
      },
    ],
    experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
    social: {
      linkedin: {
        type: String,
      },
      twitter: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);