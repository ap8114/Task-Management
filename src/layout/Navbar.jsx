import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const totalBreakLimit = 60;
  const [userStatus, setUserStatus] = useState('Available');
  const [showOverlay, setShowOverlay] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakUsed, setTotalBreakUsed] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  const [role, setRole] = useState("");
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    }
    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light   py-2" style={{backgroundColor:"#c6dbf8",zIndex: 1000}}>
        <div className="container-fluid px-2 px-md-3">
          {/* Brand and Sidebar Toggle */}
          <div className="d-flex align-items-center gap-3 flex-shrink-0">
            <img
              // src="https://ik.imagekit.io/wycpoxj6v/Eminoids%20-%20Logo_B.png?updatedAt=1750836038955"
              src="https://i.postimg.cc/7hwsfwW3/Screenshot-20250728-133647-Adobe-Acrobat-removebg-preview.png"
              alt="Logo"
              style={{
                width: window.innerWidth >= 992 ? "150px" : "120px",
                height: "65px",
              }}
            />
            <button
              className="btn btn-link text-dark p-0 d-lg-none mt-2"
              onClick={toggleSidebar}
              style={{ fontSize: "20px", textDecoration: "none" }}
              aria-label="Toggle Sidebar"
            >
              <i className="fa fa-bars fs-4 p-2 "></i>
            </button>
          </div>


          {/* Right Side Content */}
          <div className="d-flex align-items-center ms-auto gap-2 gap-md-3 flex-shrink-0">

            {/* Notification Bell - Hidden on mobile */}
            {/* Profile Dropdown */}
            <div className="dropdown" ref={profileRef}>
              <button
                className="btn btn-link text-black p-2 d-flex align-items-center"
                style={{
                  fontSize: "22px",
                  textDecoration: "none",
                  border: "none",
                }}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-label="Profile Menu"
              >
                <div className="position-relative">
                  <i className="fa-solid fa-circle-user" style={{fontSize:"x-large"}}></i>
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                    style={{ fontSize: "8px", width: "12px", height: "12px" }}
                  >
                    <span className="visually-hidden">Online</span>
                  </span>
                </div>
              </button>
              {showProfileDropdown && (
                <ul
                  className="dropdown-menu dropdown-menu-end shadow show"
                  style={{
                    position: 'absolute',
                    inset: '0px auto auto 0px',
                    margin: '0px',
                    transform: 'translate(-160px, 40px)',
                    zIndex: 1200
                  }}
                >
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="fa fa-user me-2"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 text-danger" to="/">
                      <i className="fa fa-sign-out-alt me-2"></i>
                      Logout
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;