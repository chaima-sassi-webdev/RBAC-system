import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import styles from "../../styles/pmDashboard.module.css";

function Complaints() {

  const [plaintes, setPlaintes] = useState([]);
  const [search, setSearch] = useState("");
  const [viewPlainte, setViewPlainte] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editPlainte, setEditPlainte] = useState(null);
  const [users, setUsers] = useState([]);
  
  const [plainteForm, setPlainteForm] = useState({
      subject: "",
      employee: "",
      message: "",
      status: "pending",
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;  

  const plainteTypeOptions = [
    { value: "Pending", label: "Pending" },
    { value: "In-review", label: "In-review" },
    { value: "Resolved", label: "Resolved" },
 ];
// ================= FETCH =================
 const fetchPlaintes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/employee/plaintes/${userId}`);
        setPlaintes(res.data);
         console.log(res.data);
    } catch (error) {
      console.log(error);
    }
 };

 const fetchEmployees = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }
 }
 const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/plaintes/${id}`
      );

      setViewPlainte(res.data);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
 }
// ================= CREATE =================
 const handleCreatePlainte = async (e) => {
    e.preventDefault();

    try {
      if (!userId) {
        alert("User not logged in");
        return;
      }
      await axios.post(
        "http://localhost:5000/api/users/employee/plaintes",
         {
            employee: userId,
            subject: plainteForm.subject,
            message: plainteForm.message,
            status: plainteForm.status,
         }
      );
      console.log(plainteForm);
      alert("plainte created successfully");
      setShowCreateModal(false);
      fetchPlaintes();
      setPlainteForm({
        employee: "",
        subject: "",
        message: "",
        status: "pending",
    });
      
    } catch (error) {
      if(error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Error creating plainte");
    }
    }
 };
// ================= USE EFFECT =================
 useEffect(() => {
   fetchPlaintes();
   fetchEmployees();
 }, []);

 const userOptions = users.map((u) => ({
  value: u._id,
  label: u.name,
 }));
 const employeeOptions = employees.map(emp => ({
    value: emp._id,
    label: `${emp.email}`,
  }));


  // ================= FILTER =================
 const filteredPlaintes = plaintes.filter((plaintes) =>
    plaintes.employee?.email?.toLowerCase().includes(search.toLowerCase()) || 
    plaintes.subject?.toLowerCase().includes(search.toLowerCase()) ||
    plaintes.status?.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
        {/* HEADER */}
      <div className={styles.header}>
        <h1>📁 Complaints Management</h1>
        <button
            className={styles.addButton}
            onClick={() => {
                setEditPlainte(null);
                setPlainteForm({
                  employee:"",
                  subject: "",
                  message: "",
                  status: "pending",
                });
            setShowCreateModal(true);}}>
                  + Add Complaint
        </button>
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
                      ? styles.pending
                      : styles.pending}>
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
       {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h3>Create Complaint</h3>

            <form onSubmit={handleCreatePlainte} className={styles.form}>
              <div className={styles.modalGrid}>
                    <p>From: {user?.email} </p>                   
                    <br /> <br />
                    <p>Plainte Subject: </p> <br />
                    <input type="text" name ="subject" value={plainteForm.subject} onChange={(e) => {
                      setPlainteForm({
                        ...plainteForm,
                        subject: e.target.value,
                      })
                    }}/>
                    <br />
                    <br /> 
                    <p>Message :</p>
                    <br />
                    <textarea
                      type="text"
                      name="message"
                      value={plainteForm.message}
                      onChange={(e) => setPlainteForm({
                        ...plainteForm,
                        message: e.target.value,
                      })}
                    />
                    <br /> <br />
                    <p>Status: </p>
                    <br />
                    <select name="status"  value={plainteForm.status} onChange={(e) => setPlainteForm({
                      ...plainteForm, status: e.target.value,
                    })}>
                      <option value="">-- Select Status --</option>
                      <option value="pending">Pending</option>
                      <option value="in-review">In Review</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <br /> <br />
              </div>

              <div className={styles.modalActions}>
                <button type="submit">
                   Create
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
       {showModal && viewPlainte && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>📁Plainte Details </h3>
            <p><b>Employee: </b> 
              {viewPlainte?.employee
                ? viewPlainte?.employee.email
                : "No employee assigned"}
            </p> <br />
            <p><b>Subject: </b> {viewPlainte.subject}</p> <br />
            <div className={styles.descriptionBox}>
              <b>Message: </b>
              <p>{viewPlainte.message}</p>
            </div>  <br />
            <p><b>Status: </b> <span
              className={
                viewPlainte.status === "resolved"
                ? styles.approved
                : viewPlainte.status === "rejected"
                ? styles.rejected
                : viewPlainte.status === "in-review"
                ? styles.pending
                : styles.pending
              }>
              {viewPlainte.status}
            </span></p> <br />
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
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