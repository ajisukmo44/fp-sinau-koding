import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button } from 'react-bootstrap';

const menuData = new Array(12).fill({
  name: 'Gado-gado Special',
  price: 'Rp 20.000',
  category: 'Food',
  description: 'Vegetables, egg, tempe, tofu, ketupat, peanut sauce, and kerupuk',
  image: 'https://awsimages.detik.net.id/community/media/visual/2024/02/14/resep-gado-gado-siram.jpeg?w=600&q=90', // Replace with your image path
});


const handleClick = (e) => {
  console.log('dataa', e);

}

const MenuApp = () => {
  const [selectedMenu, setSelectedMenu] = useState(menuData[0]);

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
                <Nav.Link eventKey="all">All Menu</Nav.Link>
              </Nav.Item>
              <Nav.Item className='border rounded me-2' onClick={handleClick}>
                <Nav.Link eventKey="food">Foods</Nav.Link>
              </Nav.Item>
              <Nav.Item className='border rounded me-2'>
                <Nav.Link eventKey="beverage">Beverages</Nav.Link>
              </Nav.Item>
              <Nav.Item className='border rounded me-2'>
                <Nav.Link eventKey="dessert">Dessert</Nav.Link>
              </Nav.Item>
            </Nav>
              </div>
              <div className="col-4 text-end">
              <div className="text-muted mt-2">
                Total : <b> 30 Menu</b> 
              </div>
              </div>
            </div>
          </div>
          <Row className="mt-3">
            {menuData.map((item, idx) => (
              <Col key={idx} md={4} className="mb-3">
                <Card onClick={() => setSelectedMenu(item)} style={{ cursor: 'pointer' }}>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text className="text-primary">{item.price}</Card.Text>
                    <span className="badge bg-primary">{item.category}</span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
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
            <Button variant="primary" className="me-2"><b>+</b></Button>
            </div>
          </div>
          <hr />
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
          </Card>
        </Col>
      </Row>
  );
};

export default MenuApp;