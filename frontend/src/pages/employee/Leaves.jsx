import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import styles from "../../styles/pmDashboard.module.css";

function Leaves() {

  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [viewLeave, setViewLeave] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  const [users, setUsers] = useState([]);
  const [leaveForm, setLeaveForm] = useState({
      startDate: "",
      endDate: "",
      leaveType: "",
      reason: "",
      status: "active",
    });
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id; 
  
// ================= FETCH =================
 const fetchLeaves = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/employee/leaves/${userId}`);
          setLeaves(res.data);
          console.log(leaves);
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
        `http://localhost:5000/api/users/leaves/${id}`
      );
      setViewLeave(res.data);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
 }
// ================= CREATE =================
 const handleCreateLeave = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/users/employee/leaves",
        {
          ...leaveForm,
          employee: userId,
        }
      );
      alert("leave created successfully");
      setShowCreateModal(false);
      setLeaveForm({
      startDate: "",
      endDate: "",
      leaveType: "",
      reason: "",
      status: "active",
    });
      fetchLeaves();
    } catch (error) {
      if(error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Error creating leave");
    }
    }
 };
// ================= USE EFFECT =================
 useEffect(() => {
   fetchLeaves();
   fetchEmployees();
 }, []);
  const leaveTypeOptions = [
    { value: "Annual", label: "Annual" },
    { value: "Sick", label: "Sick" },
    { value: "Emergency", label: "Emergency" },
  ];
 const userOptions = users.map((u) => ({
  value: u._id,
  label: u.name,
 }));
 const employeeOptions = employees.map(emp => ({
    value: emp._id,
    label: `${emp.email}`,
  }));


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
        <button
                  className={styles.addButton}
                  onClick={() => {
                    setEditLeave(null);
                    setLeaveForm({
                      startDate: "",
                      endDate: "",
                      leaveType: "",
                      reason: "",
                      status: "active",
                    });
                    setShowCreateModal(true);
                  }}
                >
                  + Add Leave
        </button>
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
       {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h3>Create Leave</h3>

            <form onSubmit={handleCreateLeave} className={styles.form}>
              <div className={styles.modalGrid}>
                    <p>From:{user?.email} </p> 
                    <br /> <br />
                    <p>Leave type: </p>
                    <br /> 
                    <Select
                      options={leaveTypeOptions}
                      value={leaveTypeOptions.find((opt) =>
                        opt.value === leaveForm.leaveType
                      )}
                      onChange={(selected) => {
                        setLeaveForm({
                          ...leaveForm,
                          leaveType: selected ? selected.value: "",
                        });
                      }}
                      placeholder="Select leave type"
                    />  
                    <br />
                    <br />
                    <p>Start date: </p>
                    <br /> 
                    <input
                      type="date"
                      name="startDate"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({
                        ...leaveForm,
                        startDate: e.target.value,
                      })}
                    />      
                    <br />
                    <br />
                    <p>End date: </p>
                    <br /> 
                    <input
                      type="date"
                      name="endDate"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({
                        ...leaveForm,
                        endDate: e.target.value,
                      })}
                    />  <br /> 
                    <p>Reason :</p>
                    <br />
                    <textarea
                      type="text"
                      name="reason"
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({
                        ...leaveForm,
                        reason: e.target.value,
                      })}
                    />
                    <br /> <br />
                    <p>Status: </p>
                    <br />
                    <select name="status"  value={leaveForm.status} onChange={(e) => setLeaveForm({
                      ...leaveForm, status: e.target.value,
                    })}>
                      <option value="">-- Select Status --</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="late">Late</option>
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
       {showModal && viewLeave && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Leave Details </h3>
            <p><b>Leave Type: </b> {viewLeave.leaveType}</p> <br />
            <p><b>Employee: </b> 
              {viewLeave?.employee
                ? viewLeave?.employee.email
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

export default Leaves;