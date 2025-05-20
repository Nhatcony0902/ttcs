import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyAccount } from '../../action/authAction';
import { useNavigate } from 'react-router-dom';

const VerifyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { verifying, isVerified, message, error } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyAccount(email, verificationCode));
  };

  // ✅ Điều kiện chuyển hướng
  useEffect(() => {
     console.log("isVerified:", isVerified);
    if (isVerified) {
     
      setTimeout(() => {
        navigate("/login?from=verify");
 // Điều hướng sau 1 giây
      }, 1000);
    }
  }, [isVerified, navigate]);

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Verify Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Verification Code:</label><br />
          <input
            type="text"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1.5rem' }} disabled={verifying}>
          {verifying ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      {message && (
        <p style={{ color: isVerified ? 'green' : 'orange', marginTop: '1rem' }}>{message}</p>
      )}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default VerifyPage;
