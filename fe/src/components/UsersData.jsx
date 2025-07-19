import React, { useState, useEffect } from 'react';
import { Container, Row, Badge, Col, Card, Nav, Form, Button, Modal } from 'react-bootstrap';
import deleted from '../assets/icon/deleted.png';
import tickCircle from '../assets/icon/tick-circle.png';
import add from '../assets/icon/add.png';
import edit from '../assets/icon/edit.png';
import deletedd from '../assets/icon/deletedd.png';
import api from '../api';
import urlImage from '../api/baseUrl';

const SettingApp = () => {
  const [settingData, setDataSetting] = useState([]);
  const [selectedUser, setselectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [addForm, setAddForm] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
    password: ''
  });
  const [adding, setAdding] = useState(false);

  const fetchDataSetting = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/master-user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDataSetting(response.data.data);
      if (response.data.length > 0) {
        setselectedUser(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSetting();
  }, []);

  const handleDeleteData = async () => {
    if (!selectedUser) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/master-user/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDataSetting(prev => prev.filter(item => item.id !== selectedUser.id));
      setselectedUser(null);
      setShowDeleteModal(false);
      setShowAlert(true);
      setMessageAlert('Data successfully deleted!');
    } catch (error) {
      console.error('Error deleting data:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSetting = () => {
    if (!selectedUser) return;
    setEditForm({
      name: selectedUser.name,
      username: selectedUser.username,
      email: selectedUser.email,
      role: selectedUser.role,
      status: selectedUser.status,
      language: selectedUser.language
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm({});
  };

  const handleUpdateData = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    try {
      // const token = localStorage.getItem('token');
      const data = {
        "username" : editForm.username,
        "name" : editForm.name,
        "email" : editForm.email,
        "role" : editForm.role,
        "status" : editForm.status,
        "language" : editForm.language,
      }
      const response = await api.put(`/admin/master-user/${selectedUser.id}`, data);
      // console.log('res edit data', response);
      setselectedUser(null);
      setIsEditMode(false);
      fetchDataSetting();
      setShowAlert(true);
      setMessageAlert('Data successfully updated!');
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddData = () => {
    setIsAddMode(true);
    setAddForm({
      key: '',
      value: '',
    });
  };

  const handleCreateData = async () => {
    setAdding(true);
    try {
      // const token = localStorage.getItem('token');
      const data = {
        "username" : addForm.username,
        "name" : addForm.name,
        "email" : addForm.email,
        "role" : addForm.role,
        "password" : addForm.password,
        "status" : 'active'
      }

      // console.log(data);
      const response = await api.post('/admin/master-user', data);
      setDataSetting(prev => [...prev, response.data]);
      setIsAddMode(false);
      fetchDataSetting();
      setShowAlert(true);
      setMessageAlert('data successfully created!');
    } catch (error) {
      console.error('Error creating data:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAddMode(false);
    setAddForm({
     "username" :'',
        "name" : '',
        "email" : '',
        "role" : '',
        "password" : ''
    });
  };

  return (
    <>
      <Row className='mt-0'>
        {/* Left Panel - data List */}
        <Col md={8}>
          {/* <div>
            <h5 className="fw-bolder">List Data</h5>
          </div>
         */}
          <Row className="mt-1">
            {loading ? (
              <Col className="text-center">
                <div>Loading...</div>
              </Col>
            ) : (
              settingData.map((item, idx) => (
                <Col key={idx} md={12} className="mb-3">
                  <Card onClick={() => setselectedUser(item)} style={{ cursor: 'pointer' }} className='h-100 px-3 py-0'>
                    <Card.Body className='px-0'>
                      <div className="row mt-2">
                      <div className="col-1 text-end ">
                        <img
                            src={urlImage + '/users/'+item.avatar || "https://as2.ftcdn.net/jpg/08/19/66/31/1000_F_819663119_che4sZSrmQv8uQJOzuN9TVQFQNHJlfQ2.jpg"}
                            alt="ava"
                            className="rounded-circle bg-light"
                            width="80%"
                          />
                        </div>
                        <div className="col-8 text-muted">
                          <h6><b>{item.name} </b> / <small>{item.username}</small> / <small>{item.email}</small></h6> 
                          <Badge bg={item.role == 'admin' ? 'success' : 'secondary'}><b>{item.role} </b></Badge>
                        </div>
                        <div className="col-3 text-end">
                            <Badge bg={item.status == 'active' ? 'primary' : 'danger'}>{item.status == 'active' ? 'active' : 'non actve'}</Badge>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>

        {/* Right Panel - Detail data */}
        <Col md={4} className='mt-0 pt-1'>
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
                 'Add Data'
                ) : isEditMode ? (
                  'Edit Data'
                ) : selectedUser ? (
                 'Detail Data'
                ): (
                  'Add Data'
                )}

                </h5>
            </div>
              <div className="col-2 text-end">
                {isAddMode ? (
                  <Button variant="light" className="me-0 px-3 border text-muted" onClick={handleCancelAdd}>X</Button>
                ) : isEditMode ? (
                  <Button variant="light" className="me-0 px-3 border text-muted" onClick={handleCancelEdit}>X</Button>
                ) : selectedUser ? (
                  <div className="d-flex justify-content-end">
                      <Button variant="white" className="me-2 mx-0 p-0" onClick={handleEditSetting}><img src={edit} alt="icon" className='mx-0'/></Button>
                      <Button variant="white" className='mx-0 p-0' onClick={() => setShowDeleteModal(true)}><img src={deletedd} alt="icon" className='mx-0'/></Button>
                    </div>
                ): (
                  <Button variant="primary" className="me-0 px-2" onClick={handleAddData}><img src={add} alt="icon" className='mx-0'/></Button>
                )}
            </div>
          </div>
          <hr />
            {isAddMode ? (
              <Card.Body className='p-0 pt-0'>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                      type="text"
                      value={addForm.name}
                      onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                      placeholder="Enter name.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                      type="text"
                      value={addForm.username}
                      onChange={(e) => setAddForm({...addForm, username: e.target.value})}
                      placeholder="Enter username.."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="text"
                      value={addForm.email}
                      onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                      placeholder="Enter email.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password"
                      value={addForm.password}
                      onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                      placeholder="Enter password.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select 
                      value={addForm.role}
                      onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="cashier">Cashier</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    {/* <Button variant="secondary" className="me-2" onClick={handleCancelAdd}>Cancel</Button> */}
                    <Button variant="primary" 
                      className='btn btn-block px-4'
                      onClick={handleCreateData}
                      disabled={adding || !addForm.username ||  !addForm.email}
                    >
                      {adding ? 'Loading...' : 'Save'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            ) : isEditMode && selectedUser ? (
              <Card.Body className='p-0 pt-4'>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                      type="text"
                      value={editForm.username || ''}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      placeholder="Enter username.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>name</Form.Label>
                    <Form.Control 
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Enter name.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>email</Form.Label>
                    <Form.Control 
                      type="text"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      placeholder="Enter email.."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select 
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="cashier">Cashier</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select 
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    >
                      <option value="">Select status</option>
                      <option value="active">Active</option>
                      <option value="non_active">Non Active</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select 
                      value={editForm.language}
                      onChange={(e) => setEditForm({...editForm, language: e.target.value})}
                    >
                      <option value="">Select Language</option>
                      <option value="indonesia">Indonesia</option>
                      <option value="english">English</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      className='btn btn-block px-4'
                      onClick={handleUpdateData}
                      disabled={updating || !editForm.username || !editForm.email }
                    >
                      {updating ? 'Loading...' : 'Update'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            ) : selectedUser ? (
              <>
                <Card.Body className='p-0 pt-0'>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control value={selectedUser.name} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control value={selectedUser.username} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control value={selectedUser.email} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control value={selectedUser.role} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Control value={selectedUser.status} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Language</Form.Label>
                      <Form.Control value={selectedUser.language} disabled />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </>
            ) : (
              <Card.Body>
                <div className="text-center text-muted">
                  Select data to view details
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
          <h4 style={{ fontWeight: '600' }}>Are you sure want to delete <br /> this data?</h4>
          <div className="text-center mb-5 mt-5">
            <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} className='me-3 px-5'>
              Cancel
            </Button>
            <Button
              className='px-5'
              variant="danger" 
              onClick={handleDeleteData}
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

export default SettingApp;
