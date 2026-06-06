import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/pmDashboard.module.css";

function Client() {

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [viewClient, setViewClient] = useState(null);
  const [showViewModal , setShowViewModal] = useState(false);
  const [clients, setClients] = useState([]);
  const truncate = (text, max = 15) => {
  if (!text) return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
};
  // ================= FETCH =================
  const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/clients");
          setClients(res.data);
      } catch (error) {
        console.log(error);
      }
  };
  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/clients/${id}`
      );
      setViewClient(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.log(error);
    }
  }

  // ================= USE EFFECT =================
  useEffect(() => {
  fetchClients();
  }, []);



  // ================= FILTER =================
  const filteredClients = clients.filter((client) =>
    client.email?.toLowerCase().includes(search.toLowerCase()) || 
    client.phone?.toLowerCase().includes(search.toLowerCase()) ||
    client.company?.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
        {/* HEADER */}
      <div className={styles.header}>
        <h1>📁 Clients Management</h1>
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
                            <td><td>{truncate(client.company, 18)}</td></td>
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
                            <td>
                              <div className={styles.actions}>
                                <button className={styles.viewButton} onClick={() => handleView(client._id)}>
                                  View
                                </button>  
                              </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
       </div>
       {showViewModal && viewClient && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Client Details </h3>
            <p><b>Name: </b> {viewClient.name}</p> <br />
            <p><b>Email: </b> {viewClient.email}</p> <br />
            <p><b>Phone: </b> {viewClient.phone}</p> <br />
            <div className={styles.descriptionBox}>
              <b>Company: </b> {viewClient.email}
              <p>{viewClient.company}</p>
            </div>  <br />
            <p><b>Address: </b> {viewClient.address}</p> <br />
            <p><b>Status: </b> {viewClient.status}</p> <br />
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

export default Client;