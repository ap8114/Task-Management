import { Route, Router, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { useEffect, useState } from "react";
import LoginPage from "./authtication/Login";
import SignupPage from "./authtication/singup";

// import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import TaskManagement from "./components/AdminDashboard/TaskManagement/TaskManagemnet";
import UserManagement from "./components/AdminDashboard/UserManagement/UserManagement";
import Calander from "./components/AdminDashboard/Calander/Calander";
import AuthLayout from "./layout/authLayout";
import MainLayout from "./layout/MainLayout";
import EmailIntegration from "./components/AdminDashboard/EmailIntegration/EmailIntegration";
import Dashboard from "./components/AdminDashboard/AdminDashboard/Dashboard";
import Notifications from "./components/AdminDashboard/Notifications/Notifications";
import StaffDashboard from "./components/StaffDashboard/Dashboard/StaffDashboard";
import MyTasks from "./components/StaffDashboard/Mytask/MyTasks";
import CalendarView from "./components/StaffDashboard/Calendar/CalendarView";
import ManualReportSubmission from "./components/StaffDashboard/ReportSubmission/ManualReportSubmission";
import NotificationsPage from "./components/StaffDashboard/Notification/NotificationsPage";
import Reports from "./components/AdminDashboard/Reports/Reports";
import Profile from "./Profile/Profile";



function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);


  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const menusidebarcollaps = () => setIsSidebarCollapsed(true);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, []);
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* App Routes */}
      <Route
        element={
          <MainLayout
            isSidebarCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            menusidebarcollaps={menusidebarcollaps}
          />
        }
      >
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calander />} />
        <Route path="/emailintegration" element={<EmailIntegration />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/task-management" element={<TaskManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/usermanage" element={<UserManagement />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/*staff dashbaord  project */}
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/my-task" element={<MyTasks />} />
        <Route path="/calendarview" element={<CalendarView />} />
        <Route path="/reportsubmission" element={<ManualReportSubmission />} />
        <Route path="/notificationspage" element={<NotificationsPage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
}


export default App;
