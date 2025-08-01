import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import axiosInstance from '../../../Utilities/axiosInstance';

const Dashboard = () => {
    const [filters, setFilters] = useState({
        employee: 'all',
        dateRange: 'today',
        taskType: 'all'
    });

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Task type categories
    const taskTypeCategories = {
        'Tax Services': [
            'Personal Tax Preparation',
            'Corporate Tax Preparation',
            'Tax Problem Resolution/Offer & Compromise',
            'Penalty Abatement',
            'Federal/State Representation'
        ],
        'Accounting Services': [
            'Marked Financial Statements',
            'Quickbooks Financial Statements',
            'Payroll',
            'Sales Tax',
            'Initial QB Setup: Chart of Accounts & GL',
            'Audit Services'
        ]
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    // Fetch dashboard data from API
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/dashboard/getDashboardData');
                setDashboardData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const getStatusBadge = (status) => {
        if (!status) return 'secondary';
        
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'in progress':
                return 'primary';
            case 'pending':
                return 'warning';
            case 'overdue':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    // Prepare chart data based on API response
    const prepareChartData = () => {
        if (!dashboardData) return { tasksByCategory: null, completionChart: null };

        // Group tasks by category (Tax Services vs Accounting Services)
        const taxServicesCount = dashboardData.tasks.filter(task => 
            taskTypeCategories['Tax Services'].includes(task.taskType)
        ).length;

        const accountingServicesCount = dashboardData.tasks.filter(task => 
            taskTypeCategories['Accounting Services'].includes(task.taskType)
        ).length;

        const tasksByCategory = {
            labels: ['Tax Services', 'Accounting Services'],
            datasets: [
                {
                    label: 'Tasks by Category',
                    data: [taxServicesCount, accountingServicesCount],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',   // Blue for Tax Services
                        'rgba(255, 99, 132, 0.7)'    // Red for Accounting Services
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };

        // Completion rate (assuming completed vs not completed)
        const completedCount = dashboardData.tasks.filter(task => task.status === 'Completed').length;
        const totalCount = dashboardData.tasks.length || 1;
        const completionRate = Math.round((completedCount / totalCount) * 100);

        const completionChart = {
            labels: ['Completed', 'Incomplete'],
            datasets: [
                {
                    data: [completionRate, 100 - completionRate],
                    backgroundColor: ['#4bc0c0', '#ff6384'],
                    hoverBackgroundColor: ['#36a2a2', '#ff4569']
                }
            ]
        };

        return { tasksByCategory, completionChart };
    };

    const { tasksByCategory, completionChart } = prepareChartData();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                {error}
                <Button variant="link" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    if (!dashboardData) {
        return <div className="alert alert-warning">No data available</div>;
    }

    // Filter out tasks with null titles for the recent tasks list
    const validTasks = dashboardData.tasks.filter(task => task.title);

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

            {/* Charts */}
            <Row className="mb-4">
                <Col lg={6} md={12} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <h6 className="text-muted mb-3">Tasks by Category</h6>
                            <div style={{ height: '300px' }}>
                                {tasksByCategory ? (
                                    <Bar
                                        data={tasksByCategory}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
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
                                ) : (
                                    <div className="text-muted">No category data available</div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6} md={12} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <h6 className="text-muted mb-3">Completion Rate</h6>
                            <div style={{ height: '300px' }}>
                                {completionChart ? (
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
                                ) : (
                                    <div className="text-muted">No completion data available</div>
                                )}
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
                                        <option value="4">Amit Verma</option>
                                        <option value="5">Neha Gupta</option>
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
                                    <Form.Label>Task Category</Form.Label>
                                    <Form.Select
                                        name="taskType"
                                        value={filters.taskType}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="Tax Services">Tax Services</option>
                                        <option value="Accounting Services">Accounting Services</option>
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
                                    <th>Task Type</th>
                                    <th>Invoice Amount</th>
                                    <th>Assigned To</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {validTasks.length > 0 ? (
                                    validTasks.map(task => (
                                        <tr key={task.id}>
                                            <td>{task.title}</td>
                                            <td>{task.taskType || 'N/A'}</td>
                                            <td>{formatCurrency(task.invoiceAmount)}</td>
                                            <td>{task.assignedToName || 'Unassigned'}</td>
                                            <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                                            <td>
                                                <Badge bg={getStatusBadge(task.status)}>
                                                    {task.status || 'Unassigned'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">
                                            No tasks found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Dashboard;