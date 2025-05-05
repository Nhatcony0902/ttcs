import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { login } from '../../action/authAction';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, isAuthenticated } = useSelector(state => state.auth || {});

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username && formData.password) {
            dispatch(login(formData));
        }
    };

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>LOGIN</div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <div>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            id="uname" 
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            id="pass" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="remember">
                            <input type="checkbox" id="remember" /> Remember me
                        </label>
                        <a href="#">Forget Password ?</a>
                    </div>
                    <div>
                        <input
                            type="submit"
                            id="login-btn"
                            value="Login"
                        />
                    </div>
                    <div>Don't have an Account? <NavLink to='/Register'>Sign up</NavLink></div>
                </form>
            </div>
        </div>
    );
}

export default Login;