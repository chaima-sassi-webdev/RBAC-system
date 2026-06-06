import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Styles from "../../styles/pmDashboard.module.css";
import styles from "../../styles/dashboards.module.css";
import "react-calendar/dist/Calendar.css";
import Tasks from "./Tasks";
import Leaves from "./Leaves";
import Complaints from "./Complaints";
import Clients from "./Clients";
import User from "./User";
import Settings from "./Settings";
import Projects from "./Projects";
import Messenger from "../../pages/MessengerPage";
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

function AdminDashboard() {

  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState({});
  const [projectStatusData, setprojectStatusData] = useState({});
  const [taskStatusData, setTaskStatusData] = useState({});
  const [leaveMonthsData, setLeaveMonthsData]= useState([]);
  const months = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
  ];
  const chartData = [
  {
    name: "Active",
    value: projectStatusData?.active ?? 0,
    color: "#3b82f6",
  },
  {
    name: "Completed",
    value: projectStatusData?.completed ?? 0,
    color: "#22c55e",
  },
  {
    name: "Critical",
    value: projectStatusData?.critical ?? 0,
    color: "#ef4444",
  },
  {
    name: "Closed",
    value: projectStatusData?.closed ?? 0,
    color: "#6b7280",
  },
];
  const taskChartData = [
  {
    name: "Pending",
    value: taskStatusData?.pending ?? 0,
    color: "#22c55e",
  },
  {
    name: "In-progress",
    value: taskStatusData?.in_progress ?? 0,
    color: "#3b82f6",
  },
  {
    name: "Completed",
    value: taskStatusData?.completed ?? 0,
    color: "#6b7280",
  },
  {
    name: "Late",
    value: taskStatusData?.late ?? 0,
    color: "#ef4444",
  },
];
  const LeavechartData = leaveMonthsData.map(item => ({
    name: `${months[item._id.month - 1]} ${item._id.year}`,
    value: item.total,
    color: "#8b5cf6"
}));
  const [tasks, setTasks] = useState([]);
  const [viewTask, setViewTask] = useState(null);
  const [showViewModalTask, setShowViewModalTask] = useState(false);
  
  const [projects, setProjects] = useState([]);
  const [viewProject, setViewProject] = useState(null);
  const [showViewModalProject, setShowViewModalProject] = useState(false);

  const [clients, setClients] = useState([]);
  const [viewClient, setViewClient] = useState(null);
  const [showViewModalClient, setShowViewModalClient] = useState(false);

  const [users, setUsers] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const [showViewModalUser, setShowViewModalUser] = useState(false);

  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [viewpendingLeaves, setViewpendingLeaves] = useState(null);
  const [showViewModalLeaves, setShowViewModalLeaves] = useState(false);

  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [viewComplaints, setViewComplaints] = useState(null);
  const [showViewModalComplaints, setShowViewModalComplaints] = useState(false);

  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState({
    employees: 0,
    projects: [],
    tasks: [],
    leaves: [],
    complaints: []
  });
  const [showModal, setShowModal] = useState(false);
  const chartRef = useRef(null);
  const projectChartRef = useRef(null);
  const taskChartRef = useRef(null);
  const leaveChartRef = useRef(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  
  
  // ================= USER =================
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // ================= FETCH DASHBOARD =================
  const reportCards = [
  { title: "Employees Reports", value: reports.employees ?? 0 },
  { title: "Projects Reports", value: reports.projects?.length ?? 0 },
  { title: "Tasks Reports", value: reports.tasks?.length ?? 0 },
  { title: "Leaves Reports", value: reports.leaves?.length ?? 0 },
  { title: "Complaints Reports", value: reports.complaints?.length ?? 0 },
];
 
 // ✅ PIE CHART DATA (FIX)
  const reportChart = [
    { name: "Employees", value: reports.employees ?? 0 },
    { name: "Projects", value: reports.projects?.length ?? 0 },
    { name: "Tasks", value: reports.tasks?.length ?? 0 },
    { name: "Leaves", value: reports.leaves?.length ?? 0 },
    { name: "Complaints", value: reports.complaints?.length ?? 0 },
  ];
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, statusRes, taskStatusRes, leavesMonthsRes, reportRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/admin/stats`),
          axios.get(`http://localhost:5000/api/users/admin/projects/status`),
          axios.get(`http://localhost:5000/api/users/admin/taskstatus`),
          axios.get(`http://localhost:5000/api/users/admin/leavesmonth`),
          axios.get(`http://localhost:5000/api/users/admin/reports`)
        ]);
        setStats(statsRes.data);
        setprojectStatusData(statusRes.data);
        setTaskStatusData(taskStatusRes.data);
        setLeaveMonthsData(leavesMonthsRes.data);
        setReports(reportRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    
    if (userId) fetchDashboard();

    axios.get(`http://localhost:5000/api/users/admin/reports`).then(res => setReports(res.data));
}, []);
  // ================= CARDS =================
  const cards = [
    { title: "Number of Employees", value: stats?.totalEmployees},
    { title: "Number of Clients", value: stats?.totalClients },
    { title: "Number of Projects", value: stats?.totalProjects },
    { title: "Number of Tasks", value: stats?.totalTasks },
    { title: "Number of Pending leaves", value: stats?.pendingLeaves},
    { title: "Number of Pending Plaintes", value: stats?.pendingComplaints}
  ];
 
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
    if (activePage === "tasks") {
      return <Tasks />
    };

    if (activePage === "pendingLeaves") {
      return <Leaves /> ;
    }

    if (activePage === "complaints") {
      return <Complaints />;
    }

    if (activePage === "projects") {
      return <Projects />;
    }

    if (activePage === "clients") {
      return <Clients />;
    }

    if (activePage === "users") {
      return <User />;
    }

    if (activePage === "messenger") {
      return <Messenger />;
    }

    if (activePage === "settings") {
      return <Settings />;
    }

    // ================= DASHBOARD HOME =================
    return (
      <>
        <div className={Styles.header}>
          <h1>Welcome {user.name} 👋</h1>
        </div>

        {/* CARDS */}
        <div className={Styles.cardsContainer}>
          {cards.map((c, i) => (
            <div key={i} className={Styles.card}>
              <h3>{c.title}</h3>
              <div className={Styles.cardValue}>{c.value}</div>
            </div>
          ))}
        </div>
        
         {/* BAR CHART */}
          <div
            ref={chartRef}
            className={`${styles.chartContainer} ${
              chartVisible ? styles.visible : ""
            }`}>
            <br />
            <h2>Projects Per Status</h2>
            <br />
            <br />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* BAR CHART */}
          <div
            ref={chartRef}
            className={`${styles.chartContainer} ${
              chartVisible ? styles.visible : ""
            }`}>
            <br />
            <h2>Tasks Per Status</h2>
            <br />
            <br />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {taskChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* BAR CHART */}
          <div
            ref={chartRef}
            className={`${styles.chartContainer} ${
              chartVisible ? styles.visible : ""
            }`}>
            <br />
            <h2>Leaves Per Months</h2>
            <br />
            <br />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={LeavechartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {LeavechartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
         {/* PIE CHART REPORTS */}
        <div className={`${styles.chartContainer} ${
              chartVisible ? styles.visible : ""
            }`}>
              <br />
            <h2>Reports</h2>
            <br />
            <br />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportChart}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {reportChart.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      ["#3b82f6", "#22c55e", "#ef4444", "#8b5cf6", "#f59e0b"][
                        index
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>    
      </>
    );
  };
  const handleViewLeave = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/leaves/${id}`
      );
      setViewpendingLeaves(res.data);
      setShowViewModalLeaves(true);
    } catch (error) {
      console.log(error);
    }
  }; 
  const handleViewProject = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/projects/${id}`
      );
      setViewProject(res.data);
      setShowViewModalProject(true);
    } catch (error) {
      console.log(error);
    }
  }; 
  const handleViewTask = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/tasks/${id}`
      );
      setViewTask(res.data);
      setShowViewModalTask(true);
    } catch (error) {
      console.log(error);
    }
  }; 
  // ============= SIDEBAR ============== //
  return (
    <div className={Styles.container}>
      {/* SIDEBAR */}
      <div className={Styles.sidebar}>
        <h2 className={Styles.logo}>ProjectFlow</h2>
        <ul className={Styles.menu}>

            <li
              className={`${Styles.menuItem} ${
                activePage === "dashboard" ? Styles.active : ""
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`${Styles.menuItem} ${
                activePage === "users" ? Styles.active : ""
              }`}
              onClick={() => setActivePage("users")}
            >
              Users
            </li> 
            <li
              className={`${Styles.menuItem} ${
                activePage === "clients" ? Styles.active : ""
              }`}
              onClick={() => setActivePage("clients")}
            >
              Clients
            </li>   
            <li
              className={`${Styles.menuItem} ${
                activePage === "projects" ? Styles.active : ""
              }`}
              onClick={() => setActivePage("projects")}
            >
              Projects
            </li>  
            <li
              className={`${Styles.menuItem} ${
                activePage === "tasks" ? Styles.active : ""
              }`}
              onClick={() => setActivePage("tasks")}
            >
              Tasks
            </li>
            <li
              className={`${Styles.menuItem} ${
                activePage === "pendingLeaves" ? Styles.active : ""
              }`}
              onClick={() => setActivePage("pendingLeaves")}
            >
              Pending Leaves
            </li>
            <li
              className={`${Styles.menuItem} ${
                activePage === "complaints" ? Styles.active : ""
              }`}
              onClick={() => setActivePage("complaints")}
            >
              Complaints
            </li>
            <li
              className={`${Styles.menuItem} ${
                activePage === "messenger" ? Styles.active : ""
              }`}
              onClick={() => setActivePage("messenger")}
            >
              Messenger
            </li>
            <li
              className={`${Styles.menuItem} ${
                activePage === "settings" ? Styles.active : ""
              }`}
              onClick={() => setActivePage("settings")}
            >
              Settings
            </li>
            <li
              className={`${Styles.menuItem} ${Styles.logout}`}
              onClick={handleLogout}
            >
              Logout
            </li>

        </ul>
      </div>

      {/* MAIN */}
      <div className={Styles.main}>{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;