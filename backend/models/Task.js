const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type:String,
            required: true,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
        assignedTo: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
        ],
        status: {
            type: String,
            enum: [
                "pending",
                "in-progress",
                "completed",
                "late",
            ],
            default: "pending",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        deadline: Date,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    }, 
    {timestamps: true}
);

module.exports = mongoose.model(
    "Task",
    taskSchema
);