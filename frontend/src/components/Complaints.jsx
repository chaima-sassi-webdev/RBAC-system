import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/pmDashboard.module.css";

function Plaintes() {

  const [plaintes, setPlaintes] = useState([]);
  const [search, setSearch] = useState("");
  const [viewComplaint, setViewComplaint] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false); 
// ================= FETCH =================
const fetchPlaintes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/plaintes");
          setPlaintes(res.data);
    } catch (error) {
      console.log(error);
    }
};

 const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/plaintes/${id}`
      );
      setViewComplaint(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.log(error);
    }
  }

// ================= USE EFFECT =================
  useEffect(() => {
  fetchPlaintes();
  }, []);



  // ================= FILTER =================
  const filteredPlaintes = plaintes.filter((plainte) =>
  (plainte.employee?.email || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||
  (plainte.subject || "")
    .toLowerCase()
    .includes(search.toLowerCase())
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
                        <th>Employee</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredPlaintes.map((plainte) => (
                        <tr key={plainte._id}>

                            <td>{plainte.employee?.email}</td>
                            <td>{plainte.subject}</td>
                            
                            <td>
                              <span
                                className={
                                  plainte.status === "resolved"
                                    ? styles.approved
                                    : plainte.status === "rejected"
                                    ? styles.rejected
                                    : plainte.status === "in-review"
                                    ? styles.review
                                    : styles.pending
                                }
                                >
                                {plainte.status}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actions}>
                                <button className={styles.viewButton} onClick={() => handleView(plainte._id)}>
                                  View
                                </button>  
                              </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
       </div>
       {showViewModal && viewComplaint && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Complaint Details </h3>
              <p><b>Employee: </b> 
              {viewComplaint.employee
                ? viewComplaint.employee?.email
                : "No employee assigned"}
              </p> <br />
              <p><b>Subject: </b> {viewComplaint.subject} </p> <br />
              <p><b>Message:</b> </p> <br />
              <div className={styles.descriptionBox}>
                <p>{viewComplaint.message}</p>
              </div>  <br />
              <p><b>Status: </b> <span
                className={
                  viewComplaint.status === "approved"
                  ? styles.approved
                  : viewComplaint.status === "rejected"
                  ? styles.rejected
                  : styles.pending
                }>
                  {viewComplaint.status}
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

export default Plaintes;