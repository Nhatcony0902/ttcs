import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AddToCart = ({ onAddToCart }) => {
  const { productId } = useParams(); // Lấy productId từ URL
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:8081/home/infoToken?token=${token}`)
        .then(res => res.json())
        .then(data => setUserId(data.id))
        .catch(err => console.error('Lỗi lấy user info:', err));
    }
  }, []);

  const handleAddToCart = () => {
    if (!userId) {
      setMessage('Vui lòng đăng nhập');
      return;
    }

    if (quantity <= 0) {
      setMessage('Số lượng phải lớn hơn 0');
      return;
    }

    const cartItem = {
      userId,
      productId: parseInt(productId),
      quantity,
    };

    const token = localStorage.getItem('token');

    fetch('http://localhost:8081/customer/createCartItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cartItem),
    })
      .then(res => {
        if (!res.ok) throw new Error('Thêm sản phẩm thất bại');
        return res.text();
      })
      .then(msg => {
        setMessage(msg || 'Đã thêm vào giỏ hàng!');
        if (onAddToCart) {
          onAddToCart(); // Gọi callback khi thêm vào giỏ hàng thành công
        }
      })
      .catch(err => {
        console.error('Lỗi khi thêm giỏ hàng:', err);
        setMessage('Lỗi khi thêm vào giỏ hàng');
      });
  };

  return (
    <div className="mt-4">
      <label className="mr-2">Số lượng:</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={e => setQuantity(parseInt(e.target.value))}
        className="border px-2 py-1 w-20 mr-4"
      />
      <button onClick={handleAddToCart} className="bg-green-600 text-white px-4 py-1 rounded">
        Thêm vào giỏ hàng
      </button>
      {message && <p className="mt-2 text-sm text-blue-600">{message}</p>}
    </div>
  );
};

export default AddToCart;
