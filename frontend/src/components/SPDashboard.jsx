import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/dashboards.module.css";
import Users from "../pages/Users";
import Client from "../components/Client";
import Project from "../components/Projects";
import Tasks from "../components/Tasks";
import Leaves from "../components/Leaves";
import Complaints from "../components/Complaints";
import Messenger from "../pages/MessengerPage";
import Settings from "../pages/hr/Settings";
import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
  const dotVariants = {
  jump: {
    y: -15,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};
function Dashboard() {
  // ================= STATES =================
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  const [chartData, setChartData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef(null);

  const activationRate =
    totalUsers > 0
      ? ((activeUsers / totalUsers) * 100).toFixed(1)
      : 0;

  // ================= CARDS =================
  const cards = [
    { title: "Total Users", value: totalUsers },
    { title: "Active Users", value: activeUsers },
    { title: "Inactive Users", value: inactiveUsers },
    {
      title: "Activation Rate",
      value: (
        <b
          style={{
            color:
              activationRate > 70
                ? "#10b981"
                : activationRate > 40
                ? "#f59e0b"
                : "#ef4444",
          }}
        >
          {activationRate}%
        </b>
      ),
    },
  ];
function LoadingJumpingDots() {
  return (
    <motion.div
      animate="jump"
      transition={{
        staggerChildren: 0.15,
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "100px",
      }}
    >
      <motion.div
        variants={dotVariants}
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: "#6366f1",
        }}
      />

      <motion.div
        variants={dotVariants}
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: "#6366f1",
        }}
      />

      <motion.div
        variants={dotVariants}
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: "#6366f1",
        }}
      />
    </motion.div>
  );
}

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersCount,
          stats,
          activitiesRes,
          statusRes,
          rolesRes,
          alertsRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/users/count"),
          axios.get("http://localhost:5000/api/users/stats/monthly-users"),
          axios.get("http://localhost:5000/api/users/activities"),
          axios.get("http://localhost:5000/api/users/status"),
          axios.get("http://localhost:5000/api/users/roles/stats"),
          axios.get("http://localhost:5000/api/users/alerts"),
        ]);

        setTotalUsers(usersCount.data.totalUsers);

        const months = [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ].map(m => ({ month: m, users: 0 }));

        stats.data.forEach((item) => {
          const i = item._id - 1;
          if (months[i]) months[i].users = item.total;
        });

        setChartData(months);

        setActivities(activitiesRes.data);
        setActiveUsers(statusRes.data.activeUsers || 0);
        setInactiveUsers(statusRes.data.inactiveUsers || 0);
        setRolesData(rolesRes.data);
        setAlerts(alertsRes.data);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= SCROLL ANIMATION =================
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChartVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) observer.observe(chartRef.current);

    return () => observer.disconnect();
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ================= RENDER =================
  const renderContent = () => {
    if (activePage === "users") return <Users />;
    if (activePage === "clients") return <Client />;
    if (activePage === "projects") return <Project />;
    if (activePage === "tasks") return <Tasks />;
    if (activePage === "leaves") return <Leaves />;
    if (activePage === "plaintes") return <Complaints />;
    if (activePage === "messenger") return <Messenger />;
    if (activePage === "settings") return <Settings />;

    return (
      <>
        {/* HEADER */}
        <div className={styles.header}>
          <br />
          <h1>Welcome Back 👋</h1>
        </div>
        <br /> <br />
        {/* CARDS */}
        <div className={styles.cardsContainer}>
          {cards.map((c, i) => (
            <div key={i} className={styles.card}>
              <h3>{c.title}</h3>
              <div className={styles.cardValue}>{c.value}</div>
            </div>
          ))}
        </div>
          <br />
        {/* BAR CHART */}
        <div
          ref={chartRef}
          className={`${styles.chartContainer} ${
            chartVisible ? styles.visible : ""
          }`}
        >
          <br />
          <h2>Users Per Month</h2>
          <br />
          <br />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar
                dataKey="users"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
                isAnimationActive={chartVisible}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className={styles.chartContainer}>
          <br /> <br />
          <h2>Users Roles Distribution</h2>
          <br /> <br />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rolesData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
                isAnimationActive={chartVisible}
              >
                {rolesData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === 0
                        ? "#ef4444"
                        : i === 1
                        ? "#10b981"
                        : i === 2
                        ? "#f59e0b"
                        : "#c6f163"
                    }
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <br /> <br />
        {/* ACTIVITY */}
        <div className={styles.activityContainer}>
           <br />
          <h2>System Activity</h2>
          <br /> <br />
          <div className={styles.tableScroll}>
          <table className={styles.table}>
            
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {activities.slice(0, 8).map((a, i) => (
                <tr key={i} className={styles.row}>
                  
                  <td className={styles.userCell}>
                    {a.user || "System"}
                  </td>

                  <td className={styles.actionCell}>
                    {a.action}
                  </td>

                  <td className={styles.dateCell}>
                    {a.date || a.createdAt
                      ? new Date(a.date || a.createdAt).toLocaleDateString("fr-FR")
                      : "-"}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
        </div>

        {/* ALERTS */}
        <div className={styles.activityContainer}>
          <br />
          <h2>⚠️ System Alerts</h2>
                <br /> <br />
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Alert</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {alerts.length ? (
                  alerts.map((a, i) => (
                    <tr key={i} className={styles.row}>
                      <td>{a.user}</td>
                      <td>{a.action}</td>
                      <td>
                        {new Date(a.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className={styles.emptyRow}>
                      No alerts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };
if (loading) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoadingJumpingDots />
      <p style={{ marginTop: "20px" }}>
        Loading dashboard...
      </p>
    </div>
  );
}
  // ================= UI =================
  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <h2 className={styles.logo}>ProjectFlow</h2>

        <ul className={styles.menu}>
          <li
            className={styles.menuItem}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </li>

          <li
            className={styles.menuItem}
            onClick={() => setActivePage("users")}
          >
            Users
          </li>
          <li
            className={styles.menuItem}
            onClick={() => setActivePage("clients")}
          >
            Clients
          </li>
            <li
            className={styles.menuItem}
            onClick={() => setActivePage("projects")}
          >
            Projects
          </li>
           <li
            className={styles.menuItem}
            onClick={() => setActivePage("tasks")}
          >
            Tasks
          </li>
          <li
            className={styles.menuItem}
            onClick={() => setActivePage("leaves")}
          >
            Leaves
          </li>
          <li
            className={styles.menuItem}
            onClick={() => setActivePage("plaintes")}
          >
            Complaints
          </li>
          <li
            className={styles.menuItem}
            onClick={() => setActivePage("messenger")}
          >
            Messenger
          </li>
          <li
            className={styles.menuItem}
            onClick={() => setActivePage("settings")}
          >
            Settings
          </li>

          <li className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Dashboard;