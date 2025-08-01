import React, { useState, useEffect } from "react";
import { Table, Form, Badge } from "react-bootstrap";
import axios from "axios";
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

  // Replace this with your actual user ID retrieval logic
  const userId = localStorage.getItem(user_id); // This should come from your auth system or context

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(
          `emailTask/getEmailTaskById/${userId}`
        );
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
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
    return <div className="text-center py-5">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid py-3">
      <div className="">
        <h3 className="fw-bold text-dark">My Tasks</h3>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
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
                {tasks?.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{task.title}</td>
                    <td className="text-muted">{task.description}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Badge 
                          bg={statusVariant[task.status]} 
                          className="me-2"
                          style={{ width: "10px", height: "10px", padding: 0 }}
                        />
                        <Form.Select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          size="sm"
                          className="border-0 shadow-sm"
                          style={{ 
                            backgroundColor: `var(--bs-${statusVariant[task.status]}-light`,
                            color: `var(--bs-${statusVariant[task.status]})`,
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
                      <small className="d-block text-muted">Start: {task.startDate}</small>
                      <small className="d-block text-muted">Due: {task.dueDate}</small>
                    </td>
                    <td>
                      <small className="text-muted">{task.comments}</small>
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="border">
                        <i className="fas fa-paperclip me-1"></i>
                        {task.file}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg="info" pill>
                        {task.timer} min
                      </Badge>
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={task.invoiceAmount}
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
        </div>
      </div>
    </div>
  );
};

export default MyTasks;