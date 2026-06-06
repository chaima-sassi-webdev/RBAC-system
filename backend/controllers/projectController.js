const Project = require("../models/Project");
const Task = require("../models/Task");


// ================= KPI =================
exports.getProjectManagerKpis = async (req, res) => {
  try {
    const activeProjects = await Project.countDocuments({ status: "active" });

    const completedTasks = await Task.countDocuments({ status: "completed" });
    const inProgressTasks = await Task.countDocuments({ status: "in-progress" });
    const lateTasks = await Task.countDocuments({ status: "late" });

    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedEmployees", "name email");

    const urgentTasks = await Task.find({
      priority: "high",
      status: { $ne: "completed" },
    })
      .sort({ deadline: 1 })
      .limit(5)
      .populate("projectId", "title");

    const criticalProjects = await Project.find({ status: "critical" }).limit(5).populate("clientId", "name email");

    const projects = await Project.find();

    const usedBudget = projects.reduce((t, p) => t + (p.spentBudget || 0), 0);
    const totalBudget = projects.reduce((t, p) => t + (p.budget || 0), 0);

    const remainingBudget = totalBudget - usedBudget;

    const expensesPerProject = projects.map((p) => ({
      project: p.title,
      spent: p.spentBudget,
    }));

    res.status(200).json({
      activeProjects,
      completedTasks,
      inProgressTasks,
      lateTasks,
      recentProjects,
      criticalProjects,
      urgentTasks,
      usedBudget,
      remainingBudget,
      expensesPerProject,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= CREATE PROJECT =================
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      spentBudget,
      deadline,
      status,
      assignedEmployees,
      clientId,
    } = req.body;

    if (!title || !clientId ) {
      return res.status(400).json({ message: "This field is required" });
    }

    const project = new Project({
      title,
      description,
      budget: budget || 0,
      spentBudget: spentBudget || 0,
      deadline,
      status: status || "active",
      assignedEmployees: assignedEmployees || [],
      clientId,
    });

    await project.save();

    const populated = await project.populate(
      [
        {
          path: "clientId",
          select: "name email",
        },
        {
          path: "assignedEmployees",
          select: "name email role",
        },
      ]
    );

    res.status(201).json({
      message: "Project created successfully",
      project: populated,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET PROJECTS =================
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("clientId", "name")
      .populate("assignedEmployees", "email role");

    res.status(200).json(projects);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET BY ID =================
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    .populate("assignedEmployees", "name email")
    .populate("clientId", "name email");

    if(!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    res.status(200).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeProjects = async (req, res) => {
  try  {
    const {employeeId} = req.params;
    const projects = await Project.find({
      assignedEmployees: employeeId,
    })
    .populate("clientId", "name")
    .populate("assignedEmployees", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// ================= UPDATE PROJECT =================
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("clientId", "name");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    Object.assign(project, req.body);

    await project.save();

    const updated = await project.populate(
      [ {
        path: "clientId",
        select: "name email",
      },
      {
        path: "assignedEmployees",
        select: "name email role",
      },
    ]
    );

    res.status(200).json({
      message: "Project updated successfully",
      project: updated,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE PROJECT =================
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= CREATE TASK =================
exports.createTask = async (req, res) => {

  try {

    let {
      title,
      description,
      projectId,
      priority,
      status,
      deadline,
      assignedTo,
    } = req.body;

    // ================= VALIDATION =================

    if (!title || !projectId) {

      return res.status(400).json({
        message: "Missing fields",
      });

    }

    // ================= FORMAT TITLE =================

    title = title.trim();

    // ================= CHECK PROJECT =================

    const project = await Project.findById(projectId);

    if (!project) {

      return res.status(404).json({
        message: "Project not found",
      });

    }

    // ================= CHECK DUPLICATE TASK =================

    const existingTask = await Task.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      projectId,
    });

    if (existingTask) {

      return res.status(409).json({
        message: "Task already exists for this project",
      });

    }

    // ================= CREATE TASK =================

    const task = new Task({
      title,
      description,
      projectId,
      priority: priority || "medium",
      status: status || "pending",
      deadline,
      assignedTo: assignedTo || [],
    });

    await task.save();
    const populated = await task.populate(
      [
        {
          path: "assignedTo",
          select: "email",
        },
        {
          path: "projectId",
          select: "title",
        },
      ]
    );
    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });

  }

};


// ================= GET TASKS =================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate({
        path: "projectId",
        select: "title clientId",
        populate: {
          path: "clientId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE TASK =================
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "email").populate("projectId", "title");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE TASK =================
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await Project.updateMany(
      {
        assignedTasks: task._id,
      },
      {
        $pull: {
          assignedTasks: task._id,
        },
      }
    );
    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    .populate("assignedTo", "email")
    .populate("projectId", "title");
    if(!task){
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json(task);
  } catch(error) {
    res.status(500).json({
      message: error.message,
    });
  }
};