import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/pmDashboard.module.css";

function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
 

// ================= FETCH =================
const fetchUsers= async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/all-users");
          setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
};


// ================= USE EFFECT =================
useEffect(() => {
 fetchUsers();
}, []);



  // ================= FILTER =================
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) || 
    user.role?.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
        {/* HEADER */}
      <div className={styles.header}>
        <h1>📁 Users Consultation</h1>
      </div>
        {/* SEARCH */}
       <input
              type="text"
              className={styles.searchInput}
              placeholder="Search User"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
      {/* TABLE */}
       <div className={styles.activityContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th> Name</th>
                        <th> Email</th>
                        <th> Role</th>
                       
                    </tr>
                </thead>

                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>

                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.role}
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
       </div>
     
    </div>
  );
}

export default Users;