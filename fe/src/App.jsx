import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage';
import DashboardAdmin from './pages/HomeDashboard';
import SalesReportPage from './pages/SalesReportPage';
import SettingsPage from './pages/SettingsPage';
import MasterCatalogPage from './pages/MasterCatalogPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const [count, setCount] = useState(0)

  return (
      <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard-admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/master-catalog" element={<ProtectedRoute><MasterCatalogPage /></ProtectedRoute>} />
        <Route path="/report-sales" element={<ProtectedRoute><SalesReportPage /></ProtectedRoute>} />
        <Route path="/setting" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
