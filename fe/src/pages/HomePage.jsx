import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/login.css'; // Custom styles if needed
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {

  return (
    <div className="login-page d-flex align-items-center justify-content-start vh-100">
      <div className="login-cashier-box bg-white p-5 rounded shadow">
        <div className="text-center mb-4 pt-5">
          <img src={logo} alt="Logo" style={{ width: '150px', height: '60px', objectFit: 'contain' }} />
        </div>
        <h3 className="text-center mb-3">Welcome Back!</h3>
        <div className="text-center text-muted"><small>Please select  your role access!</small></div>
        <div className='text-center mt-5 px-4'>
          <Link to='/admin/login'>
          <button type="submit" className="btn btn-primary w-100 mb-2" >
            Admin
          </button>
          </Link>
          <Link to='/cashier/login'>
          <button type="submit" className="btn btn-primary w-100 mb-2">
            Cashier
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;