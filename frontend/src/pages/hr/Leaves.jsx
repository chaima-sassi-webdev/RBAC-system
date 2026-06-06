import React, { useEffect, useState } from "react";
import styles from "../../styles/hr.module.css";
import axios from "axios";
import Select from "react-select";

function Leaves() {

  // ================== STATES ==================
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [search, setSearch] = useState("");
  const [viewLeave, setViewLeave] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  const [formData, setFormData] = useState({
    employee: "",
    leaveType: "Annual",
    startDate: "",
    endDate: "",
    reason: "",
    status: "pending",
  });

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);
  
  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= FETCH LEAVES =================
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/leaves"
      );
      setLeaves(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH EMPLOYEES =================

  const fetchEmployees = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/users/employees"
      );

      setEmployees(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const employeeOptions = employees.map(emp => ({
    value: emp._id,
    label: emp.email
}));
// ================= CREATE LEAVE =================
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/users/leaves",
        formData
      );
      alert("leave created successfully");
      setShowModal(false);
      fetchLeaves();
    } catch (error) {
        if(error.response?.data?.message) {
         alert(error.response.data.message);
        } else {
          alert("Error creating leave");
      }
    }
  };

 // ================= UPDATE LEAVE =================
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      await axios.put(
        `http://localhost:5000/api/users/leaves/${editingLeave._id}`,
        formData
      );

      setShowModal(false);
      setEditingLeave(null);
      fetchLeaves();

    } catch (error) {

      console.log(error);

    }
  };
  
// ================= DELETE LEAVE =================
  const handleDelete = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/users/leaves/${id}`
      );

      fetchLeaves();

    } catch (error) {

      console.log(error);

    }
  }; 
// =============== VIEW ===================
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
};
const selectedEmployee = employees.find(
  emp => emp._id === formData.employee
);
// ================= FILTER =================
const filteredLeaves = leaves.filter((leave) =>
  leave.employee?.email
  ?.toLowerCase()
  .includes(search.toLowerCase())
);

// ================= RETURN =================
  return (
    <div>

      {/* HEADER */}
      <div className={styles.header}>
        <h2>📅 Leaves Management</h2>
        <button
          className={styles.addButton}
          onClick={ ()=> {
            setEditingLeave(null);
            setFormData({
              employee: "",
              leaveType: "Annual",
              startDate: "",
              endDate: "",
              reason: "",
              status: "pending",
            });
            setShowModal(true);
          }

          }
        >
          + Add Leave
        </button>
      </div>
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search employee..."
        className={styles.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Leave Type</th>
              <th>Start Date</th>
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
                  {new Date(
                    leave.startDate
                  ).toLocaleDateString()}
                </td>

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
                    <button
                        className={styles.viewButton}
                        onClick={() => handleView(leave._id)}
                        >
                        View
                    </button>  
                    {/* EDIT */}
                    <button
                      className={styles.editButton}
                       onClick={() => {
                          setEditingLeave(leave);

                          setFormData({
                            employee: leave.employee?._id || "",
                            leaveType: leave.leaveType,
                            startDate: leave.startDate?.slice(0, 10),
                            endDate: leave.endDate?.slice(0, 10),
                            reason: leave.reason,
                            status: leave.status,
                          });

                          setShowModal(true);
                        }}
                    >
                      
                      Edit
                    </button>
                    {/* DELETE */}
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(leave._id)}
                    >
                      Delete
                    </button>
                    {/* VIEW */}
                    

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {showViewModal && viewLeave && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>📁 Leaves Details</h3>

            <p><b>Employee:</b> {viewLeave?.employee?.email} </p><br />
            <p><b>Leave Type:</b> {viewLeave.leaveType}</p> <br />
            <p>
              <b>Start Date:</b>{" "}
              {new Date(viewLeave.startDate).toLocaleDateString()}
            </p> <br />
            <p>
              <b>End Date:</b>{" "}
              {new Date(viewLeave.endDate).toLocaleDateString()}
            </p> <br />
            <div className={styles.descriptionBox}>
              <b> Reason:  </b> 
              <p>{viewLeave.reason}</p>                       
            </div>  <br />
            <p><b>Status:</b> {viewLeave.status}</p> <br />

            <button
              className={styles.closeButton}
              onClick={() => setShowViewModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showModal && (

        <div className={styles.modalOverlay}>

          <div className={styles.modal}>

            <h3>
              {editingLeave
                ? "Edit Leave"
                : "Add Leave"}
            </h3>

            <form
              onSubmit={
                editingLeave
                  ? handleUpdate
                  : handleCreate
              }
            >
            <br />
            <br />
            <p>Employee:  {viewLeave.employee.email}</p> <br />
           
                       
            <br /> 
            <p>Leave Type: </p>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
            >
              <option value="Annual">
                Annual Leave
              </option>
              <option value="Sick">
                Sick Leave
              </option>
              <option value="Emergency">
                Emergency Leave
              </option>
            </select>
            <br /> <br /> 
            <p>Reason: </p> 
            <textarea name="reason" value={formData.reason} onChange={handleChange} />  
            <p>Start Date:</p>    
            <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            <br />
            <br />  
            <p>End Date: </p> 
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            <br /> <br />
            <p>Status: </p>
            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                >
                <option value="pending">
                    Pending
                </option>

                <option value="approved">
                    Approved
                </option>

                <option value="rejected">
                    Rejected
                </option>
            </select>
            {/* ACTIONS */}
            <div className={styles.modalActions}>

                <button type="submit">
                  {editingLeave
                    ? "Update"
                    : "Create"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

            </div>

          </form>

        </div>

      </div>

      )}
      

    </div>
  );
}

export default Leaves;