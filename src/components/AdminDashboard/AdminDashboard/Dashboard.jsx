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

    const [dashboardData, setDashboardData] = useState({
        totalTasks: 0,
        completedToday: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        tasks: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);

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
                setError(null);
                
                // Fetch employees first
                const employeesResponse = await axiosInstance.get('/user/getAllUsers');
                setEmployees(employeesResponse.data?.data || []);
                
                // Then fetch dashboard data
                const response = await axiosInstance.get('/dashboard/getDashboardData');
                
                // Process tasks to ensure they have required fields
                const processedTasks = (response.data.data?.tasks || []).map(task => ({
                    ...task,
                    id: task._id || Math.random().toString(),
                    title: task.title || 'Untitled Task',
                    taskType: task.taskType || 'Uncategorized',
                    assignedToName: task.assignedToName || 'Unassigned',
                    status: task.status || 'Pending',
                    invoiceAmount: task.invoiceAmount || 0,
                    dueDate: task.dueDate || null
                }));
                
                setDashboardData({
                    totalTasks: response.data.data?.totalTasks || 0,
                    completedToday: response.data.data?.completedToday || 0,
                    pendingTasks: response.data.data?.pendingTasks || 0,
                    overdueTasks: response.data.data?.overdueTasks || 0,
                    tasks: processedTasks
                });
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try again later.');
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

    // Filter tasks based on current filters
    const filterTasks = () => {
        let filtered = [...dashboardData.tasks];

        // Filter by employee
        if (filters.employee !== 'all') {
            filtered = filtered.filter(task => 
                task.assignedTo === filters.employee
            );
        }

        // Filter by task type
        if (filters.taskType !== 'all') {
            filtered = filtered.filter(task => 
                taskTypeCategories[filters.taskType]?.includes(task.taskType)
            );
        }

        // Filter by date range (simplified example)
        const now = new Date();
        if (filters.dateRange === 'today') {
            filtered = filtered.filter(task => {
                const taskDate = task.dueDate ? new Date(task.dueDate) : null;
                return taskDate && taskDate.toDateString() === now.toDateString();
            });
        } else if (filters.dateRange === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filtered = filtered.filter(task => {
                const taskDate = task.dueDate ? new Date(task.dueDate) : null;
                return taskDate && taskDate >= oneWeekAgo && taskDate <= now;
            });
        } else if (filters.dateRange === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            filtered = filtered.filter(task => {
                const taskDate = task.dueDate ? new Date(task.dueDate) : null;
                return taskDate && taskDate >= oneMonthAgo && taskDate <= now;
            });
        }

        return filtered;
    };

    // Prepare chart data based on filtered tasks
    const prepareChartData = () => {
        const filteredTasks = filterTasks();
        
        // Group tasks by category (Tax Services vs Accounting Services)
        const taxServicesCount = filteredTasks.filter(task =>
            taskTypeCategories['Tax Services'].includes(task.taskType)
        ).length;

        const accountingServicesCount = filteredTasks.filter(task =>
            taskTypeCategories['Accounting Services'].includes(task.taskType)
        ).length;

        const tasksByCategory = {
            labels: ['Tax Services', 'Accounting Services'],
            datasets: [
                {
                    label: 'Tasks by Category',
                    data: [taxServicesCount, accountingServicesCount],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)'
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
        const completedCount = filteredTasks.filter(task => task.status === 'Completed').length;
        const totalCount = filteredTasks.length || 1;
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

        // Calculate summary metrics based on filtered tasks
        const summaryData = {
            totalTasks: filteredTasks.length,
            completedToday: filteredTasks.filter(task => 
                task.status === 'Completed' && 
                task.dueDate && 
                new Date(task.dueDate).toDateString() === new Date().toDateString()
            ).length,
            pendingTasks: filteredTasks.filter(task => 
                task.status === 'Pending'
            ).length,
            overdueTasks: filteredTasks.filter(task => 
                task.status !== 'Completed' && 
                task.dueDate && 
                new Date(task.dueDate) < new Date()
            ).length
        };

        return { tasksByCategory, completionChart, summaryData };
    };

    const { tasksByCategory, completionChart, summaryData } = prepareChartData();
    const filteredTasks = filterTasks();

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
                                    <h3 className="mb-0">{summaryData.totalTasks}</h3>
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
                                    <h3 className="mb-0">{summaryData.completedToday}</h3>
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
                                    <h3 className="mb-0">{summaryData.pendingTasks}</h3>
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
                                    <h3 className="mb-0">{summaryData.overdueTasks}</h3>
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
                                                    beginAtZero: true,
                                                    ticks: {
                                                        stepSize: 1
                                                    }
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
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            return `${context.label}: ${context.raw}%`;
                                                        }
                                                    }
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
                                        {employees.map(employee => (
                                            <option key={employee._id} value={employee._id}>
                                                {employee.name}
                                            </option>
                                        ))}
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
                                        <option value="all">All Time</option>
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
                        <small className="text-muted">Showing {filteredTasks.length} tasks</small>
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
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map(task => (
                                        <tr key={task.id}>
                                            <td>{task.title}</td>
                                            <td>{task.taskType}</td>
                                            <td>{formatCurrency(task.invoiceAmount)}</td>
                                            <td>{task.assignedToName}</td>
                                            <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                                            <td>
                                                <Badge bg={getStatusBadge(task.status)}>
                                                    {task.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">
                                            No tasks found matching your filters
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