import React, { useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';

// Import komponen-komponen
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MenuData from '../components/MenuData';

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
    <div className="d-flex justify-content-start vh-100 w-100">
    <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isSidebarMinimized={isSidebarMinimized}/>
    <Sidebar 
      isOpen={isSidebarOpen} 
      minimized={isSidebarMinimized}
      onToggleMinimize={toggleSidebarMinimize}
    />
    {isSidebarOpen && <div className="d-lg-none" onClick={toggleSidebar} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1020}}></div>}
    
    <div className={`main-content pt-5 px-0 w-100 ${isSidebarMinimized ? 'main-minimized' : ''}`}>
      <main className="p-4">
          <MenuData/>
      </main>
    </div>
  </div>
  );
}

export default App;