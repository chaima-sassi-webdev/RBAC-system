const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "info",
        "success",
        "warning",
        "danger",
      ],
      default: "info",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema, 'activities');