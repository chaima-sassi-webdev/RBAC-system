import React, {useState, useEffect} from "react";
import axios from "axios";
import styles from "../../styles/hr.module.css";

function Settings() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => { 
       const savedUser = JSON.parse( localStorage.getItem("user") ); 
       if (savedUser) { 
            setName(savedUser.name || ""); 
            setEmail(savedUser.email || "");
            setUserId(savedUser._id || null); 
        } 
    }, []);

    const handleProfileUpdate = async () => {

        try {
            if (!userId) {
                 return alert("User not found. Please login again.");
            }
            const res = await axios.put(
            `http://localhost:5000/api/users/profile/${userId}`,
            {
                name,
                email,
            }
            );

            // ===== UPDATE LOCAL STORAGE ===== 
            const updatedUser = res.data.user; 
            localStorage.setItem( "user", JSON.stringify(updatedUser) ); 
            setName(updatedUser.name || "");
            setEmail(updatedUser.email || "");
            alert("Profile updated successfully");

        } catch (error) {

            console.log(error);
            alert("Error updating profile");

        }
    };

    const handlePasswordUpdate = async () => {
        
        try {
            if (!userId) { 
                return alert("User not found. Please login again."); 
            } 
            if (newPassword !== confirmPassword) { 
                return alert("Passwords do not match"); 
            } 
            if (!currentPassword || !newPassword) { 
                return alert("All password fields are required"); 
            } 
            const res = await axios.put( `http://localhost:5000/api/users/password/${userId}`, { currentPassword, newPassword, } );

            alert(res.data.message || "Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error updating password");
        }
    };

    return (
        <div className={styles.settingsPage}>
          {/* HEADER */} 
          <div className={styles.header}> 
            <h1>⚙️ HR Settings</h1> 
          </div>  
          {/* PROFILE SETTINGS */}    
          <div className={styles.settingsCard}>
            <h2>Profile Information</h2>
            <div className={styles.settingsForm}>
              <p>Full Name: </p>  
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <p>Email: </p>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <button className={styles.saveBtn} onClick={handleProfileUpdate}> Save Changes </button>
            </div>
          </div>
          {/* PASSWORD SETTINGS */}
          <div className={styles.settingsCard}>
            <h2>Security</h2>
            <div className={styles.settingsForm}>
               <input type="password" placeholder="Current Password" value={currentPassword} onChange={ (e) => setCurrentPassword(e.target.value)} />
               <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
               <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
               <button className={styles.saveBtn} onClick={handlePasswordUpdate}>Update Password</button> 
            </div>
          </div>
        </div>
    )
}

export default Settings;