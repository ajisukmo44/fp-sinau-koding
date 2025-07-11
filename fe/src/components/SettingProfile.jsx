import React, { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';

function SettingsPage() {
  const [formData, setFormData] = useState({
    email: 'johndoe@gmail.com',
    username: 'John Doe',
    role: 'Admin',
    status: 'Active',
    language: 'English',
    password: '',
    mode: 'Light Mode',
    fontSize: '16 px',
    zoom: '100 (Normal)',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-5">
      {/* Account Section */}
      <h5 className="mt-0">Account</h5>
      <Row className="mb-3 align-items-center">
        <Col md="auto">
          <img
            src="https://media.licdn.com/dms/image/v2/D5635AQGwMAaY9dxOSA/profile-framedphoto-shrink_200_200/B56Zdp2O6DGoAc-/0/1749827514430?e=1752739200&v=beta&t=EHgXbWGjsgESw3ct-ee1YCH-Qds0TqhJRiIgAJGojMg"
            alt="Profile"
            className="rounded-circle"
            width="80"
            height="80"
          />
        </Col>
        <Col md="auto">
          <Button variant="primary" className="me-2 px-3">Change Picture</Button>
          <Button variant="outline-secondary">Delete Picture</Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <Form.Label>Role</Form.Label>
          <Form.Control
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Label>Status</Form.Label>
          <Form.Select name="status" value={formData.status} onChange={handleChange} disabled>
            <option>Active</option>
            <option>Inactive</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label>Language</Form.Label>
          <Form.Select name="language" value={formData.language} onChange={handleChange}>
            <option>English</option>
            <option>Indonesian</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Password Section */}
      <Row className="mb-5">
      <h5 className="mt-4">Password</h5>
        <Col md={4}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          
          <Button variant="primary" className='px-3 mt-2'>Change Password</Button>
        </Col>
      </Row>

      {/* Appearance Section */}
      <Row className="mb-5">
        
      <h5 className="mt-4">Appearance</h5>
        <Col md={4}>
          <Form.Label>Preference Mode</Form.Label>
          <Form.Select name="mode" value={formData.mode} onChange={handleChange}>
            <option>Light Mode</option>
            <option>Dark Mode</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label>Font Size</Form.Label>
          <Form.Select name="fontSize" value={formData.fontSize} onChange={handleChange}>
            <option>14 px</option>
            <option>16 px</option>
            <option>18 px</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label>Zoom Display</Form.Label>
          <Form.Select name="zoom" value={formData.zoom} onChange={handleChange}>
            <option>100 (Normal)</option>
            <option>125</option>
            <option>150</option>
          </Form.Select>
        </Col>
      </Row>

      <Button variant="secondary" disabled>Save Changes</Button>
    </div>
  );
}

export default SettingsPage;
