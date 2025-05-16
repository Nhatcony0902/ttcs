const initialState = {
    isAuthenticated: false,
    verifying: false,
    isVerified: false, // Có thể dùng khi có logic xác minh email sau này
    message: '',
    token: null,
    loading: false,
    error: null,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                isVerified: false,
                error: null,
            };
        case 'REGISTER_FAIL':
            return {
                ...state,
                isAuthenticated: false,
                error: action.payload,
            };
  

        case 'VERIFY_REQUEST':
            return { ...state, verifying: true, error: null };

        case 'VERIFY_SUCCESS':
            return {
                ...state,
                verifying: false,
                isVerified: action.payload === 'verified successfully',
                message: action.payload,
                error: null,
            };

        case 'VERIFY_FAIL':
            return {
                ...state,
                verifying: false,
                verified: false,
                message: '',
                error: action.payload,
            };
        case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload,
        error: null,
      };

    case 'LOGIN_FAIL':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        token: null,
        error: action.payload,
      };
      case 'LOGOUT':
      return { ...state, isAuthenticated: false, token: null, error: null };
        default:
            return state;
    }
};
