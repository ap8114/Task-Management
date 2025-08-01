import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Login.css";
import BaseUrl from "../Utilities/BaseUrl";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userid, setuserid] = useState("");

  const roleCredentials = {
    Admin: { email: "admin@example.com", password: "admin@123" },
    Staff: { email: "staff@example.com", password: "staff@123" },
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!role) {
    setError("Please select a role.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(
      `${BaseUrl}user/login`,
      {
        email,
        password
      }
    );

    console.log(response);
    
    if (response?.data?.status) {
      const userId = response.data.data.userId || response.data.data.id; // Adjust based on your API response structure
      setuserid(userId); // Set the userid state
      
      localStorage.setItem("authToken", response.data.data.token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userId", userId); // Save userId separately
      localStorage.setItem("userData", JSON.stringify({ 
        role, 
        email, 
        userId 
      }));

      if (role == "Admin") {
        navigate("/admin-dashboard");
      } else if (role == "Staff") {
        navigate("/staff-dashboard");
      }
    } else {
      setError(response.data.message || "Invalid email or password.");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
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
            <p className="fw-bold text-strong text-secondary">
              Tax Accounting & Consulting Group, Inc.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="p-4 shadow rounded-4 bg-white" style={{ width: '100%', maxWidth: 400 }}>
            <form className="w-100" onSubmit={handleSubmit}>
              <h4 className="text-center gradient-heading mb-2">
                Omega Tax & Accounting
              </h4>
              <p className="text-center text-muted mb-4">Secure Login Portal</p>

              {error && (
                <div className="alert alert-danger py-1" role="alert">
                  {error}
                </div>
              )}

              <div className="position-relative mb-3">
                <FontAwesomeIcon icon={faEnvelope} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="position-relative mb-3">
                <FontAwesomeIcon icon={faLock} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control ps-5 pe-5"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>

              {/* Role selection */}
              <div className="d-flex justify-content-center gap-2 mb-3">
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
                className="btn w-100 text-white fw-semibold"
                style={{
                  background: 'linear-gradient(to right, #1e3c72, #2a5298)',
                }}
                disabled={isLoading}
              >
                {isLoading ? "LOGGING IN..." : "LOG IN"}
              </button>

              <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
                Omega Tax & Services — Version 1.0
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;