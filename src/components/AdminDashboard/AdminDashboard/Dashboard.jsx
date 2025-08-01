// import React, { useState } from 'react';
// import { Card, Row, Col, Form, Button, Badge } from 'react-bootstrap';
// import { Bar, Pie } from 'react-chartjs-2';
// import 'chart.js/auto';

// const Dashboard = () => {
//     // Sample data state
//     const [filters, setFilters] = useState({
//         employee: 'all',
//         dateRange: 'today',
//         taskType: 'all'
//     });

//     // Sample data
//     const dashboardData = {
//         totalTasks: 124,
//         completedToday: 18,
//         pendingTasks: 42,
//         overdueTasks: 7,
//         netInvoiceAmount: 5240,
//         tasksByType: {
//             labels: ['Development', 'Design', 'Meeting', 'Review', 'Documentation'],
//             data: [45, 30, 15, 20, 14]
//         },
//         completionRate: 72,
//         recentTasks: [
//             { id: 1, title: 'Implement login page', type: 'Development', due: 'Today', status: 'In Progress' },
//             { id: 2, title: 'Client meeting prep', type: 'Meeting', due: 'Today', status: 'Completed' },
//             { id: 3, title: 'Dashboard UI redesign', type: 'Design', due: 'Tomorrow', status: 'Pending' },
//             { id: 4, title: 'API documentation', type: 'Documentation', due: 'Overdue', status: 'Overdue' }
//         ]
//     };

//     // Chart data
//     const tasksByTypeChart = {
//         labels: dashboardData.tasksByType.labels,
//         datasets: [
//             {
//                 label: 'Tasks by Type',
//                 data: dashboardData.tasksByType.data,
//                 backgroundColor: [
//                     'rgba(54, 162, 235, 0.7)',
//                     'rgba(255, 99, 132, 0.7)',
//                     'rgba(75, 192, 192, 0.7)',
//                     'rgba(255, 206, 86, 0.7)',
//                     'rgba(153, 102, 255, 0.7)'
//                 ],
//                 borderColor: [
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(153, 102, 255, 1)'
//                 ],
//                 borderWidth: 1
//             }
//         ]
//     };

//     const completionChart = {
//         labels: ['Completed', 'Pending'],
//         datasets: [
//             {
//                 data: [dashboardData.completionRate, 100 - dashboardData.completionRate],
//                 backgroundColor: ['#4bc0c0', '#ff6384'],
//                 hoverBackgroundColor: ['#36a2a2', '#ff4569']
//             }
//         ]
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters({
//             ...filters,
//             [name]: value
//         });
//     };

//     const getStatusBadge = (status) => {
//         switch (status) {
//             case 'Completed':
//                 return 'success';
//             case 'In Progress':
//                 return 'primary';
//             case 'Pending':
//                 return 'warning';
//             case 'Overdue':
//                 return 'danger';
//             default:
//                 return 'secondary';
//         }
//     };

//     return (
//         <div className="container-fluid py-4">
//             <h3 className="mb-4 fw-bold text-dark">Task Management Dashboard</h3>

        
//             {/* Summary Cards */}
//             <Row className="mb-4">
//                 <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
//                     <Card className="h-100 shadow-sm border-primary">
//                         <Card.Body>
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                     <h6 className="text-muted mb-2">Total Tasks</h6>
//                                     <h3 className="mb-0">{dashboardData.totalTasks}</h3>
//                                 </div>
//                                 <div className="bg-primary bg-opacity-10 p-3 rounded">
//                                     <i className="bi bi-list-task fs-4 text-primary"></i>
//                                 </div>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
//                     <Card className="h-100 shadow-sm border-success">
//                         <Card.Body>
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                     <h6 className="text-muted mb-2">Completed Today</h6>
//                                     <h3 className="mb-0">{dashboardData.completedToday}</h3>
//                                 </div>
//                                 <div className="bg-success bg-opacity-10 p-3 rounded">
//                                     <i className="bi bi-check-circle fs-4 text-success"></i>
//                                 </div>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
//                     <Card className="h-100 shadow-sm border-warning">
//                         <Card.Body>
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                     <h6 className="text-muted mb-2">Pending Tasks</h6>
//                                     <h3 className="mb-0">{dashboardData.pendingTasks}</h3>
//                                 </div>
//                                 <div className="bg-warning bg-opacity-10 p-3 rounded">
//                                     <i className="bi bi-hourglass-split fs-4 text-warning"></i>
//                                 </div>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
//                     <Card className="h-100 shadow-sm border-danger">
//                         <Card.Body>
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                     <h6 className="text-muted mb-2">Overdue Tasks</h6>
//                                     <h3 className="mb-0">{dashboardData.overdueTasks}</h3>
//                                 </div>
//                                 <div className="bg-danger bg-opacity-10 p-3 rounded">
//                                     <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
//                                 </div>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Invoice Amount and Charts */}
//             <Row className="mb-4">
//                 <Col lg={4} md={12} className="mb-4">
//                     <Card className="h-100 shadow-sm">
//                         <Card.Body>
//                             <h6 className="text-muted mb-3">Net Invoice Amount</h6>
//                             <h2 className="mb-4">${dashboardData.netInvoiceAmount.toLocaleString()}</h2>
//                             <div className="d-flex justify-content-between">
//                                 <div>
//                                     <span className="text-muted">Daily Average</span>
//                                     <h5 className="mb-0">$1,240</h5>
//                                 </div>
//                                 <div>
//                                     <span className="text-muted">Monthly Total</span>
//                                     <h5 className="mb-0">$37,200</h5>
//                                 </div>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col lg={4} md={6} sm={12} className="mb-4">
//                     <Card className="h-100 shadow-sm">
//                         <Card.Body>
//                             <h6 className="text-muted mb-3">Tasks by Type</h6>
//                             <div style={{ height: '250px' }}>
//                                 <Bar
//                                     data={tasksByTypeChart}
//                                     options={{
//                                         responsive: true,
//                                         maintainAspectRatio: false,
//                                         plugins: {
//                                             legend: {
//                                                 position: 'bottom'
//                                             }
//                                         }
//                                     }}
//                                 />
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col lg={4} md={6} sm={12} className="mb-4">
//                     <Card className="h-100 shadow-sm">
//                         <Card.Body>
//                             <h6 className="text-muted mb-3">Completion Rate</h6>
//                             <div style={{ height: '250px' }}>
//                                 <Pie
//                                     data={completionChart}
//                                     options={{
//                                         responsive: true,
//                                         maintainAspectRatio: false,
//                                         plugins: {
//                                             legend: {
//                                                 position: 'bottom'
//                                             }
//                                         }
//                                     }}
//                                 />
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>


//    {/* Filters */}
//             <Card className="mb-4 shadow-sm">
//                 <Card.Body>
//                     <Form>
//                         <Row>
//                             <Col md={4}>
//                                 <Form.Group controlId="employeeFilter">
//                                     <Form.Label>Employee</Form.Label>
//                                     <Form.Select
//                                         name="employee"
//                                         value={filters.employee}
//                                         onChange={handleFilterChange}
//                                     >
//                                         <option value="all">All Employees</option>
//                                         <option value="john">John Doe</option>
//                                         <option value="jane">Jane Smith</option>
//                                         <option value="mike">Mike Johnson</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>
//                             <Col md={4}>
//                                 <Form.Group controlId="dateRangeFilter">
//                                     <Form.Label>Date Range</Form.Label>
//                                     <Form.Select
//                                         name="dateRange"
//                                         value={filters.dateRange}
//                                         onChange={handleFilterChange}
//                                     >
//                                         <option value="today">Today</option>
//                                         <option value="week">This Week</option>
//                                         <option value="month">This Month</option>
//                                         <option value="custom">Custom Range</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>
//                             <Col md={4}>
//                                 <Form.Group controlId="taskTypeFilter">
//                                     <Form.Label>Task Type</Form.Label>
//                                     <Form.Select
//                                         name="taskType"
//                                         value={filters.taskType}
//                                         onChange={handleFilterChange}
//                                     >
//                                         <option value="all">All Types</option>
//                                         <option value="development">Development</option>
//                                         <option value="design">Design</option>
//                                         <option value="meeting">Meeting</option>
//                                         <option value="documentation">Documentation</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>
//                         </Row>
//                         {/* <div className="d-flex justify-content-end mt-3">
//                             <Button variant="primary" className="me-2">Apply Filters</Button>
//                             <Button variant="outline-secondary">Reset</Button>
//                         </div> */}
//                     </Form>
//                 </Card.Body>
//             </Card> 

//             {/* Recent Tasks */}
//             <Card className="shadow-sm">
//                 <Card.Body>
//                     <div className="d-flex justify-content-between align-items-center mb-4">
//                         <h5 className="mb-0">Recent Tasks</h5>
//                         {/* <Button variant="outline-primary" size="sm">View All</Button> */}
//                     </div>
//                     <div className="table-responsive">
//                         <table className="table table-hover">
//                             <thead>
//                                 <tr>
//                                     <th>Task</th>
//                                     <th>Type</th>
//                                     <th>Due Date</th>
//                                     <th>Status</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {dashboardData.recentTasks.map(task => (
//                                     <tr key={task.id}>
//                                         <td>{task.title}</td>
//                                         <td>{task.type}</td>
//                                         <td>{task.due}</td>
//                                         <td>
//                                             <Badge bg={getStatusBadge(task.status)}>
//                                                 {task.status}
//                                             </Badge>
//                                         </td>
//                                         <td>
//                                             <Button variant="outline-primary" size="sm">View</Button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </Card.Body>
//             </Card>
//         </div>
//     );
// };

// export default Dashboard;


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
        if (!dashboardData) return { tasksByType: null, completionChart: null };

        // Tasks by status
        const statusData = dashboardData.statusBreakdown || [];
        const tasksByType = {
            labels: statusData.map(item => item.status || 'Unassigned'),
            datasets: [
                {
                    label: 'Tasks by Type',
                    data: statusData.map(item => item.count),
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 99, 132, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };

        // Completion rate (assuming completed vs not completed)
        const completedCount = statusData.find(item => item.status === 'completed')?.count || 0;
        const totalCount = dashboardData.totalTasks || 1;
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

        return { tasksByType, completionChart };
    };

    const { tasksByType, completionChart } = prepareChartData();

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
                            <h6 className="text-muted mb-3">Tasks by Type</h6>
                            <div style={{ height: '300px' }}>
                                {tasksByType ? (
                                    <Bar
                                        data={tasksByType}
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
                                    <div className="text-muted">No status data available</div>
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
                                        {/* You can dynamically populate this from your users data */}
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
                                    <Form.Label>Task Status</Form.Label>
                                    <Form.Select
                                        name="taskType"
                                        value={filters.taskType}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="completed">Completed</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="pending">Pending</option>
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
                                    <th>Assigned To</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {validTasks.length > 0 ? (
                                    validTasks.map(task => (
                                        <tr key={task.id}>
                                            <td>{task.title}</td>
                                            <td>{task.assignedToName || 'Unassigned'}</td>
                                            <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                                            <td>
                                                <Badge bg={getStatusBadge(task.status)}>
                                                    {task.status || 'Unassigned'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'secondary'}>
                                                    {task.priority || '-'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted py-4">
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