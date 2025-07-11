import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/login.css'; // Custom styles if needed
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    try {
      const res_data = await login(username, password);
      console.log('result login', res_data);
      
      localStorage.setItem('token', res_data.data.token);
      localStorage.setItem('role', res_data.data.user?.role);
      // notify other components about auth change
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard-admin');
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Login failed' });
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-start vh-100">
      <div className="login-box bg-white p-5 rounded shadow">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: '60px', objectFit: 'contain' }} />
        </div>
        <h4 className="text-center mb-3">Welcome Back!</h4>
        <small className="text-center text-muted">Please enter your username and password here!</small>
        <form onSubmit={handleLogin}>
          <div className="mb-3 mt-5">
            <label htmlFor="username" className="form-label d-flex justify-content-between">Username</label>
            <input 
              type="text" 
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              id="username" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label d-flex justify-content-between">
              <span>Password</span>
              <a href="#" className="small">Forgot Password?</a>
            </label>
            <div className="position-relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>
          {errors.general && <div className="alert alert-danger">{errors.general}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;