import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const DeleteProduct = () => {
  const location = useLocation();
  const productId = location.state?.productId;
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8081/manager/deleteProduct/${productId}`, {
        method: "DELETE", // ← CHỈNH SỬA Ở ĐÂY
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.text();
      if (res.ok) {
        setMessage("Xoá sản phẩm thành công.");
      } else {
        setMessage("Xoá thất bại: " + result);
      }
    } catch (err) {
      console.error(err);
      setMessage("Có lỗi khi xoá sản phẩm.");
    } finally {
      setConfirming(false);
    }
  };

  if (!productId) return <p>Không tìm thấy ID sản phẩm để xoá.</p>;

  return (
    <div style={{ marginTop: "10px" }}>
      {!confirming ? (
        <button onClick={() => setConfirming(true)}>🗑 Xoá sản phẩm</button>
      ) : (
        <div>
          <p>Bạn có chắc muốn xoá sản phẩm này?</p>
          <button onClick={handleDelete} style={{ color: "red" }}>Xác nhận xoá</button>
          <button onClick={() => setConfirming(false)}>Huỷ</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteProduct;
