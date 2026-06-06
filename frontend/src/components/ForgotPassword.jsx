import React, { useState } from "react";
import axios from "axios";

import styles from "../styles/forgotPassword.module.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Email required");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { email }
      );

      setMessage(res.data.message);

      setEmail("");

    } catch (error) {

      setError(
        error.response?.data?.message || "Server error"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className={styles.forgotPage}>

      <div className={styles.forgotCard}>

        <div className={styles.header}>

          <h2>Forgot Password</h2>

          <p>
            Enter your email address and we will send
            you a password reset link.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >

            {loading ? (
              <div className={styles.spinnerContainer}>

                <div className={styles.spinner}></div>

                <span>Sending...</span>

              </div>
            ) : (
              "Send Reset Link"
            )}

          </button>

        </form>

        {message && (
          <p className={styles.success}>
            {message}
          </p>
        )}

        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}

        <div className={styles.backLogin}>
          <a href="/login">
            Back to Login
          </a>
        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;