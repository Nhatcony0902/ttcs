// pages/LoginPage.jsx
import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../action/authAction';
import { Link, useNavigate } from 'react-router-dom';

function Login () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const token = localStorage.getItem('token');
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(username, password));
   
    console.log(token);
  };

useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Chuyển hướng sau khi đăng nhập
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <br/>
        <Link to="/forgotpassword">Quên mật khẩu</Link>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
