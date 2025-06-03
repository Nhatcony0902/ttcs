import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`http://localhost:8081/home/infoToken?token=${token}`)
      .then(res => res.json())
      .then(data => setUserId(data.id))
      .catch(err => console.error('Lỗi lấy user info:', err));
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchCartItems();
  }, [userId]);

  const fetchCartItems = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/customer/getCartItems?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setCartItems(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi lấy giỏ hàng:', err);
        setLoading(false);
      });
  };

  const handleDelete = (cartItemId) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/customer/deleteCartItem/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Xóa thất bại');
        return res.text();
      })
      .then(msg => {
        setMessage(msg);
        fetchCartItems(); // load lại giỏ hàng sau khi xóa
      })
      .catch(err => {
        console.error('Lỗi khi xóa cart item:', err);
        setMessage('Lỗi khi xóa giỏ hàng');
      });
  };
  
  const handleOrder = (cartItemId) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/customer/order?cartItemId=${cartItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Đặt hàng thất bại');
        return res.text();
      })
      .then(msg => {
        setMessage(msg);
        fetchCartItems(); // cập nhật lại giỏ hàng sau khi đặt hàng
      })
      .catch(err => {
        console.error('Lỗi khi đặt hàng:', err);
        setMessage('Lỗi khi đặt hàng');
      });
  };

  const handleCancelOrder = (cartItemId) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/customer/cancel?cartItemId=${cartItemId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Hủy đặt hàng thất bại');
        return res.text();
      })
      .then(msg => {
        setMessage(msg);
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === cartItemId 
              ? { ...item, status: "Thêm vào giỏ hàng" }
              : item
          )
        );
      })
      .catch(err => {
        console.error('Lỗi khi hủy đặt hàng:', err);
        setMessage('Lỗi khi hủy đặt hàng');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (cartItems.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="mt-4 text-xl font-medium text-gray-900">Giỏ hàng trống</h3>
        <p className="mt-2 text-gray-500">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </Link>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h2>
        
        </div>
        
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <p className="text-green-700">{message}</p>
          </div>
        )}

        <div className="grid gap-6">
          {cartItems.map(item => {
            const product = item.productResponse;
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-200 hover:shadow-md">
                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  {product?.imageResponses?.[0]?.url && (
                    <div className="flex-shrink-0">
                      <img
                        src={product.imageResponses[0].url}
                        alt={product.name}
                        className="w-40 h-40 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Số lượng</p>
                        <p className="font-medium text-lg">{item.quantity}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Giá</p>
                        <p className="font-medium text-lg text-green-600">${product.price?.toFixed(2)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                        <p className="font-medium text-lg text-blue-600">{item.status}</p>
                      </div>
                      {item.orderDate && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Ngày đặt</p>
                          <p className="font-medium text-lg">{new Date(item.orderDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                    
                    {item.deliveryDate && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-500 mb-1">Giao dự kiến</p>
                        <p className="font-medium text-blue-700">{new Date(item.deliveryDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end justify-center">
                    {item.status === "Thêm vào giỏ hàng" && (
                      <button
                        onClick={() => handleOrder(item.id)}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Đặt hàng
                      </button>
                    )}
                    {item.status === "Đã đặt hàng" && (
                      <button
                        onClick={() => handleCancelOrder(item.id)}
                        className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Hủy Đặt
                      </button>
                    )}
                    {item.status === "Đã hủy" && (
                      <button
                        onClick={() => handleOrder(item.id)}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Đặt lại
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Cart;