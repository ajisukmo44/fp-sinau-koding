import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import moment from 'moment';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SummaryData from '../components/SummaryData';
import SalesChart from '../components/SalesChart';
import order from '../assets/icon/receipt.png'
import omzet from '../assets/icon/wallet-money.png'
import menu from '../assets/icon/document.png'
import foods from '../assets/icon/reserve.png'
import beverages from '../assets/icon/coffee.png'
import desserts from '../assets/icon/cake.png'
import api from '../api';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarMinimized, setSidebarMinimized] = useState(true);
  const [summaryData, setSummaryData] = useState({});
  const timeNow = moment().format('[Today,] dddd DD MMMM YYYY');

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarMinimize = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/admin/statistics-summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = {
          totalBeverages : data.data.total_beverages,
          totalDesserts : data.data.total_desserts,
          totalFoods : data.data.total_foods,
          totalMenus : data.data.total_menu,
          totalOmzet : data.data.total_omzet,
          totalOrder : data.data.total_order,
        }
        setSummaryData(result);
        
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };
    fetchSummaryData();
  }, []);

  return (
    <div className="d-flex  justify-content-start vh-100">
    <Sidebar 
      isOpen={isSidebarOpen} 
      minimized={isSidebarMinimized}
      onToggleMinimize={toggleSidebarMinimize}
    />
    {isSidebarOpen && <div className="d-lg-none" onClick={toggleSidebar} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1020}}></div>}
    
    <div className={`main-content w-100 ${isSidebarMinimized ? 'main-minimized' : ''}`}>
      
    <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isSidebarMinimized={isSidebarMinimized}/>
      <main className="p-4 mt-5">
        <div className="d-flex flex-wrap justify-content-between mb-2">
          <div>
            <h5 className="fw-bolder">Dashboard</h5>
          </div>
          <div className="text-muted">
            {timeNow}
          </div>
        </div>

        <Row xs={1} sm={2} lg={3} xl={6} className="g-4">
          <SummaryData icon={order} title="Total Orders" value={summaryData.totalOrder || 0} />
          <SummaryData icon={omzet} title="Total Omzet" value={formatRupiah(summaryData?.totalOmzet) || 0} />
          <SummaryData icon={menu} title="All Menu Orders" value={summaryData.totalMenus || 0} />
          <SummaryData icon={foods} title="Foods" value={summaryData.totalFoods || 0} />
          <SummaryData icon={beverages} title="Beverages" value={summaryData.totalBeverages || 0} />
          <SummaryData icon={desserts} title="Desserts" value={summaryData.totalDesserts || 0} />
        </Row>
        <SalesChart />
      </main>
    </div>
  </div>
  );
}

export default App;