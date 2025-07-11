import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { Calendar, Search } from 'react-bootstrap-icons';
import axios from 'axios';
import api from '../api';

function SalesReportData() {
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [dataDetailItem, setDataDetailItem] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    orderType: ''
  });

  // const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDetail = async (id) => {
    setShowModal(true);
    console.log('iddd', id);
    fetchOrderDataDetail(id)
  };

  const fetchSalesReport = async () => {
    console.log('mulaiii');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/sales-report', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('report sales', response);
      
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDataDetail = async (id) => {
    const key = id;
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/admin/sales-report/'+key, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDataDetail(data.data);
        setDataDetailItem(data.dataItem)
        console.log('data detail', data);
        
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    }

  useEffect(() => {
    fetchSalesReport();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    fetchSalesReport();
  };

  return (
    <div className="bg-white p-4 w-100 rounded shadow-sm">
    
      {/* Filters */}
      <Form className="mb-4">
        <Row className="align-items-end">
          <Col md={2}>
            <Form.Label>Start</Form.Label>
            <InputGroup>
              <Form.Control 
                type="date" 
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Label>Finish</Form.Label>
            <InputGroup>
              <Form.Control 
                type="date" 
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Label>Category</Form.Label>
            <Form.Select 
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Select category</option>
              <option value="Foods">Foods</option>
              <option value="Drinks">Drinks</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Order Type</Form.Label>
            <Form.Select 
              value={filters.orderType}
              onChange={(e) => handleFilterChange('orderType', e.target.value)}
            >
              <option value="">Select order type</option>
              <option value="Dine-in">Dine-in</option>
              <option value="Takeaway">Takeaway</option>
            </Form.Select>
          </Col>
          <Col md={4} className='text-end'>
          <Button 
            className='me-2 px-4 btn-primary' 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </Button>
          <Button variant="outline-secondary" className='px-3'>V</Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <table bordered responsive>
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
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">Loading...</td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No data found</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{order.order_number}</td>
                <td>{order.transaction_type}</td>
                <td>{order.customer_name}</td>
                <td className='text-center'>
                  <Button size='sm' className='px-3 py-1 btn-primary' onClick={() => handleDetail(order.id)}>
                    Detail
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {/* <div className="d-flex justify-content-between align-items-center">
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
      </div> */}

      <Modal show={showModal} onHide={handleClose}>
        {/* <Modal.Header closeButton>
        </Modal.Header> */}
        <Modal.Body className='p-3'>
          <div className='text-end'>
            <button className='bordered' onClick={handleClose}>X</button>
          </div>
          {/* Place your detail content here */}
          <div className='text-center pt-1 mt-2 mb-4'>
              <h2><b>Transaction Detail</b></h2>
          </div>
          <div className="rounded bg-light p-4 mb-4">
            <span><small className='text-muted'>No Order : </small><small>{dataDetail?.order_number }</small></span> <br />
            <span><small className='text-muted'>Order Date :  </small><small>{dataDetail?.created_at }</small></span><br />
            <span><small className='text-muted'>Customer Name : </small><small>{ dataDetail?.customer_name}</small> </span><br />
            <span><small className='text-muted'>Dine-in : </small><small> No.Meja { dataDetail?.table_number}</small></span>
            <hr />
            <div className="mt-2">
                {dataDetailItem.map((item, index) => (
                  <div className="row mb-2" key={index}>
                    <div className="col-8">
                      <b>{item.name}</b> <br />
                      <small>{item.quantity} x Rp {item.price} </small>
                    </div>
                    <div className="col-4 text-end">
                      <small><b>Rp {item.subtotal}</b></small>
                    </div>
                  </div>
                ))}
            </div>
            <hr />
            <div className="row">
              <div className="col-8">
                <small className='text-muted'>Sub Total</small>  <br />
              </div>
              <div className="col-4 text-end">
               <small> Rp {dataDetail?.subtotal_group}</small>
              </div>
            </div>
            <div className="row">
              <div className="col-8">
              <small className='text-muted'>Tax</small>  <br />
              </div>
              <div className="col-4 text-end">
             <small> Rp {dataDetail?.tax}</small>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-8">
                <h5><b>Total</b></h5>  <br />
              </div>
              <div className="col-4 text-end">
                <h5><b>Rp {parseFloat(dataDetail?.subtotal_group)+parseFloat(dataDetail?.tax)}</b></h5>
              </div>
            </div>
            <div className="row">
              <div className="col-8">
              <small className='text-muted'>Diterima</small>  <br />
              <small className='text-muted'>Kembalian</small>  <br />
              </div>
              <div className="col-4 text-end">
                <small>Rp {dataDetail?.cash}</small> <br />
                <small>Rp {dataDetail?.cashback}</small>
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