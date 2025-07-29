import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("userRole"); // ✅ GET ROLE

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  const isActive = (path) => location.pathname === path;

  const menuItemClick = () => {
    console.log("Menu item clicked");
  };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar bg-card" style={{ height: "105vh" }}>
        <ul className="menu">
          {/* ✅ Admin Sidebar */}
          {role === "Admin" && (
            <>
              <li className={`menu-item ${isActive("/admin-dashboard") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/admin-dashboard")}>
                  <i className="fa-solid fa-compass"></i>
                  <span className="menu-text">Dashboard</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/active-project") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/active-project")}>
                  <i className="fa-solid fa-diagram-project"></i>
                  <span className="menu-text">Active Projects</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/task-management") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/task-management")}>
                  <i className="fa-solid fa-tasks"></i>
                  <span className="menu-text">Task Management</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/project") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/project")}>
                  <i className="fa-solid fa-diagram-project"></i>
                  <span className="menu-text">Projects</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/sourcework") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/sourcework")}>
                  <i className="fa-solid fa-chart-line"></i>
                  <span className="menu-text">Resource Workload</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/action-center") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/action-center")}>
                  <i className="fa-solid fa-bolt"></i>
                  <span className="menu-text">Action Center</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/reportinganalytics") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/reportinganalytics")}>
                  <i className="fa-solid fa-chart-line"></i>
                  <span className="menu-text">Reporting & Analytics</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/auditlog") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/auditlog")}>
                  <i className="fa-solid fa-shield"></i>
                  <span className="menu-text">Audit Logs</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/attendance") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/attendance")}>
                  <i className="fa-solid fa-calendar-days"></i>
                  <span className="menu-text">Attendance</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/shift-allocation") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/shift-allocation")}>
                  <i className="fa-solid fa-life-ring"></i>
                  <span className="menu-text">Shift Allocation</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/calendar") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/calendar")}>
                  <i className="fa-solid fa-calendar"></i>
                  <span className="menu-text">Calendar</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/usermanage") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/usermanage")}>
                  <i className="fa-solid fa-users-gear"></i>
                  <span className="menu-text">User</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/role-permission") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/role-permission")}>
                  <i className="fa-brands fa-critical-role"></i>
                  <span className="menu-text">Role & Permission</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/collaboration") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/collaboration")}>
                  <i className="fa-solid fa-comments"></i>
                  <span className="menu-text">Chat Room</span>
                </div>
              </li>
            </>
          )}

          {/* ✅ Staff Sidebar */}
          {role === "Staff" && (
            <>
              <li className={`menu-item ${isActive("/staff-dashboard") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/staff-dashboard")}>
                  <i className="fa-solid fa-compass"></i>
                  <span className="menu-text">Dashboard</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/task") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/task")}>
                  <i className="fa-solid fa-list"></i>
                  <span className="menu-text">My Tasks</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/attendance") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/attendance")}>
                  <i className="fa-solid fa-calendar-days"></i>
                  <span className="menu-text">Attendance</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/productivity") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/productivity")}>
                  <i className="fa-solid fa-chart-line"></i>
                  <span className="menu-text">Productivity</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/activity") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/activity")}>
                  <i className="fa-solid fa-clock-rotate-left"></i>
                  <span className="menu-text">Activity</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/messages") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/messages")}>
                  <i className="fa-solid fa-comment"></i>
                  <span className="menu-text">Messaging</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/settingpage") ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => navigate("/settingpage")}>
                  <i className="fa-solid fa-gear"></i>
                  <span className="menu-text">Setting</span>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
