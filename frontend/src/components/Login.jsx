import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/login.module.css";

function Login() {

  const { register, handleSubmit } = useForm();

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (data) => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        data
      );

      setMessage(res.data.message);

      const user = res.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
      localStorage.setItem( "userId", user._id ); 
      localStorage.setItem( "userName", user.name ); 
      localStorage.setItem( "userEmail", user.email );
      localStorage.setItem( "userRole", user.role );
      // Navigation selon rôle
      if (user.role === "super_admin") {
        navigate("/superAdmin/dashboard");
      }

      else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }

      else if (user.role === "employee") {
        navigate("/em/dashboard");
      }

      else if (user.role === "hr") {
        navigate("/hr/dashboard");
      }

      else if (user.role === "project_manager") {
        navigate("/pm/dashboard");
      }

    } catch (error) {

      console.log(error);

      setMessage(
        error.response?.data?.message ||
        "Erreur serveur"
      );
    }
  };

  return (

    <div className={styles.loginPage}>

      {/* OVERLAY */}
      <div className={styles.overlay}></div>

      {/* LOGIN CARD */}
      <div className={styles.loginCard}>

        <div className={styles.logoSection}>
          <h1>ProjectFlow</h1>

          <p>
            Smart Project Management Platform
          </p>
        </div>

        <h2>Welcome Back 👋</h2>

        <p className={styles.subtitle}>
          Login to manage your projects,
          tasks and teams efficiently.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >

          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: true,
            })}
          />

          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: true,
            })}
          />

          <button type="submit">
            Login
          </button>

        </form>

        <div className={styles.links}>

          <a href="/forgot-password">
            Forgot Password ?
          </a>

          <a href="/register">
            Create Account
          </a>

        </div>

        {message && (
          <p className={styles.message}>
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Login;