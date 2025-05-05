import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Import reducer cụ thể

const allReducers = combineReducers({
  auth: authReducer, 
});

export default allReducers;