import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FiGrid, FiFileText, FiSettings, FiLogOut, FiMenu } from './Icon';
import logo from '../assets/logo.png';
import logoMin from '../assets/logo-p.png';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, minimized, onToggleMinimize }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`sidebar bg-white shadow-sm ${isOpen ? 'open' : ''} ${minimized ? 'minimized' : ''}`}>
      <div className="p-3 d-flex flex-column h-100 align-items-center">
       
        <Navbar.Brand href="#" className="d-flex mb-4 text-dark text-decoration-none justify-content-center w-100">
          <img
            src={minimized ? logoMin : logo}
            alt="Logo"
            style={{ width: minimized ? '40px' : '120px', height: '40px', objectFit: 'contain', transition: 'width 0.2s' }}
            onClick={onToggleMinimize}
          />
        </Navbar.Brand>
        {/* <hr />
        <Button
          variant="light"
          size="sm"
          className="mb-3"
          onClick={handleMinimize}
          aria-label={minimized ? 'Expand sidebar' : 'Minimize sidebar'}
        >
          <FiMenu />
        </Button> */}
        <Nav variant="pills" className="flex-column mb-auto w-100 mt-4">
          <Nav.Item>
            <Nav.Link
              href="/dashboard-admin"
              active={location.pathname === '/dashboard-admin'}
              className="d-flex align-items-center justify-content-start"
            >
              <FiGrid className="me-2" /> {!minimized && 'Dashboard'}
            </Nav.Link>
          </Nav.Item>
          <Nav.Link href="/master-catalog"  active={location.pathname === '/master-catalog'} className="d-flex align-items-center justify-content-start">
              <FiFileText className="me-2" /> {!minimized && 'Catalog Menu'}
            </Nav.Link>
          <Nav.Item>
            <Nav.Link
              href="/report-sales"
              active={location.pathname === '/report-sales'}
              className="d-flex align-items-center justify-content-start"
            >
              <FiFileText className="me-2" /> {!minimized && 'Reports'}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="/setting"
              active={location.pathname === '/setting'}
              className="d-flex align-items-center justify-content-start"
            >
              <FiSettings className="me-2" /> {!minimized && 'Settings'}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="mt-auto w-100 d-flex justify-content-center">
           <Nav.Link onClick={handleLogout} className="d-flex align-items-center text-danger justify-content-start" style={{cursor: 'pointer'}}>
              <FiLogOut className="me-2" /> {!minimized && 'Logout'}
            </Nav.Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
