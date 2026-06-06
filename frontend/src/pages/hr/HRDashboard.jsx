import React, { useState, useEffect } from "react";
import Leaves from "./Leaves";
import Plaintes from "./Plaintes";
import Tasks from "../../components/Tasks";
import Clients from "../../components/Client";
import Users from "./Users";
import Settings from "./Settings";
import styles from "../../styles/hr.module.css";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import MessengerPage from "../MessengerPage";

function HRDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    totalComplaints: 0,
    absenceRate: 0,
    satisfactionRate: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  // ================= STATES =================

  const [activePage, setActivePage] =
    useState("dashboard");

  // KPI
  const [pendingLeaves, setPendingLeaves] =
    useState(0);

  const [approvedLeaves, setApprovedLeaves] =
    useState(0);

  const [rejectedLeaves, setRejectedLeaves] =
    useState(0);

  const [complaintsCount, setComplaintsCount] =
    useState(0);

  const [employeesCount, setEmployeesCount] =
    useState(0);

  // CHARTS
  const [leaveChart, setLeaveChart] =
    useState([]);

  // TABLES


  const fetchRecentLeaves = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/leaves" // ou route correcte
      );

      // on garde seulement les 5 derniers
      setRecentLeaves(res.data.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRecentComplaints = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/plaintes"
      );

      setRecentComplaints(res.data.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };
  // ================= KPI CARDS =================

  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
    },
    {
      title: "Pending Leaves",
      value: stats.pendingLeaves,
    },
    {
      title: "Approved Leaves",
      value: stats.approvedLeaves,
    },
    {
      title: "Rejected Leaves",
      value: stats.rejectedLeaves,
    },
    {
      title: "Complaints",
      value: stats.totalComplaints,
    },
    
  ];

  // ================= LOGOUT =================

  const handleLogout = async () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {

        window.location.href = "/login";
        return;
      }

      const user = JSON.parse(storedUser);

      await axios.post(
        "http://localhost:5000/api/users/logout",
        {
          userId: user._id,
        }
      );

      localStorage.removeItem("user");

      window.location.href = "/login";

    } catch (error) {

      console.log(error);

    }
  };


  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/hr/kpis"
      );
      setStats(res.data);
    } catch(error) {
      console.log(error);
    }
  };
  // ================= RENDER CONTENT =================

  
  const renderContent = () => {

    switch (activePage) {

      // ================= DASHBOARD =================

      case "dashboard":

        return (
          <>

            {/* HEADER */}
            <br />
            <div className={styles.header}>
              <h1>
                HR Dashboard 👨‍💼
              </h1>
            </div>
            <br /> <br />
            {/* KPI CARDS */}
            <div className={styles.cardsContainer}>

              {cards.map((card, index) => (

                <div
                  key={index}
                  className={styles.card}
                >
                  <h3>{card.title}</h3>

                  <b className={styles.cardValue}>
                    {card.value}
                  </b>
                </div>

              ))}

            </div>
               {/* RECENT COMPLAINTS */}
            <div className={styles.activityContainer}>

              <h2>
                Recent Complaints
              </h2>

              <div className={styles.tableScroll}>
                <table className={styles.table}>

                <thead>

                  <tr>

                    <th className={styles.th}>
                      Employee
                    </th>

                    <th className={styles.th}>
                      Complaint
                    </th>

                    <th className={styles.th}>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentComplaints.length === 0 ? ( 
                    <tr>
                      <td colSpan="3" className={styles.emptyMessage}>
                        No complaints found
                      </td>
                    </tr>
                  ) : ( 
                    recentComplaints.map(
                    (complaint, index) => (

                    <tr
                      key={index}
                      className={styles.infoRow}
                    >

                      <td className={styles.td}>
                        {complaint.employee?.email}
                      </td>

                      <td className={styles.td}>
                        {complaint.subject}
                      </td>

                      <td className={styles.td}>
                        {complaint.status}
                      </td>

                    </tr>

                  ))
                  )

                  }

                </tbody>

                </table>
              </div>
               <div className={styles.seeMoreContainer}>
                <button
                  className={styles.seeMoreBtn}
                  onClick={() => setActivePage("complaints")}
                >
                  Voir plus →
                </button>
               </div>   
            </div>
            {/* LEAVES CHART */}
            <div className={styles.chartContainer}>
              <br /> <br />
              <h2>
                Leaves Per Month
              </h2>
              <br />
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart
                  data={leaveChart}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="leaves"
                    fill="#4b6cb7"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>

            </div>

            {/* RECENT LEAVES */}
            <div className={styles.activityContainer}>

              <h2>
                Recent Leave Requests
              </h2>

              <div className={styles.tableScroll}>
                <table className={styles.table}>

                <thead>

                  <tr>
                    <th className={styles.th}>
                      Employee
                    </th>

                    <th className={styles.th}>
                      Type
                    </th>

                    <th className={styles.th}>
                      Status
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {recentLeaves.length === 0 ? ( 
                    <tr>
                      <td colSpan="3" className={styles.emptyMessage}>
                        No leaves found
                      </td>
                    </tr>
                  ): ( 
                    recentLeaves.map(
                    (leave, index) => (

                    <tr
                      key={index}
                      className={styles.infoRow}
                    >

                      <td className={styles.td}>
                        {leave.employee?.email}
                      </td>

                      <td className={styles.td}>
                        {leave.leaveType}
                      </td>

                      <td className={styles.td}>
                        {leave.status}
                      </td>

                    </tr>

                  ))
                  )}

                </tbody>

              </table>
              </div>
              <div className={styles.seeMoreContainer}>
                <button
                  className={styles.seeMoreBtn}
                  onClick={() => setActivePage("leaves")}
                >
                  Voir plus →
                </button>
              </div>    
            </div>

           

          </>
        );

      // ================= LEAVES =================

      case "leaves":

        return <Leaves />;

      // ================= COMPLAINTS =================

      case "complaints":

        return <Plaintes />;



      case "tasks":

        return <Tasks />;

      case "clients":

        return <Clients />;
      case "users":

        return <Users />;

      case "messenger":

        return <MessengerPage />; 
  
      // ================= SETTINGS =================

      case "settings":

        return <Settings />;

      default:
        return null;
    }
  };
  const fetchLeaveChart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/leaves-per-month");
      setLeaveChart(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  // ================= USE EFFECT =================

  useEffect(() => {

    // ===== TEMPORARY MOCK DATA =====

    setPendingLeaves(8);

    setApprovedLeaves(24);

    setRejectedLeaves(5);

    setComplaintsCount(7);

    setEmployeesCount(58);
    setRecentLeaves([
      {
        employee: "Ahmed",
        type: "Annual Leave",
        status: "Pending",
      },
      {
        employee: "Sarra",
        type: "Sick Leave",
        status: "Approved",
      },
    ]);

    setRecentComplaints([
      {
        employee: "Mouna",
        subject: "Salary Delay",
        status: "Open",
      },
      {
        employee: "Ali",
        subject: "Work Pressure",
        status: "Resolved",
      },
    ]);
    fetchStats();
    fetchRecentLeaves();        // ✅ ADD
    fetchRecentComplaints();    // ✅ ADD
    fetchLeaveChart();
  }, []);
  

  // ================= RETURN =================

  return (

    <div className={styles.container}>

      {/* SIDEBAR */}
      <div className={styles.sidebar}>

        <h2 className={styles.logo}>
          ProjectFlow
        </h2>

        <ul className={styles.menu}>

          {/* DASHBOARD */}
          <li
            className={`${styles.menuItem} ${
              activePage === "dashboard"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            Dashboard
          </li>

          {/* LEAVES */}
          <li
            className={`${styles.menuItem} ${
              activePage === "leaves"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("leaves")
            }
          >
            Congés
          </li>

          {/* COMPLAINTS */}
          <li
            className={`${styles.menuItem} ${
              activePage === "complaints"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("complaints")
            }
          >
            Complaints
          </li>

          <li
            className={`${styles.menuItem} ${
              activePage === "tasks"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("tasks")
            }
          >
            Tasks
          </li>
          <li
            className={`${styles.menuItem} ${
              activePage === "clients"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("clients")
            }
          >
            Clients
          </li>

            <li
            className={`${styles.menuItem} ${
              activePage === "users"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("users")
            }
          >
            Users
          </li>

          <li
            className={`${styles.menuItem} ${
              activePage === "users"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("messenger")
            }
          >
            Messenger
          </li>

          {/* SETTINGS */}
          <li
            className={`${styles.menuItem} ${
              activePage === "settings"
                ? styles.active
                : ""
            }`}
            onClick={() =>
              setActivePage("settings")
            }
          >
            Settings
          </li>

          {/* LOGOUT */}
          <li
            className={`${styles.menuItem} ${
              activePage === "logout"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              setActivePage("logout");
              handleLogout();
            }}
          >
            Logout
          </li>

        </ul>

      </div>

      {/* MAIN */}
      <div className={styles.main}>
        {renderContent()}
      </div>

    </div>
  );
}

export default HRDashboard;