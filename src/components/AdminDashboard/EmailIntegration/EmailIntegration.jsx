import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, ListGroup, Badge, ProgressBar, Dropdown } from 'react-bootstrap';
import { FaEnvelope, FaPaperclip, FaCalendarAlt, FaUser, FaTasks, FaCheck, FaTrash, FaFilter, FaSearch, FaEllipsisV } from 'react-icons/fa';

const EmailIntegration = () => {
  // Sample email data
  const [emails, setEmails] = useState([
    {
      id: 1,
      subject: 'Project Deadline Extension',
      body: 'Team, we need to extend the deadline for Q3 deliverables due to unexpected delays in the development phase. Please review the attached specifications and provide your feedback.',
      date: '2025-07-28',
      sender: 'manager@company.com',
      attachments: ['specs.pdf'],
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      subject: 'Client Meeting Notes',
      body: 'Here are the notes from today\'s client meeting regarding the new website redesign. Key points include color scheme preferences and requested features.',
      date: '2025-07-27',
      sender: 'client@clientco.com',
      attachments: ['meeting_notes.docx', 'presentation.pptx'],
      read: true,
      priority: 'medium'
    },
    {
      id: 3,
      subject: 'Weekly Team Sync',
      body: 'Reminder about our weekly sync meeting tomorrow at 10 AM. Please prepare your updates and blockers.',
      date: '2025-07-26',
      sender: 'team@company.com',
      attachments: [],
      read: false,
      priority: 'low'
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review Project Specifications',
      description: 'Review the updated project specifications document and provide feedback by EOD.',
      attachments: ['specs_v2.pdf'],
      deadline: '2025-08-05',
      assignedTo: 'Alex Johnson',
      status: 'In Progress',
      created: '2025-07-25',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Prepare Client Presentation',
      description: 'Create slides for the upcoming client presentation covering project milestones.',
      attachments: [],
      deadline: '2025-08-10',
      assignedTo: 'Sam Rivera',
      status: 'Pending',
      created: '2025-07-20',
      priority: 'medium'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const employees = ['Alex Johnson', 'Sam Rivera', 'Taylor Chen', 'Jordan Smith'];

  const handleConvertToTask = (email) => {
    setSelectedEmail(email);
    setShowModal(true);
  };

  const handleCreateTask = () => {
    if (!selectedEmail) return;

    const newTask = {
      id: tasks.length + 1,
      title: selectedEmail.subject,
      description: selectedEmail.body,
      attachments: selectedEmail.attachments,
      deadline,
      assignedTo,
      status: 'Pending',
      created: new Date().toISOString().split('T')[0],
      priority
    };

    setTasks([...tasks, newTask]);
    setShowModal(false);
    setDeadline('');
    setAssignedTo('');
    setPriority('medium');

    // Mark email as read
    setEmails(emails.map(e =>
      e.id === selectedEmail.id ? { ...e, read: true } : e
    ));
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && task.status === 'Pending') ||
                      (activeTab === 'inProgress' && task.status === 'In Progress') ||
                      (activeTab === 'completed' && task.status === 'Completed');
    return matchesSearch && matchesTab;
  });

  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="email-integration-system px-3 px-sm-4 py-3">
      {/* Header Section */}
      <header className="email-integration-header mb-4">
        <Row className="align-items-center">
          <Col xs={8} sm={6} md={6} lg={6}>
            <h2 className="mb-0 fw-bold text-primary">Task Manager Pro</h2>
            <p className="text-muted mb-0 d-none d-sm-block">Convert emails to tasks and manage your workflow</p>
          </Col>
          <Col xs={4} sm={6} md={6} lg={6} className="text-end">
            <div className="d-flex justify-content-end align-items-center">
              <Form.Control
                type="search"
                placeholder="Search tasks..."
                className="me-2 d-none d-md-block"
                style={{ width: '200px' }}
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
                  <Dropdown.Item onClick={() => setShowMobileMenu(!showMobileMenu)}>
                    <FaFilter className="me-2" />
                    Filter Tasks
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="primary" className="d-none d-md-flex align-items-center">
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
                  <small className="text-muted">{completedTasks} of {tasks.length} tasks completed</small>
                </div>
                <div style={{ width: '200px' }}>
                  <ProgressBar now={completionPercentage} label={`${completionPercentage}%`} variant="success" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row className="g-3">
        {/* Email Section - Full width on mobile, then 5 columns on md+ */}
        <Col xs={12} md={5}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><FaEnvelope className="me-2 text-primary" /> Inbox</h5>
                <Badge bg="primary">{emails.length} emails</Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <ListGroup variant="flush">
                {emails.map(email => (
                  <ListGroup.Item
                    key={email.id}
                    className={`p-2 p-sm-3 ${email.read ? '' : 'bg-light'} border-bottom`}
                    action
                    onClick={() => handleConvertToTask(email)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1 mb-sm-2">
                      <div className="d-flex align-items-center">
                        <div className={`priority-indicator ${email.priority}`}></div>
                        <h6 className={`mb-0 ${email.read ? '' : 'fw-bold'} text-truncate`} style={{ maxWidth: '200px' }}>
                          {email.subject}
                        </h6>
                      </div>
                      <small className="text-muted">{email.date}</small>
                    </div>
                    <p className="text-muted mb-1 mb-sm-2 text-truncate">{email.body.substring(0, 80)}...</p>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                      <div className="mb-1 mb-sm-0">
                        {email.attachments.map((file, idx) => (
                          <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
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
                        <span className="d-none d-sm-inline">Convert to Task</span>
                        <span className="d-sm-none">Convert</span>
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Task Section - Full width on mobile, then 7 columns on md+ */}
        <Col xs={12} md={7}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h5 className="mb-2 mb-md-0"><FaTasks className="me-2 text-primary" /> Task Dashboard</h5>
                <div className={`d-flex flex-wrap ${showMobileMenu ? '' : 'd-none d-md-flex'}`}>
                  <Button
                    variant={activeTab === 'all' ? 'primary' : 'outline-primary'}
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={activeTab === 'pending' ? 'primary' : 'outline-primary'}
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => setActiveTab('pending')}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={activeTab === 'inProgress' ? 'primary' : 'outline-primary'}
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => setActiveTab('inProgress')}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={activeTab === 'completed' ? 'primary' : 'outline-primary'}
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body style={{ minHeight: '400px', maxHeight: '600px', overflowY: 'auto' }}>
              {filteredTasks.length > 0 ? (
                <Row xs={1} sm={1} md={1} lg={2} className="g-3">
                  {filteredTasks.map(task => (
                    <Col key={task.id}>
                      <Card className={`border-${getPriorityColor(task.priority)} border-start border-3 h-100`}>
                        <Card.Body className="d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h5 className="mb-1 text-truncate" style={{ maxWidth: '200px' }}>{task.title}</h5>
                              <div className="d-flex flex-wrap">
                                <Badge bg={getPriorityColor(task.priority)} className="me-2 mb-1">
                                  {task.priority}
                                </Badge>
                                <Badge bg={task.status === 'Completed' ? 'success' : 
                                           task.status === 'In Progress' ? 'info' : 'warning'} className="mb-1">
                                  {task.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="me-1 mb-1"
                                onClick={() => handleTaskStatusChange(task.id, 'Completed')}
                                disabled={task.status === 'Completed'}
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
                          <p className="text-muted mb-3 flex-grow-1">{task.description.substring(0, 100)}...</p>
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
                            </div>
                            <div>
                              {task.attachments.map((file, idx) => (
                                <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                                  <FaPaperclip className="me-1" /> 
                                  <span className="d-none d-sm-inline">{file}</span>
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
                    style={{ width: '120px', opacity: 0.7 }}
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center">
            <FaTasks className="me-2 text-primary" /> 
            <div>
              <h5 className="mb-0">Create Task from Email</h5>
              <small className="text-muted">Convert email to actionable task</small>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmail && (
            <Form>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={selectedEmail.subject}
                      className="border-primary"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="border-primary"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  defaultValue={selectedEmail.body}
                  className="border-primary"
                />
              </Form.Group>

              {selectedEmail.attachments.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Attachments</Form.Label>
                  <div className="p-2 bg-light rounded">
                    {selectedEmail.attachments.map((file, idx) => (
                      <div key={idx} className="d-flex align-items-center mb-2">
                        <FaPaperclip className="me-2 text-muted" />
                        <span className="me-3 text-truncate" style={{ maxWidth: '200px' }}>{file}</span>
                        <Button variant="outline-primary" size="sm">Preview</Button>
                      </div>
                    ))}
                  </div>
                </Form.Group>
              )}

              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                      type="date"
                      className="border-primary"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Assign To</Form.Label>
                    <Form.Select
                      className="border-primary"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="">Select team member</option>
                      {employees.map((emp, idx) => (
                        <option key={idx} value={emp}>{emp}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateTask}
            disabled={!deadline || !assignedTo}
          >
            Create Task
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
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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