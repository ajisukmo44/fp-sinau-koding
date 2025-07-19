import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import api from '../api';
import tickCircle from '../assets/icon/tick-circle.png';
import urlImage from '../api/baseUrl';

function SettingsPage() {
  const [formData, setFormData] = useState({
    id:'',
    email: '',
    name:'',
    username: '',
    role: '',
    status: '',
    language: 'English',
    password: '',
    mode: 'Light Mode',
    fontSize: '16 px',
    zoom: '100 (Normal)',
  });
  const [loading, setLoading] = useState(false);
  const [avatarImage, setAvatarImage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/admin/profile');
      const profile = response.data.data?.user;
      // console.log('profile', profile);
      setFormData(prev => ({
        ...prev,
        id: profile.id || '',
        name: profile.name || '',
        email: profile.email || '',
        username: profile.username || '',
        role: profile.role || '',
        status: profile.status || '',
      }));
      setAvatarImage(profile.avatar || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      await api.put('/profile/admin/edit', {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        language: formData.language,
      });
      setShowAlert(true);
      setMessageAlert('Profile successfully updated!');
      
      localStorage.setItem('username', formData.username);
      localStorage.setItem('name', formData.name);
      
      // Dispatch custom event to reload header
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { name: formData.name, username: formData.username }
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const changePicture = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    setLoading(true);
    try {
      const response = await api.patch('/profile/admin/change-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAvatarImage(response.data.data.image_url);
      setShowAlert(true);
      setMessageAlert('Picture updated successfully!');
      
      // Update localStorage and dispatch event for header reload
      localStorage.setItem('avatar_image', response.data.data.image_url);
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { avatar: response.data.data.image_url }
      }));
    } catch (error) {
      console.error('Error updating picture:', error);
      alert('Failed to update picture');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.patch('/profile/admin/change-password', {
        password: newPassword
      });
      setNewPassword('');
      setConfirmPassword('');
      setShowAlert(true);
      setMessageAlert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) changePicture(file);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-5">
      {/* Account Section */}
      <h5 className="mt-0">Account</h5>
       {showAlert ? (
          <div className="alert-success mb-2">
              <div className="alert-message">  <img src={tickCircle} alt="icon" className='mx-0 me-2'/><span className='ms-2'>{messageAlert}</span></div>
              <div className="alert-close" onClick={() => setShowAlert(false)}>&times;</div>
            </div>
        ) :  (
          ''
        )}
      <Row className="mb-3 align-items-center">
        <Col md="auto">
         <img
            src={urlImage + '/users/'+avatarImage|| "https://as2.ftcdn.net/jpg/08/19/66/31/1000_F_819663119_che4sZSrmQv8uQJOzuN9TVQFQNHJlfQ2.jpg"}
            alt="Profile"
            className="rounded-circle"
            width="80"
            height="80"
          />
        </Col>
        <Col md="auto">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <Button 
            variant="primary" 
            className="me-2 px-3"
            onClick={() => document.getElementById('fileInput').click()}
            disabled={loading}
          >
            Change Picture
          </Button>
          <Button variant="outline-primary">Delete Picture</Button>
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
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Col>
      </Row>

      <Row className="mb-3">
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

       <Col md={12} className='mt-4 mb-5'>
         <Button 
            variant="primary" 
            className='px-5'
            onClick={updateProfile}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
       </Col>
      </Row>

      {/* Password Section */}
      <Row className="mb-5">
        <h5 className="mt-4">Password</h5>
        <Col md={4}>
          <div className='mb-3'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          </div>
          <div className='mb-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <div className='mb-2 d-flex align-items-end'>
             <Button 
                variant="primary" 
                className='px-3'
                onClick={changePassword}
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? 'Updating...' : 'Change Password'}
              </Button>
          </div>
        </Col>
      </Row>

      {/* Appearance Section */}
      {/* <Row className="mb-5">
        
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
      </Row> */}
    </div>
  );
}

export default SettingsPage;
