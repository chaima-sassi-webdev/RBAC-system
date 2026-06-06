const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const hrController = require("../controllers/hrController");
const pmController = require("../controllers/projectController");
const employeeController = require("../controllers/employeeController");
const clientController  = require("../controllers/clientController");
const adminController = require("../controllers/adminController");

router.post("/login", userController.loginUser);
router.post("/register", userController.createUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
router.put("/password/:id", userController.updatePassword);
router.get("/count", userController.countUsers);
router.get("/stats/monthly-users", userController.getMonthlyUsers);
router.get("/activities", userController.getActivities);
router.get("/status", userController.getUsersStatus);
router.post("/logout", userController.logoutUser);

router.get("/all-users", userController.getAllUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id/status", userController.toggleUserStatus);
router.get("/profile/:id", userController.getProfile);
router.put("/profile/:id",userController.updateProfile);
router.get( "/alerts", userController.getAlerts);
router.get("/profile/:id", userController.getProfile);

//hr dashboard //
router.get("/leaves", hrController.getLeaves);
router.get("/leaves/:id", hrController.getSingleLeave);
router.post("/leaves", hrController.createLeave);
router.put("/leaves/:id", hrController.updateLeave);
router.delete("/leaves/:id", hrController.deleteLeave);
router.put("/leaves/:id/approve", hrController.approvedLeaves);
router.put("/leaves/:id", hrController.rejectLeave);
router.get("/leaves/:id",hrController.getSingleLeave);
router.get("/leaves-per-month", hrController.getLeavesPerMonth);
router.get("/employees", hrController.getEmployeesEmails);
router.get("/plaintes", hrController.getPlaintes);
router.get("/plaintes/:id", hrController.getSinglePlainte);
router.post("/plaintes", hrController.createPlainte);
router.put("/plaintes/:id", hrController.updatePlainte);
router.delete("/plaintes/:id", hrController.deletePlainte);
router.get("/hr/kpis", hrController.getHRKpis);
router.get( "/roles/stats", hrController.getRolesStats);
router.get("/hr/user/:id", hrController.getSingleUser);

// projects //
router.post("/projects", pmController.createProject);
router.get("/projects", pmController.getProjects);
router.put("/projects/:id", pmController.updateProject);
router.get("/projects/:id", pmController.getProjectById);
router.delete("/projects/:id", pmController.deleteProject);
router.post("/tasks", pmController.createTask);
router.get("/tasks", pmController.getTasks);
router.get("/tasks/:id", pmController.getTaskById);
router.put("/tasks/:id", pmController.updateTask);
router.delete("/tasks/:id",pmController.deleteTask);
router.get("/kpis", pmController.getProjectManagerKpis);
router.get("/employee/projects/:employeeId", pmController.getEmployeeProjects);

// CLIENTS //
router.post("/clients", clientController.createClient);
router.get("/clients", clientController.getClients);
router.get("/clients/:id", clientController.getClientById);
router.put("/clients/:id", clientController.updateClient);
router.delete("/clients/:id", clientController.deleteClient);


// EMPLOYEE //
router.get("/employee/stats/:id", employeeController.getEmployeeStats);
router.get("/employee/tasks/:id", employeeController.getEmployeeTasks);
router.put("/employee/tasks/:taskId", employeeController.updateEmployeeTask);
router.post("/employee/leaves", employeeController.createLeave);
router.get("/employee/leaves/:id", employeeController.getEmployeeLeaves);
router.post("/employee/plaintes", employeeController.createComplaint);
router.get("/employee/plaintes/:id", employeeController.getEmployeesComplaints);



// ADMIN //
router.post("/admin/users", adminController.createUser);
router.post("/admin/client", adminController.createClient);
router.post("/admin/project", adminController.createProject); 
router.post("/admin/task", adminController.createTask);
router.put("/admin/:id/status", adminController.toggleUserStatus);

router.get("/admin/getUsers", adminController.getUsers);
router.get("/admin/getClients", adminController.getClients);
router.get("/admin/getProjects", adminController.getProjects);
router.get("/admin/tasks", adminController.getTasks);

router.get("/admin/getClientById/:id", adminController.getClientById);
router.get("/admin/users/:id", adminController.getUserById);
router.get("/admin/project/:id", adminController.getProjectById);
router.get("/admin/tasks/:id", adminController.getTaskById);
router.get("/admin/leaves/:id", adminController.getLeaveById);

router.put("/admin/user/:id", adminController.updateUser);
router.put("/admin/client/:id", adminController.updateClient);
router.put("/admin/project/:id", adminController.updateProject);
router.put("/admin/task/:id", adminController.updateTask);

router.delete("/admin/user/:id", adminController.deleteUser);
router.delete("/admin/project/:id", adminController.deleteProject);
router.delete("/admin/client/:id", adminController.deleteClient);
router.delete("/admin/task/:id", adminController.deleteTask);

router.get("/admin/stats", adminController.getAdminStats);
router.get("/admin/projects/status", adminController.getProjectsByStatus);
router.get("/admin/taskstatus", adminController.getTasksByStatus);
router.get("/admin/leavesmonth", adminController.getMonthlyLeaves);
router.get("/admin/getAllUsers", adminController.getAllUsers);
router.get("/admin/getAllProjects", adminController.getAllProjects);
router.get("/admin/getAllLeaves", adminController.getAllLeaves);
router.get("/admin/getAllClients", adminController.getAllClients);
router.get("/admin/getAllTasks", adminController.getAllTasks);
router.get("/admin/getAllComplaints", adminController.getAllComplaints);
router.get("/admin/complaints/:id", adminController.getComplaintById);
router.get("/admin/reports", adminController.getReports);
module.exports = router;