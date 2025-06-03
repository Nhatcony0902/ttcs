import React, { useState } from 'react';

  const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage('');
      setError('');

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8081/home/forgotPassword?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Lỗi HTTP: ${response.status} - ${errorText}`);
        }

        const data = await response.text(); // Endpoint trả về chuỗi
        console.log(data);
        setMessage(data);
        setEmail(''); // Xóa email sau khi gửi thành công
      } catch (err) {
        setError(err.message || 'Lỗi khi gửi yêu cầu đặt lại mật khẩu.');
      }
    };

    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <h2>Quên mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none' }}
          >
            Gửi yêu cầu
          </button>
        </form>
        {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    );
  };

  export default ForgotPassword;