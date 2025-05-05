import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { register } from '../../action/authAction';
function Register(){
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    retype: '',
    age: '',
    phone: '',
    email: '',
    role: '',
  });

  const [termsAgreed, setTermsAgreed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector(state => state.auth || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTermsChange = (e) => {
    setTermsAgreed(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!termsAgreed) {
      alert('Please agree to the Terms and Conditions before signing up.');
      return;
    }

    if (formData.password !== formData.retype) {
      alert('Passwords do not match!');
      return;
    }

    dispatch(register(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Verify');
    }
  }, [isAuthenticated, navigate]);
  return (
    <>
    <div className="main-container centered-flex">
        <div className="form-register">
          <div className="form-wrapper">
            <div className="static-text">
              <span className="logo bi bi-command"></span>
              <h2>Get Started Now!</h2>
              <p>Set up your account and unlock endless possibilities.</p>
            </div>
            {error && <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="field-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="off"
                  required
                />
                <label htmlFor="email">Email</label>
                <span className="field-icon bi bi-envelope"></span>
              </div>
              <div className="field-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <label htmlFor="password">Password</label>
                <span className="field-icon bi bi-lock"></span>
              </div>
              <div className="field-group">
                <input
                  type="password"
                  id="confirm-password"
                  name="retype"
                  value={formData.retype}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <label htmlFor="confirm-password">Confirm Password</label>
                <span className="field-icon bi bi-lock"></span>
              </div>
              <div className="field-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="off"
                  required
                />
                <label htmlFor="name">Name</label>
                <span className="field-icon bi bi-emoji-angry"></span>
              </div>
              <div className="field-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="off"
                  required
                />
                <label htmlFor="username">Username</label>
                <span className="field-icon bi bi-emoji-dizzy"></span>
              </div>
              <div className="field-group">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="off"
                  required
                />
                <label htmlFor="phone">Phone</label>
                <span className="field-icon bi bi-phone"></span>
              </div>
              <div className="field-group">
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="off"
                  required
                />
                <label htmlFor="role">Role</label>
                <span className="field-icon bi bi-r-circle"></span>
              </div>
              <div className="agree-checkbox">
                <input
                  type="checkbox"
                  id="terms-condition"
                  checked={termsAgreed}
                  onChange={handleTermsChange}
                />
                <label htmlFor="terms-condition">
                  I agree to the <a href="#">Terms and Conditions</a>
                </label>
              </div>
              <button type="submit" >
                Sign up
              </button>
            </form>
            <span className="separator">or</span>
            <div className="other-options">
              <a href="#">
                <span className="option-icon bi bi-google"></span>
                Sign up with Google
              </a>
              <a href="#">
                <span className="option-icon bi bi-microsoft"></span>
                Sign up with Microsoft
              </a>
            </div>
            <p className="login-link">
              Already have an Account? <NavLink href="/login">Login</NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;