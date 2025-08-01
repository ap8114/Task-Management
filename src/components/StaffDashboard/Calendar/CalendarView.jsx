import React, { useState, useEffect } from "react";
import { Button, Dropdown, Table, Badge, Spinner, Alert } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import axiosInstance from "../../../Utilities/axiosInstance";

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [viewMode, setViewMode] = useState("week"); // 'day', 'week', or 'month'
  const userId = localStorage.getItem("userId");

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get(
          `employeeTask/getEmployeeTaskByUserId/${userId}`
        );
        
        console.log("API Response:", response); // Debugging
        
        // Handle different response structures
        let tasksData = [];
        
        if (Array.isArray(response?.data?.data)) {
          // Case 1: Response has data array
          tasksData = response.data.data;
        } else if (response?.data?.data && typeof response.data.data === 'object') {
          // Case 2: Response has single task object
          tasksData = [response.data.data];
        } else if (Array.isArray(response?.data)) {
          // Case 3: Response is directly an array
          tasksData = response.data;
        } else if (response?.data && typeof response.data === 'object') {
          // Case 4: Response is a single task object
          tasksData = [response.data];
        }
        
        // Transform tasks to expected format
        const transformedTasks = tasksData.map(task => ({
          id: task.id,
          title: task.title || "Untitled Task",
          date: task.startDateTime ? task.startDateTime.split('T')[0] : moment().format('YYYY-MM-DD'),
          time: task.startDateTime ? task.startDateTime.split('T')[1].substring(0, 5) : "00:00",
          duration: task.duration || "N/A",
          status: task.status || "Pending",
          description: task.description || "No description available"
        }));
        
        setTasks(transformedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(
          err.response?.data?.message || 
          err.message || 
          "Failed to fetch tasks. Please try again later."
        );
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTasks();
    } else {
      setError("User ID not found. Please login again.");
      setLoading(false);
    }
  }, [userId]);

  // Get tasks for the current view
  const getTasksForView = () => {
    const viewTasks = tasks.filter(task => {
      const taskDate = moment(task.date);
      switch (viewMode) {
        case "day":
          return taskDate.isSame(currentDate, "day");
        case "week":
          return taskDate.isSame(currentDate, "week");
        case "month":
          return taskDate.isSame(currentDate, "month");
        default:
          return false;
      }
    });
    return viewTasks;
  };

  // Generate days for week view
  const getWeekDays = () => {
    const startOfWeek = currentDate.clone().startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, "days"));
  };

  // Generate cells for month view
  const getMonthCells = () => {
    const startOfMonth = currentDate.clone().startOf("month").startOf("week");
    const endOfMonth = currentDate.clone().endOf("month").endOf("week");
    const cells = [];
    let day = startOfMonth.clone();

    while (day.isBefore(endOfMonth)) {
      cells.push(day.clone());
      day.add(1, "day");
    }

    return cells;
  };

  // Change date navigation
  const navigateDate = (direction) => {
    setCurrentDate(prev => 
      direction === "prev" 
        ? prev.clone().subtract(1, viewMode) 
        : prev.clone().add(1, viewMode)
    );
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed": return "success";
      case "In Progress": return "primary";
      case "Pending": return "warning";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <h3 className="fw-bold text-dark">My Scheduled Tasks</h3>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                &lt;
              </Button>

              <Dropdown>
                <Dropdown.Toggle variant="light" size="sm" id="view-mode-dropdown">
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setViewMode("day")}>Day</Dropdown.Item>
                  <Dropdown.Item onClick={() => setViewMode("week")}>Week</Dropdown.Item>
                  <Dropdown.Item onClick={() => setViewMode("month")}>Month</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <h6 className="mb-0">
                {viewMode === "month"
                  ? currentDate.format("MMMM YYYY")
                  : viewMode === "week"
                    ? `${currentDate.clone().startOf("week").format("MMM D")} - ${currentDate
                      .clone()
                      .endOf("week")
                      .format("MMM D, YYYY")}`
                    : currentDate.format("MMMM D, YYYY")}
              </h6>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigateDate("next")}
              >
                &gt;
              </Button>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setCurrentDate(moment())}
              >
                Today
              </Button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {viewMode === "day" && (
            <div>
              <h6 className="mb-3">{currentDate.format("dddd, MMMM D")}</h6>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Time</th>
                    <th style={{ width: "30%" }}>Task</th>
                    <th style={{ width: "20%" }}>Duration</th>
                    <th style={{ width: "15%" }}>Status</th>
                    <th style={{ width: "15%" }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {getTasksForView().length > 0 ? (
                    getTasksForView()
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((task) => (
                        <tr key={task.id}>
                          <td>{task.time}</td>
                          <td>{task.title}</td>
                          <td>{task.duration}</td>
                          <td>
                            <Badge bg={getStatusBadge(task.status)}>
                              {task.status}
                            </Badge>
                          </td>
                          <td>{task.description}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        No tasks scheduled for this day
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {viewMode === "week" && (
            <div>
              <Table bordered>
                <thead>
                  <tr>
                    <th style={{ width: "14%" }}>Time</th>
                    {getWeekDays().map((day) => (
                      <th key={day.format("YYYY-MM-DD")} style={{ width: "12%" }}>
                        <div>{day.format("ddd")}</div>
                        <div>{day.format("D")}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <tr key={hour}>
                      <td>{`${hour}:00`}</td>
                      {getWeekDays().map((day) => {
                        const dayTasks = getTasksForView().filter(
                          (task) =>
                            moment(task.date).isSame(day, "day") &&
                            parseInt(task.time.split(":")[0]) === hour
                        );
                        return (
                          <td key={day.format("YYYY-MM-DD")} style={{ height: "60px" }}>
                            {dayTasks.map((task) => (
                              <div
                                key={task.id}
                                className={`p-1 mb-1 rounded text-white bg-${getStatusBadge(task.status)}`}
                              >
                                <small>
                                  {task.time} - {task.title}
                                </small>
                              </div>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {viewMode === "month" && (
            <div>
              <Table bordered>
                <thead>
                  <tr>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <th key={day} className="text-center">
                          {day}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(getMonthCells().length / 7) }).map(
                    (_, weekIndex) => (
                      <tr key={weekIndex}>
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                          const cellIndex = weekIndex * 7 + dayIndex;
                          const cellDate = getMonthCells()[cellIndex];
                          const isCurrentMonth = cellDate.isSame(
                            currentDate,
                            "month"
                          );
                          const dayTasks = getTasksForView().filter((task) =>
                            moment(task.date).isSame(cellDate, "day")
                          );

                          return (
                            <td
                              key={cellDate.format("YYYY-MM-DD")}
                              style={{
                                height: "100px",
                                verticalAlign: "top",
                                opacity: isCurrentMonth ? 1 : 0.5,
                                backgroundColor: cellDate.isSame(moment(), "day")
                                  ? "rgba(0, 123, 255, 0.1)"
                                  : "white",
                              }}
                            >
                              <div className="d-flex justify-content-between">
                                <span>{cellDate.format("D")}</span>
                                {dayTasks.length > 0 && (
                                  <Badge bg="primary" pill>
                                    {dayTasks.length}
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-1">
                                {dayTasks.slice(0, 2).map((task) => (
                                  <div
                                    key={task.id}
                                    className="text-truncate small"
                                    style={{
                                      backgroundColor: `var(--bs-${getStatusBadge(
                                        task.status
                                      )})`,
                                      color: "white",
                                      padding: "2px 4px",
                                      borderRadius: "3px",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    {task.time} {task.title}
                                  </div>
                                ))}
                                {dayTasks.length > 2 && (
                                  <div className="small text-muted">
                                    +{dayTasks.length - 2} more
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;