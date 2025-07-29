import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, ListGroup, Badge } from 'react-bootstrap';
import { FaEnvelope, FaPaperclip, FaCalendarAlt, FaUser, FaTasks } from 'react-icons/fa';

const TaskManager = () => {
  // Sample email data
  const [emails, setEmails] = useState([
    { 
      id: 1, 
      subject: 'Project Deadline Extension', 
      body: 'Team, we need to extend the deadline for Q3 deliverables due to...', 
      date: '2025-07-28', 
      attachments: ['specs.pdf'],
      read: false
    },
    { 
      id: 2, 
      subject: 'Client Meeting Notes', 
      body: 'Here are the notes from today\'s client meeting...', 
      date: '2025-07-27', 
      attachments: ['meeting_notes.docx', 'presentation.pptx'],
      read: true
    }
  ]);

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  
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
      created: new Date().toISOString().split('T')[0]
    };
    
    setTasks([...tasks, newTask]);
    setShowModal(false);
    setDeadline('');
    setAssignedTo('');
    
    // Mark email as read
    setEmails(emails.map(e => 
      e.id === selectedEmail.id ? {...e, read: true} : e
    ));
  };

  return (
    <Container fluid className="task-manager-system px-4 py-3">
      <header className="task-manager-header mb-4">
        <h1 className="task-manager-title">
          <FaTasks className="me-2" /> Outlook Task Manager
        </h1>
        <div className="task-manager-controls">
          <Button variant="outline-primary" className="task-manager-refresh">
            <FaEnvelope className="me-1" /> Refresh Emails
          </Button>
        </div>
      </header>

      <Row>
        {/* Email Section */}
        <Col md={5} className="email-integration-section mb-4">
          <Card className="email-card">
            <Card.Header className="email-card-header bg-primary text-white">
              <h3><FaEnvelope className="me-2" /> Outlook Emails</h3>
            </Card.Header>
            <Card.Body className="email-list-container p-0">
              <ListGroup variant="flush">
                {emails.map(email => (
                  <ListGroup.Item 
                    key={email.id} 
                    className={`email-list-item ${email.read ? '' : 'email-unread'}`}
                  >
                    <div className="email-item-header">
                      <h5 className="email-subject">{email.subject}</h5>
                      <span className="email-date">{email.date}</span>
                    </div>
                    <div className="email-preview">
                      {email.body.substring(0, 100)}...
                    </div>
                    <div className="email-attachments">
                      {email.attachments.map((file, idx) => (
                        <span key={idx} className="attachment-badge">
                          <FaPaperclip className="me-1" /> {file}
                        </span>
                      ))}
                    </div>
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      className="email-convert-btn mt-2"
                      onClick={() => handleConvertToTask(email)}
                    >
                      Convert to Task
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Task Section */}
        <Col md={7}>
          <Card className="task-manager-card">
            <Card.Header className="task-manager-card-header bg-info text-white">
              <h3><FaTasks className="me-2" /> Task Dashboard</h3>
            </Card.Header>
            <Card.Body className="task-grid-container">
              <Row xs={1} md={2} lg={3} className="g-4">
                {tasks.map(task => (
                  <Col key={task.id}>
                    <Card className="task-card h-100">
                      <Card.Header className={`task-card-header ${
                        task.status === 'Completed' ? 'bg-success' : 'bg-warning'
                      } text-white`}>
                        <div className="task-title-truncate">{task.title}</div>
                      </Card.Header>
                      <Card.Body>
                        <p className="task-description">{task.description.substring(0, 80)}...</p>
                        <div className="task-meta">
                          <div className="task-deadline">
                            <FaCalendarAlt className="me-1" /> 
                            {task.deadline}
                          </div>
                          <div className="task-assignee">
                            <FaUser className="me-1" /> 
                            {task.assignedTo}
                          </div>
                          <div className="task-status-badge">
                            <Badge bg={task.status === 'Completed' ? 'success' : 'warning'}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                        {task.attachments && task.attachments.length > 0 && (
                          <div className="task-attachments mt-2">
                            <FaPaperclip className="me-1" />
                            {task.attachments.map((file, idx) => (
                              <span key={idx} className="task-attachment-item">
                                {file}
                              </span>
                            ))}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {tasks.length === 0 && (
                <div className="task-placeholder text-center py-5">
                  <h4 className="text-muted">No tasks created yet</h4>
                  <p>Convert emails to tasks to get started</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Convert Email Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="task-conversion-modal-header">
          <Modal.Title>
            <FaTasks className="me-2" /> Create Task from Email
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="task-conversion-form">
          {selectedEmail && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Task Title</Form.Label>
                <Form.Control 
                  type="text" 
                  defaultValue={selectedEmail.subject}
                  className="task-title-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  defaultValue={selectedEmail.body}
                  className="task-description-input"
                />
              </Form.Group>

              {selectedEmail.attachments.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Attachments</Form.Label>
                  <div className="email-attachments-list">
                    {selectedEmail.attachments.map((file, idx) => (
                      <div key={idx} className="attachment-item">
                        <FaPaperclip className="me-1" />
                        {file}
                        <Button variant="link" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </Form.Group>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control 
                      type="date" 
                      className="task-deadline-input"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Assign To</Form.Label>
                    <Form.Select 
                      className="task-assign-select"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="">Select employee</option>
                      {employees.map((emp, idx) => (
                        <option key={idx} value={emp}>{emp}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            className="task-create-btn"
            onClick={handleCreateTask}
            disabled={!deadline || !assignedTo}
          >
            Create Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskManager;