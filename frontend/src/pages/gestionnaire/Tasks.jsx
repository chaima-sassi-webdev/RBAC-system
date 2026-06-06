import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import styles from "../../styles/tasks.module.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [viewTask, setViewTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: [],
    status: "pending",
    priority: "medium",
    deadline: "",
  });

  // ================= FETCH =================
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/users/tasks");
    setTasks(res.data);
  };

  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:5000/api/users/projects");
    setProjects(res.data);
  };

  const fetchUsers =async () => {
    const res = await axios.get("http://localhost:5000/api/users/employees");
    setUsers(res.data);
  }
  const projectOptions = projects.map(emp => ({
    value:emp._id,
    label: `${emp.title}`,
  }))
  const userOptions = users.map((u) => ({
    value: u._id,
    label: u.name,
  }));
  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setTaskForm({ ...taskForm, 
      [e.target.name]: e.target.value,
     });
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    if (editTask) {

      await axios.put(
        `http://localhost:5000/api/users/tasks/${editTask._id}`,
        taskForm
      );

    } else {

      await axios.post(
        "http://localhost:5000/api/users/tasks",
        taskForm
      );

    }

    setShowModal(false);
    setEditTask(null);

    fetchTasks();

  } catch (error) {

    if (error.response?.status === 409) {

      alert("Task already exists for this project");

    } else {

      alert("Server error");

    }

    console.log(error);
  }
};

  // ================= DELETE =================
  const handleDelete = async (id) => {

    try {
      await axios.delete(
        `http://localhost:5000/api/users/tasks/${id}`
      );
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= EDIT =================
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/tasks/${editTask._id}`,
        taskForm
      );
      setShowModal(false);
      setEditTask(null);
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
      console.log(viewTask)
      setShowViewModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const filtered = tasks.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.pageTitle}>📋 Tasks</h1>
          <p className={styles.pageSubtitle}>Manage your tasks</p>
        </div>

        <button
          className={styles.addButton}
          onClick={() => {
            setEditTask(null);
            setTaskForm({
              title: "",
              description: "",
              assignedTo: [],
              projectId: "",
              priority: "medium",
              status: "pending",
              deadline: "",
            });
            setShowModal(true);
          }}
        >
          + Add Task
        </button>
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
                          setEditTask(t);

                          setTaskForm({
                            title: t.title,
                            description: t.description,
                            projectId: t.projectId?._id || t.projectId,
                            assignedTo: Array.isArray(t.assignedTo)
                              ? t.assignedTo.map(u =>
                                  typeof u === "string" ? u : u._id
                                )
                              : [],
                            status: t.status,
                            priority: t.priority,
                            deadline: t.deadline?.split("T")[0] || "",
                          });

                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(t._id)}
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
      </div>

      {/* MODAL CREATE / EDIT */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h3>{editTask ? "Edit Task" : "Create Task"}</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.modalGrid}>
                    <p>Task Title</p>
                    <input
                      name="title"
                      value={taskForm.title}
                      onChange={handleChange}
                    />
                    <br /> <br />
                  <p>Project name: </p>
                  <br /> 
                  <Select
                    options={projectOptions}
                    value={projectOptions.find(opt => opt.value === taskForm.projectId )}
                    onChange={(selected) => {
                    setTaskForm({
                      ...taskForm,
                      projectId: selected
                        ?  selected.value : "",
                    });}}
                    required
                  />
                    <br/>
                    <p>Assigned To: </p>
                    <br /> 
                    <Select
                      isMulti
                      options={userOptions}
                      value={userOptions.filter(opt =>
                        taskForm.assignedTo?.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        setTaskForm({
                          ...taskForm,
                          assignedTo: selected ? selected.map(s => s.value) : [],
                        });
                      }}
                    />
                  <br />
                    <p>Description:</p>
                  <textarea
                    type="date"
                    name="description"
                    value={taskForm.description}
                    onChange={handleChange}
                  />
                  <br /> <br />
                  <p>Priority: </p> <br />
                  <select name="priority" onChange={handleChange} value={taskForm.priority}>
                    <option value="">-- Select priority --</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <br /> <br />
                  <p>Status: </p>
                  <br />
                  <select name="status" onChange={handleChange} value={taskForm.status}>
                    <option value="">-- Select Status --</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="late">Late</option>
                  </select>
                  <br /> <br />
                  <p>Deadline: </p>
                  <input
                    type="date"
                    name="deadline"
                    value={taskForm.deadline}
                    onChange={handleChange}
                  />
                   </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>

                <button type="submit">
                  {editTask ? "Update" : "Create"}
                </button>
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
                <span className={styles.viewLabel}>Assigned To : </span>
                <span className={styles.viewValue}> {viewTask?.assignedTo.length > 0
                ? viewTask?.assignedTo.map(emp => emp.email).join(", ")
                : "No employees"}</span>
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