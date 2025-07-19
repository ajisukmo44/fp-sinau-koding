import React, { useState } from 'react';
import { Row } from 'react-bootstrap';
import moment from 'moment';

// Import komponen-komponen
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SalesReportData from '../components/SalesReportData';

// Import ikon-ikon untuk SummaryData
function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarMinimized, setSidebarMinimized] = useState(true);
  const timeNow = moment().format('[Today,] dddd DD MMMM YYYY');
  const [summaryDataCashier, setSummaryDataCashier] = useState({});

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarMinimize = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="d-flex w-100 justify-content-start vh-100">
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
            <h5 className="fw-bolder">Sales Report</h5>
          </div>
          <div className="text-muted">
            {timeNow}
          </div>
        </div>
        <SalesReportData />
      </main>
    </div>
  </div>
  );
}

export default App;