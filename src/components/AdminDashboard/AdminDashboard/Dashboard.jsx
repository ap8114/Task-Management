import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
    // Sample data state
    const [filters, setFilters] = useState({
        employee: 'all',
        dateRange: 'today',
        taskType: 'all'
    });

    // Task type categories
    const taskTypeCategories = {
        'Tax Services': [
            'Personal Tax Preparation',
            'Corporate Tax Preparation',
            'Tax Problem Resolution/Offer & Compromise',
            'Penalty Abatement',
            'Federal/State Representation'
        ],
        'Bookkeeping/Accounting Services': [
            'Marked Financial Statements',
            'Quickbooks Financial Statements',
            'Payroll',
            'Sales Tax',
            'Initial QB Setup: Chart of Accounts & GL',
            'Audit Services'
        ]
    };

    // Sample data with updated task types
    const dashboardData = {
        totalTasks: 124,
        completedToday: 18,
        pendingTasks: 42,
        overdueTasks: 7,
        netInvoiceAmount: 5240,
        tasksByCategory: {
            labels: ['Tax Services', 'Bookkeeping/Accounting Services'],
            data: [70, 54] // Sum of individual tasks in each category
        },
        completionRate: 72,
        recentTasks: [
            { id: 1, title: 'Client tax filing - John Smith', type: 'Personal Tax Preparation', due: 'Today', status: 'In Progress' },
            { id: 2, title: 'ABC Corp quarterly taxes', type: 'Corporate Tax Preparation', due: 'Today', status: 'Completed' },
            { id: 3, title: 'Financial statements review', type: 'Marked Financial Statements', due: 'Tomorrow', status: 'Pending' },
            { id: 4, title: 'IRS penalty abatement case', type: 'Penalty Abatement', due: 'Overdue', status: 'Overdue' }
        ]
    };

    // Chart data - now showing only two categories
    const tasksByCategoryChart = {
        labels: dashboardData.tasksByCategory.labels,
        datasets: [
            {
                label: 'Tasks by Category',
                data: dashboardData.tasksByCategory.data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',   // Blue for Tax Services
                    'rgba(255, 99, 132, 0.7)'    // Red for Bookkeeping/Accounting
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const completionChart = {
        labels: ['Completed', 'Pending'],
        datasets: [
            {
                data: [dashboardData.completionRate, 100 - dashboardData.completionRate],
                backgroundColor: ['#4bc0c0', '#ff6384'],
                hoverBackgroundColor: ['#36a2a2', '#ff4569']
            }
        ]
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed':
                return 'success';
            case 'In Progress':
                return 'primary';
            case 'Pending':
                return 'warning';
            case 'Overdue':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="container-fluid py-4">
            <h3 className="mb-4 fw-bold text-dark">Task Management Dashboard</h3>

            {/* Summary Cards */}
            <Row className="mb-4">
                <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
                    <Card className="h-100 shadow-sm border-primary">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted mb-2">Total Tasks</h6>
                                    <h3 className="mb-0">{dashboardData.totalTasks}</h3>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded">
                                    <i className="bi bi-list-task fs-4 text-primary"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
                    <Card className="h-100 shadow-sm border-success">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted mb-2">Completed Today</h6>
                                    <h3 className="mb-0">{dashboardData.completedToday}</h3>
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded">
                                    <i className="bi bi-check-circle fs-4 text-success"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
                    <Card className="h-100 shadow-sm border-warning">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted mb-2">Pending Tasks</h6>
                                    <h3 className="mb-0">{dashboardData.pendingTasks}</h3>
                                </div>
                                <div className="bg-warning bg-opacity-10 p-3 rounded">
                                    <i className="bi bi-hourglass-split fs-4 text-warning"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
                    <Card className="h-100 shadow-sm border-danger">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted mb-2">Overdue Tasks</h6>
                                    <h3 className="mb-0">{dashboardData.overdueTasks}</h3>
                                </div>
                                <div className="bg-danger bg-opacity-10 p-3 rounded">
                                    <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Invoice Amount and Charts */}
            <Row className="mb-4">
                <Col lg={4} md={12} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <h6 className="text-muted mb-3">Net Invoice Amount</h6>
                            <h2 className="mb-4">${dashboardData.netInvoiceAmount.toLocaleString()}</h2>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <span className="text-muted">Daily Average</span>
                                    <h5 className="mb-0">$1,240</h5>
                                </div>
                                <div>
                                    <span className="text-muted">Monthly Total</span>
                                    <h5 className="mb-0">$37,200</h5>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} sm={12} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <h6 className="text-muted mb-3">Tasks by Category</h6>
                            <div style={{ height: '250px' }}>
                                <Bar
                                    data={tasksByCategoryChart}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'bottom'
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6} sm={12} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <h6 className="text-muted mb-3">Completion Rate</h6>
                            <div style={{ height: '250px' }}>
                                <Pie
                                    data={completionChart}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom'
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="employeeFilter">
                                    <Form.Label>Employee</Form.Label>
                                    <Form.Select
                                        name="employee"
                                        value={filters.employee}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">All Employees</option>
                                        <option value="john">John Doe</option>
                                        <option value="jane">Jane Smith</option>
                                        <option value="mike">Mike Johnson</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="dateRangeFilter">
                                    <Form.Label>Date Range</Form.Label>
                                    <Form.Select
                                        name="dateRange"
                                        value={filters.dateRange}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="today">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                        <option value="custom">Custom Range</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="taskTypeFilter">
                                    <Form.Label>Task Type</Form.Label>
                                    <Form.Select
                                        name="taskType"
                                        value={filters.taskType}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">All Types</option>
                                        <optgroup label="Tax Services">
                                            {taskTypeCategories['Tax Services'].map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Bookkeeping/Accounting Services">
                                            {taskTypeCategories['Bookkeeping/Accounting Services'].map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </optgroup>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Recent Tasks */}
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">Recent Tasks</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Type</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.recentTasks.map(task => (
                                    <tr key={task.id}>
                                        <td>{task.title}</td>
                                        <td>{task.type}</td>
                                        <td>{task.due}</td>
                                        <td>
                                            <Badge bg={getStatusBadge(task.status)}>
                                                {task.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button variant="outline-primary" size="sm">View</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Dashboard;