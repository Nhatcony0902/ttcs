import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../action/authAction';
function Logout  ()  {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };

  return (
   <>
     <button onClick={handleLogout} style={{ padding: '10px', cursor: 'pointer' }}>
      Đăng xuất
    </button>
   </>
  );
};

export default Logout;