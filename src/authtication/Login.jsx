import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const roleCredentials = {
    Admin: { email: "admin@example.com", password: "admin@123" },
    Staff: { email: "staff@example.com", password: "staff@123" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const creds = roleCredentials[role];
      if (email === creds.email && password === creds.password) {
        localStorage.setItem("authToken", "dummy-token");
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userData", JSON.stringify({ role, email }));

        if (role === "Admin") {
          navigate("/admin-dashboard");
        } else if (role === "Staff") {
          navigate("/staff-dashboard");
        }
      } else {
        setError("Invalid email or password.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setEmail(roleCredentials[selectedRole].email);
    setPassword(roleCredentials[selectedRole].password);
  };

  return (
    <div className="login-page">
      <div className="login-container row">
        {/* Left Panel */}
        <div className="col-md-6 login-left d-flex justify-content-center align-items-center">
          <div className="login-left-content">
            <img
              src="https://i.postimg.cc/7hwsfwW3/Screenshot-20250728-133647-Adobe-Acrobat-removebg-preview.png"
              alt="Omega Tax & Services Logo"
              className="login-logo"
              style={{ width: "250px", height: "120px", marginBottom: "24px" }}
            />
            <h1 className="text-dark">Welcome to Omega</h1>
            <p className="fw-bold text-strong text-secondary">Your partner in financial clarity & compliance.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 login-right d-flex justify-content-center align-items-center">
          <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
              <h4 className="login-form-title">
                Omega Tax & Services
                <br />
                <span className="text-muted">Secure Login Portal</span>
              </h4>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="login-input-group">
                <FontAwesomeIcon icon={faEnvelope} className="login-input-icon" />
                <input
                  type="text"
                  className="form-control login-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-input-group">
                <FontAwesomeIcon icon={faLock} className="login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control login-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>

              {/* Role Selection Buttons */}
              <div className="d-flex flex-wrap justify-content-center mt-3 gap-2">
                {Object.keys(roleCredentials).map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`btn btn-outline-secondary ${role === r ? "active" : ""}`}
                    onClick={() => handleRoleSelect(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="btn login-submit-btn mt-3"
                disabled={isLoading}
              >
                {isLoading ? "LOGGING IN..." : "LOG IN"}
              </button>

              <div className="text-center mt-3">
                <p className="text-muted">Omega Tax & Services — Version 1.0</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
