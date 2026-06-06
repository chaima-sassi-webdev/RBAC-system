import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import styles from "../../styles/tasks.module.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [viewTask, setViewTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id; 
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: [],
    status: "pending",
    priority: "medium",
    deadline: "",
  });
  const employeeOptions = employees.map(emp => ({
    value: emp._id,
    label: `${emp.email}`,
  }));
  // ================= FETCH =================
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/employee/tasks/${userId}`);
      setTasks(res.data);
    } catch (error) {
      console.log(error);   }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  useEffect(() => {
    axios.get("http://localhost:5000/api/users/employees")
      .then(res => setEmployees(res.data))
      .catch(console.log);
  }, []);
  // ================= CHANGE =================
  const handleChange = (e) => {
    setTaskForm({ ...taskForm, 
      [e.target.name]: e.target.value,
     });
  };

 const openEditModal = (task) => {
    setEditTask(task);
    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      projectId: task.projectId?._id || task.projectId || "",
      assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo.map(emp => typeof emp === "object" ? emp._id : emp) : [] , 
      status: task.status || "pending",
      priority: task.priority || "medium",
      deadline: task.deadline ? task.deadline.slice(0, 10) : "",
    });

    setShowModal(true);
  };  
  // ================= EDIT =================
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/tasks/${editTask._id}`,
        taskForm
      );
      setEditTask(null);
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= VIEW =================
  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/tasks/${id}`
      );
      setViewTask(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const filtered = tasks.filter((t) =>
  (t.title || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (t.projectId?.title || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (t.status || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.pageTitle}>📋 Tasks</h1>
          <p className={styles.pageSubtitle}>Manage your tasks</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.projectId?.title}</td>

                  <td>
                    <span
                       className={
                        t.status === "completed"
                          ? styles.approved
                          : t.status === "late"
                          ? styles.rejected
                          : t.status === "in-progress"
                          ? styles.review
                          : styles.pending
                      }
                    >
                      {t.status}
                    </span>
                  </td>

                  <td>{t.priority}</td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleView(t._id)}
                      >
                        View
                      </button>

                      <button
                        className={styles.editButton}
                        onClick={() => {
                          openEditModal(t)
                          }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    
     {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit Task</h3>

            <form
              onSubmit={
                handleEdit
              }
              className={styles.form}
            >
              <div className={styles.modalGrid}>
                <p>Title:</p>
                <input
                  name="title"
                  value={taskForm.title}
                  onChange={handleChange}
                />
                <br /> <br />
                <p>Description:</p>
                <textarea
                  name="description"
                  value={taskForm.description}
                  onChange={handleChange}
                />
                <br /> <br />
                <p>Deadline:</p>
                <input
                  type="date"
                  name="deadline"
                  value={taskForm.deadline}
                  onChange={handleChange}
                />
                <br /> <br />
                {/* MULTI SELECT EMPLOYEES */}
                <p>Assign Employees:</p>
                <br /> 
                 <span>
                    {editTask?.assignedTo?.length > 0
                      ? editTask.assignedTo.map(emp =>
                          typeof emp === "object" ? emp.email : emp
                        ).join(", ")
                      : "No assigned employees"}
                  </span>
                  <br /> <br />
                <p>Priority:</p>

                <select
                  name="priority"
                  value={taskForm.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <br /> <br />
                {/* STATUS */}
                <p>Status:</p>
                <select
                  name="status"
                  value={taskForm.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="late">Late</option>
                </select>

                <div className={styles.modalActions}>
                  <button type="submit">
                    Update
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
      {/* MODAL VIEW */}
      {showViewModal && viewTask && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>📋 Task Details</h3>

            <div className={styles.viewBox}>

              <div className={styles.viewItem}>
                <span className={styles.viewLabel}>Title</span>
                <span className={styles.viewValue}>{viewTask.title}</span>
              </div>
              <div className={styles.viewItem}>
                <span className={styles.viewLabel}>
                  Assigned Employees
                </span>

                <span className={styles.viewValue}>
                  {viewTask.assignedTo?.map(emp => emp.email).join(", ")}
                </span>
              </div>
              <div className={styles.viewItem}>
                <span className={styles.viewLabel}>Description</span>
                <span className={styles.viewValue}>{viewTask.description}</span>
              </div>

              <div className={styles.viewItem}>
                <span className={styles.viewLabel}>Status</span>
                <span
                  className={`${styles.statusBadge} ${
                    viewTask.status === "completed"
                    ? styles.approved
                    : viewTask.status === "late"
                    ? styles.rejected
                    : viewTask.status === "in-progress"
                    ? styles.review
                    : styles.pending
                  }`}
                >
                  {viewTask.status}
                </span>
              </div>

              <div className={styles.viewItem}>
                <span className={styles.viewLabel}>Priority</span>
                <span className={styles.viewValue}>{viewTask.priority}</span>
              </div>

              <div className={styles.viewItem}>
                <span className={styles.viewLabel}>Deadline</span>
                <span className={styles.viewValue}>
                  {viewTask.deadline
                    ? new Date(viewTask.deadline).toLocaleDateString()
                    : "No deadline"}
                </span>
              </div>
              <div className={styles.viewItem}>
                <span className={styles.viewLabel}>
                  Project
                </span>

                <span className={styles.viewValue}>
                  {viewTask.projectId?.title || "No Project"}
                </span>
              </div>

            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Tasks;