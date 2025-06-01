export const register = (userData) => async (dispatch) => {
    try {
        const res = await fetch('http://localhost:8081/home/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const result = await res.text(); 

        if (result === 'registered successfully') {
            dispatch({ type: 'REGISTER_SUCCESS' });
        } else {
            dispatch({ type: 'REGISTER_FAIL', payload: result });
        }
    } catch (error) {
        dispatch({ type: 'REGISTER_FAIL', payload: 'Something went wrong' });
    }
};
// actions/authActions.js
// actions/authActions.js
export const verifyAccount = (email, verificationCode) => async (dispatch) => {
  try {
    dispatch({ type: 'VERIFY_REQUEST' });

    const url = `http://localhost:8081/home/verify?email=${encodeURIComponent(email)}&verificationCode=${encodeURIComponent(verificationCode)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.text(); 

    dispatch({
      type: 'VERIFY_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'VERIFY_FAIL',
      payload: error.message || 'Verification failed',
    });
  }
};
export const loginUser = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });

    const response = await fetch('http://localhost:8081/home/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.text();
    console.log(data);
    if (data === 'failed to login') {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Invalid credentials or account not verified' });
    } else {
      
      localStorage.setItem('token', data); 
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      window.dispatchEvent(new CustomEvent("LOGIN_SUCCESS"));
    }
  } catch (error) {
    dispatch({ type: 'LOGIN_FAIL', payload: 'Network error' });
  }
};
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: 'LOGOUT' });
};



