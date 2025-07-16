import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button, Modal, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import foods from '../assets/icon/reserve1.png'
import beverages from '../assets/icon/coffe1.png'
import desserts from '../assets/icon/cake1.png'
import deleted from '../assets/icon/deleted.png';
import tickCircle from '../assets/icon/tick-circle.png';
import add from '../assets/icon/add.png';
import edit from '../assets/icon/edit.png';
import deletedd from '../assets/icon/deletedd.png';
import logo from '../assets/logo.png';
import api from '../api';
import urlImage from '../api/baseUrl';
import Alert from 'react-bootstrap/Alert';
import { Trash, Plus, Dash } from 'react-bootstrap-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';

const MenuApp = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [addForm, setAddForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: null
  });
  const [adding, setAdding] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderType, setOrderType] = useState('dine_in');
  const [customerName, setCustomerName] = useState('');
  // const [cashPayment, setCashPayment] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [dataDetailItem, setDataDetailItem] = useState(null);
  const [paying, setPaying] = useState(false);
  // const urlImage = urlImage;

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

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

  const addToOrder = (item) => {
    const existingItem = orderList.find(order => order.id === item.id);
    if (existingItem) {
      setOrderList(prev => prev.map(order => 
        order.id === item.id 
          ? { ...order, quantity: order.quantity + 1 }
          : order
      ));
    } else {
      setOrderList(prev => [...prev, { ...item, quantity: 1 }]);
    }
    calculateTotal();
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(id);
    } else {
      setOrderList(prev => prev.map(order => 
        order.id === id ? { ...order, quantity: newQuantity } : order
      ));
    }
    calculateTotal();
  };

  const removeFromOrder = (id) => {
    setOrderList(prev => prev.filter(order => order.id !== id));
    calculateTotal();
  };

  const calculateTotal = () => {
    const subtotal = orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    setOrderTotal(subtotal + tax);
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      const token = localStorage.getItem('token');
      const subtotal = orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      
      const orderData = {
        customer_name: customerName,
        transaction_type: orderType,
        table_number: orderType === 'dine_in' ? tableNumber : null,
        items: orderList.map(item => ({
          catalog_id: item.id,
          quantity: item.quantity,
          subtotal: item.price*item.quantity,
          note: '-'
        })),
        subtotal_group : subtotal,
        tax : tax,
        cash : paymentAmount,
        cashback : (parseFloat(paymentAmount)-(total))
      };
      // console.log('orderData', orderData);
      const response = await api.post('/cashier/transactions', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowInvoiceModal(true);
      setDataDetailItem(response.data.dataItem)
      setInvoiceData(response.data.data);
      setShowInvoiceModal(true);
      setOrderList([]);
      setCustomerName('');
      setTableNumber('');
      setPaymentAmount('');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const printInvoice = async () => {
    const element = document.getElementById('printPDF');
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const x = (pageWidth - imgWidth) / 2;
    
    let position = 10;
    let heightLeft = imgHeight;
    
    pdf.addImage(imgData, 'PNG', x, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - 20);
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', x, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20);
    }
    
    pdf.save(`invoice-${invoiceData?.order_number}.pdf`);
  };

  return (
    <>
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
                  <Card onClick={() => addToOrder(item)} style={{ cursor: 'pointer' }} className='h-100'>
                    <Card.Img variant="top" src={urlImage + '/catalogs/' + item.image}  style={{ width: '100%', height: '200px' }} />  
                    <Card.Body className='px-0'>
                      <div className="row">
                        <div className="col-12 text-muted">
                          <h5><b>{item.name} </b></h5>
                          <small>{item?.description.slice(0, 100)} {item.description.length > 100 ? '...' : ''}</small>
                        </div>
                        <div className="col-8 mt-3">
                          <b>{formatRupiah(item.price)}</b> <small className='text-muted'>/ Portion</small>
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
            <h5><strong>List Order</strong></h5>
            {/* <small>No Order <strong>ORDR#1234567890</strong></small> */}
            <div className="d-flex mt-3 mb-2">
              <Button 
                variant={orderType === 'dine_in' ? 'primary' : 'outline-secondary'} 
                className="flex-fill me-2"
                onClick={() => setOrderType('dine_in')}
              >
                Dine in
              </Button>
              <Button 
                variant={orderType === 'take_away' ? 'primary' : 'outline-secondary'} 
                className="flex-fill"
                onClick={() => setOrderType('take_away')}
              >
                Take Away
              </Button>
            </div>

            <Form.Group className="mb-3">
              <hr />
              <div className="row mt-2">
                <div className={orderType === 'take_away' ? 'col-12' : 'col-6'}>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control 
                    placeholder="Enter name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                {orderType === 'dine_in' && (
                  <div className="col-6">
                    <Form.Label>Nomer Table</Form.Label>
                    <Form.Select 
                      style={{width: '180px'}}
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    >
                      <option value="">Select Table</option>
                      <option value="01">01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                      <option value="04">04</option>
                      <option value="05">05</option>
                      <option value="06">06</option>
                      <option value="07">07</option>
                      <option value="08">08</option>
                      <option value="09">09</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </Form.Select>
                  </div>
                )}
              </div>
            </Form.Group>

            {/* Order Items */}
            <div className="mb-3 mt-3">
              {orderList.length === 0 ? (
                <div className="text-center text-muted py-4">
                  No items in order
                </div>
              ) : (
                orderList.map((item) => (
                  <div key={item.id} className="row w-100 mb-3 border-bottom-secondary">
                    <div className="col-3">
                      <img
                        src={urlImage + '/catalogs/' + item.image}
                        alt={item.name}
                        style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-6">
                      <div><strong>{item.name}</strong></div>
                      <div className="text-muted">{formatRupiah(item.price)}</div>
                    </div>
                    <div className="col-3 text-end">
                      <Button 
                        variant="link" 
                        className="text-danger ms-auto mb-2"
                        onClick={() => removeFromOrder(item.id)}
                      >
                        <Trash />
                      </Button>
                      <div className="d-flex align-items-center mt-1">
                        <Button 
                          size="sm" 
                          variant="outline-secondary"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Dash />
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline-secondary"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>


            {/* Summary */}
            <div className="mt-4 pt-2">
              <div className="d-flex justify-content-between">
                <div>Sub Total</div>
                <div>{formatRupiah(orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div>Tax (10%)</div>
                <div>{formatRupiah(orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1)}</div>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                <div>Total</div>
                <div>{formatRupiah(orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1)}</div>
              </div>
              <hr />
              <div className="row mt-3 px-3">
                 <label className='ml-0 mb-1'>Masukan Nominal</label>
                  <Form.Control 
                    placeholder="Enter nominal" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    type='number'
                  />
              </div>
              <Button 
                variant="primary" 
                className="w-100 mt-3"
                disabled={orderList.length === 0 || paying || !customerName || paymentAmount < orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1}
                onClick={handlePay}
              >
                {paying ? 'Processing...' : 'Pay'}
              </Button>
            </div>
            </Card>
        </Col>
      </Row>

      {/* Invoice Modal */}
      <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="md">
        <Modal.Body className='bg-invoice'>
         <div>
           <div className='text-end'>
            <button className='bordered'  onClick={() => setShowInvoiceModal(false)}>X</button>
          </div>
          <div className="text-center pt-1 mt-2 mb-4 anyclass" data-html2canvas-ignore="true">
            <h3><b>Transaction Success</b></h3>
          </div>
          <div id='printPDF'>
          <div className="rounded m-3 p-4 bg-white mb-4">
              <div className="text-center pt-1 mt-0 mb-4">
                <img src={logo} alt="Logo" className='me-2 pb-1 img-invoice' style={{ width: '125px', height: '45px', }} />
              </div>
              <span><small className='text-muted'>No Order : </small><small>{invoiceData?.order_number }</small></span> <br />
              <span><small className='text-muted'>Order Date :  </small><small>{moment(invoiceData?.created_at).locale("id").format('dddd, DD/MM/YYYY, hh:mm')}</small></span><br />
              <span><small className='text-muted'>Customer Name : </small><small>{ invoiceData?.customer_name}</small> </span><br />
                <span> {invoiceData?.transaction_type == 'dine_in' ? (<><small className='text-muted'>Dine-in : </small><small> No.Meja { invoiceData?.table_number}</small></>) : (<small><b>Take Away</b></small>)} </span>
              <hr />
              <div className="mt-2">
                  {dataDetailItem?.map((item, index) => (
                    <div className="row mb-2" key={index}>
                      <div className="col-8">
                        <b>{item.name}</b> <br />
                        <small>{item.quantity} x {formatRupiah(item.price)} </small>
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
                  <small> {formatRupiah(invoiceData?.subtotal_group)}</small>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                <small className='text-muted'>Tax</small>  <br />
                </div>
                <div className="col-4 text-end">
                <small> {formatRupiah(invoiceData?.tax)}</small>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-8">
                  <h5><b>Total</b></h5>  <br />
                </div>
                <div className="col-4 text-end">
                  <h5><b>{formatRupiah(parseFloat(invoiceData?.subtotal_group)+parseFloat(invoiceData?.tax))}</b></h5>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                <small className='text-muted'>Diterima</small>  <br />
                <small className='text-muted'>Kembalian</small>  <br />
                </div>
                <div className="col-4 text-end">
                  <small>{formatRupiah(invoiceData?.cash)}</small> <br />
                  <small>{formatRupiah(invoiceData?.cashback)}</small>
                </div>
              </div>
          </div>
          <div className="mx-3 mb-5 anyclass" data-html2canvas-ignore="true">
              <button 
                type="button" 
                className="btn btn-primary w-100"
                onClick={printInvoice}
              >
                Print Struk
              </button>
          </div>
          </div>
         </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MenuApp;