import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button, Modal, InputGroup } from 'react-bootstrap';
import foods from '../assets/icon/reserve1.png'
import beverages from '../assets/icon/coffe1.png'
import desserts from '../assets/icon/cake1.png'
import edit2 from '../assets/icon/edit-2.png'
import logo from '../assets/logo.png';
import api from '../api';
import urlImage from '../api/baseUrl';
import { Trash, Plus, Dash } from 'react-bootstrap-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';

const MenuApp = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
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
  
  // Note modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedItemForNote, setSelectedItemForNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  // const urlImage = urlImage;

  // Lazyloading spinner state for card images
  const [imageLoading, setImageLoading] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});
  const MIN_IMAGE_LOAD_DELAY = 1500; // ms

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
      const response = await api.get('/cashier/master-catalogs', {
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

  const addNote = (itemId) => {
    const item = orderList.find(order => order.id === itemId);
    if (item) {
      setSelectedItemForNote(item);
      setNoteText(item.note || '');
      setShowNoteModal(true);
    }
  };

  const handleSaveNote = () => {
    if (selectedItemForNote) {
      setOrderList(prev => prev.map(order => 
        order.id === selectedItemForNote.id 
          ? { ...order, note: noteText }
          : order
      ));
      setShowNoteModal(false);
      setSelectedItemForNote(null);
      setNoteText('');
    }
  };

  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
    setSelectedItemForNote(null);
    setNoteText('');
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
          note: item.note || '-'
        })),
        subtotal_group : subtotal,
        tax : tax,
        cash : paymentAmount,
        cashback : (parseFloat(paymentAmount)-(total))
      };
      const response = await api.post('/cashier/transactions', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log('dataList', orderList);
      // console.log('dataItem', response.data.dataItem);
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

  const [selected, setSelected] = useState('');
  const handleButtonClick = (value) => {
    setSelected(value);
    setPaymentAmount(value);
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
              <Nav variant="pills" defaultActiveKey="all" className="menu-component">
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
                <Col key={idx} md={3} className="mb-3">
                  <Card onClick={() => addToOrder(item)} style={{ cursor: 'pointer' }} className='h-100 px-3 py-0'>
                    {/* <Card.Img variant="top" src={urlImage + '/catalogs/' + item.image}  style={{ width: '100%', height: '200px' }} />   */}
                    <Card.Body className='px-0'>
                      <div style={{ position: 'relative', width: '100%', height: '150px' }}>
                        <img
                          src={urlImage + '/catalogs/' + item.image}
                          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                          className='p-0 rounded mb-2'
                          loading="lazy"
                          alt={item.name}
                          onLoad={() => {
                            setImageLoaded(prev => ({ ...prev, [item.id]: true }));
                            setTimeout(() => {
                              setImageLoading(prev => ({ ...prev, [item.id]: true }));
                            }, MIN_IMAGE_LOAD_DELAY);
                          }}
                          onError={() => {
                            setImageLoaded(prev => ({ ...prev, [item.id]: true }));
                            setTimeout(() => {
                              setImageLoading(prev => ({ ...prev, [item.id]: true }));
                            }, MIN_IMAGE_LOAD_DELAY);
                          }}
                        />
                        {(!imageLoading[item.id]) && (
                          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',background:'#f8f9fa',zIndex:1}}>
                            <div className="spinner-border" role="status" style={{width:'2rem',height:'2rem'}}>
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 text-muted">
                          <h5><b>{item.name} </b></h5>
                          <small>{item?.description.slice(0, 60)} {item.description.length > 60 ? '...' : ''}</small>
                        </div>
                        <div className="col-8 mt-3 align-content-bottom">
                         <b>{formatRupiah(item.price)}</b><small className='text-muted'>/Portion</small>
                        </div>
                        <div className="col-4 mt-3 text-end">
                           <small> <span className="badge bg-primary pe-2">{item.category}</span></small>
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
          <Card style={{minHeight: '700px'}}>
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
              <div className="row mt-3">
                <div className={orderType === 'take_away' ? 'col-12' : 'col-6'}>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control 
                    placeholder="Customer name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                {orderType === 'dine_in' && (
                <div className={orderType === 'take_away' ? '' : 'col-6'}>
                  <Form.Label>Nomer Table</Form.Label>
                  <Form.Select 
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
               <hr />
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
                        style={{ width: '100%', height: 80, borderRadius: 8, objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-6">
                      <div><strong>{item.name}</strong></div>
                      <div className="text-muted">{formatRupiah(item.price)}</div>
                      {item.note && item.note !== '-' && (
                        <div className="text-info small mt-1">
                          <small><strong>Note:</strong> {item.note}</small>
                        </div>
                      )}
                       <Button 
                          size="sm" 
                          variant="light"
                          className='p-1 ps-2'
                        >
                         <img src={edit2} alt="Logo"  onClick={() => addNote(item.id)} className='me-2 pb-1' style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                        </Button>
                    </div>
                    <div className="col-3 text-end">
                      <Button 
                        variant="link" 
                        className="text-danger ms-auto mb-2 rounded border"
                        onClick={() => removeFromOrder(item.id)}
                      >
                        <Trash />
                      </Button>
                      <div className="align-items-center mt-1 mx-0 px-0">
                        <Button 
                          size="sm" 
                          variant="outline-secondary"
                          style={{borderRadius:'50%'}}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Dash />
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          style={{borderRadius:'50%'}}
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
            {orderList.length === 0 ? ('') : (
              <div className="mt-2">
                <div className='bg-invoice p-3'>
                    <div className="d-flex justify-content-between pt-2">
                      <div>Sub Total</div>
                      <div>{formatRupiah(orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</div>
                    </div>
                    <div className="d-flex justify-content-between">
                    <div>Tax (10%)</div>
                      <div>{formatRupiah(orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1)}</div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                      <div>Total</div>
                      <div>{formatRupiah(orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1)}</div>
                    </div>
                  </div>
                  <div className='mt-2 mb-2'>
                    <small className='mt-4 mb-2' htmlFor="sn">Select Nominal</small>
                    <div className="d-flex gap-2 px-1 mb-3">
                    {[100000, 150000, 200000, 300000].map((amount) => (
                        <div className="">
                          <button
                            size="sm"
                            key={amount}
                            className={`btn btn-outline-secondary ${selected === amount ? 'active' : ''}`}
                            onClick={() => handleButtonClick(amount)}
                          >
                            {formatRupiah(amount)}
                          </button>
                        </div>
                        ))}
                    </div>
                    <div className="row mt-3 px-3">
                      {/* <label className='ml-0 mb-1'>Enter Nominal</label> */}
                        <Form.Control
                          className='input-payment'
                          placeholder="Enter nominal" 
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(Number(e.target.value))}
                          type='number'
                        />
                    </div>
                  </div>
              </div>
            )}     
            <div className='d-flex flex-column mt-auto'>
              <Button 
                variant={(orderList.length === 0 || paying || !customerName || (paymentAmount+1) < orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1) ? 'secondary' : 'primary' }
                className="w-100 mt-3"
                disabled={orderList.length === 0 || paying || !customerName || (paymentAmount+1) < orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1}
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
        <Modal.Body className='bg-invoice rounded'>
         <div>
           <div className='text-end'>
            <button className='bordered' style={{ cursor: 'pointer', backgroundColor: 'transparent', border: 'none', borderRadius: '50%', width: '30px', height: '30px' }} onClick={() => setShowInvoiceModal(false)}>X</button>
          </div>
          <div className="text-center pt-1 mt-2 mb-4 anyclass" data-html2canvas-ignore="true">
            <h4><b>Transaction Success</b></h4>
          </div>
          <div id='printPDF'>
          <div className="rounded m-3 p-4 bg-white mb-4">
              <div className="text-center pt-1 mt-0 mb-4">
                <img src={logo} alt="Logo" className='me-2 pb-1' style={{ width: '125px', height: '45px', }} />
              </div>
              <span><small className='text-muted'>No Order : </small><small>{invoiceData?.order_number }</small></span> <br />
              <span><small className='text-muted'>Order Date :  </small><small>{moment(invoiceData?.created_at).locale("id").format('dddd, DD/MM/YYYY, HH:mm:ss')}</small></span><br />
              <span><small className='text-muted'>Customer Name : </small><small>{ invoiceData?.customer_name}</small> </span><br />
                <span> {invoiceData?.transaction_type == 'dine_in' ? (<><small className='text-muted'>Dine-in : </small><small> No.Meja { invoiceData?.table_number}</small></>) : (<small><b>Take Away</b></small>)} </span>
              <hr />
              <div className="mt-2">
                  {dataDetailItem?.map((item, index) => (
                    <div className="row mb-2" key={index}>
                      <div className="col-8">
                        <small><b>{item.name}</b></small> <br />
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
                className="btn btn-primary w-100 rounded"
                onClick={printInvoice}
              >
                Print Struk
              </button>
          </div>
          </div>
         </div>
        </Modal.Body>
      </Modal>

      {/* Note Modal */}
      <Modal show={showNoteModal} onHide={handleCloseNoteModal} size="md">
        <Modal.Body className='bg-white rounded'>
          <div className='d-flex flex justify-content-between'>
            <h5 className='p-2'><b>Detail Menu</b></h5>
            <button className='bordered' style={{ cursor: 'pointer', backgroundColor: 'transparent', border: 'none', borderRadius: '50%', width: '30px', height: '30px' }} onClick={handleCloseNoteModal}>X</button>
          </div>
          {selectedItemForNote && (
            <div className="p-3">
              <div className="mb-3">
                <div className="row align-items-center mb-2">
                  <div className="col-12 mb-2">
                    <img
                      src={urlImage + '/catalogs/' + selectedItemForNote.image}
                      alt={selectedItemForNote.name}
                      style={{ width: '100%', height: 250, borderRadius: 8, objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-12">
                    <h6><strong>{selectedItemForNote.name}</strong></h6>
                    <small className="text-muted">{formatRupiah(selectedItemForNote.price)} x {selectedItemForNote.quantity}</small>
                  </div>
                </div>
              </div>
              <Form.Group className="mb-3">
                <Form.Label><small>Catatan (Optional)</small></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="rounded"
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-secondary" 
                  className="flex-fill rounded"
                  onClick={handleCloseNoteModal}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-fill rounded"
                  onClick={handleSaveNote}
                >
                  Save Note
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MenuApp;