import React, { useState } from "react";

const SearchProduct = () => {
  const [params, setParams] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    rating: "",
    shopAddress: "",
    shopName: "",
    shopRating: "",
    shopType: "",
  });

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams({ ...params, [name]: value });
  };

  const buildQuery = (obj) => {
    const query = Object.entries(obj)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    return query;
  };

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    const queryString = buildQuery(params);
    try {
      const response = await fetch(`http://localhost:8081/home/find?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setMessage(data.length > 0 ? "" : "Không tìm thấy sản phẩm.");
      } else {
        const error = await response.text();
        setMessage("Lỗi: " + error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Đã xảy ra lỗi khi tìm kiếm.");
    }
  };

  return (
    <div>
      <h3>Tìm kiếm sản phẩm nâng cao</h3>
      {Object.keys(params).map((field) => (
        <div key={field}>
          <input
            name={field}
            value={params[field]}
            onChange={handleChange}
            placeholder={field}
          />
        </div>
      ))}
      <button onClick={handleSearch}>Tìm kiếm</button>

      {message && <p>{message}</p>}

      <ul>
        {products.map((product) => (
          <li key={product.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "16px", padding: "10px" }}>
            <p><strong>ID:</strong> {product.id}</p>
            <p><strong>Tên:</strong> {product.name}</p>
            <p><strong>Mô tả:</strong> {product.description}</p>
            <p><strong>Giá:</strong> {product.price}</p>
            <p><strong>Loại:</strong> {product.category}</p>
            <p><strong>Số lượng:</strong> {product.quantity}</p>
            <p><strong>Đánh giá trung bình:</strong> {product.rating ?? "Chưa có"}</p>
            <p><strong>Shop ID:</strong> {product.shopId}</p>

            {/* Hiển thị ảnh sản phẩm */}
            {product.imageResponses && product.imageResponses.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.imageResponses.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`image-${idx}`}
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                ))}
              </div>
            )}

            {/* Hiển thị danh sách đánh giá nếu có */}
            {product.ratingResponses && product.ratingResponses.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <strong>Đánh giá chi tiết:</strong>
                <ul>
                  {product.ratingResponses.map((rate, i) => (
                    <li key={i}>
                      ⭐ {rate.score} - {rate.comment || "Không có bình luận"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default SearchProduct;
