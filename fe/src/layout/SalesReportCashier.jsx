import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import moment from 'moment';
import api from '../api';
import HeaderCashier from '../components/HeaderCashier';
import SidebarCashier from '../components/SidebarCashier';
import SalesReportData from '../components/SalesReportData';
import SummaryDataCashier from '../components/SummaryDataCashier';
import order from '../assets/icon/receipt.png'
import omzet from '../assets/icon/wallet-money.png'
import menu from '../assets/icon/document.png'
import foods from '../assets/icon/reserve.png'
import beverages from '../assets/icon/coffee.png'
import desserts from '../assets/icon/cake.png'

// Import ikon-ikon untuk SummaryData
function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarMinimized, setSidebarMinimized] = useState(true);
  const [summaryDataCashier, setSummaryDataCashier] = useState({});
  const timeNow = moment().format('[Today,] dddd DD MMMM YYYY');

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarMinimize = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/cashier/statistics-summary', {
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
        setSummaryDataCashier(result);
        
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };
    fetchSummaryData();
  }, []);

  return (
    <div className="d-flex w-100 justify-content-start vh-100">
    <SidebarCashier 
      isOpen={isSidebarOpen} 
      minimized={isSidebarMinimized}
      onToggleMinimize={toggleSidebarMinimize}
    />
    {isSidebarOpen && <div className="d-lg-none" onClick={toggleSidebar} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1020}}></div>}
    
    <div className={`main-content w-100 ${isSidebarMinimized ? 'main-minimized' : ''}`}>
      
    <HeaderCashier toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isSidebarMinimized={isSidebarMinimized}/>
      <main className="p-4 mt-5">
        <div className="d-flex flex-wrap justify-content-between mb-4">
          <div>
            <h4 className="fw-bolder">Sales Report</h4>
          </div>
          <div className="text-muted">
            {timeNow}
          </div>
        </div>
        <Row xs={1} sm={2} lg={3} xl={6} className="g-4 mb-4">
          <SummaryDataCashier icon={order} title="Total Orders" value={summaryDataCashier.totalOrder || 0} />
          <SummaryDataCashier icon={omzet} title="Total Omzet" value={formatRupiah(summaryDataCashier?.totalOmzet) || 0} />
          <SummaryDataCashier icon={menu} title="All Menu Orders" value={summaryDataCashier.totalMenus || 0} />
          <SummaryDataCashier icon={foods} title="Foods" value={summaryDataCashier.totalFoods || 0} />
          <SummaryDataCashier icon={beverages} title="Beverages" value={summaryDataCashier.totalBeverages || 0} />
          <SummaryDataCashier icon={desserts} title="Desserts" value={summaryDataCashier.totalDesserts || 0} />
        </Row>

        <SalesReportData />
      </main>
    </div>
  </div>
  );
}

export default App;