import React, { useEffect, useState } from "react";
import Styles from "../styles/users.module.css";
import axios from "axios";

function Users() {

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );
  // ===== HANDLE INPUT =====
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // ===== OPEN CREATE MODAL =====
  const openCreateModal = () => {

    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "employee",
    });

    setShowModal(true);
  };

  // ===== OPEN EDIT MODAL =====
  const openEditModal = (user) => {

    setEditingUser(user);

    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });

    setShowModal(true);
  };

  // ===== FETCH USERS =====
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users/all-users");
    setUsers(res.data);
  };
  

  // ===== UPDATE USER =====
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      await axios.put(
        `http://localhost:5000/api/users/${editingUser._id}`,
        formData
      );

      setShowModal(false);

      fetchUsers();

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== CREATE USER =====
  const handleCreate = async (e) => {
  e.preventDefault();

  try {
    const form = new FormData(e.target);

    const newUser = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      role: form.get("role"),
    };

    const res = await axios.post(
      "http://localhost:5000/api/users/register",
      newUser
    );

    console.log("Success:", res.data);

    setShowModal(false);
    fetchUsers();

  } catch (err) {
    console.log("ERROR RESPONSE:", err.response);
    console.log("ERROR DATA:", err.response?.data);
    console.log("ERROR MESSAGE:", err.response?.data?.message);
  }
};

  return (
    <div>

      {/* HEADER */}
      <h2>👤 Users Page Content</h2>

      {/* ADD BUTTON */}
      <button onClick={openCreateModal} className={Styles.addButton}>
        + Add User
      </button>
      <div className={Styles.topBar}>

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={Styles.searchInput}
        />

      </div>
      <div className={Styles.tableContainer}>
        {/* TABLE */}
        <table  width="100%" className={Styles.table}>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user) => (
              <tr key={user._id}>

                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.isActive ? "Active" : "Inactive"}
                </td>

                <td>

                  <div className={Styles.actions}>
                        {/* TOGGLE STATUS */}
                  <button
                    onClick={async () => {
                      await axios.put(
                        `http://localhost:5000/api/users/${user._id}/status`
                      );
                      fetchUsers();
                    }}
                    className={Styles.toogleButton}
                  >
                    {user.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                  {/* EDIT */}
                  <button
                    onClick={() => openEditModal(user)}
                    className={Styles.editButton}
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={async () => {
                      await axios.delete(
                        `http://localhost:5000/api/users/${user._id}`
                      );
                      fetchUsers();
                    }}
                    className={Styles.deleteButton}
                  >
                    Delete
                  </button>
                  {/* VIEW */}
                  <button
                    onClick={() => setViewUser(user)}
                    className={Styles.viewButton}
                  >
                    View
                  </button>
                  {/* VIEW USER MODAL */}
                  {viewUser && (

                    <div className={Styles.modalOverlay}>

                      <div className={Styles.viewModal}>

                        <h2>User Profile</h2>

                        <div className={Styles.profileInfo}>

                          <p>
                            <strong>Name :</strong> {viewUser.name}
                          </p>

                          <p>
                            <strong>Email :</strong> {viewUser.email}
                          </p>

                          <p>
                            <strong>Role :</strong> {viewUser.role}
                          </p>

                          <p>
                            <strong>Status :</strong>
                            {" "}
                            {viewUser.isActive
                              ? "Active"
                              : "Inactive"}
                          </p>

                          <p>
                            <strong>Last Login :</strong>
                            {" "}
                            {viewUser.lastLogin
                              ? new Date(viewUser.lastLogin)
                                  .toLocaleString("fr-FR")
                              : "Never"}
                          </p>

                          <p>
                            <strong>Created At :</strong>
                            {" "}
                            {new Date(viewUser.createdAt)
                              .toLocaleString("fr-FR")}
                          </p>

                        </div>

                        <button
                          onClick={() => setViewUser(null)}
                          className={Styles.closeButton}
                        >
                          Close
                        </button>

                      </div>

                    </div>
                  )}
                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
      {/* MODAL */}
      {showModal && (
        <div className={Styles.modalOverlay}>

          <div className={Styles.modal}>

            <h3>
              {editingUser
                ? "Edit User"
                : "Add User"}
            </h3>

            <form
              onSubmit={
                editingUser
                  ? handleUpdate
                  : handleCreate
              }
            >

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {!editingUser && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              )}
              <select name="role" value={formData.role}
                onChange={handleChange}>
                <option value="super_admin">Super Administrator</option>
                <option value="admin">Administrator</option>
                <option value="gestionnaire">Project Manager</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
              </select>

              <div className={Styles.modalActions}>

                <button type="submit">
                  {editingUser
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

export default Users;