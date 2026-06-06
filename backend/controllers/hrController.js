const User = require("../models/User");
const Leave = require("../models/Leave");
const Plainte = require("../models/Plainte");

exports.createLeave = async (req, res) => {
  try {
    const {
      employee,
      leaveType,
      startDate,
      endDate,
      reason,
      status,
    } = req.body;
    const employees = await User.find({
      role: "employee"
    }, "name email");
    if(!employee || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }
    const leave = new Leave ({
      employee: req.body.employee,
      leaveType: req.body.leaveType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason,
      status: status || "pending",
    });

    await leave.save();
    const populated = await leave.populate(
      [
        {
          path: "employee",
          select: "email",
        },
      ]
    );
    res.status(201).json({
      message: "Leave created successfully",
      leave,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "email");
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getEmployeesEmails = async (req, res) => {
  try {
    const employees = await User.find(
      { role: "employee" },
      "name email"
    );
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id)
        .populate("employee", "email name");
        
        res.json(leave);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
exports.updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }
    leave.employeeName =
      req.body.employeeName;
    leave.employeeEmail =
      req.body.employeeEmail;
    leave.leaveType =
      req.body.leaveType;
    leave.startDate =
      req.body.startDate;
    leave.endDate =
      req.body.endDate;
    leave.reason =
      req.body.reason;
    leave.status = req.body.status || leave.status;
    await leave.save();
    res.status(200).json({
      message: "Leave updated successfully",
      leave,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};
exports.deleteLeave = async ( req, res) => {
    try {
        const deletedLeave = await Leave.findByIdAndDelete(req.params.id);
        if (!deletedLeave) {
            return res.status(404).json({
                message: "Leave not found",
            });
        }

        res.status(200).json({
            message: "Deleted successfully",
        });  
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}; 
exports.approvedLeaves = async (req, res) => {
    try {
        const leave = await Leave.findById(
            req.params.id
        );
        if(!leave) {
            return res.status(404).json({
                message: "Leave not found",
            });
        }
        leave.status = "approved";
        await leave.save();

        res.status(200).json({
            message: "Leave approved",
            leave,
        });
    } catch (erorr) {
        console.log(error);
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.rejectLeave = async (req, res) => {
    try {
        const leave = await Leave.findById (
            req.params.id
        );
        if(!leave) {
            return res.status(404).json({
                message: "Leave not found",
            });
        }
        leave.status = "rejected";

        await leave.save();
        res.status(200).json({
            message: "Leave rejected",
            leave,
        });
    } catch (error) {
        console.log(error) ;
        res.status(500).json({
            message: error.message,
        });
    }
};
exports.getLeavesPerMonth = async (req, res) => {
  try {
    const leaves = await Leave.find();

    const monthOrder = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const stats = {};

    leaves.forEach((leave) => {
      const date = new Date(leave.startDate);
      const key = `${monthOrder[date.getMonth()]} ${date.getFullYear()}`;
      if(!stats[key]) {
        stats[key] = 0;
      }
      stats[key]++;
    });
    const result = Object.keys(stats).sort((a,b) => {
      const [ma,ya] = a.split(" ");
      const [mb,yb] = b.split(" ");
      if(ya !== yb) return ya -yb;
      return monthOrder.indexOf(ma) - monthOrder.indexOf(mb);
    }).map((key) => ({
      month: key,
      leaves: stats[key],
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};


/**************************Plaintes *******************************/

exports.getPlaintes = async (req, res) => {
  try {
    const data = await Plainte.find()
    .populate("employee", "email");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CREATE =================

exports.createPlainte = async (req, res) => {

  try {

    const {
      employee,
      subject,
      message,
      status,
    } = req.body;
    const existingPlainte = await Plainte.findOne({
      employee,
      subject,
    });
    if (existingPlainte) {
      return res.status(400).json({
        message: "Plainte already exists",
      });
    }
    const employees = await User.find({
      role: "employee"
    }, "name email");
    if(!employee || !subject || !message ) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }
    // Création plainte
    const newPlainte = new Plainte({
      employee: req.body.employee,
      subject: req.body.subject,
      message: req.body.message,
      status: status || "pending",
    });

    await newPlainte.save();
    const populated = await newPlainte.populate(
      [
        {
          path: "employee",
          select: "email",
        },
      ]
    );
    res.status(201).json({

      message: "Plainte created successfully",
      plainte: newPlainte,

    });

  } catch (error) {

    console.log("ERROR =", error);

    res.status(500).json({
      message: error.message,
    });

  }

};

// ================= GET SINGLE =================
exports.getSinglePlainte = async (req, res) => {
  try {
    const data = await Plainte.findById(req.params.id)
    .populate("employee", "email");

    if (!data) {
      return res.status(404).json({ message: "Plainte not found" });
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= UPDATE =================
exports.updatePlainte = async (req, res) => {
  try {
    const plainte = await Plainte.findById(req.params.id);
    if (!plainte) {
      return res.status(404).json({ message: "Plainte not found" });
    }
    plainte.subject = req.body.subject;
    plainte.message = req.body.message;
    plainte.status = req.body.status || plainte.status;
    await plainte.save();
    res.status(200).json({
      message: "Plainte updated successfully",
      plainte,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= DELETE =================
exports.deletePlainte = async (req, res) => {
  try {
    const deleted = await Plainte.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Plainte not found" });
    }

    res.status(200).json({ message: "Plainte deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/*******************KPI******************************/
exports.getHRKpis = async (req, res) => {

    try {

        // ================= EMPLOYEES =================
        const totalEmployees = await User.countDocuments();

        // ================= LEAVES =================
        const pendingLeaves = await Leave.countDocuments({
            status: "pending",
        });

        const approvedLeaves = await Leave.countDocuments({
            status: "approved",
        });

        const rejectedLeaves = await Leave.countDocuments({
            status: "rejected",
        });

        // ================= COMPLAINTS =================
        const totalComplaints = await Plainte.countDocuments();

        // ================= ABSENCE RATE =================
        const totalLeaves = await Leave.countDocuments();

        const absenceRate =
            totalEmployees > 0
                ? (
                    (totalLeaves / (totalEmployees * 30)) *
                    100
                  ).toFixed(1)
                : 0;

        // ================= SATISFACTION =================
        const satisfactionRate = 82;

        // ================= RESPONSE =================
        return res.status(200).json({
            totalEmployees,
            pendingLeaves,
            approvedLeaves,
            rejectedLeaves,
            totalComplaints,
            absenceRate,
            satisfactionRate,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

exports.getRolesStats = async (req, res) => {
  try {
    const admins = await User.countDocuments({
      role: "admin",
    });
    const hr = await User.countDocuments({
      role: "hr",
    });
    const employees = await User.countDocuments({
      role: "employee",
    });
    const project_manager = await User.countDocuments({
      role: "project_manager",
    });
    res.status(200).json([
      {
        name: "Admins",
        value: admins,
      },
      {
        name: "HR",
        value: hr,
      },
      {
        name: "Employees",
        value: employees,
      },
      {
        name: "Project_manager",
        value: project_manager,
      },
    ]);
} catch (error) {
  console.log(error);
  res.status(500).json({
    message: error.message,
  });
}
};

exports.getSingleUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}