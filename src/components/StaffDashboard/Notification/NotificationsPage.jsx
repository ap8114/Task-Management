import React, { useState } from 'react';
import { Card, Badge, Button, Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new-task',
      title: 'New Project Documentation',
      message: 'You have been assigned to update the project documentation',
      date: '2025-07-25',
      dueDate: '2025-07-30',
      read: false
    },
    {
      id: 2,
      type: 'due-today',
      title: 'Client Report Submission',
      message: 'Your client report is due today',
      date: '2025-07-25',
      dueDate: '2025-07-25',
      read: false
    },
    {
      id: 3,
      type: 'overdue',
      title: 'Code Review',
      message: 'Code review for the new feature is overdue',
      date: '2025-07-20',
      dueDate: '2025-07-22',
      read: true
    },
    {
      id: 4,
      type: 'new-task',
      title: 'Bug Fixing',
      message: 'Please fix the login page issues',
      date: '2025-07-24',
      dueDate: '2025-07-28',
      read: false
    },
    {
      id: 5,
      type: 'due-today',
      title: 'Team Meeting',
      message: 'Sprint planning meeting today at 2 PM',
      date: '2025-07-25',
      dueDate: '2025-07-25',
      read: false
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'new-task': return 'primary';
      case 'due-today': return 'warning';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const getBadgeText = (type) => {
    switch (type) {
      case 'new-task': return 'New Task';
      case 'due-today': return 'Due Today';
      case 'overdue': return 'Overdue';
      default: return 'Notification';
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
              <h3 className="fw-bold text-dark"> Notifications</h3>
              <Button variant="outline-primary" size="sm" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
            </div>
      <div>
        <Col>
          <Card className="border-0 shadow-sm mb-4 ">
            
            <Card.Body className="p-0 bg-card" >
              <div className="list-group list-group-flush">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start flex-wrap ${!notification.read ? 'bg-light' : ''}`}
                  >
                    <div className="me-3">
                      <Badge bg={getBadgeColor(notification.type)} className="mb-2">
                        {getBadgeText(notification.type)}
                      </Badge>
                      <h6 className="mb-1">{notification.title}</h6>
                      <p className="mb-1 small text-muted">{notification.message}</p>
                      <small className="text-muted">
                        {moment(notification.date).fromNow()} • Due: {moment(notification.dueDate).format('MMM D, YYYY')}
                      </small>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </div>

      {/* Summary Cards Row */}
      <Row className="gy-3 gx-3">
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                <span className="text-primary fs-4">📋</span>
              </div>
              <div>
                <h6 className="mb-0">New Tasks</h6>
                <h3 className="mb-0">
                  {notifications.filter(n => n.type === 'new-task' && !n.read).length}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                <span className="text-warning fs-4">⏰</span>
              </div>
              <div>
                <h6 className="mb-0">Due Today</h6>
                <h3 className="mb-0">
                  {notifications.filter(n => n.type === 'due-today' && !n.read).length}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                <span className="text-danger fs-4">❗</span>
              </div>
              <div>
                <h6 className="mb-0">Overdue</h6>
                <h3 className="mb-0">
                  {notifications.filter(n => n.type === 'overdue' && !n.read).length}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationsPage;
