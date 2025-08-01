import React, { useState, useEffect } from "react";
import axios from "axios";

function StaffDashboard() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with actual user ID from your auth system
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://projectmanagement-backend-production.up.railway.app/api/staffDashboard/getStaffDashboardData/${userId}`
          
        );
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="container-fluid py-3">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container-fluid py-3">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="container-fluid py-3">No data available</div>;
  }

  // Calculate task status counts from the API data
  const pendingTasks = dashboardData.tasks.filter(
    (task) => task.status.toLowerCase() === "to do"
  ).length;
  const overdueTasks = 0; // You might need to calculate this based on due dates
  const completedTasks = dashboardData.tasks.filter(
    (task) => task.status.toLowerCase() === "done"
  ).length;
  const inProgressTasks = dashboardData.tasks.filter(
    (task) => task.status.toLowerCase() === "in progress"
  ).length;
  const assignedTasks = dashboardData.totalTasks;

  // Prepare performance data (you might want to fetch this from API)
  const performanceData = [
    { day: "Mon", tasks: 3 },
    { day: "Tue", tasks: 5 },
    { day: "Wed", tasks: 4 },
    { day: "Thu", tasks: 6 },
    { day: "Fri", tasks: 2 },
    { day: "Sat", tasks: 0 },
    { day: "Sun", tasks: 0 },
  ];

  const maxTasks = Math.max(...performanceData.map((item) => item.tasks), 1);

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Staff Dashboard</h3>
        <div className="text-muted">{formattedDate}</div>
      </div>

      {/* Stats Cards Row */}
      <div className="row mb-4">
        {/* Assigned */}
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Total Tasks</h6>
                  <h3 className="mb-0">{assignedTasks}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="fas fa-tasks text-primary"></i>
                </div>
              </div>
              <div className="mt-3">
                <div className="progress" style={{ height: "5px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{
                      width: `${Math.min((assignedTasks / 10) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">In Progress</h6>
                  <h3 className="mb-0">{inProgressTasks}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="fas fa-spinner text-info"></i>
                </div>
              </div>
              <div className="mt-3">
                <div className="progress" style={{ height: "5px" }}>
                  <div
                    className="progress-bar bg-info"
                    style={{
                      width: `${Math.min((inProgressTasks / 10) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Pending Tasks</h6>
                  <h3 className="mb-0">{pendingTasks}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="fas fa-clock text-warning"></i>
                </div>
              </div>
              <div className="mt-3">
                <div className="progress" style={{ height: "5px" }}>
                  <div
                    className="progress-bar bg-warning"
                    style={{
                      width: `${Math.min((pendingTasks / 10) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Completed Tasks</h6>
                  <h3 className="mb-0">{completedTasks}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="fas fa-check-circle text-success"></i>
                </div>
              </div>
              <div className="mt-3">
                <div className="progress" style={{ height: "5px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${Math.min((completedTasks / 10) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row">
        {/* Personal Performance Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                Personal Performance (Tasks Completed This Week)
              </h5>
            </div>
            <div
              className="card-body d-flex align-items-end justify-content-around"
              style={{ height: "300px" }}
            >
              {performanceData.map((day, index) => {
                const height = (day.tasks / maxTasks) * 200; // max 200px height
                return (
                  <div 
                    key={index} 
                    className="text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        height: `${height}px`,
                        width: "25px",
                        backgroundColor: "#4bc0c0",
                        marginBottom: "6px",
                        borderRadius: "6px 6px 0 0",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#36a2a2";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#4bc0c0";
                        e.target.style.transform = "scale(1)";
                      }}
                    ></div>
                    <div className="small fw-bold">{day.tasks}</div>
                    <div className="small text-muted">{day.day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Status Breakdown Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Task Status Breakdown</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center flex-column">
              <div
                className="position-relative"
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background:
                    `conic-gradient(#ff6384 0% ${(pendingTasks/assignedTasks)*100}%, #36a2eb ${(pendingTasks/assignedTasks)*100}% ${((pendingTasks+inProgressTasks)/assignedTasks)*100}%, #4bc0c0 ${((pendingTasks+inProgressTasks)/assignedTasks)*100}% ${((pendingTasks+inProgressTasks+completedTasks)/assignedTasks)*100}%, #9966ff ${((pendingTasks+inProgressTasks+completedTasks)/assignedTasks)*100}% 100%)`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.background = 
                    `conic-gradient(#ff4569 0% ${(pendingTasks/assignedTasks)*100}%, #1e88e5 ${(pendingTasks/assignedTasks)*100}% ${((pendingTasks+inProgressTasks)/assignedTasks)*100}%, #36a2a2 ${((pendingTasks+inProgressTasks)/assignedTasks)*100}% ${((pendingTasks+inProgressTasks+completedTasks)/assignedTasks)*100}%, #8a5cff ${((pendingTasks+inProgressTasks+completedTasks)/assignedTasks)*100}% 100%)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.background = 
                    `conic-gradient(#ff6384 0% ${(pendingTasks/assignedTasks)*100}%, #36a2eb ${(pendingTasks/assignedTasks)*100}% ${((pendingTasks+inProgressTasks)/assignedTasks)*100}%, #4bc0c0 ${((pendingTasks+inProgressTasks)/assignedTasks)*100}% ${((pendingTasks+inProgressTasks+completedTasks)/assignedTasks)*100}%, #9966ff ${((pendingTasks+inProgressTasks+completedTasks)/assignedTasks)*100}% 100%)`;
                }}
              >
                <div
                  className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle"
                  style={{ width: "100px", height: "100px" }}
                >
                  <div className="text-center mt-4">
                    <strong>{assignedTasks}</strong>
                    <br />
                    <small>Total Tasks</small>
                  </div>
                </div>
              </div>
              <div className="mt-4 w-75">
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="me-2 rounded"
                    style={{
                      width: "15px",
                      height: "15px",
                      background: "#ff6384",
                    }}
                  ></div>
                  <span>Pending - {pendingTasks}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="me-2 rounded"
                    style={{
                      width: "15px",
                      height: "15px",
                      background: "#36a2eb",
                    }}
                  ></div>
                  <span>In Progress - {inProgressTasks}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="me-2 rounded"
                    style={{
                      width: "15px",
                      height: "15px",
                      background: "#4bc0c0",
                    }}
                  ></div>
                  <span>Completed - {completedTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Your Tasks</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.tasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>
                          <span
                            className={`badge ${
                              task.status.toLowerCase() === "done"
                                ? "bg-success"
                                : task.status.toLowerCase() === "in progress"
                                ? "bg-info"
                                : "bg-warning"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              task.priority.toLowerCase() === "high"
                                ? "bg-danger"
                                : task.priority.toLowerCase() === "medium"
                                ? "bg-warning"
                                : "bg-secondary"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td>
                          {new Date(task.dueDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;