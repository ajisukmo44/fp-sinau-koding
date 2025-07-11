import React, { useState } from 'react';
import { Table, Form, Button, Row, Col, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { Calendar, Search } from 'react-bootstrap-icons';

function SalesReportData() {
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const orders = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    orderNo: 'ORDER1234567890',
    orderDate: 'Rabu, 18/09/2024 12:30:00',
    orderType: 'Dine-in',
    category: 'Foods',
    customerName: 'Anisa',
  }));

  return (
    <div className="bg-white p-4 w-100 rounded shadow-sm">
    
      {/* Filters */}
      <Form className="mb-4">
        <Row className="align-items-end">
          <Col md={2}>
            <Form.Label>Start</Form.Label>
            <InputGroup>
              <Form.Control type="date" />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Label>Finish</Form.Label>
            <InputGroup>
              <Form.Control type="date" />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Label>Category</Form.Label>
            <Form.Select>
              <option>Select category</option>
              <option>Foods</option>
              <option>Drinks</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Order Type</Form.Label>
            <Form.Select>
              <option>Select order type</option>
              <option>Dine-in</option>
              <option>Takeaway</option>
            </Form.Select>
          </Col>
          <Col md={4} className='text-end'>
          <Button  className='me-2 px-4 btn-primary'> Search</Button>
          <Button variant="outline-secondary" className='px-3'>V</Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <Table bordered responsive>
        <thead className="table-light">
          <tr>
            <th>No Order</th>
            <th>Order Date</th>
            <th>Order Type</th>
            {/* <th>Category</th> */}
            <th>Customer Name</th>
            <th className='text-center' width={'10%'}>Detail</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.orderNo}</td>
              <td>{order.orderDate}</td>
              <td>{order.orderType}</td>
              {/* <td>{order.category}</td> */}
              <td>{order.customerName}</td>
              <td className='text-center'>
                <Button size='sm' className='px-3 py-1 btn-primary' onClick={handleShow}>
                  Detail
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <Form.Select style={{ width: 'auto' }}>
          <option>Show: 10</option>
          <option>Show: 20</option>
          <option>Show: 50</option>
        </Form.Select>
        <Pagination>
          <Pagination.Prev />
          <Pagination.Item active>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item>3</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        {/* <Modal.Header closeButton>
        </Modal.Header> */}
        <Modal.Body className='p-3'>
          <div className='text-end'>
            <button className='bordered' onClick={handleClose}>X</button>
          </div>
          {/* Place your detail content here */}
          <div className='text-center pt-3 mt-2 mb-4'>
              <h2><b>Transaction Detail</b></h2>
          </div>
          <div className="rounded bg-light p-4 mb-4">
            <span><small className='text-muted'>No Order : </small><small>TRX-0001</small></span> <br />
            <span><small className='text-muted'>Order Date :  </small><small>Rabu, 18/09/2024 12:30:00</small></span><br />
            <span><small className='text-muted'>Customer Name : </small><small>Anisa</small> </span><br />
            <span><small className='text-muted'>Dine-in : </small><small> No.Meja 02 </small></span>
            <hr />
            <div className="row">
              <div className="col-8">
               <b> Gado Gado Spesial</b> <br />
                 <small>1 x Rp 20.000</small>
              </div>
              <div className="col-4">
                Rp 20.000
              </div>
              <div className="col-8">
               <b> Gado Gado Spesial</b> <br />
                 <small>1 x Rp 20.000</small>
              </div>
              <div className="col-4">
                Rp 20.000
              </div> 
            </div>
            <hr />
            <div className="row">
              <div className="col-8">
                <small className='text-muted'>Sub Total</small>  <br />
              </div>
              <div className="col-4">
                Rp 20.000
              </div>
            </div>
            <div className="row">
              <div className="col-8">
              <small className='text-muted'>Tax</small>  <br />
              </div>
              <div className="col-4">
                Rp 5.000
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-8">
                <small><b>Total</b></small>  <br />
              </div>
              <div className="col-4">
                <h5>Rp 20.000</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-8">
              <small className='text-muted'>Tax</small>  <br />
              <small className='text-muted'>Kembalian</small>  <br />
              </div>
              <div className="col-4">
                <span>Rp 5.000</span> <br />
                <span>Rp 5.000</span>
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

export default SalesReportData;