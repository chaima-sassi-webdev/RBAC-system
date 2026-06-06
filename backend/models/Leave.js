const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  leaveType: {
    type: String,
    enum: ["Annual", "Sick", "Emergency"],
    required: true,
  },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });
module.exports = mongoose.model("Leave",leaveSchema);