// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./Sidebar.css";

// const Sidebar = ({ collapsed }) => {
//   const [openSubmenu, setOpenSubmenu] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const role = localStorage.getItem("userRole"); // ✅ GET ROLE from localStorage

//   const toggleSubmenu = (menuName) => {
//     setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
//   };

//   const isActive = (path) => location.pathname === path;

//   const menuItemClick = () => {
//     console.log("Menu item clicked");
//   };

//   return (
//     <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
//       <div className="sidebar bg-card " style={{ height: "105vh" }}>
//         <ul className="menu">
//           {/* Admin Dashboard Menu */}
//           {role === "Admin" && (
//             <>
//               <li
//                 className={`menu-item ${isActive("/admin-dashboard") ? "active" : ""
//                   }`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/admin-dashboard");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-compass"></i>
//                   <span className="menu-text">Dashboard</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/task-management") ? "active" : ""
//                   }`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/task-management");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-tasks"></i>
//                   <span className="menu-text">Task Management</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/email-integration") ? "active" : ""
//                   }`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/email-integration");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-envelope"></i>
//                   <span className="menu-text">Email Integration</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/calendar") ? "active" : ""}`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/calendar");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-calendar"></i>
//                   <span className="menu-text">Calendar View</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/reports") ? "active" : ""}`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/reports");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-chart-line"></i>
//                   <span className="menu-text">Reports</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/usermanage") ? "active" : ""
//                   }`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/usermanage");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-users-gear"></i>
//                   <span className="menu-text">User Management</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/notifications") ? "active" : ""
//                   }`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/notifications");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-bell"></i>
//                   <span className="menu-text">Notifications & Alerts</span>
//                 </div>
//               </li>
//             </>
//           )}

//           {/* Staff Dashboard Menu */}
//           {role === "Staff" && (
//             <>
//               <li
//                 className={`menu-item ${isActive("/staff-dashboard") ? "active" : ""
//                   }`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/staff-dashboard");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-compass"></i>
//                   <span className="menu-text">Dashboard</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/my-tasks") ? "active" : ""}`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/my-tasks");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-tasks"></i>
//                   <span className="menu-text">My Tasks</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/calendar") ? "active" : ""}`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/calendar");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-calendar"></i>
//                   <span className="menu-text">Calendar View</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/report-submission") ? "active" : ""
//                   }`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/report-submission");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-file-upload"></i>
//                   <span className="menu-text">Report Submission</span>
//                 </div>
//               </li>

//               <li
//                 className={`menu-item ${isActive("/notifications") ? "active" : ""
//                   }`}
//               >
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => {
//                     navigate("/notifications");
//                     menuItemClick();
//                   }}
//                 >
//                   <i className="fa-solid fa-bell"></i>
//                   <span className="menu-text">Notifications</span>
//                 </div>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;











import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("userRole");

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  const isActive = (path) => location.pathname === path;
  const menuItemClick = () => console.log("Menu item clicked");

  // Centralized menu configuration
  const menuConfig = {
    Admin: [
      { path: "/admin-dashboard", icon: "fa-solid fa-gauge", text: "Dashboard" },
      { path: "/task-management", icon: "fa-solid fa-list-check", text: "Task Management" },
      { path: "/emailintegration", icon: "fa-solid fa-envelope-open-text", text: "Email Integration" },
      { path: "/reports", icon: "fa-solid fa-chart-pie", text: "Reporting" },
      { path: "/calendar", icon: "fa-solid fa-calendar-days", text: "Calendar View" },
      { path: "/usermanage", icon: "fa-solid fa-user-gear", text: "User Management" },
      { path: "/notifications", icon: "fa-solid fa-bell", text: "Notifications & Alerts" },
    ],

    Staff: [
      { path: "/staff-dashboard", icon: "fa-solid fa-gauge-high", text: "Dashboard" },
      { path: "/my-task", icon: "fa-solid fa-check-to-slot", text: "My Task" },
      { path: "/calendarview", icon: "fa-solid fa-calendar-week", text: "Calendar View" },
      { path: "/reportsubmission", icon: "fa-solid fa-file-arrow-up", text: "Report Submission" },
      { path: "/notificationspage", icon: "fa-solid fa-bell", text: "Notifications" },
    ]

  };

  const currentMenu = menuConfig[role] || [];

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar " style={{ height: "105vh" }}>
        <ul className="menu">
          {currentMenu.map((item) => (
            <li
              key={item.path}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
            >
              <div
                className="menu-link menu-i"
                onClick={() => {
                  navigate(item.path);
                  menuItemClick();
                }}
              >
                <i className={item.icon}></i>
                <span className="menu-text">{item.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;