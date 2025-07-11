import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import foods from '../assets/icon/reserve1.png'
import beverages from '../assets/icon/coffe1.png'
import desserts from '../assets/icon/cake1.png'
import api from '../api';

const MenuApp = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/master-catalogs', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMenuData(response.data.data);
      if (response.data.length > 0) {
        setSelectedMenu(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const filteredMenuData = activeCategory === 'all' 
    ? menuData 
    : menuData.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  return (
      <Row className='mt-2'>
        {/* Left Panel - Menu List */}
        <Col md={8}>
          <div>
          <h4 className="fw-bolder">List Menu</h4>
          </div>
          <div className='text-start'>
            <div className="row">
              <div className="col-8">
              <Nav variant="pills" defaultActiveKey="all">
              <Nav.Item className='border rounded me-2'>
                <Nav.Link 
                  eventKey="all" 
                  active={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                >All Menu</Nav.Link>
              </Nav.Item>
              <Nav.Item className='border rounded me-2'>
                <Nav.Link 
                  eventKey="food"
                  active={activeCategory === 'foods'}
                  onClick={() => setActiveCategory('foods')}
                >  <img src={foods} alt="Logo" className='me-2 pb-1' style={{ width: '24px', height: '24px', objectFit: 'contain' }} /> Foods</Nav.Link>
              </Nav.Item>
              <Nav.Item className='border rounded me-2'>
                <Nav.Link 
                  eventKey="beverages"
                  active={activeCategory === 'beverages'}
                  onClick={() => setActiveCategory('beverages')}
                >  <img src={beverages} alt="Logo" className='me-2 pb-1' style={{ width: '24px', height: '24px', objectFit: 'contain' }} /> Beverages</Nav.Link>
              </Nav.Item>
              <Nav.Item className='border rounded me-2'>
                <Nav.Link 
                  eventKey="desserts"
                  active={activeCategory === 'desserts'}
                  onClick={() => setActiveCategory('desserts')}
                > <img src={desserts} alt="Logo" className='me-2 pb-1' style={{ width: '24px', height: '24px', objectFit: 'contain' }} /> Desserts</Nav.Link>
              </Nav.Item>
            </Nav>
              </div>
              <div className="col-4 text-end">
              <div className="text-muted mt-2">
                Total : <b>{filteredMenuData.length} Menu</b> 
              </div>
              </div>
            </div>
          </div>
          <Row className="mt-3">
            {loading ? (
              <Col className="text-center">
                <div>Loading...</div>
              </Col>
            ) : filteredMenuData.length === 0 ? (
              <Col className="text-center">
                <div>No menu items found</div>
              </Col>
            ) : (
              filteredMenuData.map((item, idx) => (
                <Col key={idx} md={4} className="mb-3">
                  <Card onClick={() => setSelectedMenu(item)} style={{ cursor: 'pointer' }}>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body className='px-0'>
                      <div className="row">
                        <div className="col-12 text-muted">
                          <h5><b>{item.name}</b></h5>
                          <small>{item?.description.slice(0, 100)} {item.description.length > 100 ? '...' : ''}</small>
                        </div>
                        <div className="col-8 mt-3">
                          <b>Rp {item.price}</b> <small className='text-muted'>/ Portion</small>
                        </div>
                        <div className="col-4 mt-3">
                            <span className="badge bg-primary">{item.category}</span>
                        </div>
                    </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>

        {/* Right Panel - Detail Menu */}
        <Col md={4} className='mt-4 pt-1'>
       
          <Card>
          <div className='row'>
            <div className="col-10">
                <h4 className="fw-bolder">Add Menu</h4>
            </div>
            <div className="col-2 text-end">
            <Button variant="primary" className="me-2 px-3"><b>+</b></Button>
            </div>
          </div>
          <hr />
            {selectedMenu ? (
              <>
                <Card.Img variant="top" src={selectedMenu.image} />
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-2">
                      <Form.Label>Name</Form.Label>
                      <Form.Control value={selectedMenu.name} readOnly />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Category</Form.Label>
                      <Form.Control value={selectedMenu.category} readOnly />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Price</Form.Label>
                      <Form.Control value={selectedMenu.price} readOnly />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={selectedMenu.description}
                        readOnly
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                      <Button variant="warning" className="me-2">Edit</Button>
                      <Button variant="danger">Delete</Button>
                    </div>
                  </Form>
                </Card.Body>
              </>
            ) : (
              <Card.Body>
                <div className="text-center text-muted">
                  Select a menu item to view details
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
  );
};

export default MenuApp;