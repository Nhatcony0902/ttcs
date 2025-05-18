import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CreateRating = ({ onSuccess }) => {
  const location = useLocation();
  const productId = location.state?.productId;

  const [userId, setUserId] = useState(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`http://localhost:8081/home/infoToken?token=${token}`)
      .then(res => res.json())
      .then(data => setUserId(data.id))
      .catch(err => console.error('Lỗi lấy thông tin người dùng:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !productId) {
      alert('Thiếu thông tin người dùng hoặc sản phẩm.');
      return;
    }

    const ratingDTO = {
      userId,
      productId,
      content,
      rating
    };

    try {
      const res = await fetch('http://localhost:8081/customer/createRating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratingDTO),
      });

      const message = await res.text();
      alert(message);

      if (res.ok && onSuccess) {
        onSuccess();
        setContent('');
        setRating(5);
      }
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-3 mt-4">
      <h3 className="font-semibold text-lg">Gửi đánh giá của bạn</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Viết cảm nhận của bạn..."
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        min="1"
        max="5"
        step="0.5"
        value={rating}
        onChange={(e) => setRating(parseFloat(e.target.value))}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Gửi đánh giá
      </button>
    </form>
  );
};

export default CreateRating;
