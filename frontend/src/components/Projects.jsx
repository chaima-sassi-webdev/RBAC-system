import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/pmDashboard.module.css";

function Projects() {

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [viewProject, setViewProject] = useState(null);
  const [showViewModal , setShowViewModal] = useState(false);

  // ================= FETCH =================
  const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/projects");
            setProjects(res.data);
      } catch (error) {
        console.log(error);
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
  }

  // ================= USE EFFECT =================
  useEffect(() => {
  fetchProjects();
  }, []);



  // ================= FILTER =================
  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(search.toLowerCase()) || 
    project.budget?.toLowerCase().includes(search.toLowerCase()) ||
    project.spentBudget?.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
        {/* HEADER */}
      <div className={styles.header}>
        <h1>📁 Projects Management</h1>
      </div>
        {/* SEARCH */}
        <input
          type="text"
              className={styles.searchInput}
              placeholder="Search Project"
              value={search}
          onChange={(e) => setSearch(e.target.value)}
         />
        {/* TABLE */}
        <div className={styles.activityContainer}>
          <table className={styles.table}>
              <thead>
                    <tr>
                        <th>Title</th>
                        <th>Budget</th>
                        <th>Spent Budget</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.title}</td>
                    <td>{project.budget?.toString().toLowerCase()}</td>
                    <td>{project.spentBudget}</td>
                    <td>
                      <span
                        className={
                        project.status === "approved"
                        ? styles.approved
                        : project.status === "rejected"
                        ? styles.rejected
                        : styles.pending
                        }
                      >
                      {project.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.viewButton} onClick={() => handleView(project._id)}>
                          View
                        </button>  
                      </div>
                    </td>
                  </tr>
                 ))}
              </tbody>
          </table>
        </div>
        {showViewModal && viewProject && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Projects Details </h3>
              <p><b>Title: </b> {viewProject.title}</p> <br />
              <p><b>Affected to: </b> 
                {viewProject.assignedEmployees.length > 0 ? ( 
                  viewProject.assignedEmployees.map((emp) => (
                    <span key={emp._id}>
                      {emp.name} ({emp.email}) <br />  
                    </span>
                  ))
                ) : ( 
                  "No employees assigned"
                )}
              </p> <br />
              <p><b>Budget: </b> {viewProject.budget} TND</p> <br />
              <p><b>Spent Budget: </b> {viewProject.spentBudget} TND</p> <br />
              <p><b>Client: </b> {viewProject.clientId?.name}</p> <br />
              <p><b>Deadline: </b> {viewProject.deadline
              ? new Date(viewProject.deadline).toLocaleDateString()
              : "No deadline"}</p> <br />
              <div className={styles.descriptionBox}>
                <b>Description: </b>
                <p>{viewProject.description}</p>
              </div>  <br />
              <p><b>Status: </b> <span
                  className={
                    viewProject.status === "approved"
                    ? styles.approved
                    : viewProject.status === "rejected"
                    ? styles.rejected
                    : styles.pending
                  }>
                    {viewProject.status}
                  </span></p> <br />
              <button
                className={styles.closeButton}
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>    
          </div>
        )}
    </div>
  );
}

export default Projects;