import React, { useState } from "react";
import { Link } from "react-router-dom";

const InfoShop = () => {
  const [shopId, setShopId] = useState("");
  const [shopInfo, setShopInfo] = useState(null);
  const [error, setError] = useState("");

  const handleFetchShop = async () => {
    try {
      const response = await fetch(`http://localhost:8081/manager/infoShop?shopId=${shopId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setShopInfo(data);
        setError("");
      } else {
        setError("Không tìm thấy shop hoặc có lỗi xảy ra.");
        setShopInfo(null);
      }
    } catch (err) {
      console.error("Lỗi fetch shop:", err);
      setError("Lỗi khi gọi API.");
      setShopInfo(null);
    }
  };

  return (
    <div>
      <h2>Thông tin Shop</h2>
      <input
        type="text"
        placeholder="Nhập shop ID"
        value={shopId}
        onChange={(e) => setShopId(e.target.value)}
      />
      <button onClick={handleFetchShop}>Lấy thông tin shop</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shopInfo && (
        <div>
          <h3>Thông tin:</h3>
          <p><strong>ID:</strong> {shopInfo.id}</p>
          <p><strong>Tên:</strong> {shopInfo.name}</p>
          <p><strong>Loại:</strong> {shopInfo.type}</p>
          <p><strong>Đánh giá:</strong> {shopInfo.rating}</p>

          {shopInfo.productResponses && shopInfo.productResponses.length > 0 ? (
            <div>
              <h4>Sản phẩm:</h4>
              <ul>
                {shopInfo.productResponses.map((product, index) => (
                  <li key={index} style={{ borderBottom: "1px solid #ccc", marginBottom: "16px" }}>
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>Tên:</strong> {product.name}</p>
                    <p><strong>Mô tả:</strong> {product.description}</p>
                    <p><strong>Giá:</strong> {product.price}</p>
                    <p><strong>Loại:</strong> {product.category}</p>
                    <p><strong>Số lượng:</strong> {product.quantity}</p>
                    <p><strong>Đánh giá trung bình:</strong> {product.rating ?? "Chưa có"}</p>
                    {product.imageResponses && product.imageResponses.length > 0 && (
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {product.imageResponses.map((img, idx) => (
                          <img key={idx} src={img.url} alt={`img-${idx}`} width={80} height={80} style={{ objectFit: "cover", borderRadius: "4px" }} />
                        ))}
                      </div>
                    )}
                    <Link to="/deleteProduct" state={{ productId: product.id }}>
                      🗑 Xoá sản phẩm
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Không có sản phẩm nào.</p>
          )}

          {/* Truyền shopId sang các trang bằng state */}
          <Link to="/createProduct" state={{ shopId: shopInfo.id }}>Thêm sản phẩm</Link><br />
          <Link to="/editProduct" state={{ shopId: shopInfo.id }}>Sửa sản phẩm</Link><br />
          <Link to="/deleteProduct" state={{ shopId: shopInfo.id }}>Xóa sản phẩm</Link>
        </div>
      )}
    </div>
  );
};

export default InfoShop;
