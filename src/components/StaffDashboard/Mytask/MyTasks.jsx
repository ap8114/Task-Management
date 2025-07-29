import React, { useState } from "react";
import { Table, Form, Badge } from "react-bootstrap";

const initialTasks = [
  {
    id: 1,
    title: "Design Landing Page",
    description: "Create a responsive landing page for the new product.",
    status: "In Progress",
    startDate: "2025-07-25",
    dueDate: "2025-08-01",
    comments: "Make sure to include mobile support.",
    file: "landing_design.pdf",
    timer: 90,
    invoiceAmount: 5000,
  },
  {
    id: 2,
    title: "API Integration",
    description: "Integrate payment API for subscriptions.",
    status: "Pending",
    startDate: "2025-07-28",
    dueDate: "2025-08-05",
    comments: "Use the official SDK.",
    file: "api_doc.pdf",
    timer: 60,
    invoiceAmount: 8000,
  },
  {
    id: 3,
    title: "Content Upload",
    description: "Upload blogs and videos to CMS.",
    status: "Completed",
    startDate: "2025-07-20",
    dueDate: "2025-07-27",
    comments: "Use optimized formats.",
    file: "content.zip",
    timer: 120,
    invoiceAmount: 3000,
  },
  {
    id: 4,
    title: "Bug Fixing",
    description: "Resolve issues from QA testing.",
    status: "On Hold",
    startDate: "2025-07-22",
    dueDate: "2025-07-30",
    comments: "Prioritize login issues.",
    file: "buglist.xlsx",
    timer: 45,
    invoiceAmount: 2500,
  },
  {
    id: 5,
    title: "UI Improvements",
    description: "Refine UI based on feedback.",
    status: "In Progress",
    startDate: "2025-07-21",
    dueDate: "2025-08-02",
    comments: "Focus on navbar and footer.",
    file: "feedback_notes.txt",
    timer: 100,
    invoiceAmount: 6000,
  },
];

const statusVariant = {
  "Pending": "warning",
  "In Progress": "primary",
  "Completed": "success",
  "On Hold": "secondary"
};

const MyTasks = () => {
  const [tasks, setTasks] = useState(initialTasks);

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

  return (
    <div className="container-fluid py-3">
           <div className="">
          <h3 className="fw-bold text-dark"> My Tasks</h3>
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
                {tasks.map((task, index) => (
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