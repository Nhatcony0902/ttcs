import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const EditProduct = () => {
  const location = useLocation();
  const shopId = location.state?.shopId || "";

  const [productId, setProductId] = useState("");
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
    if (!productId || !shopId || !name || !price || !category || !quantity) {
      setMessage("Vui lòng nhập đầy đủ thông tin, bao gồm Product ID và Shop ID.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("shopId", shopId);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    images.forEach((img) => formData.append("images", img));

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8081/manager/editProduct", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Không set Content-Type khi dùng FormData
        },
        body: formData,
      });

      const result = await res.text();
      if (res.ok) {
        setMessage("Cập nhật sản phẩm thành công!");
        // Có thể reset form nếu muốn:
        // setProductId("");
        // setName("");
        // setDescription("");
        // setPrice("");
        // setCategory("");
        // setQuantity("");
        // setImages([]);
      } else {
        setMessage("Cập nhật thất bại: " + result);
      }
    } catch (err) {
      console.error(err);
      setMessage("Có lỗi khi cập nhật sản phẩm.");
    }
  };

  return (
    <div style={{ border: "1px dashed #aaa", padding: "10px", marginBottom: "20px" }}>
      <h3>Chỉnh sửa sản phẩm</h3>
      <p>Shop ID: {shopId || "Chưa có Shop ID"}</p>
      <input
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      /><br />
      <input
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br />
      <textarea
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /><br />
      <input
        type="number"
        placeholder="Giá"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      /><br />
      <input
        placeholder="Loại"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      /><br />
      <input
        type="number"
        placeholder="Số lượng"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      /><br />
      <input
        type="file"
        multiple
        onChange={handleImageChange}
      /><br />
      <button onClick={handleSubmit}>Cập nhật sản phẩm</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditProduct;
