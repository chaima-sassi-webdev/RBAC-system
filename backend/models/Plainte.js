const mongoose = require("mongoose");

const plainteSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-review","resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Plainte = mongoose.models.Plainte || mongoose.model("Plainte", plainteSchema);
module.exports = Plainte;