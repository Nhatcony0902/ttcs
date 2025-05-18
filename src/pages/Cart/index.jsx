import React, { useEffect, useState } from 'react';

const Cart = () => {
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
    fetch(`http://localhost:8081/customer/getCartItems?userId=${userId}`)
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
    fetch(`http://localhost:8081/customer/deleteCartItem/${cartItemId}`, {
      method: 'DELETE',
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
    fetch(`http://localhost:8081/customer/order?cartItemId=${cartItemId}`)
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

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (cartItems.length === 0) return <p>Giỏ hàng trống.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Giỏ hàng của bạn</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      {cartItems.map(item => {
        const product = item.productResponse;
        console.log('Cart item status:', item.status);
        return (
          <div key={item.id} className="border-b py-3 flex items-start gap-4">
            {product?.imageResponses?.[0]?.url && (
              <img
                src={product.imageResponses[0].url}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div>
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{product.description}</p>
              <p className="text-sm">Số lượng: {item.quantity}</p>
              <p className="text-sm">Giá: ${product.price?.toFixed(2)}</p>
              <p className="text-sm">Trạng thái: <strong>{item.status}</strong></p>
              {item.orderDate && (
                <p className="text-sm">
                  Ngày đặt: {new Date(item.orderDate).toLocaleDateString()}
                </p>
              )}
              {item.deliveryDate && (
                <p className="text-sm">
                  Giao dự kiến: {new Date(item.deliveryDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {item.status === "Thêm vào rỏ hàng" && (
                <button
                  onClick={() => handleOrder(item.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Đặt hàng
                </button>
              )}
              {item.status === "Đã đặt hàng" && (
                <button
                  onClick={() => handleOrder(item.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Hủy Đặt
                </button>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cart;
