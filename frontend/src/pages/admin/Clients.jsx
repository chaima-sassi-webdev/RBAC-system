import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/pmDashboard.module.css";

function Clients() {

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [viewClient, setViewClient] = useState(null);  
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    status: "active",
  });
const truncate = (text, max = 15) => {
  if (!text) return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
};
// ================= FETCH =================
const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/admin/getClients");
      if(Array.isArray(res.data)){
        setClients(res.data);
      } else {
        setClients([]);
        console.warn("Backend did not return array:", res.data);
      }
    } catch (error) {
      console.log("FETCH ERROR =>", error.response?.data || error.message);
    }
};
// ================= USE EFFECT =================
useEffect(() => {
 fetchClients();

}, []);

const handleChange = (e) => {
    setClientForm({
       ...clientForm,
       [e.target.name]: e.target.value,
    });
}
// ================= CREATE =================
const handleCreateClient = async (e) => {

  e.preventDefault();

  try {

    await axios.post(
      "http://localhost:5000/api/users/admin/client",
      clientForm
    );
    alert("client created successfully");
    setShowModal(false);
    fetchClients();
  } catch (error) {
    if(error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Error creating client");
    }

    console.log(error);
  }
};

// ================= UPDATE =================
const handleUpdateClient = async (e) => {
    e.preventDefault();
   try {
    await axios.put(
     `http://localhost:5000/api/users/admin/client/${editClient._id}`,
      clientForm
    );
    setShowModal(false);
    setEditClient(null);
    fetchClients();
   } catch (error) {
     console.log(error);
   }
};
  // ================= DELETE =================
const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/admin/client/${id}`);
      fetchClients();
    } catch (error) {
      console.log(error);
    }
};

 
// ================= VIEW =================
  const handleView = async (id) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/users/admin/getClientById/${id}`
      );

      setViewClient(res.data);

      setShowViewModal(true);

    } catch (error) {

      console.log(error);

    }
  };

  // ================= FILTER =================
  const filteredClients = clients.filter((client) =>
    client.email?.toLowerCase().includes(search.toLowerCase()) || 
    String(client.phone).includes(search)||
    client.company?.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
        {/* HEADER */}
      <div className={styles.header}>
        <h1>📁 Clients Management</h1>
        <button 
            className={styles.addButton}
            onClick={() => {setEditClient(null);setClientForm({
                name: "",
                email: "",
                phone: "",
                company: "",
                address: "",
                status: "active",
            });
            setShowModal(true)}} >
            + Add Client
        </button>
      </div>
        {/* SEARCH */}
       <input
              type="text"
              className={styles.searchInput}
              placeholder="Search Client"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
      {/* TABLE */}
       <div className={styles.activityContainer}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {filteredClients.map((client) => (
                    <tr key={client._id}>

                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{truncate(client.company, 18)}</td>

                    <td>
                        <span
                        className={
                            client.status === "active"
                            ? styles.approved
                            : styles.rejected
                        }
                        >
                        {client.status}
                        </span>
                    </td>

                    {/* ACTIONS MUST BE INSIDE TD */}
                    <td>
                        <div className={styles.actions}>

                        {/* VIEW */}
                        <button
                            className={styles.viewButton}
                            onClick={() => handleView(client._id)}
                        >
                            View
                        </button>
                         
                        {/* EDIT */}
                        <button
                            className={styles.editButton}
                            onClick={() => {
                            setEditClient(client);
                            setClientForm({
                                name: client.name,
                                email: client.email,
                                phone: client.phone,
                                company: client.company,
                                address: client.address,
                                status: client.status,
                            });
                            setShowModal(true);
                            }}
                        >
                            Edit
                        </button>

                        {/* DELETE */}
                        <button
                            onClick={() => handleDeleteClient(client._id)}
                            className={styles.deleteButton}
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

      {/* CREATE / EDIT MODAL  */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>
              {editClient
                ? "Edit Client"
                : "Add Client"}
            </h3>
            <form
              onSubmit={
                editClient
                ? handleUpdateClient
                : handleCreateClient
              }>
                {/* NAME */}
                <p>Name:</p>
                <input
                type="text"
                name="name"
                placeholder="Client name"
                value={clientForm.name}
                onChange={handleChange}
                required
            />
            {/* EMAIL */}
                <p>Email:</p>
                <input
                type="text"
                name="email"
                placeholder="Email name"
                value={clientForm.email}
                onChange={handleChange}
                required
            />
                {/* DESCRIPTION */}
            <p>Company:</p>
            <textarea
              name="company"
              placeholder="Company description"
              value ={clientForm.company}
              onChange={handleChange}
            />
                {/* PHONE NUMBER */}
            <p>Phone Number:</p>
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={clientForm.phone}
              onChange={handleChange}
            />
              {/* ADDRESS */}
            <p>Address:</p>
            <input
              type="text"
              name="address"
              placeholder="Client Address"
              value={clientForm.address}
              onChange={handleChange}
            />
                {/* STATUS */}
            <p>Status:</p>
            <select 
                name="status"
                value={clientForm.status}
                onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
            </select>


             {/* BUTTONS */}
            <div className={styles.modalActions}>
                <button  type="submit">
                    {editClient
                    ? "Update"
                : "Create"}
                </button>
                <button
                    type="button"
                    onClick={() => {setShowModal(false); setEditClient(null)}}
                    >
                    Cancel
                </button>
            </div>
            </form>    
            
          </div>
        </div>
      )}

      {/* VIEW  MODAL */}
      {showViewModal && viewClient && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>
                📄 Client Details
            </h3>
            <div className={styles.viewBox}>
                <p>
                    <b> Name : </b> {viewClient.name}
                </p>
                <p>
                    <b> Email : </b> {viewClient.email}
                </p>
                <div className={styles.descriptionBox}>
                  <b> Description:  </b> 
                  <p>{viewClient.company}</p>
                  
                </div>    
                <p>
                    <b> Phone Number : </b> {viewClient.phone}
                </p>
                <p>
                    <b> Address : </b> {viewClient.address}
                </p>
                <p>
                    <b> Status: </b> {" "}
                    
                    <span
                    className={
                    viewClient.status === "active"
                    ? styles.approved
                    : styles.rejected
                    }
                    >
                       {viewClient.status}
                    </span>                
                </p>

                <button className={styles.closeButton} onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Clients;