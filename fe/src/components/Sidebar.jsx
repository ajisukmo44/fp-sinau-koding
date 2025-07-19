import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FiGrid, FiFileText, FiSettings, FiLogOut, FiMenu } from './Icon';
import logo from '../assets/logo.png';
import logoMin from '../assets/logo-p.png';
import { useLocation, useNavigate } from 'react-router-dom';
import dashboard from '../assets/icon/dashboard.png'
import setting from '../assets/icon/setting.png'
import menuboard from '../assets/icon/menu-board.png'
import report from '../assets/icon/report.png'
import logout from '../assets/icon/logout.png';
import dashboardActive from '../assets/icon/dashboard-active.png'
import settingActive from '../assets/icon/setting-active.png'
import menuboardActive from '../assets/icon/menu-board-active.png'
import reportActive from '../assets/icon/report-active.png'
import arrowLeft from '../assets/icon/arrow-left.png'
import arrowRight from '../assets/icon/arrow-right.png'
import userPng from '../assets/icon/user.png'
import scan from '../assets/icon/scan.png'
import tagUser from '../assets/icon/tag-user.png'

const Sidebar = ({ isOpen, minimized, onToggleMinimize }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className={`sidebar bg-white shadow-sm ${isOpen ? 'open' : ''} ${minimized ? 'minimized' : ''}`}>
      <div className="d-flex flex-column h-100 align-items-center px-0 py-3 mx-0 ps-1">
       
        <Navbar.Brand className={`d-flex mb-2 text-dark text-decoration-none w-100 ${minimized ? 'justify-content-center' : 'justify-content-between'}`}>
          <img
            src={minimized ? logoMin : logo}
            alt="Logo"
            style={{ width: minimized ? '40px' : '120px', height: '40px', objectFit: 'contain', transition: 'width 0.2s' }}
            className='me-2'
          />
           { !minimized ? ( <img
              src={arrowLeft}
              alt="Logo"
              style={{ width: minimized ? '32px' : '32px', height: '32px', objectFit: 'contain', transition: 'width 0.2s', cursor: 'pointer' }}
              onClick={onToggleMinimize}
             className='me-2'
            />) : ('') }
        </Navbar.Brand>
        <hr className="w-100 hr-sidebar my-3" />
         { minimized ? ( <img
              src={minimized ? arrowRight : ''}
              alt="Logo"
              style={{ width: minimized ? '32px' : '32px', height: '32px', transition: 'width 0.2s', cursor: 'pointer' }}
          onClick={onToggleMinimize}
          className='me-2'
        />) : ('')}
        
          { minimized ? ( <hr className="w-100 hr-sidebar my-3" />) : ('') }
        <Nav variant="pills" className="flex-column justify-content-center mb-auto w-100 mt-4 ps-2 m-0">
          <Nav.Item>
            <Nav.Link
              href="/admin/dashboard-admin"
              active={location.pathname === '/admin/dashboard-admin'}
              className="d-flex align-items-center justify-content-start"
            >
              <img src={location.pathname === '/admin/dashboard-admin' ? dashboardActive : dashboard} className='me-2' /> {!minimized && 'Dashboard'}
            </Nav.Link>
          </Nav.Item>
          <Nav.Link href="/admin/master-catalog"  active={location.pathname === '/admin/master-catalog'} className="d-flex align-items-center justify-content-start">
              <img src={location.pathname === '/admin/master-catalog' ? menuboardActive : menuboard} alt="Logo" className='me-2' style={{ width: '24px', height: '24px' }} />  {!minimized && 'Catalog Menu'}
            </Nav.Link>
          <Nav.Item>
            <Nav.Link
              href="/admin/report-sales"
              active={location.pathname === '/admin/report-sales'}
              className="d-flex align-items-center justify-content-start"
            >
              <img src={location.pathname === '/admin/report-sales' ? reportActive : report} alt="Logo" className='me-2' style={{ width: '24px', height: '24px', objectFit: 'contain' }} />   {!minimized && 'Reports'}
            </Nav.Link>
          </Nav.Item>
          
        <hr className="w-100 hr-sidebar my-3" />
        <Nav.Item>
            <Nav.Link
              href="/admin/setting"
              active={location.pathname === '/admin/setting'}
              className="d-flex align-items-center justify-content-start"
            >
              <img src={location.pathname === '/admin/setting' ? settingActive : setting} alt="Logo" className='me-2' style={{ width: '24px', height: '24px', objectFit: 'contain' }} /> {!minimized && 'Settings Profile'}
            </Nav.Link>
          </Nav.Item>
        <Nav.Item>
            <Nav.Link
              href="/admin/master-user"
              active={location.pathname === '/admin/master-user'}
              className="d-flex align-items-center justify-content-start"
            >
              <img src={location.pathname === '/admin/master-user' ? userPng : userPng} alt="Logo" className='me-2' style={{ width: '24px', height: '24px', objectFit: 'contain',  opacity: '0.3' }} /> {!minimized && 'Master User'}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="/admin/setting-apps"
              active={location.pathname === '/admin/setting-apps'}
              className="d-flex align-items-center justify-content-start"
            >
              <img src={location.pathname === '/admin/setting-apps' ? scan : scan} alt="Logo" className='me-2' style={{ width: '23px', height: '22px', objectFit: 'contain', opacity: '0.3' }} /> {!minimized && 'Settings Apps'}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="mt-auto w-100 d-flex justify-content-center">
           <Nav.Link onClick={handleLogout} className="d-flex align-items-center text-danger justify-content-start bg-light p-2 px-3 rounded" style={{cursor: 'pointer'}}>
               <img src={logout} alt="Logo" className='me-2' style={{ width: '24px', height: '24px', objectFit: 'contain' }} /> {!minimized && 'Logout'}
            </Nav.Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
