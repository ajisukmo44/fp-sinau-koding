import React, { useState } from 'react';
import { Card, Col, Modal, Table } from 'react-bootstrap';
import api from '../api';

const SummaryData = ({ icon, title, value }) => {
  const [showModal, setShowModal] = useState(false);
  const isClickable = ['Foods', 'Beverages', 'Desserts'].includes(title);

  const [dataDetail, setDataDetail] = useState([]);

  const handleCardClick = () => {
    if (isClickable) setShowModal(true);
     fetchSummaryDataDetail(title)
  };

   const fetchSummaryDataDetail = async (title) => {
    console.log('val', title.toLowerCase());
    const key = title.toLowerCase();
    
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/admin/statistics-summary/'+key, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // const result = {
        //   totalBeveranges : data.data.total_beveranges,
        //   totalDesserts : data.data.total_desserts,
        //   totalFoods : data.data.total_foods,
        //   totalMenus : data.data.total_menu,
        //   totalOmzet : data.data.total_omzet,
        //   totalOrder : data.data.total_order,
        // }
        setDataDetail(data.data);
        console.log('data', data);
        
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
             <div className="col-12 text-muted text-start mb-1" style={{fontSize: '1em'}}>{title}</div>
              <div className="col-12 text-secondary me-3 mt-1"><span>{icon}</span> <span className='text-secondary h5 ms-2'><b className='my-4'>{value}</b></span></div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Total {title}: <strong>{value}</strong></p>
          <p>Details for {title.toLowerCase()} will be displayed here.</p>
          <div>
               <Table bordered responsive>
        <thead className="table-light">
          <tr>
            <th>No Order</th>
            <th>Customer Name</th>
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
      </Table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SummaryData;