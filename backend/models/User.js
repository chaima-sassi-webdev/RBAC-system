const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetToken: {
      type: String,
      default: null,
    },

    role: {
      type: String,

      enum: [
        "super_admin",
        "admin",
        "hr",
        "project_manager",
        "employee"
      ],

      default: "employee",
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);