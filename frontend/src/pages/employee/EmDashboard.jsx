import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/employee.module.css";
import Styles from "../../styles/tasks.module.css";
import Calendar from "react-calendar";
import Tasks from "./Tasks";
import Projects from "./Projects";
import Leaves from "./Leaves";
import Complaints from "./Complaints";
import Messenger from "../MessengerPage";
import Settings from "../hr/Settings";
import "react-calendar/dist/Calendar.css";


function EmployeeDashboard() {

  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState({
    leaves: 0,
    requests: 0,
    tasks: 0 , 
    complaints: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [viewProject, setViewProject] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewLeave, setViewLeave] = useState(null);
  const [showViewModalLeave, setShowViewModalLeave] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [showViewModalTask, setShowViewModalTask] = useState(false);
  
  // ================= USER =================
  const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user?._id;

  // ================= FETCH DASHBOARD =================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, tasksRes, leavesRes, projectsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/employee/stats/${userId}`),
          axios.get(`http://localhost:5000/api/users/employee/tasks/${userId}`),
          axios.get(`http://localhost:5000/api/users/employee/leaves/${userId}`),
          axios.get(`http://localhost:5000/api/users/employee/projects/${userId}`)
        ]);

        setStats(statsRes.data);
        setTasks(tasksRes.data);
        setLeaves(leavesRes.data);
        setProjects(projectsRes.data);

      } catch (err) {
        console.log(err);
      }
    };

    if (userId) fetchDashboard();
}, [userId]);
  // ================= UPDATE TASK STATUS =================
  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/employee/tasks/${taskId}`,
        { status }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status } : t
        )
      );
    } catch (err) {
      console.log(err);
    }
  };
  // ================= QUICK ACTIONS =================
  const requestLeave = async () => {
    const reason = prompt("Reason for leave:");
    const startDate = prompt("Start date (YYYY-MM-DD):");
    const endDate = prompt("End date (YYYY-MM-DD):");

    if (!reason) return;

    await axios.post("http://localhost:5000/api/users/employee/leaves", {
      employee: userId,
      reason,
      startDate,
      endDate,
    });

    alert("Leave request sent");
  };

  const createComplaint = async () => {
    const subject = prompt("Complaint subject:");
    const message = prompt("Message:");

    if (!subject || !message) return;

    await axios.post("http://localhost:5000/api/users/employee/complaints", {
      employee: userId,
      subject,
      message,
    });

    alert("Complaint sent");
  };

  // ================= CARDS =================
  const cards = [
    { title: "Number of Tasks", value: stats.tasks },
    { title: "Remaining Leaves", value: stats.leaves },
    { title: "Requests sent", value: stats.requests },
    { title: "My Complaints", value: stats.complaints }
  ];

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ================= RENDER =================
  const renderContent = () => {
    if (activePage === "tasks") return <Tasks tasks={tasks} setTasks={setTasks} />;


    if (activePage === "leaves") {
      return <Leaves /> ;
    }

    if (activePage === "complaints") {
      return <Complaints />;
    }

    if (activePage === "projects") {
      return <Projects />;
    }
    if (activePage === "messenger") {
      return <Messenger />;
    }
    if (activePage === "settings") {
      return <Settings />;
    }

    // ================= DASHBOARD HOME =================
    return (
      <>
        <div className={styles.header}>
          <h1>Welcome {user?.name || "Employee"} 👋</h1>
        </div>

        {/* CARDS */}
        <div className={styles.cardsContainer}>
          {cards.map((c, i) => (
            <div key={i} className={styles.card}>
              <h3>{c.title}</h3>
              <div className={styles.cardValue}>{c.value}</div>
            </div>
          ))}
        </div>

        <div className={styles.calendarContainer}>
          <h2>Calendar</h2>
          <Calendar onChange={setDate} value={date} />
        </div>

        {/* RECENT PROJECTS */}
        <div className={styles.dashboardSection}>
          <div className={styles.activityContainer}>
            <div className={Styles.sectionTitle}>
              <h2>🆕 Recent Project </h2>
            </div> <br />
            <div className={Styles.scrollTable}>
              <table className={Styles.table}>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects?.map((project) => (
                    <tr key={project._id}>
                      <td>{project.title}</td>
                      <td> {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}</td>
                      <td>
                        <span
                          className={
                            project.status === "completed"
                            ? Styles.approved
                            : project.status === "closed"
                            ? Styles.rejected
                            : Styles.pending
                          }>
                          {project.status}
                        </span>
        
                      </td>
                      <td>
                        <div className={Styles.actions}>
                          <button
                            className={Styles.viewButton}
                            onClick={() => handleViewProject(project._id)}>
                              View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.seeMoreContainer}>
              <button
                className={styles.seeMoreBtn}
                onClick={() => setActivePage("projects")}>
                  Voir plus →
              </button>
          </div>   
          </div> <br /> 
          <div className={styles.activityContainer}>
            <div className={Styles.sectionTitle}>
              <h2>🆕 Recent Task </h2>
            </div> <br />
            <div className={Styles.scrollTable}>
              <table className={Styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks?.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}</td>
                      <td>
                        <span
                          className={
                            task.status === "completed"
                            ? Styles.approved
                            : task.status === "closed"
                            ? Styles.rejected
                            : Styles.pending
                          }>
                          {task.status}
                        </span>
        
                      </td>
                      <td>
                        <div className={Styles.actions}>
                          <button
                            className={Styles.viewButton}
                            onClick={() => handleViewTask(task._id)}>
                              View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          <div className={styles.seeMoreContainer}>
              <button
                className={styles.seeMoreBtn}
                onClick={() => setActivePage("tasks")}>
                  Voir plus →
              </button>
          </div> 
          </div> <br />
          <div className={styles.activityContainer}>
            <div className={Styles.sectionTitle}>
              <h2>🆕 Leave Requests </h2>
            </div> <br />
            <div className={Styles.scrollTable}>
              <table className={Styles.table}>
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Start date </th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves?.map((leave) => (
                    <tr key={leave._id}>
                      <td>{leave.leaveType}</td>
                      <td>{leave.startDate ? new Date(leave.startDate).toLocaleDateString() : "No deadline"}</td>
                      <td>
                        <span
                         className={
                         leave.status === "completed"
                         ? Styles.approved
                         : leave.status === "closed"
                         ? Styles.rejected
                         : Styles.pending
                        }>
                         {leave.status}
                        </span>
                      </td>
                      <td>
                        <div className={Styles.actions}>
                          <button
                            className={Styles.viewButton}
                            onClick={() => handleViewLeave(leave._id)}>
                              View
                          </button>
                        </div>
                      </td>
                    </tr> 
                  ))}
                </tbody>
              </table>  
              
            </div>
            
            <div className={styles.seeMoreContainer}>
              <button
                className={styles.seeMoreBtn}
                onClick={() => setActivePage("leaves")}>
                  Voir plus →
              </button>
          </div> 
          </div>
        </div>   
        {showViewModal && viewProject && (
              <div className={Styles.modalOverlay}>
                <div className={Styles.modal}>
                  <h3>📋 Project Details</h3>
                  <div className={Styles.viewBox}>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Title</span>
                      <span className={Styles.viewValue}>{viewProject.title}</span>
                    </div>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Description</span>
                      <span className={Styles.viewValue}>{viewProject.description}</span>
                    </div>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Status</span>
                      <span
                        className={`${Styles.statusBadge} ${
                          viewProject.status === "completed"
                          ? Styles.approved
                          : viewProject.status === "late"
                          ? Styles.rejected
                          : Styles.pending
                        }`}
                        >
                          {viewProject.status}
                      </span>
                    </div>
            
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Budget</span>
                      <span className={Styles.viewValue}>{viewProject.budget} TND</span>
                    </div>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Spent Budget</span>
                      <span className={Styles.viewValue}>{viewProject.spentBudget} TND</span>
                    </div>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Deadline</span>
                      <span className={Styles.viewValue}>
                        {viewProject?.deadline ? new Date(viewProject.deadline).toLocaleDateString() : "No deadline"}
                      </span>
                    </div>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Assigned To: </span>
                      <span className={Styles.viewValue}>{viewProject.assignedEmployees?.length > 0
                        ? viewProject.assignedEmployees.map(emp => emp.name).join(", ")
                      : "No employees"}</span>
                    </div>
                  </div>
                  <div className={Styles.modalFooter}>
                    <button onClick={() => setShowViewModal(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
        )}
         {showViewModalTask && viewTask && (
            <div className={Styles.modalOverlay}>
              <div className={Styles.modal}>
                <h3>📋 Task Details</h3>
                <div className={Styles.viewBox}>
                  <div className={Styles.viewItem}>
                    <span className={Styles.viewLabel}>Title</span>
                    <span className={Styles.viewValue}>{viewTask.title}</span>
                  </div>
                  <div className={Styles.viewItem}>
                    <span className={Styles.viewLabel}>Description</span>
                    <span className={Styles.viewValue}>{viewTask.description}</span>
                  </div>
                  <div className={Styles.viewItem}>
                    <span className={Styles.viewLabel}>Status</span>
                    <span
                      className={`${Styles.statusBadge} ${
                      viewTask.status === "completed"
                      ? Styles.approved
                      : viewTask.status === "late"
                      ? Styles.rejected
                      : Styles.pending }`} >
                      {viewTask.status}
                    </span>
                  </div>
                  <div className={Styles.viewItem}>
                    <span className={Styles.viewLabel}>Priority</span>
                    <span className={Styles.viewValue}>{viewTask.priority}</span>
                  </div>
                  <div className={Styles.viewItem}>
                    <span className={Styles.viewLabel}>Deadline</span>
                    <span className={Styles.viewValue}>
                      {viewTask.deadline ? new Date(viewTask.deadline).toLocaleDateString() : "No deadline"}
                    </span>
                  </div>
                </div>
                <div className={Styles.modalFooter}>
                  <button onClick={() => setShowViewModalTask(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
        )} 
        {showViewModalLeave && viewLeave && (
              <div className={Styles.modalOverlay}>
                <div className={Styles.modal}>
                  <h3>📋 Leave Details</h3>
                  <div className={Styles.viewBox}>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Employee</span>
                      <span className={Styles.viewValue}>{viewLeave.employee?.email || "No employee"}</span>
                    </div>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Reason</span>
                      <span className={Styles.viewValue}>{viewLeave.reason}</span>
                    </div>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Status</span>
                      <span
                        className={`${Styles.statusBadge} ${
                          viewLeave.status === "approved"
                          ? Styles.approved
                          : viewLeave.status === "rejected"
                          ? Styles.rejected
                          : Styles.pending
                        }`}
                        >
                          {viewLeave.status}
                      </span>
                    </div>
            
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Leave Type:</span>
                      <span className={Styles.viewValue}>{viewLeave.leaveType} </span>
                    </div>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>Start date: </span>
                      <span className={Styles.viewValue}>{viewLeave?.startDate ? new Date(viewLeave.endDate).toLocaleDateString() : "No deadline"}</span>
                    </div>
                    <div className={Styles.viewItem}>
                      <span className={Styles.viewLabel}>End date:</span>
                      <span className={Styles.viewValue}>
                        {viewLeave?.endDate ? new Date(viewLeave.endDate).toLocaleDateString() : "No deadline"}
                      </span>
                    </div>
                  </div>
                  <div className={Styles.modalFooter}>
                    <button onClick={() => setShowViewModalLeave(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
        )}
      </>
    );
  };
  const handleViewLeave = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/leaves/${id}`
      );
      setViewLeave(res.data);
      setShowViewModalLeave(true);
    } catch (error) {
      console.log(error);
    }
  }; 
  const handleViewProject = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/projects/${id}`
      );
      setViewProject(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.log(error);
    }
  }; 
  const handleViewTask = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/tasks/${id}`
      );
      setViewTask(res.data);
      setShowViewModalTask(true);
    } catch (error) {
      console.log(error);
    }
  }; 

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <h2 className={styles.logo}>ProjectFlow</h2>
        <ul className={styles.menu}>

            <li
              className={`${styles.menuItem} ${
                activePage === "dashboard" ? styles.active : ""
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`${styles.menuItem} ${
                activePage === "projects" ? styles.active : ""
              }`}
              onClick={() => setActivePage("projects")}
            >
              Projects
            </li>  
            <li
              className={`${styles.menuItem} ${
                activePage === "tasks" ? styles.active : ""
              }`}
              onClick={() => setActivePage("tasks")}
            >
              Tasks
            </li>
            <li
              className={`${styles.menuItem} ${
                activePage === "leaves" ? styles.active : ""
              }`}
              onClick={() => setActivePage("leaves")}
            >
              Leaves
            </li>
            <li
              className={`${styles.menuItem} ${
                activePage === "complaints" ? styles.active : ""
              }`}
              onClick={() => setActivePage("complaints")}
            >
              Complaints
            </li>
            <li
              className={`${styles.menuItem} ${
                activePage === "messenger" ? styles.active : ""
              }`}
              onClick={() => setActivePage("messenger")}
            >
              Messenger
            </li>
            <li
              className={`${styles.menuItem} ${
                activePage === "settings" ? styles.active : ""
              }`}
              onClick={() => setActivePage("settings")}
            >
              Settings
            </li>
            <li
              className={`${styles.menuItem} ${styles.logout}`}
              onClick={handleLogout}
            >
              Logout
            </li>

        </ul>
      </div>

      {/* MAIN */}
      <div className={styles.main}>{renderContent()}</div>
    </div>
  );
}

export default EmployeeDashboard;