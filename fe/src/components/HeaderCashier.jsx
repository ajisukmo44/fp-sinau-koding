import React, { useState, useEffect } from 'react';
import { Navbar, Form, Image, Button, Modal, Card, InputGroup, Row, Col } from 'react-bootstrap';
import { FiMenu, FiSearch } from './Icon';
import logout from '../assets/icon/logout.png';
import archive from '../assets/icon/archive-add.png';
import { useLocation, useNavigate } from 'react-router-dom';
import urlImage from '../api/baseUrl';
import moment from 'moment';
import api from '../api';

const Header = ({ toggleSidebar, isSidebarOpen, isSidebarMinimized }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [avatarImage, setavatarImage] = useState(localStorage.getItem('avatar_image'));
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const fetchSalesReport = async () => {
    // setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/cashier/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const {username: newUsername, avatar } = event.detail;
      // if (newName) setName(newName);
      if (newUsername) setUsername(newUsername);
      if (avatar) setavatarImage(avatar);
    };

    fetchSalesReport()

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/cashier/login');
  };

  const handleArchive = () => {
    console.log('archivee');
    setShowArchiveModal(true);
  };


  return (
    <>
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
          <div className="d-none d-md-block ms-4 me-5 text-muted"  onClick={handleArchive} style={{ cursor: 'pointer' }} >
            <img src={archive} alt="Logo" className='me-2' style={{ width: '22px', height: '22px' }} />  Order Archive
          </div>
          <Image src={urlImage + '/users/'+avatarImage || `https://as2.ftcdn.net/jpg/08/19/66/31/1000_F_819663119_che4sZSrmQv8uQJOzuN9TVQFQNHJlfQ2.jpg`} roundedCircle width="40" height="40" className="me-2" alt="avatar"/>
          <div className="d-none d-md-block">
            <div className="fw-bold">{username ?? '-'}</div>
            <div className="text-muted small">{role?? '-'}</div>
          </div>
           {/* <div className="d-none d-md-block ms-4"  onClick={handleLogout} style={{ cursor: 'pointer' }} >
            <img src={logout} alt="Logo" className='me-2' style={{ width: '24px', height: '24px' }} /> 
          </div> */}
        </div>
      </div>
      </Navbar>

      {/* Archive Modal */}
      <Modal show={showArchiveModal} onHide={() => setShowArchiveModal(false)}   size="lg" rounded>
        <Modal.Body className='bg-light pt-0'>
          <div className="row bg-white py-2 pt-3">
            <div className="col-10">
                <h5 className='pt-2'><b>Order Archive</b></h5>
            </div>
            <div className="col-2 text-end">
              <button onClick={() => setShowArchiveModal(false)} style={{ cursor: 'mouse', backgroundColor: '#ffffff' }}>X</button>
            </div>
          </div>
          <Row className="bg-light pb-3 pt-3 px-3">
            <Col md={6}>
              <Form.Control placeholder="Enter the keyword here..." />
            </Col>
            <Col md={4}>
              <Form.Select>
                <option>Select type order</option>
                <option value='dine_in'>Dine-in</option>
                <option value='take_away'>Take away</option>
              </Form.Select>
            </Col>
            <Col md={2} className='pe-4'>
              <Button variant="primary" className="w-100 ">Search</Button>
            </Col>
          </Row>
          <div style={{ maxHeight: '80vh', overflowY: 'auto', left:0 }} className='p-3 bg-light'>
            {orders.map((order, index) => (
              <Card key={index} className="mb-2 px-2">
                <Card.Body className='p-0 px-3'>
                  <Row className='p-0'>
                    <Col md={8}>
                      <small className='text-muted'>No Order {order.order_number}</small> | {order.transaction_type} | {order.customer_name ?? '..'} <span> | {order.table_number}</span><br />
                      <b>Rp {order.subtotal_group}</b>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className="text-muted small">{order.created_at}</div>
                      <Button variant="outline-primary" size="xs" className="mt-2">
                        View
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowArchiveModal(false)}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default Header;