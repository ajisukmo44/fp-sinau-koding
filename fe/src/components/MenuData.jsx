import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button, Modal } from 'react-bootstrap';
import foods from '../assets/icon/reserve1.png'
import beverages from '../assets/icon/coffe1.png'
import desserts from '../assets/icon/cake1.png'
import deleted from '../assets/icon/deleted.png';
import tickCircle from '../assets/icon/tick-circle.png';
import add from '../assets/icon/add.png';
import edit from '../assets/icon/edit.png';
import deletedd from '../assets/icon/deletedd.png';
import api from '../api';
import urlImage from '../api/baseUrl';
import Alert from 'react-bootstrap/Alert';

const MenuApp = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editImageForm, setEditImageForm] = useState({});
  const [updating, setUpdating] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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
  // const urlImage = urlImage;
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Add image loading state and delay
  const [imageLoading, setImageLoading] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});
  const MIN_IMAGE_LOAD_DELAY = 1500; // ms

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

  const handleDeleteMenu = async () => {
    if (!selectedMenu) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/master-catalogs/${selectedMenu.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMenuData(prev => prev.filter(item => item.id !== selectedMenu.id));
      setSelectedMenu(null);
      setShowDeleteModal(false);
      setShowAlert(true);
      setMessageAlert('Menu successfully deleted!');
    } catch (error) {
      console.error('Error deleting menu:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditMenu = () => {
    if (!selectedMenu) return;
    setEditForm({
      name: selectedMenu.name,
      category: selectedMenu.category,
      price: selectedMenu.price,
      description: selectedMenu.description,
      image:  selectedMenu.image
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm({});
  };

  const handleUpdateMenu = async () => {
    if (!selectedMenu) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('category', editForm.category);
      formData.append('price', editForm.price);
      formData.append('description', editForm.description);
      if (editImageForm.image) {
        formData.append('image', editImageForm.image);
      }
      const response = await api.put(`/admin/master-catalogs/${selectedMenu.id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      // setMenuData(prev => prev.map(item => 
      //   item.id === selectedMenu.id ? { ...item, ...editForm } : item
      // ));
      // console.log('res edit menu', response);
      //  setSelectedMenu(response.data[0]);
      // setSelectedMenu({ ...selectedMenu, ...editForm });
      setSelectedMenu(null);
      setIsEditMode(false);
      fetchMenuData();
      setShowAlert(true);
      setMessageAlert('Menu successfully updated!');
    } catch (error) {
      console.error('Error updating menu:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddMenu = () => {
    setIsAddMode(true);
    setAddForm({
      name: '',
      category: '',
      price: '',
      description: '',
      image: null
    });
  };

  const handleCreateMenu = async () => {
    setAdding(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('category', addForm.category);
      formData.append('price', addForm.price);
      formData.append('description', addForm.description);
      if (addForm.image) {
        formData.append('image', addForm.image);
      }
      
      const response = await api.post('/admin/master-catalogs', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMenuData(prev => [...prev, response.data]);
      setIsAddMode(false);
      
      fetchMenuData();
      setShowAlert(true);
      setMessageAlert('Menu successfully created!');
    } catch (error) {
      console.error('Error creating menu:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAddMode(false);
    setAddForm({
      name: '',
      category: '',
      price: '',
      description: '',
      image: null
    });
  };

  const filteredMenuData = activeCategory === 'all' 
    ? menuData 
    : menuData.filter(item => item.category === activeCategory);

  return (
    <>
      <Row className='mt-2'>
        {/* Left Panel - Menu List */}
        <Col md={8}>
          <div>
            <h5 className="fw-bolder">List Menu</h5>
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
               <small> Total : <b>{filteredMenuData.length} Menu</b></small> 
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
                  <Card onClick={() => setSelectedMenu(item)} style={{ cursor: 'pointer' }} className='h-100 px-3 py-0'>
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
          {showAlert ? (
            <div className="alert-success mb-2">
                <div className="alert-message">  <img src={tickCircle} alt="icon" className='mx-0 me-2'/><span className='ms-2'>{messageAlert}</span></div>
                <div className="alert-close" onClick={() => setShowAlert(false)}>&times;</div>
              </div>
          ) :  (
            ''
          )}
          <Card>
          <div className='row'>
            <div className="col-10">
                <h5 className="fw-bolder">
                   {isAddMode ? (
                 'Add Menu'
                ) : isEditMode ? (
                  'Edit Menu'
                ) : selectedMenu ? (
                 'Detail Menu'
                ): (
                  'Add Menu'
                )}

                </h5>
            </div>
              <div className="col-2 text-end">
                {isAddMode ? (
                  <Button variant="light" className="me-0 px-3 border text-muted" onClick={handleCancelAdd}>X</Button>
                ) : isEditMode ? (
                  <Button variant="light" className="me-0 px-3 border text-muted" onClick={handleCancelEdit}>X</Button>
                ) : selectedMenu ? (
                  <div className="d-flex justify-content-end">
                      <Button variant="white" className="me-2 mx-0 p-0" onClick={handleEditMenu}><img src={edit} alt="icon" className='mx-0'/></Button>
                      <Button variant="white" className='mx-0 p-0' onClick={() => setShowDeleteModal(true)}><img src={deletedd} alt="icon" className='mx-0'/></Button>
                    </div>
                ): (
                  <Button variant="primary" className="me-0 px-2" onClick={handleAddMenu}><img src={add} alt="icon" className='mx-0'/></Button>
                )}
            </div>
          </div>
          <hr />
            {isAddMode ? (
              <Card.Body className='p-0 pt-0'>
                <Form>
                  <Form.Group className="mb-3 mt-0 rounded">
                    {/* <Form.Label>Image</Form.Label>
                    <Form.Control 
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAddForm({...addForm, image: e.target.files[0]})}
                    /> */}
                    <div
                      className="upload-card border border-primary border-dashed w-100"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div className="text-center">
                        {addForm.image ? (
                          <div>
                            <img 
                              src={URL.createObjectURL(addForm.image)} 
                              alt="Preview" 
                              style={{ width: '250px', height: '150px' }}
                              className="rounded mb-2"
                            />
                            <p className="text-success">{addForm.image.name}</p>
                          </div>
                        ) : (
                          <>
                            <i className="bi bi-upload fs-1 mb-2" />
                            <p>Drag and Drop your file here or</p>
                          </>
                        )}
                        <label className="btn btn-primary">
                          {addForm.image ? 'Change File' : 'Choose File'}
                          <input type="file" hidden accept="image/*" onChange={(e) => setAddForm({...addForm, image: e.target.files[0]})} />
                        </label>
                      </div>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                      value={addForm.name}
                      onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                      placeholder="Menu name.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                      value={addForm.category}
                      onChange={(e) => setAddForm({...addForm, category: e.target.value})}
                    >
                      <option value="">Select category</option>
                      <option value="foods">Foods</option>
                      <option value="beverages">Beverages</option>
                      <option value="desserts">Desserts</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control 
                      type="number"
                      value={addForm.price}
                      onChange={(e) => setAddForm({...addForm, price: e.target.value})}
                      placeholder="Enter price.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={addForm.description}
                      onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                      placeholder="Enter description."
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    {/* <Button variant="secondary" className="me-2" onClick={handleCancelAdd}>Cancel</Button> */}
                    <Button variant="primary" 
                      className='btn btn-block px-4'
                      onClick={handleCreateMenu}
                      disabled={adding || !addForm.name || !addForm.category || !addForm.price}
                    >
                      {adding ? 'Loading...' : 'Save'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            ) : isEditMode && selectedMenu ? (
              <Card.Body className='p-0 pt-4'>
                <Form>
                  <Form.Group className="mb-3 bg-light p-4 rounded text-center">
                      {/* <Form.Label>Image</Form.Label> <br />
                      <img src={urlImage + '/catalogs/' + editForm.image} alt="menu" className='h-25 w-25 mb-2' />
                    <Form.Control 
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditForm({...editForm, image: e.target.files[0]})}
                    /> */}
                    <div
                      className="upload-card border border-primary border-dashed w-100"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div className="text-center">
                        {editForm.image ? (
                          <div>
                            <img 
                              src={editImageForm.image instanceof File ? URL.createObjectURL(editImageForm.image) : urlImage + '/catalogs/' + editForm.image}
                              alt="Preview" 
                              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                              className="rounded mb-2"
                            />
                            <p className="text-success">{editImageForm.image instanceof File ? editImageForm.image.name : 'Current image'}</p>
                          </div>
                        ) : (
                          <>
                            <i className="bi bi-upload fs-1 mb-2" />
                            <p>Drag and Drop your file here or</p>
                          </>
                        )}
                        <label className="btn btn-primary">
                          {editImageForm.image ? 'Change File' : 'Choose File'}
                          <input type="file" hidden accept="image/*"  onChange={(e) => setEditImageForm({...editImageForm, image: e.target.files[0]})} />
                        </label>
                      </div>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Menu name.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    >
                      <option value="">Select category</option>
                      <option value="foods">Foods</option>
                      <option value="beverages">Beverages</option>
                      <option value="desserts">Desserts</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control 
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      placeholder="Enter price.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Enter description."
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      className='btn btn-block px-4'
                      onClick={handleUpdateMenu}
                      disabled={updating || !editForm.name || !editForm.category || !editForm.price}
                    >
                      {updating ? 'Loading...' : 'Update'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            ) : selectedMenu ? (
              <>
                {/* <Card.Img variant="top" src={urlImage + '/catalogs/' + selectedMenu.image} className='h-25 w-25 mb-2 text-center' /> */}
                  <Card.Body className='p-0 pt-0'>
                  <div className='text-center'>
                      <img src={urlImage + '/catalogs/' + selectedMenu.image} className='w-100 rounded mb-2 text-center' alt="menu" style={{height:'300px'}} />
                  </div>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control value={selectedMenu.name} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Control value={selectedMenu.category} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control value={selectedMenu.price} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={selectedMenu.description}
                        disabled
                      />
                    </Form.Group>
                   
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

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body className='text-center'>
          <img src={deleted} alt="Logo" className='me-2 mb-4 mt-5' style={{ width: '80px', height: '80px' }} /> 
          <h4 style={{ fontWeight: '600' }}>Are you sure want to delete <br /> this file?</h4>
          <div className="text-center mb-5 mt-5">
            <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} className='me-3 px-5'>
              Cancel
            </Button>
            <Button
              className='px-5'
              variant="danger" 
              onClick={handleDeleteMenu}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>


    </>
  );
};

export default MenuApp;
