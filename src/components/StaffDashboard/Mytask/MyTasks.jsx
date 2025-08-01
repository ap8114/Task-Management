import React, { useState, useEffect } from "react";
import { Table, Form, Badge, Spinner, Alert } from "react-bootstrap";
import axiosInstance from "../../../Utilities/axiosInstance";

const statusVariant = {
  "Pending": "warning",
  "In Progress": "primary",
  "Completed": "success",
  "On Hold": "secondary"
};

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get(
          `emailTask/getEmailTaskByUserId/${userId}`
        );
        
        console.log("Full API Response:", response); // Debugging
        
        // Handle different possible response structures
        const responseData = response?.data;
        let tasksData = [];
        
        if (Array.isArray(responseData)) {
          tasksData = responseData;
        } else if (Array.isArray(responseData?.data)) {
          tasksData = responseData.data;
        } else if (responseData?.data && typeof responseData.data === 'object') {
          // If data is an object, convert to array
          tasksData = Object.values(responseData.data);
        }
        
        console.log("Processed tasks data:", tasksData); // Debugging
        
        if (!tasksData.length) {
          console.warn("No tasks found or empty array returned");
        }
        
        setTasks(tasksData);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch tasks");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleStatusChange = (id, newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleAmountChange = (id, newAmount) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, invoiceAmount: Number(newAmount) } : task
      )
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="">
        <h3 className="fw-bold text-dark">My Tasks</h3>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {tasks.length === 0 ? (
            <div className="text-center py-4">
              <p>No tasks found</p>
            </div>
          ) : (
            <div className="table-responsive table-gradient-bg">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Dates</th>
                    <th>Comments</th>
                    <th>Attachment</th>
                    <th className="text-center">Time (min)</th>
                    <th className="text-end">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task.id || index}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{task.title || "No title"}</td>
                      <td className="text-muted">{task.description || "No description"}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Badge 
                            bg={statusVariant[task.status] || "secondary"} 
                            className="me-2"
                            style={{ width: "10px", height: "10px", padding: 0 }}
                          />
                          <Form.Select
                            value={task.status || "Pending"}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            size="sm"
                            className="border-0 shadow-sm"
                            style={{ 
                              backgroundColor: `var(--bs-${statusVariant[task.status] || "secondary"}-light`,
                              color: `var(--bs-${statusVariant[task.status] || "secondary"})`,
                              width: "120px"
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                          </Form.Select>
                        </div>
                      </td>
                      <td>
                        <small className="d-block text-muted">
                          Start: {task.deadline || "N/A"}
                        </small>
                        {/* <small className="d-block text-muted">
                          Due: {task.dueDate || "N/A"}
                        </small> */}
                      </td>
                      <td>
                        <small className="text-muted">
                          {task.comments || "No comments"}
                        </small>
                      </td>
                      <td>
                        {task.image ? (
                          <Badge bg="light" text="dark" className="border">
                            <i className="fas fa-paperclip me-1"></i>
                            {task.image}
                          </Badge>
                        ) : (
                          "No attachment"
                        )}
                      </td>
                      <td className="text-center">
                        <Badge bg="info" pill>
                          {task.timer || 0} min
                        </Badge>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={task.invoiceAmount || 0}
                          onChange={(e) => handleAmountChange(task.id, e.target.value)}
                          min="0"
                          className="text-end border-0 shadow-sm"
                          style={{ width: "100px" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;