import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/pmDashboard.module.css";

function Tasks() {

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [viewTask, setViewTask] = useState(null);
  const [showViewModal , setShowViewModal] = useState(false);

// ================= FETCH =================
const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/tasks");
          setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
};

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
}
// ================= USE EFFECT =================
useEffect(() => {
 fetchTasks();
}, []);

// ================= FILTER =================
  const filteredTasks = tasks.filter((task) =>
    task.title?.toLowerCase().includes(search.toLowerCase()) || 
    task.projectId?.toLowerCase().includes(search.toLowerCase()) ||
    task.spentBudget?.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
        {/* HEADER */}
      <div className={styles.header}>
        <h1>📁 Tasks Management</h1>
      </div>
        {/* SEARCH */}
       <input
              type="text"
              className={styles.searchInput}
              placeholder="Search Task"
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
                        <th>Priority</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredTasks.map((task) => (
                        <tr key={task._id}>

                            <td>{task.title}</td>
                            <td>
                                <span
                                className={
                                   task.status === "approved"
                                   ? styles.approved
                                   : task.status === "rejected"
                                   ? styles.rejected
                                   : styles.pending
                                }
                                >
                                {task.status}
                                </span>
                            </td>
                            <td>{task.priority}</td>
                            <td>
                              <div className={styles.actions}>
                                <button className={styles.viewButton} onClick={() => handleView(task._id)}>
                                  View
                                </button>  
                              </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
       </div>
        {showViewModal && viewTask && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Task Details </h3>
              <p><b>Title: </b> {viewTask.title}</p> <br />
              <p><b>Employee: </b> 
              {viewTask.assignedTo && viewTask.assignedTo.length > 0 ? ( 
                viewTask.assignedTo.map((emp) => (
                <span key={emp._id}>
                  {emp.email} -  <br />  
                </span>
              ))
              ) : ( 
                "No employees assigned"
              )}
              </p> <br />
              <p><b>Project: </b> {viewTask.projectId?.title}</p> <br />
              <p><b>Priority: </b> {viewTask.priority}</p> <br />
              <p><b>Deadline: </b> {viewTask.deadline
                                    ? new Date(viewTask.deadline).toLocaleDateString()
                                    : "No deadline"}</p> <br />
              <div className={styles.descriptionBox}>
                <b>Description: </b>
                <p>{viewTask.description}</p>
              </div> <br />
              <p><b>Status: </b> <span
                className={
                  viewTask.status === "approved"
                  ? styles.approved
                  : viewTask.status === "rejected"
                  ? styles.rejected
                  : styles.pending
                }
              >
                {viewTask.status}
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

export default Tasks;