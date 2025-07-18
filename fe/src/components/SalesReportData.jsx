import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, InputGroup, Pagination, Modal, Badge  } from 'react-bootstrap';
import { Calendar, Search } from 'react-bootstrap-icons';
import axios from 'axios';
import moment from 'moment';
import api from '../api';
import download from '../assets/icon/download.png';

function SalesReportData() {
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [dataDetailItem, setDataDetailItem] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    transaction_type: ''
  });
  const [pendingFilters, setPendingFilters] = useState({
    startDate: '',
    endDate: '',
    transaction_type: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

  // const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDetail = async (id) => {
    setShowModal(true);
    fetchOrderDataDetail(id)
  };

  const formatDate = async (date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  const fetchSalesReport = async (page = pagination.page, pageSize = pagination.pageSize) => {
    // console.log('mulaiii');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/sales-report', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...filters,
          limit: pageSize,
          page: page,
        }
      });
      setOrders(response.data.data);
      setPagination({
        ...pagination,
        ...response.data.pagination, // update with backend response
      });
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

  const exportDataExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/export/excel', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for file downloads!
         params: filters
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      // You can set a default filename here
      link.setAttribute('download', 'sales-report.xlsx');
      document.body.appendChild(link);
      link.click();
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  // Debounced effect for filters and pagination
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      fetchSalesReport(pagination.page, pagination.pageSize);
    }, 200); // 2ms debounce
    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line
  }, [filters, pagination.page, pagination.pageSize]);

  // Only update pendingFilters on change
  const handleFilterChange = (field, value) => {
    setPendingFilters(prev => ({ ...prev, [field]: value }));
  };

  // Only when Search is clicked, copy pendingFilters to filters and reset page
  const handleSearch = () => {
    setFilters({ ...pendingFilters });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="bg-white p-4 w-100 rounded shadow-sm mb-5">
    
      {/* Filters */}
      <Form className="mb-4">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Label>Start</Form.Label>
            <InputGroup>
              <Form.Control 
                type="date" 
                value={pendingFilters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Label>Finish</Form.Label>
            <InputGroup>
              <Form.Control 
                type="date" 
                value={pendingFilters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Label>Order Type</Form.Label>
            <Form.Select 
              value={pendingFilters.transaction_type}
              onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
            >
              <option value="">Select order type</option>
              <option value="dine_in">Dine-in</option>
              <option value="take_away">Takeaway</option>
            </Form.Select>
          </Col>
          <Col md={3} className='text-end'>
          <Button 
            className='me-2 px-4 btn-primary' 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </Button>
          <Button variant="white" className='p-0' onClick={exportDataExcel}>
             <img src={download} alt="Logo" className='me-0 pb-0' style={{ width: '38px', height: '38px'}} />
          </Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <table>
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
                <td>{moment(order.created_at).locale("id").format('dddd, DD/MM/YYYY, HH:mm:ss')}</td>
                <td> {order.transaction_type == 'dine_in' ? ( <Badge bg="secondary">Dine-in</Badge>) : ( <Badge bg="success">Take Away</Badge>)} 
                </td>
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

      <hr />

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Total Data : <b>{pagination?.total}</b>
          </div>
          <nav aria-label="Page navigation example">
            <ul className="pagination pagination-md">
              <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)} aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              {[...Array(pagination.totalPages)].map((_, idx) => (
                <li key={idx} className={`page-item ${pagination.page === idx + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(idx + 1)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)} aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        {/* <Modal.Header closeButton>
        </Modal.Header> */}
        <Modal.Body className='p-3 px-4'>
          <div className='text-end'>
            <button className='bordered' onClick={handleClose}>X</button>
          </div>
          {/* Place your detail content here */}
          <div className='text-center pt-1 mt-2 mb-4'>
              <h4><b>Transaction Detail</b></h4>
          </div>
          <div className="rounded bg-invoice p-3 mb-4">
            <span><small className='text-muted'>No Order : </small><small>{dataDetail?.order_number }</small></span> <br />
            <span><small className='text-muted'>Order Date :  </small><small>{moment(dataDetail?.created_at).locale("id").format('dddd, DD/MM/YYYY, HH:mm:ss')}</small></span><br />
            <span><small className='text-muted'>Customer Name : </small><small>{ dataDetail?.customer_name}</small> </span><br />
            <span><small> {dataDetail?.transaction_type == 'dine_in' ? (<><span>Dine-in : No.Meja { dataDetail?.table_number}</span></>) : (<span><b>Take Away</b></span>)} </small></span>
            <hr />
            <div className="mt-2">
                {dataDetailItem.map((item, index) => (
                  <div className="row mb-2" key={index}>
                    <div className="col-8">
                     <small> <b>{item.name}</b> <br /></small>
                    <small className='text-muted'>{item.quantity} x {formatRupiah(item.price)} </small>
                    </div>
                    <div className="col-4 text-end">
                      <small><b>{formatRupiah(item.subtotal)}</b></small>
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
               <small>{formatRupiah(dataDetail?.subtotal_group)}</small>
              </div>
            </div>
            <div className="row">
              <div className="col-8">
              <small className='text-muted'>Tax</small>  <br />
              </div>
              <div className="col-4 text-end">
             <small>{formatRupiah(dataDetail?.tax)}</small>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-8">
                <h5><b>Total</b></h5>  <br />
              </div>
              <div className="col-4 text-end">
                <h5><b>{formatRupiah(parseFloat(dataDetail?.subtotal_group)+parseFloat(dataDetail?.tax))}</b></h5>
              </div>
            </div>
            <div className="row">
              <div className="col-8">
              <small className='text-muted'>Diterima</small>  <br />
              <small className='text-muted'>Kembalian</small>  <br />
              </div>
              <div className="col-4 text-end">
                <small>{formatRupiah(dataDetail?.cash)}</small> <br />
                <small>{formatRupiah(dataDetail?.cashback)}</small>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SalesReportData;