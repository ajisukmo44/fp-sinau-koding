import React, { useState } from 'react';
import { Row } from 'react-bootstrap';
import moment from 'moment';

// Import komponen-komponen
import HeaderCashier from '../components/HeaderCashier';
import SidebarCashier from '../components/SidebarCashier';
import SettingProfile from '../components/SettingProfile';

// Import ikon-ikon untuk SummaryData
function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarMinimized, setSidebarMinimized] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarMinimize = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

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
            <h4 className="fw-bolder">Settings</h4>
          </div>
        </div>
        <SettingProfile />
      </main>
    </div>
  </div>
  );
}

export default App;