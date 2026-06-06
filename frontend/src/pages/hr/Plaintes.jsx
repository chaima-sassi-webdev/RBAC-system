import React, { useEffect, useState } from "react";
import styles from "../../styles/hr.module.css";
import axios from "axios";
import Select from "react-select";

function Plaintes() {

  // ================= STATES =================
  const [plaintes, setPlaintes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlainte, setEditingPlainte] = useState(null);
  const [search, setSearch] = useState("");
  const [viewPlainte, setViewPlainte] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee: "",
    subject: "",
    message: "",
    status: "pending",
  });
const truncate = (text, max = 15) => {
  if (!text) return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
};
  // ================= USE EFFECT =================
  useEffect(() => {
    fetchPlaintes();
    fetchEmployees();
  }, []);
  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // ================= FETCH PLAINTES =================
  const fetchPlaintes = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/users/plaintes"
      );

      setPlaintes(res.data);

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

  // ================= CREATE =================
  const handleCreate = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/users/plaintes",
        formData
      );
      alert("plainte created successfully");
      setShowModal(false);
      fetchPlaintes();
      setFormData({
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

  // ================= UPDATE =================
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      await axios.put(
        `http://localhost:5000/api/users/plaintes/${editingPlainte._id}`,
        formData
      );

      setShowModal(false);
      setEditingPlainte(null);
      fetchPlaintes();

    } catch (error) {

      console.log(error);

    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/users/plaintes/${id}`
      );

      fetchPlaintes();

    } catch (error) {

      console.log(error);

    }
  };

  // ================= VIEW =================
  const handleView = async (id) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/users/plaintes/${id}`
      );

      setViewPlainte(res.data);

      setShowViewModal(true);

    } catch (error) {

      console.log(error);

    }
  };
 const employeesOptions = employees.map(employee => ({
    value: employee._id,
    label: `${employee.name} - ${employee.email}`,
  }));
  // ================= FILTER =================
  const filteredPlaintes = plaintes.filter((p) =>
  (p.employee?.name || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (p.employee?.email || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (p.subject || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (

    <div>

      {/* HEADER */}
      <div className={styles.header}>

        <h2>📝 Plaintes Management</h2>

        <button
          className={styles.addButton}
          onClick={() => {

            setEditingPlainte(null);

            setFormData({
              employee: "",
              subject: "",
              message: "",
              status: "pending",
            });

            setShowModal(true);

          }}
        >
          + Add Plainte
        </button>

      </div>

      {/* SEARCH */}
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search Employee"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className={styles.tableWrapper}>

        <table className={styles.table}>

          <thead>

            <tr>
              <th>Employee</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredPlaintes.map((p) => (

              <tr key={p._id}>
                <td>{p.employee?.email}</td>

                <td>{p.subject}</td>

                <td>{truncate(p.message, 20)}</td>

                <td>

                  <span
                    className={
                      p.status === "resolved"
                        ? styles.approved
                        : p.status === "rejected"
                        ? styles.rejected
                        : p.status === "in-review"
                        ? styles.review
                        : styles.pending
                    }
                  >
                    {p.status}
                  </span>

                </td>

                <td>

                  <div className={styles.actions}>

                    {/* VIEW */}
                    <button
                      className={styles.viewButton}
                      onClick={() => handleView(p._id)}
                    >
                      View
                    </button>

                    {/* EDIT */}
                    <button
                      className={styles.editButton}
                      onClick={() => {

                        setEditingPlainte(p);

                        setFormData({
                          employee: p?.employee?._id || "",
                          subject: p.subject || "",
                          message: p.message || "",
                          status: p.status || "",
                        });

                        setShowModal(true);

                      }}
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(p._id)}
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

      {/* ================= CREATE / EDIT MODAL ================= */}
      {showModal && (

        <div className={styles.modalOverlay}>

          <div className={styles.modal}>

            <h3>
              {editingPlainte
                ? "Edit Plainte"
                : "Add Plainte"}
            </h3>

            <form
              onSubmit={
                editingPlainte
                  ? handleUpdate
                  : handleCreate
              }
            >
              <p>From: {viewPlainte?.employee.email}</p>  
              <br /> 
              {/* EMPLOYEE SELECT */}
              
                <p>Subject: </p>
              {/* SUBJECT */}
              <input
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <br /> <br />
              <p>Message: </p>
              {/* MESSAGE */}
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
              /> <br /> <br />
              <p>Status:</p>
              {/* STATUS */}
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="pending">
                  Pending
                </option>

                <option value="in-review">
                  In Review
                </option>

                <option value="resolved">
                  Resolved
                </option>

                <option value="rejected">
                  Rejected
                </option>

              </select>

              {/* ACTIONS */}
              <div className={styles.modalActions}>

                <button type="submit">

                  {editingPlainte
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

      {/* ================= VIEW MODAL ================= */}
      {showViewModal && viewPlainte && (

        <div className={styles.modalOverlay}>

          <div className={styles.modal}>

            <h3 className={styles.modalTitle}>
              📄 Plainte Details
            </h3>

            <div className={styles.viewBox}>

              <p>
                <b>Employee :</b>{" "}
                {viewPlainte?.employee.name}
              </p>
              <br />
              <p>
                <b>Email :</b>{" "}
                {viewPlainte?.employee.email}
              </p>
                <br />
              <p>
                <b>Subject :</b>{" "}
                {viewPlainte.subject}
              </p>
              <br />
              <div className={styles.descriptionBox}>

                <b>Message :</b>
                  <br /> <br />
                <p>{viewPlainte.message}</p>

              </div>

              <p>
                <br />
                <b>Status :</b>{" "}

                <span
                  className={
                    viewPlainte.status === "resolved"
                      ? styles.approved
                      : viewPlainte.status === "rejected"
                      ? styles.rejected
                      : styles.pending
                  }
                >
                  {viewPlainte.status}
                </span>

              </p>

            </div>

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