import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Card, Spinner, Alert } from 'react-bootstrap';
import { FaFilePdf, FaFileExcel, FaEnvelope, FaSearch } from 'react-icons/fa';
import axiosInstance from '../../../Utilities/axiosInstance';

const Reports = () => {
  const [emailData, setEmailData] = useState({
    recipient: 'admin@company.com',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get('/tasks/getAllTasks');
        if (response.data.status === 'success') {
          setTasks(response.data.data);
        } else {
          setApiError(response.data.message || 'Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setApiError(error.response?.data?.message || 'Failed to fetch tasks. Please try again.');
      } finally {
        setApiLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Stats calculation
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const pendingTasks = tasks.filter(task => task.status !== 'Done').length;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.dueDate && task.dueDate.includes(searchTerm));
    const matchesStatus = filterStatus === 'All' ||
      (filterStatus === 'Completed' ? task.status === 'Done' : task.status !== 'Done');
    return matchesSearch && matchesStatus;
  });

  const handleExport = (format) => {
    alert(`Exporting report to ${format.toUpperCase()} format`);
    // Actual implementation would use libraries like jsPDF or ExcelJS
  };

  const handleEmailSend = async () => {
    if (!emailData.subject.trim() || !emailData.message.trim()) {
      setError('Subject and message are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        recipient: emailData.recipient === 'admin@company.com' ? 'Project Manager' : 'Client',
        subject: emailData.subject,
        message: emailData.message
      };

      const response = await axiosInstance.post('/email/addEmailReport', payload);

      if (response.data.status === 'success') {
        setSuccess(true);
        setEmailData({
          recipient: 'admin@company.com',
          subject: '',
          message: ''
        });
        setTimeout(() => {
          setShowEmailModal(false);
          setSuccess(false);
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError(error.response?.data?.message || 'Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (apiLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="alert alert-danger">
        {apiError}
        <Button variant="link" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Report</h3>
      </div>

      <div>
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Total Tasks</Card.Title>
                <Card.Text className="display-6">{tasks.length}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3 mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>In Progress</Card.Title>
                <Card.Text className="display-6">
                  {tasks.filter(task => task.status === 'In Progress').length}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3 mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>To Do</Card.Title>
                <Card.Text className="display-6">
                  {tasks.filter(task => task.status === 'To Do').length}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3 mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Completed</Card.Title>
                <Card.Text className="display-6">
                  {tasks.filter(task => task.status === 'Completed').length}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-3">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center gap-3">
            <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2">
              <Form.Select
                style={{ width: "180px" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="To Do">To Do</option>
                <option value="Done">Completed</option>
              </Form.Select>

              <Form className="d-flex flex-grow-1">
                <Form.Control
                  type="search"
                  placeholder="Search tasks..."
                  className="me-2"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary">
                  <FaSearch />
                </Button>
              </Form>
            </div>

            <div className="d-flex flex-wrap flex-md-nowrap justify-content-end align-items-center gap-2">
              <Button
                variant="outline-primary"
                onClick={() => handleExport('pdf')}
                className="flex-fill flex-md-grow-0"
              >
                <FaFilePdf className="me-1" /> PDF
              </Button>
              <Button
                variant="outline-success"
                onClick={() => handleExport('excel')}
                className="flex-fill flex-md-grow-0"
              >
                <FaFileExcel className="me-1" /> Excel
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowEmailModal(true)}
                className="flex-fill flex-md-grow-0"
              >
                <FaEnvelope className="me-1" /> Email Report
              </Button>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="table-responsive">
          <Table striped bordered hover className="shadow-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <span
                      className={`badge ${task.status === 'Completed'
                        ? 'bg-success'
                        : task.status === 'To Do'
                          ? 'bg-warning'
                          : task.status === 'In Progress'
                            ? 'bg-info'
                            : 'bg-secondary' // fallback for unknown status
                        }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${task.priority === 'High' ? 'bg-danger' :
                      task.priority === 'Medium' ? 'bg-warning' : 'bg-info'
                      }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.assignedToName || `User ${task.assignedTo}`}</td>
                  <td>{task.dueDate || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-5">
            <h4>No tasks found</h4>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Email Modal */}
      <Modal show={showEmailModal} onHide={() => {
        setShowEmailModal(false);
        setError(null);
        setSuccess(false);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Email Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Email sent successfully!</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Recipient</Form.Label>
              <Form.Select
                value={emailData.recipient}
                onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
                disabled={loading}
              >
                <option value="admin@company.com">Admin (Project Manager)</option>
                <option value="client@company.com">Client</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                disabled={loading}
                placeholder="Enter email subject"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                disabled={loading}
                placeholder="Enter your message"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEmailModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEmailSend}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Sending...</span>
              </>
            ) : (
              'Send Report'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reports;