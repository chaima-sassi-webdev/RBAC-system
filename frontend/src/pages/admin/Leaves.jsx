import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/pmDashboard.module.css";

function Leaves() {

  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [viewLeaves, setViewLeaves] = useState(null);
  const [showViewModal , setShowViewModal] = useState(false);

  // ================= FETCH =================
  const fetchLeaves = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/admin/getAllLeaves");
            setLeaves(res.data);
      } catch (error) {
        console.log(error);
      }
  };
  
  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/admin/leaves/${id}`
      );
      setViewLeaves(res.data);
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
  const filteredLeaves = leaves.filter((leaves) =>
    leaves.leaveType?.toLowerCase().includes(search.toLowerCase()) || 
    leaves.status?.toLowerCase().includes(search.toLowerCase()) 
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
                        <th>Leave Type</th>
                        <th>Start date </th>
                        <th>End date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate
                    ? new Date(leave.startDate).toLocaleDateString()
                    : "No deadline"}</td>
                    <td>{leave.endDate
                    ? new Date(leave.endDate).toLocaleDateString()
                    : "No deadline"}</td>
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
        {showViewModal && viewLeaves && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Leave Details </h3>
              <p><b>Leave type: </b> {viewLeaves.leaveType}</p> <br />
              <p><b>Employee:</b>{" "}
                {viewLeaves.employee
                    ? `${viewLeaves.employee.name} (${viewLeaves.employee.email})`
                    : "No employee"}
              </p> <br />
              <p><b>Start date: </b> {viewLeaves.startDate
                    ? new Date(viewLeaves.startDate).toLocaleDateString()
                    : "No deadline"}</p> <br />
              <p><b>End date: </b> {viewLeaves.endDate
                    ? new Date(viewLeaves.endDate).toLocaleDateString()
                    : "No deadline"}</p> <br />
              <p><b>Raison: </b> {viewLeaves.reason}</p> <br />
              <p><b>Status: </b> <span
                  className={
                    viewLeaves.status === "approved"
                    ? styles.approved
                    : viewLeaves.status === "rejected"
                    ? styles.rejected
                    : styles.pending
                  }>
                    {viewLeaves.status}
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