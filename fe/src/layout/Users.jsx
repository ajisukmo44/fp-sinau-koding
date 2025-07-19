import React, { useState } from 'react';

// Import komponen-komponen
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UsersData from '../components/UsersData';

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
    <Sidebar 
      isOpen={isSidebarOpen} 
      minimized={isSidebarMinimized}
      onToggleMinimize={toggleSidebarMinimize}
    />
    {isSidebarOpen && <div className="d-lg-none" onClick={toggleSidebar} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1020}}></div>}
    
    <div className={`main-content w-100 ${isSidebarMinimized ? 'main-minimized' : ''}`}>
      
    <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isSidebarMinimized={isSidebarMinimized}/>
      <main className="p-4 mt-5">
        <div className="d-flex flex-wrap justify-content-between mb-4">
          <div>
            <h4 className="fw-bolder">User Data</h4>
          </div>
        </div>
        <UsersData/>
      </main>
    </div>
  </div>
  );
}

export default App;