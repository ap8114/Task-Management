import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge, Container, Card, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './TaskManagement.css';
import axiosInstance from '../../../Utilities/axiosInstance';

const TaskManagement = () => {
  // State for tasks and users
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  // Form states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  // Form data
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium',
    taskType: '',
    invoiceAmount: ''
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("tasks/getAllTasks");
      setTasks(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      showAlert('error', 'Failed to fetch tasks');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("user/getAllUsers");
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      showAlert('error', 'Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // Helper functions
  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'To Do',
      assignedTo: '',
      dueDate: '',
      priority: 'Medium',
      taskType: '',
      invoiceAmount: ''
    });
    setCurrentTask(null);
  };

  const showAlert = (icon, title, text = '') => {
    Swal.fire({
      icon,
      title,
      text,
      timer: 3000,
      showConfirmButton: false
    });
  };

  // Form handlers
  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  // Task operations
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'To Do',
      assignedTo: task.assignedTo?.id || task.assignedTo || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      priority: task.priority || 'Medium',
      taskType: task.taskType || '',
      invoiceAmount: task.invoiceAmount || ''
    });
    setShowTaskModal(true);
  };

  const handleSaveTask = async () => {
    const { title, description, status, priority, assignedTo, dueDate, taskType, invoiceAmount } = taskForm;

    if (!title || !assignedTo || !taskType) {
      showAlert('error', 'Validation Error', 'Title, Task Type and Assigned To are required!');
      return;
    }

    const payload = {
      title,
      description,
      status,
      priority,
      assignedTo: parseInt(assignedTo),
      taskType,
      invoiceAmount: parseFloat(invoiceAmount) || 0,
      dueDate: dueDate ? `${dueDate}T00:00:00.000Z` : null
    };

    try {
      let response;
      if (currentTask) {
        // Update existing task
        response = await axiosInstance.patch(`tasks/updateTask/${currentTask.id}`, payload);
        setTasks(tasks.map(task => 
          task.id === currentTask.id ? response.data.data : task
        ));
        showAlert('success', 'Success', 'Task updated successfully!');
      } else {
        // Add new task
        response = await axiosInstance.post("tasks/addTask", payload);
        setTasks([...tasks, response.data.data]);
        showAlert('success', 'Success', 'Task created successfully!');
      }
      
      setShowTaskModal(false);

      resetTaskForm();
        fetchTasks();
    } catch (error) {
      console.error("Error:", error);
      showAlert('error', 'Error', 'Server error. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`tasks/deleteTask/${taskId}`);
        setTasks(tasks.filter(task => task.id !== taskId));
        showAlert('success', 'Deleted!', 'Task has been deleted.');
      } catch (error) {
        console.error("Error:", error);
        showAlert('error', 'Failed to delete task');
      }
    }
  };

  // Filter and utility functions
  const filteredTasks = tasks.filter(task => {
    const title = task?.title || '';
    const description = task?.description || '';
    const status = task?.status || '';
    const priority = task?.priority || '';
    const taskType = task?.taskType || '';

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taskType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || status === filterStatus;
    const matchesPriority = filterPriority === 'All' || priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'primary';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Done': return 'success';
      case 'In Progress': return 'primary';
      case 'To Do': return 'secondary';
      default: return 'light';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'N/A';
  };

  return (
    <div className="">
      {/* Header */}
      <div className="p-3">
        <h3 className="fw-bold text-dark">Task Management</h3>
      </div>
      <div className="task-management-system">
        {/* Navigation */}
        <Container>
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>Total Tasks</Card.Title>
                    <i className="fa-solid fa-list-check fs-3 text-primary"></i>
                  </div>
                  <Card.Text className="display-6">{tasks.length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>Completed</Card.Title>
                    <i className="fa-solid fa-circle-check fs-3 text-success"></i>
                  </div>
                  <Card.Text className="display-6">{tasks?.filter(t => t?.status === 'Done').length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>In Progress</Card.Title>
                    <i className="fa-solid fa-spinner fs-3 text-warning"></i>
                  </div>
                  <Card.Text className="display-6">{tasks?.filter(t => t?.status === 'In Progress').length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>Pending</Card.Title>
                    <i className="fa-solid fa-hourglass-half fs-3 text-danger"></i>
                  </div>
                  <Card.Text className="display-6">{tasks?.filter(t => t?.status === 'To Do').length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-4">
            <Card.Body>
              <Row className="g-2 align-items-center">
                <Col xs={12} md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>

                <Col xs={6} md={2}>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </Form.Select>
                </Col>

                <Col xs={6} md={2}>
                  <Form.Select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="All">All Priority</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Col>

                <Col xs={12} md={4} className="text-md-end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      resetTaskForm();
                      setShowTaskModal(true);
                    }}
                    className="w-100 w-md-auto"
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add New Task
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tasks Table */}
          <Card>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Task Type</th>
                      <th>Description</th>
                      <th>Assigned To</th>
                      <th>Due Date</th>
                      <th>Invoice Amount</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <tr key={task?.id}>
                          <td>{task?.title || 'N/A'}</td>
                          <td>{task?.taskType || 'N/A'}</td>
                          <td>{task?.description || 'N/A'}</td>
                          <td>{getUserName(task?.assignedTo)}</td>
                          <td>{task?.dueDate ? task?.dueDate.split('T')[0] : 'N/A'}</td>
                          <td>{formatCurrency(task?.invoiceAmount)}</td>
                          <td>
                            <Badge bg={getPriorityBadge(task?.priority)}>
                              {task?.priority || 'N/A'}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusBadge(task?.status)}>
                              {task?.status || 'N/A'}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditTask(task)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">No tasks found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Task Modal */}
          <Modal show={showTaskModal} onHide={() => { setShowTaskModal(false); resetTaskForm(); }}>
            <Modal.Header closeButton>
              <Modal.Title>{currentTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleTaskFormChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={taskForm.description}
                    onChange={handleTaskFormChange}
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Task Type</Form.Label>
                      <Form.Select
                        name="taskType"
                        value={taskForm.taskType}
                        onChange={handleTaskFormChange}
                        required
                      >
                        <option value="">Select Task Type</option>
                        <optgroup label="Tax Services">
                          <option value="Personal Tax Preparation">Personal Tax Preparation</option>
                          <option value="Corporate Tax Preparation">Corporate Tax Preparation</option>
                          <option value="Tax Problem Resolution">Tax Problem Resolution / Offer & Compromise</option>
                          <option value="Penalty Abatement">Penalty Abatement</option>
                          <option value="Federal State Representation">Federal/State Representation</option>
                        </optgroup>
                        <optgroup label="Bookkeeping / Accounting Services">
                          <option value="Marked Financial Statements">Marked Financial Statements</option>
                          <option value="Quickbooks Financial Statements">Quickbooks Financial Statements</option>
                          <option value="Payroll">Payroll</option>
                          <option value="Sales Tax">Sales Tax</option>
                          <option value="Initial QB Setup">Initial QB Setup: Chart of Accounts & GL</option>
                          <option value="Audit Services">Audit Services</option>
                        </optgroup>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Invoice Amount</Form.Label>
                      <Form.Control
                        type="number"
                        name="invoiceAmount"
                        value={taskForm.invoiceAmount}
                        onChange={handleTaskFormChange}
                        placeholder="Enter Amount"
                        min="0"
                        step="0.01"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={taskForm.status}
                        onChange={handleTaskFormChange}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={taskForm.priority}
                        onChange={handleTaskFormChange}
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Assigned To</Form.Label>
                      <Form.Select
                        name="assignedTo"
                        value={taskForm.assignedTo}
                        onChange={handleTaskFormChange}
                        required
                      >
                        <option value="">Select user</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Due Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="dueDate"
                        value={taskForm.dueDate}
                        onChange={handleTaskFormChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => { setShowTaskModal(false); resetTaskForm(); }}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveTask}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default TaskManagement;