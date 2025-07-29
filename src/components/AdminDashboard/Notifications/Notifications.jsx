import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, ListGroup, Tab, Nav, Alert } from 'react-bootstrap';
import { FaBell, FaCheck, FaExclamationTriangle, FaCalendarDay, FaEnvelope, FaInbox } from 'react-icons/fa';

const Notifications = () => {
    // State for tasks
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete project proposal', description: 'Finish the project proposal document', assignedTo: 'john@example.com', dueDate: '2023-06-15', status: 'pending', priority: 'high' },
        { id: 2, title: 'Review code changes', description: 'Review PR #123 for the backend service', assignedTo: 'sarah@example.com', dueDate: '2023-06-14', status: 'pending', priority: 'medium' },
        { id: 3, title: 'Team meeting', description: 'Weekly team sync meeting', assignedTo: 'mike@example.com', dueDate: '2023-06-13', status: 'completed', priority: 'low' },
        { id: 4, title: 'Update documentation', description: 'Update API documentation for new endpoints', assignedTo: 'john@example.com', dueDate: '2023-06-16', status: 'pending', priority: 'medium' },
    ]);

    // State for notifications
    const [notifications, setNotifications] = useState([]);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // State for new task form
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium'
    });

    // Check for overdue and due today tasks
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];

        tasks.forEach(task => {
            if (task.status === 'pending') {
                if (task.dueDate < today) {
                    // Create overdue notification if not already exists
                    if (!notifications.some(n => n.taskId === task.id && n.type === 'overdue')) {
                        addNotification({
                            type: 'overdue',
                            taskId: task.id,
                            title: `Task Overdue: ${task.title}`,
                            message: `The task "${task.title}" is overdue. Please complete it as soon as possible.`,
                            timestamp: new Date().toISOString(),
                            read: false
                        });
                    }
                } else if (task.dueDate === today) {
                    // Create due today notification if not already exists
                    if (!notifications.some(n => n.taskId === task.id && n.type === 'dueToday')) {
                        addNotification({
                            type: 'dueToday',
                            taskId: task.id,
                            title: `Task Due Today: ${task.title}`,
                            message: `The task "${task.title}" is due today. Don't forget to complete it.`,
                            timestamp: new Date().toISOString(),
                            read: false
                        });
                    }
                }
            }
        });

        // Update unread count
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [tasks, notifications]);

    const addNotification = (notification) => {
        setNotifications([notification, ...notifications]);

        // Send email notification based on type
        switch (notification.type) {
            case 'assigned':
                sendEmailNotification(notification, 'Task Assigned');
                break;
            case 'dueToday':
                sendEmailNotification(notification, 'Task Due Today');
                break;
            case 'overdue':
                sendEmailNotification(notification, 'Task Overdue');
                break;
            default:
                break;
        }
    };

    const sendEmailNotification = (notification, emailType) => {
        // In a real app, this would call your email service API
        console.log(`Sending ${emailType} email to ${getTask(notification.taskId).assignedTo}`);
        console.log(`Subject: ${notification.title}`);
        console.log(`Body: ${notification.message}`);
    };

    const getTask = (taskId) => tasks.find(task => task.id === taskId);

    const handleTaskSubmit = (e) => {
        e.preventDefault();
        const newTaskId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

        const taskToAdd = {
            id: newTaskId,
            title: newTask.title,
            description: newTask.description,
            assignedTo: newTask.assignedTo,
            dueDate: newTask.dueDate,
            status: 'pending',
            priority: newTask.priority
        };

        setTasks([...tasks, taskToAdd]);

        // Create assigned notification
        addNotification({
            type: 'assigned',
            taskId: newTaskId,
            title: `New Task Assigned: ${newTask.title}`,
            message: `You have been assigned a new task: "${newTask.title}" due on ${newTask.dueDate}.`,
            timestamp: new Date().toISOString(),
            read: false
        });

        setShowTaskModal(false);
        setNewTask({
            title: '',
            description: '',
            assignedTo: '',
            dueDate: '',
            priority: 'medium'
        });
    };

    const markTaskComplete = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, status: 'completed' } : task
        ));
    };

    const markNotificationAsRead = (notificationId) => {
        setNotifications(notifications.map(notification =>
            notification.id === notificationId ? { ...notification, read: true } : notification
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification =>
            ({ ...notification, read: true })
        ));
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high':
                return <Badge bg="danger">High</Badge>;
            case 'medium':
                return <Badge bg="warning" text="dark">Medium</Badge>;
            case 'low':
                return <Badge bg="success">Low</Badge>;
            default:
                return <Badge bg="secondary">Unknown</Badge>;
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'assigned':
                return <FaInbox className="text-primary" />;
            case 'dueToday':
                return <FaCalendarDay className="text-warning" />;
            case 'overdue':
                return <FaExclamationTriangle className="text-danger" />;
            default:
                return <FaBell className="text-secondary" />;
        }
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col md={8}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Header className=" d-flex justify-content-between align-items-center">
                            <h3 className='fw-bold text-dark'>
                                Notifications & Alerts</h3>
                            <Button variant="primary" onClick={() => setShowTaskModal(true)}>
                                + Add Task
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Container id="task-tabs" defaultActiveKey="pending">
                                <Row>
                                    <Col sm={3}>
                                        <Nav variant="pills" className="flex-column">
                                            <Nav.Item>
                                                <Nav.Link eventKey="pending">Pending Tasks</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="completed">Completed Tasks</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="all">All Tasks</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                    <Col sm={9}>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="pending">
                                                <ListGroup>
                                                    {tasks.filter(task => task.status === 'pending').map(task => (
                                                        <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <h5>{task.title}</h5>
                                                                <p className="mb-1 text-muted">{task.description}</p>
                                                                <small>Assigned to: {task.assignedTo} | Due: {task.dueDate}</small>
                                                                {getPriorityBadge(task.priority)}
                                                            </div>
                                                            <Button variant="success" size="sm" onClick={() => markTaskComplete(task.id)}>
                                                                <FaCheck /> Complete
                                                            </Button>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="completed">
                                                <ListGroup>
                                                    {tasks.filter(task => task.status === 'completed').map(task => (
                                                        <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <h5>{task.title}</h5>
                                                                <p className="mb-1 text-muted">{task.description}</p>
                                                                <small>Assigned to: {task.assignedTo} | Due: {task.dueDate}</small>
                                                                {getPriorityBadge(task.priority)}
                                                            </div>
                                                            <Badge bg="success">Completed</Badge>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="all">
                                                <ListGroup>
                                                    {tasks.map(task => (
                                                        <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <h5>{task.title}</h5>
                                                                <p className="mb-1 text-muted">{task.description}</p>
                                                                <small>Assigned to: {task.assignedTo} | Due: {task.dueDate}</small>
                                                                {getPriorityBadge(task.priority)}
                                                            </div>
                                                            {task.status === 'pending' ? (
                                                                <Button variant="success" size="sm" onClick={() => markTaskComplete(task.id)}>
                                                                    <FaCheck /> Complete
                                                                </Button>
                                                            ) : (
                                                                <Badge bg="success">Completed</Badge>
                                                            )}
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                            <h5 className='fw-bold text-dark'>
                                <FaBell /> Notifications
                                {unreadCount > 0 && <Badge bg="danger" className="ms-2">{unreadCount}</Badge>}
                            </h5>
                            <Button variant="secondary" size="sm" onClick={markAllAsRead}>
                                Mark all as read
                            </Button>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <Alert variant="info">No notifications yet</Alert>
                            ) : (
                                <ListGroup>
                                    {notifications.map((notification, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            action
                                            onClick={() => markNotificationAsRead(index)}
                                            className={!notification.read ? 'fw-bold' : ''}
                                        >
                                            <div className="d-flex align-items-center mb-1">
                                                {getNotificationIcon(notification.type)}
                                                <span className="ms-2">{notification.title}</span>
                                            </div>
                                            <small className="text-muted">{notification.message}</small>
                                            <div className="text-end">
                                                <small>{new Date(notification.timestamp).toLocaleString()}</small>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Task Modal */}
            <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleTaskSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Assign To (Email)</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                value={newTask.assignedTo}
                                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                required
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save Task
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Notifications;