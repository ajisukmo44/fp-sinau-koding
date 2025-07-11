import React from 'react';
import { Navbar, Form, Image, Button } from 'react-bootstrap';
import { FiMenu, FiSearch } from './Icon';

const Header = ({ toggleSidebar, isSidebarOpen, isSidebarMinimized }) => {
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
        <div className="d-flex align-items-center ms-auto">
          <Image src={`https://i.pravatar.cc/40?u=john.doe`} roundedCircle width="40" height="40" className="me-2" alt="Foto Profil John Doe"/>
          <div className="d-none d-md-block">
            <div className="fw-bold">John Doe</div>
            <div className="text-muted small">Admin</div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;