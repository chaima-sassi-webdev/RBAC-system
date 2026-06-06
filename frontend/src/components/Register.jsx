import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/register.module.css";

function Register() {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState("");

    const onSubmit = async (data) => {

        try {

            const response = await axios.post(
                "http://localhost:5000/api/users/register",
                data
            );

            console.log(response.data);

            setSuccessMessage(
                `Un email de confirmation a été envoyé à ${data.email}`
            );

            // Alert succès
            alert(response.data.message);

            // Reset form
            reset();

            // Navigation login
            navigate("/login");

        } catch (error) {

            // Alert erreur backend
            if (error.response && error.response.data.message) {

                alert(error.response.data.message);

            } else {

                alert("Erreur serveur");

            }
        }
    };

    return (
        <div className={styles.registerPage}>

            <div className={styles.registerCard}>

            <div className={styles.header}>
                <h1>Create Account</h1>
                <p>Join ProjectFlow and manage projects smarter.</p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.form}
            >

                <div className={styles.inputGroup}>
                <label>Name</label>

                <input
                    type="text"
                    placeholder="Enter your name"
                    {...register("name", {
                    required: "Name required",
                    })}
                />

                <span>{errors.name?.message}</span>
                </div>

                <div className={styles.inputGroup}>
                <label>Email</label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                    required: "Email required",
                    })}
                />

                <span>{errors.email?.message}</span>
                </div>

                <div className={styles.inputGroup}>
                <label>Password</label>

                <input
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                    required: "Password required",
                    minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                    },
                    })}
                />

                <span>{errors.password?.message}</span>
                </div>

                <div className={styles.inputGroup}>
                    <label>Role</label>

                    <select {...register("role")}>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="hr">Human Ressource</option>
                        <option value="project_manager">Project Manager</option>
                    </select>
                </div>

                <button
                type="submit"
                className={styles.submitBtn}
                >
                Create Account
                </button>

                <p className={styles.loginText}>
                Already have an account?
                <a href="/login"> Login</a>
                </p>

            </form>

            {successMessage && (
                <p className={styles.successMessage}>
                {successMessage}
                </p>
            )}

            </div>

        </div>
    );
}

export default Register;