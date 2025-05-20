import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../action/authAction';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Kiểm tra nếu URL có ?from=verify
  const queryParams = new URLSearchParams(location.search);
  const fromVerify = queryParams.get('from') === 'verify';

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(username, password));

    // Xoá ?from=verify khỏi URL để tránh chặn điều hướng
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (isAuthenticated && !fromVerify) {
      navigate('/'); // Chuyển hướng về trang chủ sau đăng nhập (nếu không từ verify)
    }
  }, [isAuthenticated, fromVerify, navigate]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <div className="mt-4 text-center">
          <Link to="/forgotpassword" className="text-blue-500 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        {error && <p className="text-red-500 mt-3">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
