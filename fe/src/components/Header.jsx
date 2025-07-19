import React, { useState, useEffect } from 'react';
import { Navbar, Form, Image, Button } from 'react-bootstrap';
import { FiMenu, FiSearch } from './Icon';
import logout from '../assets/icon/logout.png';
import { useLocation, useNavigate } from 'react-router-dom';
import urlImage from '../api/baseUrl';

const Header = ({ toggleSidebar, isSidebarOpen, isSidebarMinimized }) => {
  const navigate = useNavigate();
  const [role, setName] = useState(localStorage.getItem('role'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [avatarImage, setavatarImage] = useState(localStorage.getItem('avatar_image'));

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const { name: newName, username: newUsername, avatar } = event.detail;
      if (newName) setName(newName);
      if (newUsername) setUsername(newUsername);
      if (avatar) setavatarImage(avatar);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <Navbar 
      bg="white" 
      className={`px-4 py-3 shadow-sm navbar-fixed ${isSidebarMinimized ? 'navbar-minimized' : ''}`}
    >
      <div className="d-flex w-100 justify-content-between align-items-center">
        <Button variant="light" className="d-lg-none me-2" onClick={toggleSidebar}>
          <FiMenu />
        </Button>
        <div className="position-relative flex-grow-1 flex-lg-grow-0" style={{maxWidth: '400px'}}>
          <FiSearch className="position-absolute" style={{ top: '50%', left: '15px', transform: 'translateY(-50%)', color: '#aaa' }} />
          <Form.Control type="text" placeholder="Enter the keyword here" className="ps-5 rounded-pill border-0 bg-light" />
        </div>
        <div className="d-flex align-items-center ms-auto me-4">
          <Image src={urlImage + '/users/'+avatarImage || `https://as2.ftcdn.net/jpg/08/19/66/31/1000_F_819663119_che4sZSrmQv8uQJOzuN9TVQFQNHJlfQ2.jpg`} roundedCircle width="40" height="40" className="me-2" alt="avatar"/>
          <div className="d-none d-md-block">
            <div className="fw-bold">{username ?? '-'}</div>
            <div className="text-muted small">{role?? '-'}</div>
          </div>
           <div className="d-none d-md-block ms-4"  onClick={handleLogout} style={{ cursor: 'pointer' }} >
            <img src={logout} alt="Logo" className='me-2' style={{ width: '24px', height: '24px' }} /> 
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;