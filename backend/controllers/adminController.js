const User = require ("../models/User");
const Client = require ("../models/Client");
const Project = require ("../models/Project");
const Task = require ("../models/Task");
const Leave = require ("../models/Leave");
const Plainte = require ("../models/Plainte");
const bcrypt = require("bcrypt");

// ============ CREATE USER CLIENT ================
exports.createUser = async (req, res) => {
    try {
      const existingUser = await User.findOne({
        email: req.body.email
      });
      if(existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
      }
      const hashedPassword = await bcrypt.hash(
        req.body.password,
        10
      );  
      const user = new User({
        ...req.body,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error creating user",
        error: error.message,
      });
    }
}
exports.createClient = async (req, res) => {
    try {
        const existingClient = await Client.findOne({
            email: req.body.email
        });
        if(existingClient) {
            return res.status(400).json({
                message: "Client already exists"
            });
        }
        const client = new Client ({
            ...req.body
        });
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({
        message: "Error creating client",
        error: error.message,
      });
    }
}
exports.createProject = async (req, res) => {
    try {
        const existingProject = await Project.findOne({
            title: req.body.title
        });
        if(existingProject) {
            return res.status(400).json({
                message: "Project already exists"
            });
        }
        const project = new Project ({
            ...req.body
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({
        message: "Error creating project",
        error: error.message,
      });
    }
}
exports.createTask = async (req, res) => {
    try {
        const existingTask = await Task.findOne({
            title: req.body.title
        });

        console.log("Existing task:", existingTask);

        if (existingTask) {
            return res.status(400).json({
                message: "Task already exists"
            });
        }

        const task = new Task({
            ...req.body
        });

        await task.save();
        return res.status(201).json(task);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error creating task",
            error: error.message
        });
    }
};

// =========== GET ALL USERS ================= //
exports.getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
       res.status(500).json({
        message: "Error fetching users",
        error: error.message,
       });
    }
};

exports.getClients = async (req , res ) => {
    try {
      const clients = await Client.find()
      .populate("createdBy", "email")
      .sort({ createdAt: -1});
      res.status(200).json(clients);  
    } catch (error) {
        res.status(500).json({
            message: "Error fetching clients",
            error: error.message,
        });
    }
};
exports.getProjects = async (req , res ) => {
    try {
      const projects = await Project.find()
      .populate("createdBy", "email")
      .sort({ createdAt: -1});
      res.status(200).json(projects);  
    } catch (error) {
        res.status(500).json({
            message: "Error fetching projects",
            error: error.message,
        });
    }
};
exports.getTasks = async (req , res ) => {
    try {
      const tasks = await Task.find()
      .populate("assignedTo", "email")
      .populate("projectId", "title")
      .sort({ createdAt: -1});
      res.status(200).json(tasks);  
    } catch (error) {
        res.status(500).json({
            message: "Error fetching projects",
            error: error.message,
        });
    }
};

// ======== GET ON USER ========== //
exports.getUserById = async (req, res) => {
    try {
        const { id} = req.params;
        if(!id || id.length !== 24) {
            return res.status(400).json({
                message: "Invalid user ID",
            });
        }
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user",
            error: error.message,
        });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id || id.length !== 24) {
            return res.status(400).json({
                message: "Invalid client ID",
            });
        }
        const client = await Client.findById(id);
        if(!client) {
            return res.status(404).json({
                message: "Client not found",
            });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching client",
            error: error.message,
        });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id || id.length !== 24) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }
        const project = await Project.findById(id).populate("clientId").populate("assignedEmployees",   "email");
        if(!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }
        res.status(200).json(project);
     } catch (error) {
        res.status(500).json({
            message: "Error fetching project",
            error: error.message,
        });
     }
};

exports.getTaskById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id || id.length !== 24) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }
        const task = await Task.findById(id).populate("assignedTo", "email");
        if(!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }
        res.status(200).json(task);
     } catch (error) {
        res.status(500).json({
            message: "Error fetching task",
            error: error.message,
        });
     }
};

exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("employee", "name email");

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json(leave);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id || id.length !== 24) {
            return res.status(400).json({
                message: "Invalid complaint ID",
            });
        }
        const complaint = await Plainte.findById(id)
        .populate("employee", "email");
        console.log(complaint.employee)
        if(!complaint) {
            return res.status(404).json({
                message: "Complaint not found",
            });
        }
        res.status(200).json(complaint);
     } catch (error) {
        res.status(500).json({
            message: "Error fetching complaint",
            error: error.message,
        });
     }
};
// ======== UPDATE USER ========== //
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error.message,
        });
    }
};
exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({
            message: "Error updating client",
            error: error.message,
        });

    }
};
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({
            message: "Error updating project",
            error: error.message,
        });
    }
};
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({
            message: "Error updating task",
            error: error.message,
        });
    }
};
// ========== DELETE USER ============ //
exports.deleteUser = async (req, res )=> {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted"});
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.message,
        });
    }
};
exports.deleteClient = async (req, res )=> {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Client deleted"});
    } catch (error) {
        res.status(500).json({
            message: "Error deleting client",
            error: error.message,
        });
    }
};
exports.deleteProject = async (req, res )=> {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Project deleted"});
    } catch (error) {
        res.status(500).json({
            message: "Error deleting project",
            error: error.message,
        });
    }
};
exports.deleteTask = async (req, res )=> {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted"});
    } catch (error) {
        res.status(500).json({
            message: "Error deleting task",
            error: error.message,
        });
    }
};
// ========== ADMIN'S STATS ========== //
exports.getAdminStats = async (req, res) => {
    try {
       const [
        totalEmployees,
        totalClients,
        totalProjects,
        totalTasks,
        pendingLeaves,
        pendingComplaints
       ] = await Promise.all([
        User.countDocuments({
            role: "employee"
        }),

        Client.countDocuments(),
        Project.countDocuments(),
        Task.countDocuments(),
        Leave.countDocuments({
            status: "pending"
        }),
        Plainte.countDocuments({
            status: "pending"
        })
       ]);

       res.status(200).json({
        totalEmployees,
        totalClients,
        totalProjects,
        totalTasks,
        pendingLeaves,
        pendingComplaints
       });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching dashboard stats",
            error: error.message
        });
    }
};

exports.getProjectsByStatus = async (req, res) => {
    try {
        const result = await Project.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1}
                }
            }
        ]);

        // transformer en objet propre
        const stats = {
            active: 0,
            completed: 0,
            critical: 0,
            closed: 0,
        };

        result.forEach((item) => {
            if (item._id === "active") stats.active = item.count;
            if (item._id === "completed") stats.completed = item.count;
            if (item._id === "critical") stats.critical = item.count;
            if (item._id === "closed") stats.closed = item.count;
        });

        res.status(200).json(stats);
    } catch( err) {
        res.status(500).json({ message: err.message});
    }
};
exports.getTasksByStatus = async (req, res) => {
    try {
        const result = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1}
                }
            }
        ]);

        // transformer en objet propre
        const stats = {
            pending: 0,
            in_progress: 0,
            completed: 0,
            late: 0,
        };

        result.forEach((item) => {
            if (item._id === "pending") stats.pending = item.count;
            if (item._id === "completed") stats.completed = item.count;
            if (item._id === "in_progress") stats.in_progress = item.count;
            if (item._id === "late") stats.late = item.count;
        });

        res.status(200).json(stats);
    } catch( err) {
        res.status(500).json({ message: err.message});
    }
};

exports.getMonthlyLeaves = async (req, res) => {
  try {
    const stats = await Leave.aggregate([
      {
        $match: {
          createdAt: { $exists: true }
        }
      },
      {
        $group: {
          _id: {
           year: { $year: "$createdAt"},
           month: { $month: "$createdAt"}
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(stats);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}
exports.getAllProjects = async (req, res) => {
    try{
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}
exports.getAllClients = async (req, res) => {
    try{
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}
exports.getAllTasks = async (req, res) => {
    try{
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}
exports.getAllComplaints = async (req, res) => {
    try{
        const complaints = await Plainte.find().populate("employee");
        res.status(200).json(complaints);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getAllLeaves= async (req, res) => {
    try{
        const leaves = await Leave.find();
        res.status(200).json(leaves);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getReports = async (req, res) => {
  try {

    const employees = await User.countDocuments({ role: "employee" });
    const projects = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const tasks = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const leaves = await Leave.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const complaints = await Plainte.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      employees,
      projects,
      tasks,
      leaves,
      complaints
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: !user.isActive },
      { new: true }
    );

    return res.status(200).json({
      message: "Status updated",
      isActive: updatedUser.isActive,
    });
    } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};