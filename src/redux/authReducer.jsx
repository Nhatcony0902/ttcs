const initialState = {
    isAuthenticated: false,
    isVerified: false, // Có thể dùng khi có logic xác minh email sau này
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
        default:
            return state;
    }
};
