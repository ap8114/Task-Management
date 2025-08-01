import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Dropdown } from 'react-bootstrap';
import axiosInstance from '../../../Utilities/axiosInstance';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allTasks = [
    'Dashboard Redesign',
    'User Management',
    'Content Update',
    'Report Generation',
    'Bug Fixes',
    'API Integration'
  ];

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("user/getAllUsers");
      setUsers(res?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setError("Failed to fetch users. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleShowAdd = () => {
    setIsEditMode(false);
    setCurrentUser({
      name: '',
      email: '',
      role: 'Viewer',
      password: '', // Initialize password as empty string
      permissions: {
        can_view: true,
        can_edit: false,
        can_delete: false,
        only_assigned_tasks: false
      },
      assignedTasks: []
    });
    setShowModal(true);
  };

  const handleShowEdit = (user) => {
    setIsEditMode(true);
    // Don't include password in edit mode for security reasons
    const userToEdit = {
      ...user,
      password: '' // Reset password field in edit mode
    };
    setCurrentUser(userToEdit);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value
    });
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setCurrentUser({
      ...currentUser,
      permissions: {
        ...currentUser.permissions,
        [name]: checked
      }
    });
  };

  const handleTaskToggle = (task) => {
    const updatedTasks = currentUser.assignedTasks.includes(task)
      ? currentUser.assignedTasks.filter(t => t !== task)
      : [...currentUser.assignedTasks, task];

    setCurrentUser({
      ...currentUser,
      assignedTasks: updatedTasks
    });
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        // For edit, only send password if it's been changed
        const userToUpdate = { ...currentUser };
        if (!userToUpdate.password) {
          delete userToUpdate.password; // Remove password field if empty
        }
        
        await axiosInstance.patch(`user/updateUser/${currentUser.id}`, userToUpdate);
        setUsers(users.map(user => user.id === currentUser.id ? currentUser : user));
      } else {
        // For add, require password
        if (!currentUser.password) {
          setError("Password is required for new users");
          return;
        }
        
        const response = await axiosInstance.post("user/addUser", currentUser);
        setUsers([...users, response.data]);
      }
      handleClose();
      setError(null);
    } catch (error) {
      console.error("Failed to save user", error);
      setError("Failed to save user. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`user/deleteUser/${id}`);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error("Failed to delete user", error);
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  // Filter users based on role and search term
  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Container fluid className="py-4">
      <Row className="align-items-start align-items-md-center justify-content-between g-3 mb-3">
        <Col xs={12} md="auto">
          <h3 className="fw-bold text-dark mb-1">User Management</h3>
          <p className="text-muted mb-0">Manage staff users and their permissions</p>
        </Col>
        <Col xs={12} md="auto" className="text-md-end">
          <Button variant="primary" onClick={handleShowAdd} className="w-100 w-md-auto">
            <i className="bi bi-plus-lg"></i> Add New User
          </Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3 g-2 align-items-center">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Form.Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
                <option value="Office Manager">Office Manager</option>
                <option value="Staff Accountant">Staff Accountant</option>
                <option value="Staff Bookkeeper">Staff Bookkeeper</option>
                <option value="Staff CPA">Staff CPA</option>
                <option value="Student Intern">Student Intern</option>
                <option value="Support Staff">Support Staff</option>
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={3} className="text-md-end">
              <Badge bg="" text="dark" className="p-2 w-100 w-md-auto d-block text-center text-md-end">
                Total Users: {users?.length}
              </Badge>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Assigned Tasks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map(user => (
                  <tr key={user?.id}>
                    <td>{user?.name}</td>
                    <td>{user?.email}</td>
                    <td>
                      <Badge bg={
                        user?.role === 'Admin' ? 'danger' :
                        user?.role === 'Editor' ? 'warning' : 
                        user?.role === 'Office Manager' ? 'primary' :
                        user?.role === 'Staff CPA' ? 'info' : 'secondary'
                      }>
                        {user?.role}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {user?.permissions.can_view && <Badge bg="success">View</Badge>}
                        {user?.permissions.can_edit && <Badge bg="primary">Edit</Badge>}
                        {user?.permissions.can_delete && <Badge bg="danger">Delete</Badge>}
                        {user?.permissions.only_assigned_tasks && <Badge bg="secondary">Assigned Only</Badge>}
                      </div>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm">
                          {user?.assignedTasks?.length || 0} tasks
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {user?.assignedTasks?.length > 0 ? (
                            user?.assignedTasks.map(task => (
                              <Dropdown.Item key={task}>{task}</Dropdown.Item>
                            ))
                          ) : (
                            <Dropdown.Item>No tasks assigned</Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowEdit(user)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredUsers?.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={currentUser.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={currentUser.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={currentUser.password}
                      onChange={handleInputChange}
                      placeholder={isEditMode ? "Leave blank to keep current" : "Enter password"}
                      required={!isEditMode}
                    />
                    {isEditMode && (
                      <Form.Text className="text-muted">
                        Leave password blank to keep current password
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={currentUser.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                      <option value="Office Manager">Office Manager</option>
                      <option value="Staff Accountant">Staff Accountant</option>
                      <option value="Staff Bookkeeper">Staff Bookkeeper</option>
                      <option value="Staff CPA">Staff CPA</option>
                      <option value="Student Intern">Student Intern</option>
                      <option value="Support Staff">Support Staff</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Label>Permissions</Form.Label>
                  <div className="border p-3 rounded">
                    <Form.Check
                      type="checkbox"
                      id="can_view"
                      label="Can View"
                      name="can_view"
                      checked={currentUser.permissions.can_view}
                      onChange={handlePermissionChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="can_edit"
                      label="Can Edit"
                      name="can_edit"
                      checked={currentUser.permissions.can_edit}
                      onChange={handlePermissionChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="can_delete"
                      label="Can Delete"
                      name="can_delete"
                      checked={currentUser.permissions.can_delete}
                      onChange={handlePermissionChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="only_assigned_tasks"
                      label="Only Assigned Tasks"
                      name="only_assigned_tasks"
                      checked={currentUser.permissions.only_assigned_tasks}
                      onChange={handlePermissionChange}
                    />
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Label>Assigned Tasks</Form.Label>
                  <div className="border p-3 rounded">
                    <div className="d-flex flex-wrap gap-2">
                      {allTasks.map(task => (
                        <Form.Check
                          key={task}
                          type="checkbox"
                          id={`task-${task}`}
                          label={task}
                          checked={currentUser.assignedTasks.includes(task)}
                          onChange={() => handleTaskToggle(task)}
                          inline
                        />
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;