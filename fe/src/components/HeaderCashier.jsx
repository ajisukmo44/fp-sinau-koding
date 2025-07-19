import React, { useState, useEffect } from 'react';
import { Navbar, Form, Image, Button, Modal, Card, InputGroup, Row, Col } from 'react-bootstrap';
import { FiMenu, FiSearch } from './Icon';
import logout from '../assets/icon/logout.png';
import archive from '../assets/icon/archive-add.png';
import arrowRight from '../assets/icon/arrow-right.png'
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
  
  // Search state variables
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [modalSearchName, setModalSearchName] = useState('');
  const [modalSearchCategory, setModalSearchCategory] = useState('');

  const fetchSalesReport = async (searchParams = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        searchName: searchParams.searchName || searchName,
        searchCategory: searchParams.searchCategory || searchCategory,
      };
      
      const response = await api.get('/cashier/transactions', {
        headers: { Authorization: `Bearer ${token}` },
        params: params
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSalesReport({
      searchName: modalSearchName,
      searchCategory: modalSearchCategory
    });
  };

  const handleClearSearch = () => {
    setModalSearchName('');
    setModalSearchCategory('');
    fetchSalesReport({
      searchName: '',
      searchCategory: ''
    });
  };

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const {username: newUsername, avatar } = event.detail;
      // if (newName) setName(newName);
      if (newUsername) setUsername(newUsername);
      if (avatar) setavatarImage(avatar);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/cashier/login');
  };
  
  const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

  const handleArchive = () => {
    // console.log('archivee');
    fetchSalesReport();
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
          <Form.Control 
            type="text" 
            placeholder="Enter the keyword here" 
            className="ps-5 rounded-pill border-0 bg-light"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                fetchSalesReport();
              }
            }}
          />
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
           <div className="d-none d-md-block ms-4"  onClick={handleLogout} style={{ cursor: 'pointer' }} >
            <img src={logout} alt="Logo" className='me-2' style={{ width: '24px', height: '24px' }} /> 
          </div>
        </div>
      </div>
      </Navbar>

      {/* Archive Modal */}
      <Modal show={showArchiveModal} onHide={() => setShowArchiveModal(false)} size="lg">
        <Modal.Body className='bg-light pt-0 rounded'>
          <div className="row bg-white py-2 pt-3 rounded-top">
            <div className="col-10">
                <h5 className='pt-2'><b>Order Archive</b></h5>
            </div>
            <div className="col-2 text-end">
              <button onClick={() => setShowArchiveModal(false)} style={{ cursor: 'pointer', backgroundColor: '#ffffff', border: 'none', borderRadius: '50%', width: '30px', height: '30px' }}>X</button>
            </div>
          </div>
          <Row className="bg-light pb-3 pt-3 px-3">
            <Col md={6}>
              <Form.Control 
                placeholder="Enter the keyword here..." 
                value={modalSearchName}
                onChange={(e) => setModalSearchName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="rounded"
              />
            </Col>
            <Col md={4}>
              <Form.Select 
                value={modalSearchCategory}
                onChange={(e) => setModalSearchCategory(e.target.value)}
                className="rounded"
              >
                <option value="">Select type order</option>
                <option value='dine_in'>Dine-in</option>
                <option value='take_away'>Take away</option>
              </Form.Select>
            </Col>
            <Col md={2} className='pe-4'>
              <Button 
                variant="primary" 
                className="w-100 rounded"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Col>
          </Row>
          <div style={{ maxHeight: '80vh', overflowY: 'auto', left:0 }} className='p-3 bg-light rounded-bottom'>
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-muted">No orders found</p>
                {(modalSearchName || modalSearchCategory) && (
                  <Button variant="outline-secondary" size="sm" onClick={handleClearSearch} className="rounded">
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                {orders.map((order, index) => (
                  <Card key={index} className="mb-2 p-2 rounded">
                    <Row className='p-2'>
                      <Col md={7} className='pt-0'>
                        <small className='text-muted'>No Order {order.order_number} | {order.transaction_type == 'dine_in' ? 'Dine-in' : 'Take Away' } | {order.customer_name ?? '..'}  {!order.table_number ? ('') : (<span> | {order.table_number} </span>)}</small> <br />
                        <b>{formatRupiah(order.subtotal_group)}</b>
                      </Col>
                      <Col md={5} className="text-end">
                        <div className="text-muted small mb-1">{moment(order.created_at).locale("id").format('dddd, DD/MM/YYYY, HH:mm:ss')}</div>
                        <img src={arrowRight} alt="Logo" className='' style={{ width: '26px', height: '26px' }} />
                      </Col>
                    </Row>
                  </Card>
                ))}
                {(modalSearchName || modalSearchCategory) && (
                  <div className="text-center mt-3">
                    <Button variant="outline-secondary" size="sm" onClick={handleClearSearch} className="rounded">
                      Clear Search
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;