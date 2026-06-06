import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/pmDashboard.module.css";
import Styles from "../../styles/tasks.module.css";
import Select from "react-select";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [viewProject, setViewProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    budget: "",
    spentBudget: "",
    deadline: "",
    status: "active",
    assignedEmployees: [],
    clientId: "",
  });
  // ================= EMPLOYEE OPTIONS =================
  const employeeOptions = employees.map(emp => ({
    value: emp._id,
    label: `${emp.name} - ${emp.email}`,
  }));

  // ================= FETCH PROJECTS =================
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/admin/getProjects"
      );
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchClients = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/admin/getClients"
      );
      setClients(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH EMPLOYEES =================
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/admin/getClients")
      .then((res) => setClients(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ================= INIT =================
  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  // ================= HANDLE INPUT CHANGE =================
  const handleChange = (e) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE =================
  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/users/admin/project",
        projectForm
      );
      alert("project created successfully");
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      if(error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Error creating client");
    }
    }
  };

  // ================= UPDATE =================
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/users/admin/project/${editProject._id}`,
        projectForm
      );

      setShowModal(false);
      setEditProject(null);
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DELETE =================
  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/users/admin/project/${id}`
      );
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= VIEW =================
  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/admin/project/${id}`
      );
      setViewProject(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  // ================= FILTER =================
  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>📁 Projects Management</h1>

        <button
          className={styles.addButton}
          onClick={() => {
            setEditProject(null);
            setProjectForm({
              title: "",
              description: "",
              budget: "",
              spentBudget: "",
              deadline: "",
              status: "active",
              assignedEmployees: [],
              clientId: ""
            });
            setShowModal(true);
          }}
        >
          + Add Project
        </button>
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
              <th>Status</th>
              <th>Budget</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((project) => (
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

                <td>${project.budget}</td>

                

                <td>
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "No deadline"}
                </td>

                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleView(project._id)}
                    >
                      View
                    </button>

                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setEditProject(project);
                        setProjectForm({
                          title: project.title,
                          description: project.description,
                          budget: project.budget,
                          spentBudget: project.spentBudget,
                          deadline: project.deadline
                            ? new Date(project.deadline)
                                .toISOString()
                                .split("T")[0]
                            : "",
                          status: project.status,
                          assignedEmployees:
                            project?.assignedEmployees || [],
                          clientId: project.clientId,
                        });
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{editProject ? "Edit Project" : "Add Project"}</h3>

            <form
              onSubmit={
                editProject ? handleUpdateProject : handleCreateProject
              }
              className={styles.form}
            >
              <div className={styles.modalGrid}>
                <p>Title:</p>
                <input
                  name="title"
                  value={projectForm.title}
                  onChange={handleChange}
                />

                <p>Description:</p>
                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={handleChange}
                />

                <p>Budget:</p>
                <input
                  type="number"
                  name="budget"
                  value={projectForm.budget}
                  onChange={handleChange}
                />

                <p>Spent Budget:</p>
                <input
                  type="number"
                  name="spentBudget"
                  value={projectForm.spentBudget}
                  onChange={handleChange}
                />

                <p>Deadline:</p>
                <input
                  type="date"
                  name="deadline"
                  value={projectForm.deadline}
                  onChange={handleChange}
                />

                {/* MULTI SELECT EMPLOYEES */}
                <p>Assign Employees:</p>
                <Select
                  isMulti
                  options={employeeOptions}
                  value={employeeOptions.filter(opt =>
                    (projectForm.assignedEmployees || []).includes(opt.value)
                  )}
                  onChange={(selected) => {
                    setProjectForm({
                      ...projectForm,
                      assignedEmployees: selected
                        ? selected.map(item => item.value)
                        : [],
                    });
                  }}
                />
                <p>Client:</p>
                <select
                  name="clientId"
                  value={projectForm.clientId}
                  onChange={handleChange}
                >
                  <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name} 
                      </option>
                    ))}
                </select>

                {/* STATUS */}
                <p>Status:</p>
                <select
                  name="status"
                  value={projectForm.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="critical">Critical</option>
                  <option value="closed">Closed</option>
                </select>

                <div className={styles.modalActions}>
                  <button type="submit">
                    {editProject ? "Update" : "Create"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

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
              {viewProject.clientId?.name} ({viewProject.clientId?.email})
            </p>
                <br />
            <p>
              <b>Employees:</b>{" "}
              {viewProject?.assignedEmployees.length > 0
                ? viewProject?.assignedEmployees.map(emp => emp.email).join(", ")
                : "No employees"}
            </p>

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