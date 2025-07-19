import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/login.css'; // Custom styles if needed
import logo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { loginCashier } from '../../api/auth';
import eyeSlash from '../../assets/icon/eye-slash.png';
import eye from '../../assets/icon/eye.png';

function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'email is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    try {
      const res_data = await loginCashier(email, password);
      // console.log('result login', res_data);
      localStorage.setItem('token', res_data.data.token);
      localStorage.setItem('role', res_data.data.user?.role);
      localStorage.setItem('email', res_data.data.user?.email);
      localStorage.setItem('name', res_data.data.user?.name);
      localStorage.setItem('avatar_image', res_data.data.user?.avatar);
      // notify other components about auth change
      window.dispatchEvent(new Event('storage'));
      navigate('/cashier/menu-order');
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Login failed' });
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-start vh-100">
      <div className="login-cashier-box bg-white p-5 rounded shadow">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: '60px', objectFit: 'contain' }} />
        </div>
        <h3 className="text-center mb-3">Reset Password</h3>
        <div className="text-center text-muted"><small>Please enter your registered email here!</small></div>
        <form onSubmit={handleLogin}>
          <div className="mb-3 mt-5">
            <label htmlFor="Email" className="form-label d-flex justify-content-between">Email</label>
            <input 
              type="text" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          {errors.general && <div className="alert alert-danger">{errors.general}</div>}
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Login;