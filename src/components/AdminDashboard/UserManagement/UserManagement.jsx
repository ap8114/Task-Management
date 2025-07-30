import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Dropdown } from 'react-bootstrap';

const UserManagement = () => {
  // Sample initial data
const initialUsers = [
  {
    id: 1,
    name: 'Angela Hongo',
    email: 'angela.hongo@example.com',
    role: 'Office Manager',
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      onlyAssignedTasks: false
    },
    assignedTasks: ['Scheduling', 'Client Coordination']
  },
  {
    id: 2,
    name: 'Mary White',
    email: 'mary.white@example.com',
    role: 'Staff Accountant',
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: false,
      onlyAssignedTasks: true
    },
    assignedTasks: ['Tax Filing', 'Ledger Management']
  },
  {
    id: 3,
    name: 'James Bass',
    email: 'james.bass@example.com',
    role: 'Staff Bookkeeper',
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: false,
      onlyAssignedTasks: true
    },
    assignedTasks: ['Daily Transactions', 'Bank Reconciliation']
  },
  {
    id: 4,
    name: 'Theresa Brizzi',
    email: 'theresa.brizzi@example.com',
    role: 'Staff Accountant',
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: false,
      onlyAssignedTasks: true
    },
    assignedTasks: ['Payroll', 'Financial Statements']
  },
  {
    id: 5,
    name: 'Irene NDang',
    email: 'irene.ndang@example.com',
    role: 'Staff CPA',
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      onlyAssignedTasks: false
    },
    assignedTasks: ['Client Audits', 'Tax Planning']
  },
  {
    id: 6,
    name: 'Desiray Owens',
    email: 'desiray.owens@example.com',
    role: 'Student Intern',
    permissions: {
      canView: true,
      canEdit: false,
      canDelete: false,
      onlyAssignedTasks: true
    },
    assignedTasks: ['Document Filing', 'Data Entry']
  },
  {
    id: 7,
    name: 'Lyniah Chappel',
    email: 'lyniah.chappel@example.com',
    role: 'Student Intern',
    permissions: {
      canView: true,
      canEdit: false,
      canDelete: false,
      onlyAssignedTasks: true
    },
    assignedTasks: ['Research Tasks', 'Support Staff']
  },
  {
    id: 8,
    name: 'Additional Staff #1',
    email: 'staff1@example.com',
    role: 'Support Staff',
    permissions: {
      canView: true,
      canEdit: false,
      canDelete: false,
      onlyAssignedTasks: true
    },
    assignedTasks: ['Assisting Team']
  },
  {
    id: 9,
    name: 'Additional Staff #2',
    email: 'staff2@example.com',
    role: 'Support Staff',
    permissions: {
      canView: true,
      canEdit: false,
      canDelete: false,
      onlyAssignedTasks: true
    },
    assignedTasks: ['Filing', 'Support']
  }
];


  const allTasks = [
    'Dashboard Redesign',
    'User Management',
    'Content Update',
    'Report Generation',
    'Bug Fixes',
    'API Integration'
  ];

  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleClose = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleShowAdd = () => {
    setIsEditMode(false);
    setCurrentUser({
      id: users.length + 1,
      name: '',
      email: '',
      role: 'Viewer',
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        onlyAssignedTasks: false
      },
      assignedTasks: []
    });
    setShowModal(true);
  };

  const handleShowEdit = (user) => {
    setIsEditMode(true);
    setCurrentUser(JSON.parse(JSON.stringify(user)));
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

  const handleSave = () => {
    if (isEditMode) {
      setUsers(users.map(user => user.id === currentUser.id ? currentUser : user));
    } else {
      setUsers([...users, currentUser]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

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
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={3} className="text-md-end">
              <Badge bg="" text="dark" className="p-2 w-100 w-md-auto d-block text-center text-md-end">
                Total Users: {filteredUsers.length}
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
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={
                        user.role === 'Admin' ? 'danger' :
                          user.role === 'Editor' ? 'warning' : 'info'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {user.permissions.canView && <Badge bg="success">View</Badge>}
                        {user.permissions.canEdit && <Badge bg="primary">Edit</Badge>}
                        {user.permissions.canDelete && <Badge bg="danger">Delete</Badge>}
                        {user.permissions.onlyAssignedTasks && <Badge bg="secondary">Assigned Only</Badge>}
                      </div>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm">
                          {user.assignedTasks.length} tasks
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {user.assignedTasks.length > 0 ? (
                            user.assignedTasks.map(task => (
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
                {filteredUsers.length === 0 && (
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
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={currentUser.role}
                      onChange={handleInputChange}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
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
                      id="canView"
                      label="Can View"
                      name="canView"
                      checked={currentUser.permissions.canView}
                      onChange={handlePermissionChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="canEdit"
                      label="Can Edit"
                      name="canEdit"
                      checked={currentUser.permissions.canEdit}
                      onChange={handlePermissionChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="canDelete"
                      label="Can Delete"
                      name="canDelete"
                      checked={currentUser.permissions.canDelete}
                      onChange={handlePermissionChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="onlyAssignedTasks"
                      label="Only Assigned Tasks"
                      name="onlyAssignedTasks"
                      checked={currentUser.permissions.onlyAssignedTasks}
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