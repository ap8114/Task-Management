import React, { useState, useEffect } from "react";
import { Button, Dropdown, Table, Badge } from "react-bootstrap";
import moment from "moment";

const CalendarView = () => {
  // Sample tasks data with 5 additional random tasks
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Client Meeting",
      date: "2025-07-15",
      time: "10:00",
      duration: 60,
      status: "Scheduled",
    },
    {
      id: 2,
      title: "Project Deadline",
      date: "2025-07-20",
      time: "15:00",
      duration: 120,
      status: "Pending",
    },
    {
      id: 3,
      title: "Team Sync",
      date: "2025-07-15",
      time: "14:30",
      duration: 30,
      status: "Completed",
    },
    {
      id: 4,
      title: "Code Review",
      date: "2025-07-18",
      time: "11:00",
      duration: 90,
      status: "Scheduled",
    },
    // Additional random tasks
    {
      id: 5,
      title: "UX Design Review",
      date: "2025-07-16",
      time: "13:00",
      duration: 45,
      status: "Scheduled",
    },
    {
      id: 6,
      title: "Sprint Planning",
      date: "2025-07-17",
      time: "09:30",
      duration: 90,
      status: "Pending",
    },
    {
      id: 7,
      title: "Client Demo",
      date: "2025-07-19",
      time: "14:00",
      duration: 60,
      status: "Scheduled",
    },
    {
      id: 8,
      title: "Documentation Update",
      date: "2025-07-21",
      time: "16:00",
      duration: 120,
      status: "Pending",
    },
    {
      id: 9,
      title: "Retrospective Meeting",
      date: "2025-07-22",
      time: "11:30",
      duration: 60,
      status: "Completed",
    },
  ]);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(moment());
  const [viewMode, setViewMode] = useState("week"); // 'day', 'week', or 'month'

  // Get tasks for the current view
  const getTasksForView = () => {
    switch (viewMode) {
      case "day":
        return tasks.filter((task) =>
          moment(task.date).isSame(currentDate, "day")
        );
      case "week":
        return tasks.filter((task) =>
          moment(task.date).isSame(currentDate, "week")
        );
      case "month":
        return tasks.filter((task) =>
          moment(task.date).isSame(currentDate, "month")
        );
      default:
        return [];
    }
  };

  // Generate days for week view
  const getWeekDays = () => {
    const startOfWeek = currentDate.clone().startOf("week");
    const days = [];

    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.clone().add(i, "days"));
    }

    return days;
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
    if (direction === "prev") {
      setCurrentDate(currentDate.clone().subtract(1, viewMode));
    } else {
      setCurrentDate(currentDate.clone().add(1, viewMode));
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Scheduled":
        return "primary";
      case "Pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container-fluid py-3 ">
      <div className="card border-0 shadow-sm ">
        <div className="card-header bg-white border-0">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            {/* Title */}
            <h3 className="fw-bold text-dark">My Scheduled Tasks</h3>

            {/* Controls */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                &lt;
              </Button>

              {/* View Mode Dropdown */}
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

              {/* Date Range */}
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

              {/* Next Button */}
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigateDate("next")}
              >
                &gt;
              </Button>

              {/* Today Button */}
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


        <div className="card-body ">
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
                  </tr>
                </thead>
                <tbody>
                  {getTasksForView()
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((task) => (
                      <tr key={task.id}>
                        <td>{task.time}</td>
                        <td>{task.title}</td>
                        <td>{task.duration} mins</td>
                        <td>
                          <Badge bg={getStatusBadge(task.status)}>
                            {task.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  {getTasksForView().length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
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
                                className={`p-1 mb-1 rounded text-white bg-${getStatusBadge(task.status)
                                  }`}
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