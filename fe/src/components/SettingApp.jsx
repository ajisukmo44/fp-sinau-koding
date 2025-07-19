import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button, Modal } from 'react-bootstrap';
import deleted from '../assets/icon/deleted.png';
import tickCircle from '../assets/icon/tick-circle.png';
import add from '../assets/icon/add.png';
import edit from '../assets/icon/edit.png';
import deletedd from '../assets/icon/deletedd.png';
import api from '../api';

const SettingApp = () => {
  const [settingData, setDataSetting] = useState([]);
  const [selectedSetting, setselectedSetting] = useState(null);
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
    key: '',
    value: '',
    description: '',
    image: null
  });
  const [adding, setAdding] = useState(false);

  const fetchDataSetting = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/setting', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDataSetting(response.data.data);
      if (response.data.length > 0) {
        setselectedSetting(response.data[0]);
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
    if (!selectedSetting) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/setting/${selectedSetting.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDataSetting(prev => prev.filter(item => item.id !== selectedSetting.id));
      setselectedSetting(null);
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
    if (!selectedSetting) return;
    setEditForm({
      key: selectedSetting.key,
      value: selectedSetting.value
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm({});
  };

  const handleUpdateData = async () => {
    if (!selectedSetting) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const data = {
        "key" : editForm.key,
        "value" : editForm.value
      }
      const response = await api.put(`/admin/setting/${selectedSetting.id}`, data, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });

      // console.log('res edit data', response);
      setselectedSetting(null);
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
      const token = localStorage.getItem('token');
      const data = {
        "key" : addForm.key,
        "value" : addForm.value
      }
      const response = await api.post('/admin/setting', data, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      
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
      key: '',
      value: ''
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
                  <Card onClick={() => setselectedSetting(item)} style={{ cursor: 'pointer' }} className='h-100 px-3 py-0'>
                    <Card.Body className='px-0'>
                      <div className="row mt-2">
                        <div className="col-12 text-muted">
                          <h5><b>{item.key} </b></h5>
                          <small>{item.value}</small>
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
                ) : selectedSetting ? (
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
                ) : selectedSetting ? (
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
                    <Form.Label>key</Form.Label>
                    <Form.Control 
                      type="text"
                      value={addForm.key}
                      onChange={(e) => setAddForm({...addForm, key: e.target.value})}
                      placeholder="Enter key.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>value</Form.Label>
                    <Form.Control 
                      type="text"
                      value={addForm.value}
                      onChange={(e) => setAddForm({...addForm, value: e.target.value})}
                      placeholder="Enter value.."
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    {/* <Button variant="secondary" className="me-2" onClick={handleCancelAdd}>Cancel</Button> */}
                    <Button variant="primary" 
                      className='btn btn-block px-4'
                      onClick={handleCreateData}
                      disabled={adding || !addForm.key}
                    >
                      {adding ? 'Loading...' : 'Save'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            ) : isEditMode && selectedSetting ? (
              <Card.Body className='p-0 pt-4'>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>key</Form.Label>
                    <Form.Control 
                      type="text"
                      value={editForm.key || ''}
                      onChange={(e) => setEditForm({...editForm, key: e.target.value})}
                      placeholder="Enter key.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>value</Form.Label>
                    <Form.Control 
                      type="text"
                      value={editForm.value || ''}
                      onChange={(e) => setEditForm({...editForm, value: e.target.value})}
                      placeholder="Enter value.."
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      className='btn btn-block px-4'
                      onClick={handleUpdateData}
                      disabled={updating || !editForm.key }
                    >
                      {updating ? 'Loading...' : 'Update'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            ) : selectedSetting ? (
              <>
                <Card.Body className='p-0 pt-0'>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>key</Form.Label>
                      <Form.Control value={selectedSetting.key} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>value</Form.Label>
                      <Form.Control value={selectedSetting.value} disabled />
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
