import React, { useState } from 'react';
import { Card, Col, Modal, Table } from 'react-bootstrap';
import api from '../api';

const SummaryData = ({ icon, title, value }) => {
  const [showModal, setShowModal] = useState(false);
  const isClickable = ['Foods', 'Beverages', 'Desserts'].includes(title);

  const [dataDetail, setDataDetail] = useState([]);
  const handleClose = () => setShowModal(false);
  const handleCardClick = () => {
    if (isClickable) setShowModal(true);
     fetchSummaryDataDetail(title)
  };

   const fetchSummaryDataDetail = async (title) => {
    // console.log('val', title.toLowerCase());
    const key = title.toLowerCase();
    
      try {
        const { data } = await api.get('/admin/statistics-summary/'+key);
        setDataDetail(data.data);
        // console.log('data', data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    }

  return (
    <>
      <Col>
        <Card 
          className={`shadow-sm border-0 h-100 ${isClickable ? 'clickable' : ''}`}
          onClick={handleCardClick}
          style={isClickable ? { cursor: 'pointer' } : {}}
        >
          <Card.Body className='p-0'>
            <div className="row align-items-top">
             <div className="col-12 text-muted text-start mb-1" >{title}</div>
              <div className="col-12 text-secondary me-3 mt-1">
                <span><img src={icon} alt="Logo" style={{ width: '28px', height: '28px', marginBottom: '6px' }} /></span>
                <span className='text-secondary h5 ms-2 pb-8 mt-2'><b>{value}</b></span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        {/* <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="row mb-4 p-2">
            <div className="col-6">
             <h4><b>{title}</b></h4>
            </div>
            <div className="col-6">
            <div className='text-end'>
            <button className='bordered' onClick={handleClose}>X</button>
          </div>
            </div>
          </div>
          <div className='p-2'>
            <div>
              <input type="text" className='form-control mb-3' placeholder='Enter the keyword here..'/>
            </div>
               <table className='teble table-sm' >
                <thead>
                  <tr>
                    <th>Menu Name</th>
                    <th width="35%">Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {dataDetail.map((data) => (
                    <tr key={data.name}>
                      <td>{data.name}</td>
                      <td>{data.total_sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SummaryData;