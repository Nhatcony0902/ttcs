import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
const CreateProduct = ({ onProductCreated }) => {
  const location = useLocation();
  const shopId = location.state?.shopId;

  const [productId, setProductId] = useState(""); // có thể để trống nếu tạo mới
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async () => {
    if (!name || !price || !category || !quantity || !shopId) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId || "");
    formData.append("shopId", shopId.toString());
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("quantity", quantity.toString());

    images.forEach((image) => {
      formData.append("images", image);
    });

    const token = localStorage.getItem("token");
    console.log(token);
    try {
      const res = await fetch("http://localhost:8081/manager/createProduct", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Không cần Content-Type khi gửi FormData
        },
        body: formData,
      });

      const result = await res.text();
      console.log(result);
      if (res.ok) {
        setMessage("Tạo sản phẩm thành công!");
        onProductCreated?.(); // kiểm tra có callback thì gọi
        setProductId("");
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setQuantity("");
        setImages([]);
      } else {
        setMessage("Tạo sản phẩm thất bại: " + result);
      }
    } catch (err) {
      console.error(err);
      setMessage("Lỗi tạo sản phẩm.");
    }
  };

  if (!shopId) {
    return <p style={{ color: "red" }}>Không tìm thấy shopId. Vui lòng quay lại chọn shop.</p>;
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "20px" }}>
      <h3>Thêm Sản Phẩm</h3>
      <input
        placeholder="Product ID (để trống nếu tạo mới)"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      /><br />
      <input placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} /><br />
      <textarea placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} /><br />
      <input type="number" placeholder="Giá" value={price} onChange={(e) => setPrice(e.target.value)} /><br />
      <input placeholder="Loại" value={category} onChange={(e) => setCategory(e.target.value)} /><br />
      <input type="number" placeholder="Số lượng" value={quantity} onChange={(e) => setQuantity(e.target.value)} /><br />
      <input type="file" multiple onChange={handleImageChange} /><br />
      <button onClick={handleSubmit}>Tạo sản phẩm</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateProduct;
