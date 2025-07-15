import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FiGrid, FiFileText, FiSettings, FiLogOut, FiMenu } from './Icon';
import logo from '../assets/logo.png';
import logoMin from '../assets/logo-p.png';
import { useLocation, useNavigate } from 'react-router-dom';

import dashboard from '../assets/icon/dashboard.png'
import setting from '../assets/icon/setting.png'
import menuoard from '../assets/icon/menu-board.png'
import report from '../assets/icon/report.png'

const Sidebar = ({ isOpen, minimized, onToggleMinimize }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
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
              href="/admin/dashboard-admin"
              active={location.pathname === '/admin/dashboard-admin'}
              className="d-flex align-items-center justify-content-start"
            >
              <img src={dashboard} className='me-2' /> {!minimized && 'Dashboard'}
            </Nav.Link>
          </Nav.Item>
          <Nav.Link href="/admin/master-catalog"  active={location.pathname === '/admin/master-catalog'} className="d-flex align-items-center justify-content-start">
              <img src={menuoard} alt="Logo" className='me-2' style={{ width: '24px', height: '24px' }} />  {!minimized && 'Catalog Menu'}
            </Nav.Link>
          <Nav.Item>
            <Nav.Link
              href="/admin/report-sales"
              active={location.pathname === '/admin/report-sales'}
              className="d-flex align-items-center justify-content-start"
            >
              <img src={report} alt="Logo" className='me-2' style={{ width: '24px', height: '24px', objectFit: 'contain' }} />   {!minimized && 'Reports'}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="/admin/setting"
              active={location.pathname === '/admin/setting'}
              className="d-flex align-items-center justify-content-start"
            >
              <img src={setting} alt="Logo" className='me-2' style={{ width: '24px', height: '24px', objectFit: 'contain' }} /> {!minimized && 'Settings'}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="mt-auto w-100 d-flex justify-content-center">
           <Nav.Link onClick={handleLogout} className="d-flex align-items-center text-danger justify-content-start bg-light p-2 px-3 rounded" style={{cursor: 'pointer'}}>
              <FiLogOut className="me-2" /> {!minimized && 'Logout'}
            </Nav.Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
