import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage';
import LoginPageCashier from './pages/cashier/LoginPageCashier';
import RegisterPageCashier from './pages/cashier/RegisterPageCashier';
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
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        {/* admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard-admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/admin/master-catalog" element={<ProtectedRoute><MasterCatalogPage /></ProtectedRoute>} />
        <Route path="/admin/report-sales" element={<ProtectedRoute><SalesReportPage /></ProtectedRoute>} />
        <Route path="/admin/setting" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* cashier */}
        <Route path="/cashier/login" element={<LoginPageCashier />} />
         <Route path="/cashier/register" element={<RegisterPageCashier />} />
        {/* <Route path="/dashboard-admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} /> */}
        <Route path="/cashier/menu-order" element={<ProtectedRoute><MasterCatalogPage /></ProtectedRoute>} />
        <Route path="/cashier/report-sales" element={<ProtectedRoute><SalesReportPage /></ProtectedRoute>} />
        <Route path="/cashier/setting" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
