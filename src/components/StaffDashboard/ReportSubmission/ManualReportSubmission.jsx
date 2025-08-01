import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Container } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import axiosInstance from '../../../Utilities/axiosInstance';

const ManualReportSubmission = () => {
  const [formData, setFormData] = useState({
    date: moment().format('YYYY-MM-DD'),
    taskTitle: '',
    workDone: '',
    duration: '',
    issues: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [validated, setValidated] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("dailyReport/getAllDailyReports");
      console.log("Api response", response.data.data);
      
      setRecentSubmissions(response?.data?.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch recent reports');
      setLoading(false);
      console.error('Error fetching reports:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity()) {
      try {
        const reportData = {
          reportDate: moment(formData.date).format('MM/DD/YYYY'),
          durationSpent: parseFloat(formData.duration),
          taskTitle: formData.taskTitle,
          whatWasDone: formData.workDone,
          issues: formData.issues || 'No issues reported'
        };

        await axiosInstance.post("dailyReport/createDailyReport", reportData);
        
        setSubmitted(true);
        setFormData({
          date: moment().format('YYYY-MM-DD'),
          taskTitle: '',
          workDone: '',
          duration: '',
          issues: ''
        });
        
        // Refresh the recent submissions
        await fetchRecentReports();
      } catch (err) {
        setError('Failed to submit report');
        console.error('Error submitting report:', err);
      }
    }

    setValidated(true);
  };

  return (
    <Container fluid className="py-4 px-2">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <div className="mb-4 text-center text-lg-start">
            <h3 className="fw-bold text-dark">Manual Daily Report Submission</h3>
            <small className="text-muted">Use this form when automation fails</small>
          </div>

          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
              
              {submitted && (
                <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                  Report submitted successfully!
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} xs={12} md={6} controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select a date
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xs={12} md={6} controlId="formDuration">
                    <Form.Label>Duration Spent (hours)</Form.Label>
                    <Form.Control
                      type="number"
                      name="duration"
                      min="0.1"
                      step="0.1"
                      placeholder="e.g. 2.5"
                      value={formData.duration}
                      onChange={handleChange}
                     
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter time spent
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formTaskTitle">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="taskTitle"
                    placeholder="What task were you working on?"
                    value={formData.taskTitle}
                    onChange={handleChange}
                  
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a task title
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formWorkDone">
                  <Form.Label>What Was Done</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="workDone"
                    placeholder="Describe what you accomplished..."
                    value={formData.workDone}
                    onChange={handleChange}
           
                  />
                  <Form.Control.Feedback type="invalid">
                    Please describe the work done
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formIssues">
                  <Form.Label>Issues (if any)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="issues"
                    placeholder="Describe any problems encountered..."
                    value={formData.issues}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Recent Submissions</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Task</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSubmissions.length > 0 ? (
                        recentSubmissions?.map((report, index) => (
                          <tr key={index}>
                            <td>{moment(report.reportDate, 'MM/DD/YYYY').format('MMM D, YYYY')}</td>
                            <td>{report.taskTitle}</td>
                            <td>{report.durationSpent} hours</td>
                            <td><span className="badge bg-success">Submitted</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-3 text-muted">
                            No reports found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManualReportSubmission;