import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/pmDashboard.module.css";
import Settings from "../hr/Settings";
import Projects from "./Projects";
import Tasks from "./Tasks";
import MessengerPage from "../MessengerPage";
import Clients from "./Clients";
import {
  BarChart,
  Bar,
  XAxis,
 YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function GESDashboard() {

  const [activePage, setActivePage] =
    useState("dashboard");
  const [viewProject, setViewProject] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [showViewModalTask, setShowViewModalTask] = useState(false);
  const [viewCriticalProject, setViewCriticalProject] = useState(null);
  const [showViewModalCritical, setShowViewModalCritical] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [kpis, setKpis] = useState({
    activeProjects: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    lateTasks: 0,
    recentProjects: [],
    criticalProjects: [],
    expensesPerProject: [],
    urgentTasks: [],
    usedBudget: 0,
    remainingBudget: 0,
  });

  // ================= FETCH DASHBOARD =================

  const fetchDashboard = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/users/kpis"
      );

      setKpis(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // ================= FETCH PROFILE =================

  const fetchProfile = async () => {

    try {

      

      const res = await axios.get(
        `http://localhost:5000/api/users/profile/${userId}`
      );

      setProfile(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // ================= UPDATE PROFILE =================

  const handleUpdateProfile = async (e) => {

    e.preventDefault();

    try {

      const storedUser =
        JSON.parse(localStorage.getItem("user"));

      const userId = storedUser?._id;

      await axios.put(
        `http://localhost:5000/api/users/profile/${userId}`,
        profile
      );

      alert("Profile updated successfully");

    } catch (error) {

      console.log(error);

    }
  };

  // ================= HANDLE PROFILE CHANGE =================

  const handleProfileChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ================= EFFECT =================
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user?._id;
  useEffect(() => {
    if(!userId) return;
    fetchDashboard();

    fetchProfile();

  }, [userId]);

  // ================= LOGOUT =================

  const handleLogout = async () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {

        window.location.href = "/login";

        return;
      }

      const user = JSON.parse(storedUser);

      await axios.post(
        "http://localhost:5000/api/users/logout",
        { userId: user._id }
      );

      localStorage.removeItem("user");

      window.location.href = "/login";

    } catch (error) {

      console.log(error);

    }
  };

  // ================= KPI CARDS =================

  const cards = [
    {
      title: "Active Projects",
      value: kpis.activeProjects,
    },
    {
      title: "Completed Tasks",
      value: kpis.completedTasks,
    },
    {
      title: "In Progress Tasks",
      value: kpis.inProgressTasks,
    },
    {
      title: "Late Tasks",
      value: kpis.lateTasks,
    },
  ];

  // ================= RENDER =================

  const renderContent = () => {

    switch (activePage) {

      case "dashboard":

        return (
          <>

            {/* HEADER */}
            <div className={styles.header}>
              <h1>📊 Project Manager Dashboard</h1>
            </div>

            {/* KPI CARDS */}
            <div className={styles.cardsContainer}>

              {cards.map((card, index) => (

                <div
                  key={index}
                  className={styles.card}
                >

                  <h3>{card.title}</h3>

                  <b className={styles.cardValue}>
                    {card.value}
                  </b>

                </div>

              ))}

            </div>

            {/* RECENT PROJECTS */}
            <div className={styles.dashboardSection}>

              <div className={styles.activityContainer}>

                <div className={styles.sectionTitle}>
                  <h2>🆕 Recent Projects</h2>
                </div>

                <div className={styles.scrollTable}>

                  <table className={styles.table}>

                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {kpis.recentProjects?.map((project) => (

                        <tr key={project._id}>

                          <td>{project.title}</td>

                          <td>

                            <span
                              className={
                                project.status === "completed"
                                  ? styles.approved
                                  : project.status === "closed"
                                  ? styles.rejected
                                  : styles.pending
                              }
                            >
                              {project.status}
                            </span>

                          </td>
                          <td>
                            <div className={styles.actions}>
                              <button
                                className={styles.viewButton}
                                onClick={() => handleView(project._id)}>
                                View
                              </button>
                            </div>
                          </td>
                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

            {/* URGENT TASKS */}
            <div className={styles.dashboardSection}>

              <div className={styles.activityContainer}>

                <div className={styles.sectionTitle}>
                  <h2>🔥 Urgent Tasks</h2>
                </div>

                <div className={styles.scrollTable}>

                  <table className={styles.table}>

                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {kpis.urgentTasks?.map((task) => (

                        <tr key={task._id}>

                          <td>{task.title}</td>

                          <td>
                            <span className={styles.rejected}>
                              {task.priority}
                            </span>
                          </td>

                          <td>{task.status}</td>
                          <td>
                            <div className={styles.actions}>
                              <button
                                className={styles.viewButton}
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

              </div>

            </div>

            {/* CRITICAL PROJECTS */}
            <div className={styles.dashboardSection}>

              <div className={styles.activityContainer}>

                <div className={styles.sectionTitle}>
                  <h2>🚨 Critical Projects</h2>
                </div>

                <div className={styles.scrollTable}>

                  <table className={styles.table}>

                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {kpis.criticalProjects?.map((project) => (

                        <tr key={project._id}>

                          <td>{project.title}</td>

                          <td>
                            <span className={styles.rejected}>
                              {project.status}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <button
                                className={styles.viewButton}
                                onClick={() => handleViewCriticalProject(project._id)}
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

            {/* CHART */}
            <div className={styles.dashboardSection}>

              <div className={styles.chartContainer}>

                <div className={styles.sectionTitle}>
                  <h2>💰 Expenses Per Project</h2>
                </div>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={kpis.expensesPerProject}
                  >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="project" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="spent"
                      fill="#4b6cb7"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* FINANCE */}
            <div className={styles.dashboardSection}>

              <div className={styles.cardsContainer}>

                <div className={styles.card}>

                  <h3>Budget Used</h3>

                  <b className={styles.cardValue}>
                    ${kpis.usedBudget}
                  </b>

                </div>

                <div className={styles.card}>

                  <h3>Remaining Budget</h3>

                  <b className={styles.cardValue}>
                    ${kpis.remainingBudget}
                  </b>

                </div>

              </div>

            </div>

          </>
        );

      case "projects":
        return <Projects />;

      case "tasks":
        return <Tasks />;
      
      case "clients":
        return <Clients />;

      case "messenger":
        return <MessengerPage />; 
      
      case "settings":
        return <Settings />;

      default:
        return null;
    }
  };
  const handleView = async (id) => {
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
  const handleViewCriticalProject = async (id) => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/projects/${id}`
        );
        setViewCriticalProject(res.data);
        setShowViewModalCritical(true);
      } catch (error) {
        console.log(error);
      }
    };
  return (

    <div className={styles.container}>

      <div className={styles.sidebar}>

        <h2 className={styles.logo}>
          ProjectFlow
        </h2>

        <ul className={styles.menu}>

          <li
            className={`${styles.menuItem} ${
              activePage === "dashboard"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            Dashboard
          </li>

          <li
            className={`${styles.menuItem} ${
              activePage === "projects"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("projects")
            }
          >
            Projects
          </li>

          <li
            className={`${styles.menuItem} ${
              activePage === "tasks"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("tasks")
            }
          >
            Tasks
          </li>
          <li
            className={`${styles.menuItem} ${
              activePage === "clients"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("clients")
            }
          >
            Clients
          </li>
          <li
            className={styles.menuItem}
            onClick={() => setActivePage("messenger")}
            >
              Messenger
          </li>
          <li
            className={`${styles.menuItem} ${
              activePage === "settings"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("settings")
            }
          >
            Settings
          </li>  
          <li
            className={styles.menuItem}
            onClick={handleLogout}
          >
            Logout
          </li>

        </ul>

      </div>

      <div className={styles.main}>
        {renderContent()}
      </div>
      {/* VIEW MODAL */}
      {showViewModal && viewProject && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>📁 Project Details</h3>
            <p><b>Title:</b> {viewProject.title}</p> <br />
            <div className={styles.descriptionBox}>
              <b> Description:  </b> 
              <p>{viewProject.description}</p>                       
            </div>  <br />
            <p><b>Status:</b> {viewProject.status}</p> <br />
            <p><b>Budget:</b> {viewProject.budget} $</p> <br />
            <p><b>Spent Budget:</b> {viewProject.spentBudget} $</p> <br />
            <p>
              <b>Deadline:</b>{" "}
              {viewProject.deadline
                ? new Date(viewProject.deadline).toLocaleDateString()
                : "No deadline"}
            </p> <br />
            <p>
              <b>Client:</b>{" "}
              {viewProject.clientId?.name} 
            </p>
            <br />
            <p>
              <b>Employees:</b>{" "}
              {viewProject.assignedEmployees?.length > 0
                ? viewProject.assignedEmployees.map(emp => emp.name).join(", ")
                : "No employees"}
            </p>
            <button
              className={styles.closeButton}
              onClick={() => setShowViewModal(false)}>
                Close
            </button>
          </div>
        </div>
      )}
      {showViewModalTask && viewTask && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>📋 Task Details</h3>
            <p><b>Title:</b> {viewTask.title}</p> <br />
            <div className={styles.descriptionBox}>
                      <b> Description:  </b> 
                      <p>{viewTask.description}</p>                       
            </div>  <br />
            <p><b>Employees:</b> 
             {viewTask.assignedTo?.map((emp) => (
              <span key={emp._id}>
                {emp.email}
              </span>
             ))}
            </p> <br />
            <p><b>Project:</b> {viewTask.projectId?.title}</p> <br />
            <p><b>Status:</b> {viewTask.status}</p> <br />
            <p><b>Priority:</b> {viewTask.priority}</p> <br />
            <p><b>Deadline:</b> {viewTask.deadline
                ? new Date(viewTask.deadline).toLocaleDateString()
                : "No deadline"}</p> <br />
            <div className={styles.modalFooter}>
              <button onClick={() => setShowViewModalTask(false)} className={styles.closeButton}>
                Close
              </button>
            </div>
          </div>
         
        </div>
      )}
    </div>
  );
}

export default GESDashboard;