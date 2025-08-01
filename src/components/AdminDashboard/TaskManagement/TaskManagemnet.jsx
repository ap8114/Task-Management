import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge, Container, Card, Row, Col, Toast } from 'react-bootstrap';
import './TaskManagement.css';
import axiosInstance from '../../../Utilities/axiosInstance';

const TaskManagement = () => {
  // State for tasks and users
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([
    // { id: 1, email: 'admin@example.com', name: 'Admin User', role: 'Admin', permissions: { view: true, edit: true, delete: true, assignedOnly: false } },
    // { id: 2, email: 'john@example.com', name: 'John Smith', role: 'Manager', permissions: { view: true, edit: true, delete: false, assignedOnly: false } },
    // { id: 3, email: 'sarah@example.com', name: 'Sarah Johnson', role: 'Developer', permissions: { view: true, edit: true, delete: false, assignedOnly: true } },
    // { id: 4, email: 'mike@example.com', name: 'Mike Brown', role: 'Developer', permissions: { view: true, edit: false, delete: false, assignedOnly: true } },
  ]);

  // Form states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [currentUserRole, setCurrentUserRole] = useState('Admin');

  // Form data
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium'
  });

  const [userForm, setUserForm] = useState({
    email: '',
    name: '',
    role: 'Developer',
    permissions: {
      view: true,
      edit: false,
      delete: false,
      assignedOnly: false
    }
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("tasks/getAllTasks");
      setTasks(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      showToastMessage('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  
  // Helper functions
  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'To Do',
      assignedTo: '',
      dueDate: '',
      priority: 'Medium'
    });
    setCurrentTask(null);
  };

  const resetUserForm = () => {
    setUserForm({
      email: '',
      name: '',
      role: 'Developer',
      permissions: {
        view: true,
        edit: false,
        delete: false,
        assignedOnly: false
      }
    });
    setCurrentUser(null);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Form handlers
  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('permissions.')) {
      const permissionField = name.split('.')[1];
      setUserForm(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setUserForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  // Task operations
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'To Do',
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'Medium'
    });
    setShowTaskModal(true);
  };

  const handleSaveTask = async () => {
    const { title, description, status, priority, assignedTo, dueDate } = taskForm;

    if (!title || !assignedTo) {
      showToastMessage("Title and Assigned To are required!");
      return;
    }

    const payload = {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate
    };

    try {
      let response;
      if (currentTask) {
        response = await axiosInstance.patch(`tasks/updateTask/${currentTask.id}`, payload);
      } else {
        response = await axiosInstance.post("tasks/addTask", payload);
      }

      showToastMessage(currentTask ?"Task created successfully!": "Task updated successfully!"  );
      setShowTaskModal(false);
      resetTaskForm();
      fetchTasks();
    } catch (error) {
      console.error("Error:", error);
      showToastMessage("Server error. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axiosInstance.delete(`tasks/deleteTask/${taskId}`);
        showToastMessage('Task deleted successfully!');
        fetchTasks();
      } catch (error) {
        console.error("Error:", error);
        showToastMessage("Failed to delete task");
      }
    }
  };

   useEffect(()=>{
fetchUser()
  },)

  const fetchUser =async()=>{
try {
  const response = await axiosInstance.get("user/getAllUsers");
  console.log(response);
  
  setUsers(response.data.data);

} catch (error) {
  console.error("field to fetch data", error)
}
  }
  // User operations
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setUserForm({
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: {
        view: user.permissions.view,
        edit: user.permissions.edit,
        delete: user.permissions.delete,
        assignedOnly: user.permissions.assignedOnly
      }
    });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (currentUser) {
      const updatedUsers = users.map(user =>
        user.id === currentUser.id ? { ...user, ...userForm } : user
      );
      setUsers(updatedUsers);
      showToastMessage('User updated successfully!');
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...userForm
      };
      setUsers([...users, newUser]);
      showToastMessage('User added successfully!');
    }
    setShowUserModal(false);
    resetUserForm();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      showToastMessage('User deleted successfully!');
    }
  };

  // Filter and utility functions
  const filteredTasks = tasks.filter(task => {
    const title = task.title || '';
    const description = task.description || '';
    const status = task.status || '';
    const priority = task.priority || '';
    const assignedTo = task.assignedTo || '';

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || status === filterStatus;
    const matchesPriority = filterPriority === 'All' || priority === filterPriority;

    const currentUserObj = users.filter(u => u.role === currentUserRole);
    const assignedOnlyFilter = currentUserObj?.permissions?.assignedOnly ?
      assignedTo === currentUserObj.email : true;

    return matchesSearch && matchesStatus && matchesPriority && assignedOnlyFilter;
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

  const hasPermission = (permission) => {
    const user = users.find(u => u.role === currentUserRole);
    return user ? user.permissions[permission] : false;
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
                  <Card.Text className="display-6">{tasks.filter(t => t.status === 'Done').length}</Card.Text>
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
                  <Card.Text className="display-6">{tasks.filter(t => t.status === 'In Progress').length}</Card.Text>
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
                  <Card.Text className="display-6">{tasks.filter(t => t.status === 'To Do').length}</Card.Text>
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
                  { (
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
                  )}
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
                      <th>Description</th>
                      <th>Assigned To</th>
                      <th>Due Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <tr key={task.id}>
                          <td>{task.title || 'N/A'}</td>
                          <td>{task.description || 'N/A'}</td>
                          <td>{users.find(u => u.email === task.assignedToName)?.name || task.assignedToName || 'N/A'}</td>
                          <td>{task.dueDate || 'N/A'}</td>
                          <td>
                            <Badge bg={getPriorityBadge(task.priority)}>
                              {task.priority || 'N/A'}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusBadge(task.status)}>
                              {task.status || 'N/A'}
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
                        <td colSpan="7" className="text-center">No tasks found</td>
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
                          <option key={user.id} value={user.email}>{user.name}</option>
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

          {/* User Modal */}
        

          {/* Toast Notification */}
         
        </Container>
      </div>
    </div>
  );
};

export default TaskManagement;