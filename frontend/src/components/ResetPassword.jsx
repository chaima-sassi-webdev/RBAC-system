import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import styles from "../styles/resetPassword.module.css";

function ResetPassword() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/users/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setError(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetPage}>

      <div className={styles.resetCard}>

        {/* HEADER */}
        <div className={styles.header}>
          <h2>Reset Password</h2>
          <p>Create a strong new password to secure your account.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* PASSWORD */}
          <div className={styles.passwordWrapper}>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />

            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>

          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.passwordWrapper}>

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
            />

            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(prev => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>

          </div>

          {/* PASSWORD STRENGTH */}
          <div className={styles.strengthContainer}>

            {password.length > 0 && (
              <>
                <div
                  className={`${styles.strengthBar} ${
                    password.length >= 6
                      ? styles.strong
                      : styles.weak
                  }`}
                />

                <span>
                  {password.length >= 6
                    ? "Strong password"
                    : "Weak password"}
                </span>
              </>
            )}

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? (
              <div className={styles.spinnerContainer}>
                <div className={styles.spinner}></div>
                <span>Resetting...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </button>

        </form>

        {/* MESSAGES */}
        {message && (
          <p className={styles.success}>{message}</p>
        )}

        {error && (
          <p className={styles.error}>{error}</p>
        )}

      </div>

    </div>
  );
}

export default ResetPassword;