import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/SPDashboard";
import Home from "./pages/Home";
import HRDashboard from "./pages/hr/HRDashboard";
import GESDashboard from './pages/gestionnaire/GESDashboard';
import EMDashboard from './pages/employee/EmDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import MessengerPage from './pages/MessengerPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/superAdmin/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/hr/Dashboard" element={ <HRDashboard /> } />
        <Route path="/pm/Dashboard" element={ <GESDashboard /> } />
        <Route path="/em/Dashboard" element={ <EMDashboard /> } />
        <Route path="/messenger" element={<MessengerPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
