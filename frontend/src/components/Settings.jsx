import React, { useEffect, useState } from "react";
import axios from "axios";
import Styles from "../styles/settings.module.css";

function Settings() {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    lastLogin: "",
  });

  const [message, setMessage] = useState("");

  // ===== GET PROFILE =====
  const fetchProfile = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await axios.get(
        `http://localhost:5000/api/users/profile/${user.id}`
      );

      setProfile(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchProfile();

  }, []);

  // ===== HANDLE CHANGE =====
  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ===== UPDATE PROFILE =====
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await axios.put(
        `http://localhost:5000/api/users/profile/${user.id}`,
        {
          name: profile.name,
          email: profile.email,
          role: profile.role,
        }
      );

      setMessage(res.data.message);

    } catch (error) {

      console.log(error);

      setMessage("Update failed");

    }
  };

  return (

    <div className={Styles.container}>

      <div className={Styles.card}>

        <h2>
          ⚙️ Super Admin Settings
        </h2>

        <form onSubmit={handleUpdate}>

          {/* NAME */}
          <div className={Styles.inputGroup}>

            <label>Name</label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />

          </div>

          {/* EMAIL */}
          <div className={Styles.inputGroup}>

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />

          </div>

          {/* ROLE */}
          <div className={Styles.inputGroup}>

            <label>Role</label>

            <input
              type="text"
              value={profile.role}
              disabled
            />

          </div>

          {/* LAST LOGIN */}
          <div className={Styles.inputGroup}>

            <label>Last Login</label>

            <input
              type="text"
              value={
                profile.lastLogin
                  ? new Date(
                      profile.lastLogin
                    ).toLocaleString("fr-FR")
                  : "-"
              }
              disabled
            />

          </div>

          <button
            type="submit"
            className={Styles.saveButton}
          >
            Save Changes
          </button>

        </form>

        {message && (
          <p className={Styles.message}>
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Settings;