import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge, Dropdown, Navbar, Nav, Container, Card, Row, Col, Toast } from 'react-bootstrap';
import './TaskManagement.css';

const TaskManagemnet = () => {
    // State for tasks
    const [tasks, setTasks] = useState([
      { id: 1, title: 'Complete project proposal', description: 'Finish the proposal document for client review', status: 'In Progress', assignedTo: 'john@example.com', dueDate: '2023-06-15', priority: 'High' },
      { id: 2, title: 'Fix login issue', description: 'Users unable to login with Google accounts', status: 'To Do', assignedTo: 'sarah@example.com', dueDate: '2023-06-10', priority: 'Critical' },
      { id: 3, title: 'Update documentation', description: 'Update API documentation for new endpoints', status: 'Done', assignedTo: 'mike@example.com', dueDate: '2023-05-28', priority: 'Medium' },
    ]);
  
    // State for users
    const [users, setUsers] = useState([
      { id: 1, email: 'admin@example.com', name: 'Admin User', role: 'Admin', permissions: { view: true, edit: true, delete: true, assignedOnly: false } },
      { id: 2, email: 'john@example.com', name: 'John Smith', role: 'Manager', permissions: { view: true, edit: true, delete: false, assignedOnly: false } },
      { id: 3, email: 'sarah@example.com', name: 'Sarah Johnson', role: 'Developer', permissions: { view: true, edit: true, delete: false, assignedOnly: true } },
      { id: 4, email: 'mike@example.com', name: 'Mike Brown', role: 'Developer', permissions: { view: true, edit: false, delete: false, assignedOnly: true } },
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
    const [currentUserRole, setCurrentUserRole] = useState('Admin'); // Simulated logged-in user
  
    // Task form
    const [taskForm, setTaskForm] = useState({
      title: '',
      description: '',
      status: 'To Do',
      assignedTo: '',
      dueDate: '',
      priority: 'Medium'
    });
  
    // User form
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
  
    // Reset task form
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
  
    // Reset user form
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
  
    // Handle task form changes
    const handleTaskFormChange = (e) => {
      const { name, value } = e.target;
      setTaskForm({
        ...taskForm,
        [name]: value
      });
    };
  
    // Handle user form changes
    const handleUserFormChange = (e) => {
      const { name, value, type, checked } = e.target;
  
      if (name.startsWith('permissions.')) {
        const permissionField = name.split('.')[1];
        setUserForm({
          ...userForm,
          permissions: {
            ...userForm.permissions,
            [permissionField]: type === 'checkbox' ? checked : value
          }
        });
      } else {
        setUserForm({
          ...userForm,
          [name]: type === 'checkbox' ? checked : value
        });
      }
    };
  
    // Open task modal for editing
    const handleEditTask = (task) => {
      setCurrentTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        status: task.status,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        priority: task.priority
      });
      setShowTaskModal(true);
    };
  
    // Open user modal for editing
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
  
    // Save task
    const handleSaveTask = () => {
      if (currentTask) {
        // Update existing task
        const updatedTasks = tasks.map(task =>
          task.id === currentTask.id ? { ...task, ...taskForm } : task
        );
        setTasks(updatedTasks);
        showToastMessage('Task updated successfully!');
      } else {
        // Add new task
        const newTask = {
          id: Math.max(...tasks.map(t => t.id), 0) + 1,
          ...taskForm
        };
        setTasks([...tasks, newTask]);
        showToastMessage('Task added successfully!');
      }
      setShowTaskModal(false);
      resetTaskForm();
    };
  
    // Save user
    const handleSaveUser = () => {
      if (currentUser) {
        // Update existing user
        const updatedUsers = users.map(user =>
          user.id === currentUser.id ? { ...user, ...userForm } : user
        );
        setUsers(updatedUsers);
        showToastMessage('User updated successfully!');
      } else {
        // Add new user
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
  
    // Delete task
    const handleDeleteTask = (taskId) => {
      if (window.confirm('Are you sure you want to delete this task?')) {
        setTasks(tasks.filter(task => task.id !== taskId));
        showToastMessage('Task deleted successfully!');
      }
    };
  
    // Delete user
    const handleDeleteUser = (userId) => {
      if (window.confirm('Are you sure you want to delete this user?')) {
        setUsers(users.filter(user => user.id !== userId));
        showToastMessage('User deleted successfully!');
      }
    };
  
    // Show toast message
    const showToastMessage = (message) => {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };
  
    // Filter tasks based on search and filters
    const filteredTasks = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
  
      // If current user can only see assigned tasks, filter accordingly
      const currentUserObj = users.find(u => u.role === currentUserRole);
      const assignedOnlyFilter = currentUserObj?.permissions?.assignedOnly ?
        task.assignedTo === currentUserObj.email : true;
  
      return matchesSearch && matchesStatus && matchesPriority && assignedOnlyFilter;
    });
  
    // Get priority badge color
    const getPriorityBadge = (priority) => {
      switch (priority) {
        case 'Critical': return 'danger';
        case 'High': return 'warning';
        case 'Medium': return 'primary';
        case 'Low': return 'success';
        default: return 'secondary';
      }
    };
  
    // Get status badge color
    const getStatusBadge = (status) => {
      switch (status) {
        case 'Done': return 'success';
        case 'In Progress': return 'primary';
        case 'To Do': return 'secondary';
        default: return 'light';
      }
    };
  
    // Check if current user has permission
    const hasPermission = (permission) => {
      const user = users.find(u => u.role === currentUserRole);
      return user ? user.permissions[permission] : false;
    };
  

  return (
    <div className="task-management">
      {/* Header */}
      <Row className="align-items-center mb-4 p-3">
        <Col>
          <h3 className="mb-0">Task Management</h3>
        </Col>
      </Row>
   <div className="task-management-system">
      {/* Navigation */}
      <Container>
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-white bg-primary">
              <Card.Body>
                <Card.Title>Total Tasks</Card.Title>
                <Card.Text className="display-6">{tasks.length}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-success">
              <Card.Body>
                <Card.Title>Completed</Card.Title>
                <Card.Text className="display-6">{tasks.filter(t => t.status === 'Done').length}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-warning">
              <Card.Body>
                <Card.Title>In Progress</Card.Title>
                <Card.Text className="display-6">{tasks.filter(t => t.status === 'In Progress').length}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-secondary">
              <Card.Body>
                <Card.Title>Pending</Card.Title>
                <Card.Text className="display-6">{tasks.filter(t => t.status === 'To Do').length}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters and Actions */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="All">All Priority</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Col>
              <Col md={4} className="text-end">
                {hasPermission('edit') && (
                  <Button
                    variant="primary"
                    onClick={() => { resetTaskForm(); setShowTaskModal(true); }}
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
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{users.find(u => u.email === task.assignedTo)?.name || task.assignedTo}</td>
                        <td>{task.dueDate}</td>
                        <td>
                          <Badge bg={getPriorityBadge(task.priority)}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(task.status)}>
                            {task.status}
                          </Badge>
                        </td>
                        <td>
                          {hasPermission('edit') && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditTask(task)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                          )}
                          {hasPermission('delete') && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          )}
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
        <Modal show={showUserModal} onHide={() => { setShowUserModal(false); resetUserForm(); }}>
          <Modal.Header closeButton>
            <Modal.Title>{currentUser ? 'Edit User' : 'Add New User'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  required
                  disabled={!!currentUser}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={userForm.name}
                  onChange={handleUserFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={userForm.role}
                  onChange={handleUserFormChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Permissions</Form.Label>
                <div className="border p-3 rounded">
                  <Form.Check
                    type="checkbox"
                    label="Can View Tasks"
                    name="permissions.view"
                    checked={userForm.permissions.view}
                    onChange={handleUserFormChange}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Can Edit Tasks"
                    name="permissions.edit"
                    checked={userForm.permissions.edit}
                    onChange={handleUserFormChange}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Can Delete Tasks"
                    name="permissions.delete"
                    checked={userForm.permissions.delete}
                    onChange={handleUserFormChange}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Only See Assigned Tasks"
                    name="permissions.assignedOnly"
                    checked={userForm.permissions.assignedOnly}
                    onChange={handleUserFormChange}
                  />
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {currentUser && (
              <Button variant="danger" onClick={() => { handleDeleteUser(currentUser.id); setShowUserModal(false); }} className="me-auto">
                Delete User
              </Button>
            )}
            <Button variant="secondary" onClick={() => { setShowUserModal(false); resetUserForm(); }}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveUser}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Users Table (only visible to admins/managers) */}
        {hasPermission('edit') && (
          <Modal size="lg" show={showUserModal} onHide={() => setShowUserModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>User Management</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Permissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        {user.permissions.view && <Badge bg="info" className="me-1">View</Badge>}
                        {user.permissions.edit && <Badge bg="warning" className="me-1">Edit</Badge>}
                        {user.permissions.delete && <Badge bg="danger" className="me-1">Delete</Badge>}
                        {user.permissions.assignedOnly && <Badge bg="secondary">Assigned Only</Badge>}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditUser(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        {hasPermission('delete') && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => { resetUserForm(); setShowUserModal(true); }}>
                Add New User
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Toast Notification */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </Container>
    </div>
    </div>
  );
};

export default TaskManagemnet;