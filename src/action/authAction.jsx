export const register = (userData) => async (dispatch) => {
    try {
        const res = await fetch('http://localhost:8081/home/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const result = await res.text(); // backend trả chuỗi

        if (result === 'registered successfully') {
            dispatch({ type: 'REGISTER_SUCCESS' });
        } else {
            dispatch({ type: 'REGISTER_FAIL', payload: result });
        }
    } catch (error) {
        dispatch({ type: 'REGISTER_FAIL', payload: 'Something went wrong' });
    }
};
