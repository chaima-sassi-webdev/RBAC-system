import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/pmDashboard.module.css";

function Leaves() {

  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [viewLeave, setViewLeave] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
// ================= FETCH =================
const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/leaves");
          setLeaves(res.data);
    } catch (error) {
      console.log(error);
    }
};

 const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/leaves/${id}`
      );
      setViewLeave(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.log(error);
    }
  }

// ================= USE EFFECT =================
useEffect(() => {
 fetchLeaves();
}, []);



  // ================= FILTER =================
  const filteredLeaves = leaves.filter((leave) =>
    leave.employee?.email.toLowerCase().includes(search.toLowerCase()) || 
    leave.leaveType?.toLowerCase().includes(search.toLowerCase()) ||
    leave.status?.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
        {/* HEADER */}
      <div className={styles.header}>
        <h1>📁 Leaves Management</h1>
      </div>
        {/* SEARCH */}
       <input
              type="text"
              className={styles.searchInput}
              placeholder="Search Leave"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
      {/* TABLE */}
       <div className={styles.activityContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredLeaves.map((leave) => (
                        <tr key={leave._id}>

                            <td>{leave.employee?.email}</td>
                            <td>{leave.leaveType}</td>
                            <td>
                                <span
                                className={
                                   leave.status === "approved"
                                   ? styles.approved
                                   : leave.status === "rejected"
                                   ? styles.rejected
                                   : styles.pending
                                }
                                >
                                {leave.status}
                                </span>
                            </td>
                            <td>
                              <div className={styles.actions}>
                                <button className={styles.viewButton} onClick={() => handleView(leave._id)}>
                                  View
                                </button>  
                              </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
       </div>
       {showViewModal && viewLeave && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Leave Details </h3>
            <p><b>Leave Type: </b> {viewLeave.leaveType}</p> <br />
            <p><b>Employee: </b> 
              {viewLeave.employee
                ? viewLeave.employee.email
                : "No employee assigned"}
            </p> <br />
            <p><b>Start Date: </b> {viewLeave.startDate
                    ? new Date(viewLeave.startDate).toLocaleDateString()
                    : "No deadline"}</p> <br />
            <p><b>End Date: </b> {viewLeave.endDate
                    ? new Date(viewLeave.endDate).toLocaleDateString()
                    : "No deadline"}</p> <br />
            <div className={styles.descriptionBox}>
              <b>Reason: </b>
              <p>{viewLeave.reason}</p>
            </div>  <br />
            <p><b>Status: </b> <span
              className={
                viewLeave.status === "approved"
                ? styles.approved
                : viewLeave.status === "rejected"
                ? styles.rejected
                : styles.pending
              }>
              {viewLeave.status}
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

export default Leaves;