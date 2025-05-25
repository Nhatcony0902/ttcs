import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const CreateProduct = ({ onProductCreated }) => {
  const location = useLocation();
  const shopId = location.state?.shopId;

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
        },
        body: formData,
      });

      const result = await res.text();
      console.log(result);
      if (res.ok) {
        setMessage("Tạo sản phẩm thành công!");
        onProductCreated?.();
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
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">Không tìm thấy shopId. Vui lòng quay lại chọn shop.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Thêm Sản Phẩm</h3>
      
      <div className="space-y-4">
        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product ID (để trống nếu tạo mới)"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </div>

        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Giá"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Loại"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Số lượng"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Tạo sản phẩm
        </button>

        {message && (
          <p className={`mt-4 p-3 rounded-md ${
            message.includes("thành công") 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateProduct;
