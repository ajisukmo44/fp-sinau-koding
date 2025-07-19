import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './pages/HomePage';

// admin
import LoginPage from './pages/admin/LoginPage';
import DashboardAdmin from './pages/admin/HomeDashboard';
import SalesReportPage from './pages/admin/SalesReportPage';
import SettingsPage from './pages/admin/SettingsPage';
import SettingsApps from './pages/admin/SettingsAppsPage';
import UsersPage from './pages/admin/UsersPage';
import MasterCatalogPage from './pages/admin/MasterCatalogPage';

// cashier 
import LoginPageCashier from './pages/cashier/LoginPageCashier';
import RegisterPageCashier from './pages/cashier/RegisterPageCashier';
import ResetPasswordCashier from './pages/cashier/ResetPasswordCashier';
import MenuOrderCashier from './pages/cashier/MenuOrderCashier';
import SettingsPageCashier from './pages/cashier/SettingsPageCashier';
import SalesReportPageCashier from './pages/cashier/SalesReportPageCashier';
import ProtectedRoute from './components/ProtectedRoute';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to={role === 'cashier' ? '/cashier/login' : '/admin/login'} replace />;
  }
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === 'cashier' ? '/cashier/login' : '/admin/login'} replace />;
  }
  
  return children;
};

const LoginRedirect = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (token && role) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard-admin' : '/cashier/menu-order'} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* admin */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginRedirect><LoginPage /></LoginRedirect>} />
        <Route path="/admin/dashboard-admin" element={<RoleProtectedRoute allowedRoles={['admin']}><DashboardAdmin /></RoleProtectedRoute>} />
        <Route path="/admin/master-catalog" element={<RoleProtectedRoute allowedRoles={['admin']}><MasterCatalogPage /></RoleProtectedRoute>} />
        <Route path="/admin/master-user" element={<RoleProtectedRoute allowedRoles={['admin']}><UsersPage /></RoleProtectedRoute>} />
        <Route path="/admin/report-sales" element={<RoleProtectedRoute allowedRoles={['admin']}><SalesReportPage /></RoleProtectedRoute>} />
        <Route path="/admin/setting" element={<RoleProtectedRoute allowedRoles={['admin']}><SettingsPage /></RoleProtectedRoute>} />
        <Route path="/admin/setting-apps" element={<RoleProtectedRoute allowedRoles={['admin']}><SettingsApps /></RoleProtectedRoute>} />

        {/* cashier */}
        <Route path="/cashier" element={<Navigate to="/cashier/login" replace />} />
        <Route path="/cashier/login" element={<LoginRedirect><LoginPageCashier /></LoginRedirect>} />
        <Route path="/cashier/register" element={<RegisterPageCashier />} />
        <Route path="/cashier/reset-password" element={<ResetPasswordCashier />} />
        {/* <Route path="/dashboard-admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} /> */}
        <Route path="/cashier/menu-order" element={<RoleProtectedRoute allowedRoles={['cashier']}><MenuOrderCashier /></RoleProtectedRoute>} />
        <Route path="/cashier/report-sales" element={<RoleProtectedRoute allowedRoles={['cashier']}><SalesReportPageCashier /></RoleProtectedRoute>} />
        <Route path="/cashier/setting" element={<RoleProtectedRoute allowedRoles={['cashier']}><SettingsPageCashier /></RoleProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
