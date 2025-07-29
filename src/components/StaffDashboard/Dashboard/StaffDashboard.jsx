import React, { useState } from "react";

function StaffDashboard() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [tasks] = useState([
    {
      id: 1,
      title: "Complete client report",
      dueDate: "2023-06-15",
      status: "Pending",
      priority: "High",
    },
    {
      id: 2,
      title: "Update project documentation",
      dueDate: "2023-06-10",
      status: "Overdue",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Prepare meeting agenda",
      dueDate: "2023-06-12",
      status: "Completed",
      priority: "Low",
    },
    {
      id: 4,
      title: "Review code changes",
      dueDate: "2023-06-14",
      status: "Pending",
      priority: "High",
    },
    {
      id: 5,
      title: "Submit timesheet",
      dueDate: "2023-06-09",
      status: "Completed",
      priority: "Medium",
    },
  ]);

  const performanceData = [
    { day: "Mon", tasks: 3 },
    { day: "Tue", tasks: 5 },
    { day: "Wed", tasks: 4 },
    { day: "Thu", tasks: 6 },
    { day: "Fri", tasks: 2 },
    { day: "Sat", tasks: 0 },
    { day: "Sun", tasks: 0 },
  ];

  const invoiceData = [
    { name: "Generated", value: 4, color: "primary" },
    { name: "Paid", value: 3, color: "success" },
    { name: "Pending", value: 1, color: "warning" },
  ];

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const overdueTasks = tasks.filter((task) => task.status === "Overdue").length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const assignedTasks = tasks.length;

  const totalInvoices = invoiceData.reduce((sum, item) => sum + item.value, 0);
  const invoicePercentages = invoiceData.map((item) => ({
    ...item,
    percentage: Math.round((item.value / totalInvoices) * 100),
  }));

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
                  <h6 className="text-muted mb-2">Today's Tasks</h6>
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

        {/* Overdue */}
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Overdue Tasks</h6>
                  <h3 className="mb-0">{overdueTasks}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded">
                  <i className="fas fa-exclamation-triangle text-danger"></i>
                </div>
              </div>
              <div className="mt-3">
                <div className="progress" style={{ height: "5px" }}>
                  <div
                    className="progress-bar bg-danger"
                    style={{
                      width: `${Math.min((overdueTasks / 5) * 100, 100)}%`,
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
                  <div key={index} className="text-center">
                    <div
                      style={{
                        height: `${height}px`,
                        width: "25px",
                        backgroundColor: "#0d6efd",
                        marginBottom: "6px",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.4s",
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

        {/* Invoice Summary Chart */}

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
                    "conic-gradient(#ffc107 0% 40%, #0d6efd 40% 80%, #198754 80% 100%)",
                }}
              >
                <div
                  className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle"
                  style={{ width: "100px", height: "100px" }}
                >
                  <div className="text-center mt-4">
                    <strong>{tasks.length}</strong>
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
                      background: "#ffc107",
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
                      background: "#0d6efd",
                    }}
                  ></div>
                  <span>Completed - {completedTasks}</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="me-2 rounded"
                    style={{
                      width: "15px",
                      height: "15px",
                      background: "#198754",
                    }}
                  ></div>
                  <span>Overdue - {overdueTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
