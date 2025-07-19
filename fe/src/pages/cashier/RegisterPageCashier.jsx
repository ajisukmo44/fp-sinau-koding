import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/login.css'; // Custom styles if needed
import logo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import eyeSlash from '../../assets/icon/eye-slash.png';
import eye from '../../assets/icon/eye.png';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'email is required';
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (!passwordConfirm.trim()) newErrors.passwordConfirm = 'passwordConfirm is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    try {
     const data =  {
          "username" : username,
          "email" : email,
          "password" : password
      }
      const res_data = await register(data);
      // console.log('result register', res_data);
      setSuccess(res_data?.message);
      setUsername('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      // notify other components about auth change
      // window.dispatchEvent(new Event('storage'));
      // navigate('/cashier/login');
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Register failed' });
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-start vh-100">
      <div className="register-box bg-white p-5 rounded shadow">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: '60px', objectFit: 'contain' }} />
        </div>
        <h3 className="text-center mb-3">Welcome Back!</h3>
        {!success ? (
        <div className="text-center text-muted"><small>Create your account here!</small></div>) : (<div className="alert alert-success">{success}</div>)}
        <form onSubmit={handleLogin}>
          <div className="mb-3 mt-3">
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
          <div className="mb-3 mt-2">
            <label htmlFor="email" className="form-label d-flex justify-content-between">Email</label>
            <input 
              type="text" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label d-flex justify-content-between">
              <span>Password</span>
            </label>
            <div className="position-relative mb-3">
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
                 {showPassword ? <img src={eyeSlash} alt="icon" /> : <img src={eye} alt="icon" style={{width: '18px', height: '18px'}}/>}
              </button>
            </div>

            <label htmlFor="password" className="form-label d-flex justify-content-between">
              <span>Confirm Password</span>
            </label>
             <div className="position-relative">
              <input 
                type={showPasswordConfirm ? "text" : "password"} 
                className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
                id="confirmPassword" 
                placeholder="Confirm Password" 
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <button
                type="button"
                className="btn position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              >
                {showPassword ? <img src={eyeSlash} alt="icon" /> : <img src={eye} alt="icon" style={{width: '18px', height: '18px'}}/>}
              </button>
            </div>
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>
          {errors.general && <div className="alert alert-danger">{errors.general}</div>}
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <div className='text-center mt-2'>
         <small className='text-muted me-2'> Already have an account? <Link to="/cashier/login">Login</Link></small>
        </div>
      </div>
    </div>
  );
}

export default Register;