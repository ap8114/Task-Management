import React, { useState } from 'react';
import { Table, Button, Form, Modal, Navbar, Container, Card, ProgressBar } from 'react-bootstrap';
import { FaFilePdf, FaFileExcel, FaEnvelope, FaSearch, FaFilter } from 'react-icons/fa';

const Reports = () => {
  // Mock data for tasks
  const initialTasks = [
    {
      id: 1,
      date: '2023-10-15',
      title: 'Design Homepage',
      status: 'Completed',
      duration: 8,
      amount: 1200,
      delay: 0
    },
    {
      id: 2,
      date: '2023-10-16',
      title: 'API Integration',
      status: 'Pending',
      duration: 6,
      amount: 900,
      delay: 2
    },
    {
      id: 3,
      date: '2023-10-17',
      title: 'Database Optimization',
      status: 'Pending',
      duration: 4,
      amount: 750,
      delay: 1
    },
    {
      id: 4,
      date: '2023-10-18',
      title: 'User Testing',
      status: 'Completed',
      duration: 7,
      amount: 1050,
      delay: 0
    }
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [emailData, setEmailData] = useState({
    recipient: 'admin@company.com',
    subject: 'Daily Task Report',
    message: 'Please find attached the daily task report.'
  });

  // Stats calculation
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const completionRate = (completedTasks / tasks.length) * 100;
  const totalRevenue = tasks.reduce((sum, task) => sum + task.amount, 0);

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.date.includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExport = (format) => {
    alert(`Exporting report to ${format.toUpperCase()} format`);
    // Actual implementation would use libraries like jsPDF or ExcelJS
  };

  const handleEmailSend = () => {
    alert(`Report sent to ${emailData.recipient}`);
    setShowEmailModal(false);
  };

  return (
    <div className="p-3">
      {/* Navigation Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Report</h3>

      </div>

      {/* Main Content */}
      <div>
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <Card className=" shadow-sm h-100">
              <Card.Body>
                <Card.Title>Total Tasks</Card.Title>
                <Card.Text className="display-6">{tasks.length}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3 mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Completed</Card.Title>
                <Card.Text className="display-6">{completedTasks}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3 mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Pending</Card.Title>
                <Card.Text className="display-6">{pendingTasks}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-3 mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Total Revenue</Card.Title>
                <Card.Text className="display-6">${totalRevenue}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Action Bar */}

        {/* Status Filter */}
        <div className="mb-3">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center gap-3">
            {/* Left side - Filters + Search */}
            <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2">
              {/* Status Filter */}
              <Form.Select
                style={{ width: "180px" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </Form.Select>

              {/* Search Bar */}
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

            {/* Right side - Export/Email Buttons */}
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
            <thead className="">
              <tr>
                <th>Date</th>
                <th>Task Title</th>
                <th>Status</th>
                <th>Duration (Hours)</th>
                <th>Invoice Amount</th>
                <th>Delay Days</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.date}</td>
                  <td>{task.title}</td>
                  <td>
                    <span
                      className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>{task.duration}</td>
                  <td>${task.amount}</td>
                  <td>
                    {task.delay > 0 ? (
                      <span className="badge bg-danger">{task.delay} days</span>
                    ) : (
                      <span className="badge bg-success">On time</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-5">
            <h4>No tasks found</h4>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Email Modal */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Email Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Recipient</Form.Label>
              <Form.Select
                value={emailData.recipient}
                onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
              >
                <option value="admin@company.com">Admin</option>
                <option value="client@company.com">Client</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEmailSend}>
            Send Report
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reports;