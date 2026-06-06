const Task = require ("../models/Task");
const Leave = require("../models/Leave");
const Plainte = require("../models/plainte");
const User = require("../models/User");
exports.getEmployeeStats = async (req, res) => {
    try {
        const userId = req.params.id;
        const tasks = await Task.countDocuments({
            assignedTo: userId,
        });

        const leaves = await Leave.countDocuments({
            employee: userId,
        });

        const requests = await Leave.countDocuments({
            employee: userId,
        });
        const complaints = await Plainte.countDocuments({
            employee: userId,
        })

        res.status(200).json({
            tasks, leaves , requests , complaints,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.getEmployeeTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            assignedTo: req.params.id, 
        })
        .populate("projectId", "title")
        .populate("assignedTo", "email")
        .sort({ deadline: 1});

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



exports.updateEmployeeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("projectId", "title")
      .populate("assignedTo", "email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title;
    task.description = req.body.description;
    task.deadline = req.body.deadline;
    task.status = req.body.status;
    task.priority = req.body.priority;

    await task.save();

    const updatedTask = await Task.findById(task._id)
  .populate("projectId", "title")
  .populate("assignedTo", "email");

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({
            employee: req.params.id, 
        })
        .populate("employee", "email");

        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
exports.getEmployeesComplaints = async (req, res) => {
   try {
     const complaints = await Plainte.find({
        employee: req.params.id,
     })
     .populate("employee", "email");
     res.status(200).json(complaints);
   }  catch (error) {
       res.status(500).json({
        message: error.message,
      });
   }
};

exports.createLeave = async (req, res) => {
    try {
        const leave = new Leave(req.body);
        await leave.save();
        res.status(201).json({
            message: "Leave request sent",
            leave,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.createComplaint = async (req, res) => {
  try {
    const { employee, subject, message, status } = req.body;

    if (!employee || !subject || !message) {
  return res.status(400).json({
    message: "Missing fields",
    received: req.body,
  });
}

    const existingPlainte = await Plainte.findOne({
      employee,
      subject,
    });

    if (existingPlainte) {
      return res.status(400).json({
        message: "Plainte already exists",
      });
    }

    const newPlainte = new Plainte({
      employee,
      subject,
      message,
      status: status || "pending",
    });

    await newPlainte.save();

    const populated = await newPlainte.populate({
      path: "employee",
      select: "email",
    });

    return res.status(201).json({
      message: "Plainte created successfully",
      plainte: populated,
    });

  } catch (error) {
    console.log("ERROR =", error); // 👈 TRÈS IMPORTANT
    return res.status(500).json({
      message: error.message,
    });
  }
};



