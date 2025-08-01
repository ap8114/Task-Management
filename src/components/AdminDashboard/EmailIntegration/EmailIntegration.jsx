import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  ListGroup,
  Badge,
  ProgressBar,
  Dropdown,
} from "react-bootstrap";
import {
  FaEnvelope,
  FaPaperclip,
  FaCalendarAlt,
  FaUser,
  FaTasks,
  FaCheck,
  FaTrash,
  FaFilter,
  FaSearch,
  FaEllipsisV,
  FaUpload,
} from "react-icons/fa";
import axios from "axios";
import axiosInstance from "../../../Utilities/axiosInstance";
import BaseUrl from "../../../Utilities/BaseUrl";

const EmailIntegration = () => {
  // Sample email data
  const [emails, setEmails] = useState([
    {
      id: 1,
      subject: "Project Deadline Extension",
      body: "Team, we need to extend the deadline for Q3 deliverables due to unexpected delays in the development phase. Please review the attached specifications and provide your feedback.",
      date: "2025-07-28",
      sender: "manager@company.com",
      attachments: ["specs.pdf"],
      read: false,
      priority: "high",
    },
    {
      id: 2,
      subject: "Client Meeting Notes",
      body: "Here are the notes from today's client meeting regarding the new website redesign. Key points include color scheme preferences and requested features.",
      date: "2025-07-27",
      sender: "client@clientco.com",
      attachments: ["meeting_notes.docx", "presentation.pptx"],
      read: true,
      priority: "medium",
    },
    {
      id: 3,
      subject: "Weekly Team Sync",
      body: "Reminder about our weekly sync meeting tomorrow at 10 AM. Please prepare your updates and blockers.",
      date: "2025-07-26",
      sender: "team@company.com",
      attachments: [],
      read: false,
      priority: "low",
    },
  ]);

  const [tasks, setTasks] = useState([]);
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [taskType, setTaskType] = useState("description");
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const employees = [
    { id: 1, name: "Alex Johnson" },
    { id: 2, name: "Sam Rivera" },
    { id: 3, name: "Taylor Chen" },
    { id: 4, name: "Jordan Smith" },
    { id: 5, name: "Casey Wong" },
  ];

  const taskTypes = [
    "description",
    "development",
    "design",
    "meeting",
    "review",
    "bugfix",
    "documentation",
  ];

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setIsTaskLoading(true);
      setTaskError(null);
      try {
        const response = await axios.get(
          "https://projectmanagement-backend-production.up.railway.app/api/emailTask/getAllEmailTasks",
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.data.status === "success") {
          // Map API data to UI format
          setTasks(
            response.data.data.map((task) => ({
              id: task.id,
              title: task.title,
              description: task.description,
              attachments: task.image || [],
              deadline: task.deadline,
              assignedTo: task.assignedUserName || "",
              status: "Pending", // You can update this if API provides status
              created: task.createdAt?.split("T")[0] || "",
              priority: (task.priority || "medium").toLowerCase(),
              taskType: task.taskType,
              invoiceAmount: task.invoiceAmount ? parseFloat(task.invoiceAmount) : 0,
            }))
          );
        } else {
          setTaskError("Failed to fetch tasks.");
        }
      } catch (err) {
        setTaskError("Error fetching tasks.");
      } finally {
        setIsTaskLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleConvertToTask = (email) => {
    setSelectedEmail(email);
    setTaskTitle(email.subject);
    setDescription(email.body);
    setShowModal(true);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // Only images allowed
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setUploadedFiles(imageFiles);
  };

  const handleCreateTask = async () => {
    if (!deadline || !assignedTo || !taskTitle) {
      setError("Please fill all required fields");
      return;
    }
    if (uploadedFiles.length === 0) {
      setError("At least one image is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", taskTitle);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("deadline", deadline);
      formData.append("assignedTo", assignedTo);
      formData.append("taskType", taskType);
      formData.append("invoiceAmount", invoiceAmount);

      // Only image files
      uploadedFiles.forEach((file) => {
        formData.append("image", file);
      });

      // Axios POST API call
      const response = await axios.post(
        "https://projectmanagement-backend-production.up.railway.app/api/emailTask/createEmailTask",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log(response);

      // Add the new task to local state
      const newTask = {
        id: tasks.length + 1,
        title: taskTitle,
        description: description,
        attachments: [
          ...uploadedFiles.map((file) => file.name),
          ...(selectedEmail?.attachments || []),
        ],
        deadline,
        assignedTo:
          employees.find((e) => e.id === parseInt(assignedTo))?.name ||
          assignedTo,
        status: "Pending",
        created: new Date().toISOString().split("T")[0],
        priority,
        taskType,
        invoiceAmount,
      };

      setTasks([...tasks, newTask]);
      setShowModal(false);
      resetForm();

      // Mark email as read
      if (selectedEmail) {
        setEmails(
          emails.map((e) =>
            e.id === selectedEmail.id ? { ...e, read: true } : e
          )
        );
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTaskTitle("");
    setDescription("");
    setDeadline("");
    setAssignedTo("");
    setPriority("medium");
    setTaskType("description");
    setInvoiceAmount(0);
    setUploadedFiles([]);
    setSelectedEmail(null);
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && task.status === "Pending") ||
      (activeTab === "inProgress" && task.status === "In Progress") ||
      (activeTab === "completed" && task.status === "Completed");
    return matchesSearch && matchesTab;
  });

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const completionPercentage =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <Container fluid className="email-integration-system px-3 px-sm-4 py-3">
      {/* Header Section */}
      <header className="email-integration-header mb-4">
        <Row className="align-items-center">
          <Col xs={8} sm={6} md={6} lg={6}>
            <h3 className="mb-4 fw-bold text-dark">Email Integration</h3>
            <p className="text-muted mb-0 d-none d-sm-block">
              Convert emails to tasks and manage your workflow
            </p>
          </Col>
          <Col xs={4} sm={6} md={6} lg={6} className="text-end">
            <div className="d-flex justify-content-end align-items-center">
              <Form.Control
                type="search"
                placeholder="Search tasks..."
                className="me-2 d-none d-md-block"
                style={{ width: "200px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Dropdown className="d-md-none">
                <Dropdown.Toggle variant="primary" id="mobile-menu">
                  <FaEllipsisV />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item>
                    <FaSearch className="me-2" />
                    Search
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <FaEnvelope className="me-2" />
                    Refresh
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                  >
                    <FaFilter className="me-2" />
                    Filter Tasks
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="primary"
                className="d-none d-md-flex align-items-center"
              >
                <FaEnvelope className="me-2" /> Refresh Emails
              </Button>
            </div>
          </Col>
        </Row>
      </header>

      {/* Progress Bar Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body className="p-2 p-sm-3">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
                <div className="mb-2 mb-sm-0 text-center text-sm-start">
                  <h5 className="mb-1">Task Completion</h5>
                  <small className="text-muted">
                    {completedTasks} of {tasks.length} tasks completed
                  </small>
                </div>
                <div style={{ width: "200px" }}>
                  <ProgressBar
                    now={completionPercentage}
                    label={`${completionPercentage}%`}
                    variant="success"
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row className="g-3">
        {/* Email Section */}
        <Col xs={12} md={5}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaEnvelope className="me-2 text-primary" /> Inbox
                </h5>
                <Badge bg="primary">{emails.length} emails</Badge>
              </div>
            </Card.Header>
            <Card.Body
              className="p-0"
              style={{ maxHeight: "600px", overflowY: "auto" }}
            >
              <ListGroup variant="flush">
                {emails.map((email) => (
                  <ListGroup.Item
                    key={email.id}
                    className={`p-2 p-sm-3 ${
                      email.read ? "" : "bg-light"
                    } border-bottom`}
                    action
                    onClick={() => handleConvertToTask(email)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1 mb-sm-2">
                      <div className="d-flex align-items-center">
                        <div
                          className={`priority-indicator ${email.priority}`}
                        ></div>
                        <h6
                          className={`mb-0 ${
                            email.read ? "" : "fw-bold"
                          } text-truncate`}
                          style={{ maxWidth: "200px" }}
                        >
                          {email.subject}
                        </h6>
                      </div>
                      <small className="text-muted">{email.date}</small>
                    </div>
                    <p className="text-muted mb-1 mb-sm-2 text-truncate">
                      {email.body.substring(0, 80)}...
                    </p>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                      <div className="mb-1 mb-sm-0">
                        {email.attachments.map((file, idx) => (
                          <Badge
                            key={idx}
                            bg="light"
                            text="dark"
                            className="me-1 mb-1"
                          >
                            <FaPaperclip className="me-1" />
                            <span className="d-none d-sm-inline">{file}</span>
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConvertToTask(email);
                        }}
                      >
                        <span className="d-none d-sm-inline">
                          Convert to Task
                        </span>
                        <span className="d-sm-none">Convert</span>
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Task Section */}
        <Col xs={12} md={7}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h5 className="mb-2 mb-md-0">
                  <FaTasks className="me-2 text-primary" /> Task Dashboard
                </h5>
                <div
                  className={`d-flex flex-wrap ${
                    showMobileMenu ? "" : "d-none d-md-flex"
                  }`}
                >
                  <Button
                    variant={
                      activeTab === "all" ? "primary" : "outline-primary"
                    }
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => setActiveTab("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      activeTab === "pending" ? "primary" : "outline-primary"
                    }
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => setActiveTab("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={
                      activeTab === "inProgress" ? "primary" : "outline-primary"
                    }
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => setActiveTab("inProgress")}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={
                      activeTab === "completed" ? "primary" : "outline-primary"
                    }
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => setActiveTab("completed")}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body
              style={{
                minHeight: "400px",
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              {isTaskLoading ? (
                <div className="text-center py-5">
                  <span>Loading tasks...</span>
                </div>
              ) : taskError ? (
                <div className="text-center py-5 text-danger">
                  <span>{taskError}</span>
                </div>
              ) : filteredTasks.length > 0 ? (
                <Row xs={1} sm={1} md={1} lg={2} className="g-3">
                  {filteredTasks.map((task) => (
                    <Col key={task.id}>
                      <Card
                        className={`border-${getPriorityColor(
                          task.priority
                        )} border-start border-3 h-100`}
                      >
                        <Card.Body className="d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h5
                                className="mb-1 text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {task.title}
                              </h5>
                              <div className="d-flex flex-wrap">
                                <Badge
                                  bg={getPriorityColor(task.priority)}
                                  className="me-2 mb-1"
                                >
                                  {task.priority}
                                </Badge>
                                <Badge
                                  bg={
                                    task.status === "Completed"
                                      ? "success"
                                      : task.status === "In Progress"
                                      ? "info"
                                      : "warning"
                                  }
                                  className="mb-1"
                                >
                                  {task.status}
                                </Badge>
                                {task.taskType && (
                                  <Badge bg="secondary" className="me-2 mb-1">
                                    {task.taskType}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div>
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="me-1 mb-1"
                                onClick={() =>
                                  handleTaskStatusChange(task.id, "Completed")
                                }
                                disabled={task.status === "Completed"}
                              >
                                <FaCheck />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="mb-1"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                          <p className="text-muted mb-3 flex-grow-1">
                            {task.description.substring(0, 100)}...
                          </p>
                          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                            <div className="mb-2 mb-sm-0">
                              <div className="d-flex align-items-center mb-1">
                                <FaUser className="me-2 text-muted" />
                                <small>{task.assignedTo}</small>
                              </div>
                              <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2 text-muted" />
                                <small>Due: {task.deadline}</small>
                              </div>
                              {task.invoiceAmount > 0 && (
                                <div className="d-flex align-items-center mt-1">
                                  <small className="fw-bold">
                                    Invoice: ${task.invoiceAmount.toFixed(2)}
                                  </small>
                                </div>
                              )}
                            </div>
                            <div>
                              {task.attachments.map((file, idx) => (
                                <Badge
                                  key={idx}
                                  bg="light"
                                  text="dark"
                                  className="me-1 mb-1"
                                >
                                  <FaPaperclip className="me-1" />
                                  <span className="d-none d-sm-inline">
                                    {typeof file === "string" ? file.split("/").pop() : file}
                                  </span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                    alt="No tasks"
                    style={{ width: "120px", opacity: 0.7 }}
                    className="mb-3"
                  />
                  <h4 className="text-muted">No tasks found</h4>
                  <p>Convert emails to tasks or adjust your filters</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Convert Email Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center">
            <FaTasks className="me-2 text-primary" />
            <div>
              <h5 className="mb-0">Create Task from Email</h5>
              <small className="text-muted">
                Convert email to actionable task
              </small>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <Form>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>
                    Task Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="border-primary"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    Priority <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border-primary"
                    required
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-primary"
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Task Type <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="border-primary"
                    required
                  >
                    {taskTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Invoice Amount ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={invoiceAmount}
                    onChange={(e) =>
                      setInvoiceAmount(parseFloat(e.target.value) || 0)
                    }
                    className="border-primary"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Modal Attachments Section */}
            {uploadedFiles.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Attachments</Form.Label>
                <div className="p-2 bg-light rounded">
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={`upload-${idx}`}
                      className="d-flex align-items-center mb-2"
                    >
                      <FaPaperclip className="me-2 text-muted" />
                      <span
                        className="me-3 text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {file.name}
                      </span>
                      <Badge bg="primary">New Upload</Badge>
                    </div>
                  ))}
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Upload Additional Files</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="border-primary"
                />
                <Button variant="outline-secondary" className="ms-2">
                  <FaUpload className="me-1" /> Browse
                </Button>
              </div>
            </Form.Group>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Deadline <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    className="border-primary"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Assign To <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    className="border-primary"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    required
                  >
                    <option value="">Select team member</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateTask}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .priority-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 10px;
          flex-shrink: 0;
        }
        .priority-indicator.high {
          background-color: #dc3545;
        }
        .priority-indicator.medium {
          background-color: #ffc107;
        }
        .priority-indicator.low {
          background-color: #28a745;
        }
        .task-card:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 767.98px) {
          .email-integration-system {
            padding-left: 15px;
            padding-right: 15px;
          }
        }
      `}</style>
    </Container>
  );
};

export default EmailIntegration;
