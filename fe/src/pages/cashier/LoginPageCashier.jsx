import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/login.css'; // Custom styles if needed
import logo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { loginCashier } from '../../api/auth';
import eyeSlash from '../../assets/icon/eye-slash.png';
import eye from '../../assets/icon/eye.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    setLoading(true);
    try {
      const res_data = await loginCashier(username, password);
      // console.log('result login', res_data);
      localStorage.setItem('token', res_data.data.token);
      localStorage.setItem('role', res_data.data.user?.role);
      localStorage.setItem('username', res_data.data.user?.username);
      localStorage.setItem('name', res_data.data.user?.name);
      localStorage.setItem('avatar_image', res_data.data.user?.avatar);
      // notify other components about auth change
      window.dispatchEvent(new Event('storage'));
      navigate('/cashier/menu-order');
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-start vh-100">
      <div className="login-cashier-box bg-white p-5 rounded shadow">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: '60px', objectFit: 'contain' }} />
        </div>
        <h3 className="text-center mb-3">Welcome Back!</h3>
        <div className="text-center text-muted"><small>Please enter your username and password here!</small></div>
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
              disabled={loading}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label d-flex justify-content-between">
              <span>Password</span>
            </label>
            <div className="position-relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="btn position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <img src={eyeSlash} alt="icon" /> : <img src={eye} alt="icon" style={{width: '18px', height: '18px'}}/>}
              </button>
            </div>
            <div className='text-end'>
              <small className="text-muted" style={{ fontSize: '11px' }}><Link to="/cashier/reset-password" style={{textDecoration: 'none', color: '#C4C4C4'}}>Forgot Password?</Link></small>
            </div>
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>
          {errors.general && <div className="alert alert-danger">{errors.general}</div>}
          <button 
            type="submit" 
            className="btn btn-primary w-100" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className='text-center mt-2'>
         <small className='text-muted me-2'> Don't have an account?</small><small><Link to="/cashier/register">Register Cashier</Link></small>
        </div>
      </div>
    </div>
  );
}

export default Login;