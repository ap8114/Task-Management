import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Dropdown, Card, Badge, Modal, Form } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import axiosInstance from '../../../Utilities/axiosInstance';

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
    assignedTo: '',
    status: 'Pending'
  });
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for employees
  const [employees, setEmployees] = useState([]);
  // State for tasks
  const [tasks, setTasks] = useState([]);

  // API base URL

  // Fetch employees and tasks on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employees
        const employeesResponse = await axiosInstance.get("user/getAllUsers");
        setEmployees(employeesResponse.data?.data || []);
        
        // Fetch tasks
        const tasksResponse = await axiosInstance.get("employeeTask/getAllEmployeeTasks");
       
        
        const formattedTasks = (tasksResponse.data?.data || []).map(task => ({
          ...task,
          id: task._id || Math.random().toString(36).substr(2, 9),
          start: task.startDateTime ? new Date(task.startDateTime) : new Date(),
          end: task.endDateTime ? new Date(task.endDateTime) : new Date(),
          employee: task.assignedTo ? task.assignedTo.toString() : '',
          status: task.status || 'Pending'
        }));
        setTasks(formattedTasks);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    const employeeMatch = employeeFilter === 'all' || task.employee === employeeFilter;
    const statusMatch = statusFilter === 'all' || 
                       (task.status && task.status.toLowerCase() === statusFilter.toLowerCase());
    return employeeMatch && statusMatch;
  });

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedTask(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      start: event.start || new Date(),
      end: event.end || new Date(),
      assignedTo: event.assignedTo || '',
      status: event.status || 'Pending'
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        startDateTime: moment(formData.start).format('YYYY-MM-DD'),
        endDateTime: moment(formData.end).format('YYYY-MM-DD'),
        status: formData.status
      };

      if (selectedTask) {
        // Update existing task
        await axiosInstance.patch(`employeeTask/updateEmployeeTask/${selectedTask.id}`, taskData);
        const updatedTasks = tasks.map(task =>
          task.id === selectedTask.id ? { 
            ...task, 
            ...taskData,
            start: new Date(taskData.startDateTime),
            end: new Date(taskData.endDateTime),
            employee: taskData.assignedTo ? taskData.assignedTo.toString() : ''
          } : task
        );
        setTasks(updatedTasks);
      } else {
        // Add new task
        const response = await axiosInstance.post("employeeTask/addEmployeeTask", taskData);
        const newTask = {
          ...response.data?.data,
          id: response.data?.data?._id || Math.random().toString(36).substr(2, 9),
          start: response.data?.data?.startDateTime ? new Date(response.data.data.startDateTime) : new Date(),
          end: response.data?.data?.endDateTime ? new Date(response.data.data.endDateTime) : new Date(),
          employee: response.data?.data?.assignedTo ? response.data.data.assignedTo.toString() : '',
          status: response.data?.data?.status || 'Pending'
        };
        setTasks([...tasks, newTask]);
      }
      
      setShowModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Handle slot selection (for adding new events)
  const handleSelectSlot = (slotInfo) => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      start: slotInfo.start,
      end: slotInfo.end,
      assignedTo: '',
      status: 'Pending'
    });
    setShowModal(true);
  };

  // Custom event component
  const EventComponent = ({ event }) => {
    const employee = employees.find(emp => emp._id?.toString() === event.employee);
    const statusColors = {
      'Completed': 'success',
      'In Progress': 'warning',
      'Pending': 'danger'
    };

    return (
      <div className="p-1">
        <strong>{event.title || 'No Title'}</strong>
        <div>
          <Badge pill bg={statusColors[event.status] || 'primary'} className="me-1">
            {event.status || 'Unknown'}
          </Badge>
          {employee && <small>{employee.name}</small>}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

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
                    : employees.find((e) => e.id.toString() === employeeFilter)?.name || 'Select Employee'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item onClick={() => setEmployeeFilter('all')}>All Employees</Dropdown.Item>
                  <Dropdown.Divider />
                  {employees.map((emp) => (
                    <Dropdown.Item
                      key={emp._id}
                      onClick={() => setEmployeeFilter(emp.id.toString())}
                      active={employeeFilter === emp.id.toString()}
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
                    : statusFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item onClick={() => setStatusFilter('all')}>All Statuses</Dropdown.Item>
                  <Dropdown.Divider />
                  {['Pending', 'In Progress', 'Completed'].map((status) => (
                    <Dropdown.Item
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      active={statusFilter === status}
                    >
                      {status}
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
                    case 'Completed':
                      backgroundColor = '#28a745';
                      break;
                    case 'In Progress':
                      backgroundColor = '#ffc107';
                      break;
                    case 'Pending':
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
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formStart">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start"
                    value={moment(formData.start).format('YYYY-MM-DD')}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEnd">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end"
                    value={moment(formData.end).format('YYYY-MM-DD')}
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
                  value="Pending"
                  checked={formData.status === 'Pending'}
                  onChange={handleInputChange}
                />
                <Form.Check
                  inline
                  label="In Progress"
                  name="status"
                  type="radio"
                  id="status-in-progress"
                  value="In Progress"
                  checked={formData.status === 'In Progress'}
                  onChange={handleInputChange}
                />
                <Form.Check
                  inline
                  label="Completed"
                  name="status"
                  type="radio"
                  id="status-completed"
                  value="Completed"
                  checked={formData.status === 'Completed'}
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