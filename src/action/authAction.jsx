export const login = (credentials) => async (dispatch) => {
  try {
      const response = await fetch('http://localhost:8081/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
          throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Lưu token vào localStorage
      localStorage.setItem('token', data.token);

      dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
              user: data.user,
              token: data.token,
          },
      });
  } catch (error) {
      dispatch({
          type: 'LOGIN_FAIL',
          payload: error.message,
      });
  }
};
export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: 'LOGOUT' });
};

export const register = (userData) => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:8081/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Đăng ký thất bại');
    }

    const data = await response.json();
    console.log(data);

    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: { email: data.email },
    });

    return { success: true, email: data.email };
  } catch (error) {
    dispatch({
      type: 'REGISTER_FAIL',
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};

export const verify = (verificationData) => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:8081/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Xác minh thất bại');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);

    dispatch({
      type: 'VERIFY_SUCCESS',
      payload: { user: data.user, token: data.token },
    });

    return { success: true };
  } catch (error) {
    dispatch({
      type: 'VERIFY_FAIL',
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};
