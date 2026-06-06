import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/pmDashboard.module.css";

function Complaints() {

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [viewComplaints, setViewComplaints] = useState(null);
  const [showViewModal , setShowViewModal] = useState(false);

  // ================= FETCH =================
  const fetchComplaints = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/admin/getAllComplaints");
            setComplaints(res.data);
      } catch (error) {
        console.log(error);
      }
  };
  
  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/admin/complaints/${id}`
      );
      setViewComplaints(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.log(error);
    }
  }

  // ================= USE EFFECT =================
  useEffect(() => {
  fetchComplaints();
  }, []);



  // ================= FILTER =================
  const filteredComplaints = complaints.filter((complaints) =>
    complaints.complaintsType?.toLowerCase().includes(search.toLowerCase()) || 
    complaints.status?.toLowerCase().includes(search.toLowerCase()) 
  );
  
  return (
    <div>
        {/* HEADER */}
      <div className={styles.header}>
        <h1>📁 Complaints Management</h1>
      </div>
        {/* SEARCH */}
        <input
          type="text"
              className={styles.searchInput}
              placeholder="Search Complaint"
              value={search}
          onChange={(e) => setSearch(e.target.value)}
         />
        {/* TABLE */}
        <div className={styles.activityContainer}>
          <table className={styles.table}>
              <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Employee</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.subject}</td>
                    <td>           
                      {complaint.employee?.email || "No employee"}
                    </td>
                    <td>
                      <span
                        className={
                        complaint.status === "resolved"
                        ? styles.approved
                        : complaint.status === "pending"
                        ? styles.pending
                        : complaint.status === "in-review"
                        ? styles.pending : styles.rejected
                        }
                      >
                      {complaint.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.viewButton} onClick={() => handleView(complaint._id)}>
                          View
                        </button>  
                      </div>
                    </td>
                  </tr>
                 ))}
              </tbody>
          </table>
        </div>
        {showViewModal && viewComplaints && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Complaint Details </h3>
              <p><b>Employee:</b>{" "}
                {viewComplaints.employee
                    ? `${viewComplaints.employee.email}`
                    : "No employee"}
              </p> <br />
              <p><b>Subject: </b> {viewComplaints.subject}</p> <br />
              <p><b>Message: </b> <br /> <br /> {viewComplaints.message}</p> <br />
              <p><b>Status: </b> <span
                  className={
                    viewComplaints.status === "resolved"
                    ? styles.approved
                    : viewComplaints.status === "pending"
                    ? styles.pending
                    : viewComplaints.status === "in-review"
                    ? styles.pending
                    : styles.rejected
                  }>
                    {viewComplaints.status}
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

export default Complaints;