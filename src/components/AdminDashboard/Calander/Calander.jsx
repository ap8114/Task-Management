import React, { useState } from 'react';
import { Container, Row, Col, Button, Dropdown, Card, Badge, Modal, Form } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up the localizer by providing moment
const localizer = momentLocalizer(moment);

const TaskManagementCalendar = () => {
  // State for view type
  const [view, setView] = useState('month');
  // State for filter by employee
  const [employeeFilter, setEmployeeFilter] = useState('all');
  // State for filter by task status
  const [statusFilter, setStatusFilter] = useState('all');
  // State for modal
  const [showModal, setShowModal] = useState(false);
  // State for selected task
  const [selectedTask, setSelectedTask] = useState(null);
  // State for form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    employee: '',
    status: 'pending'
  });

  // Sample employees data
  const employees = [
    { id: 'emp1', name: 'John Doe' },
    { id: 'emp2', name: 'Jane Smith' },
    { id: 'emp3', name: 'Robert Johnson' },
    { id: 'emp4', name: 'Emily Davis' },
  ];

  // Sample tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Project Kickoff',
      description: 'Initial meeting with client',
      start: new Date(2023, 5, 1, 10, 0),
      end: new Date(2023, 5, 1, 11, 30),
      employee: 'emp1',
      status: 'completed'
    },
    {
      id: 2,
      title: 'UI Design Review',
      description: 'Review wireframes with design team',
      start: new Date(2023, 5, 3, 14, 0),
      end: new Date(2023, 5, 3, 15, 30),
      employee: 'emp2',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Development Sprint',
      description: 'Work on feature implementation',
      start: new Date(2023, 5, 5, 9, 0),
      end: new Date(2023, 5, 5, 17, 0),
      employee: 'emp3',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Client Demo',
      description: 'Show progress to client',
      start: new Date(2023, 5, 8, 13, 0),
      end: new Date(2023, 5, 8, 14, 0),
      employee: 'emp4',
      status: 'pending'
    },
  ]);

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    const employeeMatch = employeeFilter === 'all' || task.employee === employeeFilter;
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    return employeeMatch && statusMatch;
  });

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedTask(event);
    setFormData({
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      employee: event.employee,
      status: event.status
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTask) {
      // Update existing task
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id ? { ...task, ...formData } : task
      );
      setTasks(updatedTasks);
    } else {
      // Add new task
      const newTask = {
        id: tasks.length + 1,
        ...formData,
        start: new Date(formData.start),
        end: new Date(formData.end)
      };
      setTasks([...tasks, newTask]);
    }
    setShowModal(false);
    setSelectedTask(null);
  };

  // Handle slot selection (for adding new events)
  const handleSelectSlot = (slotInfo) => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      start: slotInfo.start,
      end: slotInfo.end,
      employee: '',
      status: 'pending'
    });
    setShowModal(true);
  };

  // Custom event component
  const EventComponent = ({ event }) => {
    const employee = employees.find(emp => emp.id === event.employee);
    const statusColors = {
      'completed': 'success',
      'in-progress': 'warning',
      'pending': 'danger'
    };

    return (
      <div className="p-1">
        <strong>{event.title}</strong>
        <div>
          <Badge pill bg={statusColors[event.status]} className="me-1">
            {event.status}
          </Badge>
          {employee && <small>{employee.name}</small>}
        </div>
      </div>
    );
  };

  return (
    <Container fluid className="py-4">
      <div>
        <h2 className="mb-3 fw-bold text-dark">Calendar</h2>
      </div>
      {/* Filters and Controls */}
      <Row className="mb-4 gy-3">
        {/* View Options */}
        <Col xs={12} md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="fs-6 fw-semibold">View Options</Card.Title>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {['day', 'week', 'month'].map((val) => (
                  <Button
                    key={val}
                    variant={view === val ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setView(val)}
                  >
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Filter by Employee */}
        <Col xs={12} md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="fs-6 fw-semibold">Filter by Employee</Card.Title>
              <Dropdown className="mt-2">
                <Dropdown.Toggle variant="outline-secondary" size="sm" className="w-100 text-start">
                  {employeeFilter === 'all'
                    ? 'All Employees'
                    : employees.find((e) => e.id === employeeFilter)?.name || 'Select Employee'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item onClick={() => setEmployeeFilter('all')}>All Employees</Dropdown.Item>
                  <Dropdown.Divider />
                  {employees.map((emp) => (
                    <Dropdown.Item
                      key={emp.id}
                      onClick={() => setEmployeeFilter(emp.id)}
                      active={employeeFilter === emp.id}
                    >
                      {emp.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
          </Card>
        </Col>

        {/* Filter by Status */}
        <Col xs={12} md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="fs-6 fw-semibold">Filter by Status</Card.Title>
              <Dropdown className="mt-2">
                <Dropdown.Toggle variant="outline-secondary" size="sm" className="w-100 text-start">
                  {statusFilter === 'all'
                    ? 'All Statuses'
                    : statusFilter.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item onClick={() => setStatusFilter('all')}>All Statuses</Dropdown.Item>
                  <Dropdown.Divider />
                  {['pending', 'in-progress', 'completed'].map((status) => (
                    <Dropdown.Item
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      active={statusFilter === status}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
          </Card>
        </Col>

        {/* Add Task Button */}
        <Col xs={12} md={6} lg={3}>
          <Card className="h-100">
            <Card.Body className="d-flex justify-content-center align-items-center">
              <Button
                variant="success"
                className="w-100"
                onClick={() => {
                  setSelectedTask(null);
                  setShowModal(true);
                }}
              >
                + Add New Task
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      {/* Calendar */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Calendar
                localizer={localizer}
                events={filteredTasks}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                view={view}
                onView={setView}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                components={{
                  event: EventComponent
                }}
                eventPropGetter={(event) => {
                  let backgroundColor = '';
                  switch (event.status) {
                    case 'completed':
                      backgroundColor = '#28a745';
                      break;
                    case 'in-progress':
                      backgroundColor = '#ffc107';
                      break;
                    case 'pending':
                      backgroundColor = '#dc3545';
                      break;
                    default:
                      backgroundColor = '#3174ad';
                  }
                  return { style: { backgroundColor } };
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Task Edit/Add Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmployee">
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Select
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formStart">
                  <Form.Label>Start Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="start"
                    value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEnd">
                  <Form.Label>End Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="end"
                    value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Pending"
                  name="status"
                  type="radio"
                  id="status-pending"
                  value="pending"
                  checked={formData.status === 'pending'}
                  onChange={handleInputChange}
                />
                <Form.Check
                  inline
                  label="In Progress"
                  name="status"
                  type="radio"
                  id="status-in-progress"
                  value="in-progress"
                  checked={formData.status === 'in-progress'}
                  onChange={handleInputChange}
                />
                <Form.Check
                  inline
                  label="Completed"
                  name="status"
                  type="radio"
                  id="status-completed"
                  value="completed"
                  checked={formData.status === 'completed'}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedTask ? 'Update Task' : 'Add Task'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TaskManagementCalendar;