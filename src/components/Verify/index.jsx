// src/components/Verify.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verify } from '../../action/authAction';

function Verify() {
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, isVerified } = useSelector(state => state.auth || {});
  
  // Lấy email từ state của Register
  const email = location.state?.email || '';

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationData = { email, code };
    const result = await dispatch(verify(verificationData));
    if (result.success) {
      navigate('/'); // Hoặc trang chính sau khi verify thành công
    }
  };

  useEffect(() => {
    if (!email) {
      navigate('/register'); // Nếu không có email, quay lại đăng ký
    }
    if (isVerified) {
      navigate('');
    }
  }, [email, isVerified, navigate]);

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Xác minh tài khoản</h2>
      <p>Nhập mã xác nhận được gửi đến {email}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="code">Mã xác nhận:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={code}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Nhập mã xác nhận"
          />
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Xác minh
        </button>
      </form>
    </div>
  );
}

export default Verify;