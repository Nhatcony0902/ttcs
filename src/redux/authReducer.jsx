const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem('token') || null,
  isVerified: false,
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAIL':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
      case 'REGISTER_SUCCESS':
        return { ...state, error: null, loading: false };
      case 'REGISTER_FAIL':
        return { ...state, error: action.payload, loading: false };
      case 'VERIFY_SUCCESS':
        return {
          ...state,
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
          isVerified: true,
          error: null,
        };
      case 'VERIFY_FAIL':
        return { ...state, error: action.payload };
    default:
      return state;

  }
};
export default authReducer;