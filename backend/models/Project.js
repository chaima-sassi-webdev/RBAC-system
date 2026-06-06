const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
    {
        title: {
          type: String,
          required: true, 
        },
        description: {
            type: String,
            required: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        status: {
            type: String,
            enum: [
                "active",
                "completed",
                "critical",
                "closed",
            ],
            default: "active",
        },
        budget: {
            type: Number,
            default: 0,
        },
        spentBudget: {
            type: Number,
            default: 0,
        },
        assignedEmployees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // or "Employee" depending on your model
        }
        ],
        deadline: Date,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        } 
    },
    { timestamps: true}
);

module.exports = mongoose.model(
    "Project",
    projectSchema
);