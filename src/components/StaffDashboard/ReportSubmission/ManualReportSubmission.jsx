import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import moment from 'moment';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity()) {
      // Here you would typically send the data to your backend
      console.log('Report submitted:', formData);
      setSubmitted(true);
      setFormData({
        date: moment().format('YYYY-MM-DD'),
        taskTitle: '',
        workDone: '',
        duration: '',
        issues: ''
      });
    }

    setValidated(true);
  };

  return (
    <div className="p-4">
      <div className="">
        <div className="w-100">
          <div className="mb-3">
            <h3 className="fw-bold text-dark"> Manual Daily Report Submission</h3>
            <small className="text-muted">Use this form when automation fails</small>
          </div>
          <Col lg={12}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                {submitted && (
                  <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                    Report submitted successfully!
                  </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md={6} controlId="formDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a date
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md={6} controlId="formDuration">
                      <Form.Label>Duration Spent (hours)</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration"
                        min="0.1"
                        step="0.1"
                        placeholder="e.g. 2.5"
                        value={formData.duration}
                        onChange={handleChange}
                        required
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
                      required
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
                      required
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
                    <Button variant="primary" type="submit">
                      Submit Report
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
                      <tr>
                        <td>{moment().format('MMM D, YYYY')}</td>
                        <td>API Integration</td>
                        <td>3.5 hours</td>
                        <td><span className="badge bg-success">Submitted</span></td>
                      </tr>
                      <tr>
                        <td>{moment().subtract(1, 'day').format('MMM D, YYYY')}</td>
                        <td>Bug Fixing</td>
                        <td>2 hours</td>
                        <td><span className="badge bg-success">Submitted</span></td>
                      </tr>
                      <tr>
                        <td>{moment().subtract(2, 'days').format('MMM D, YYYY')}</td>
                        <td>UI Improvements</td>
                        <td>4 hours</td>
                        <td><span className="badge bg-success">Submitted</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default ManualReportSubmission;