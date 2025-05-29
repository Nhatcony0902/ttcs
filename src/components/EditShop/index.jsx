import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditShop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [shopId, setShopId] = useState(null);

  useEffect(() => {
    const fetchUserAndShopData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Vui lòng đăng nhập để chỉnh sửa shop");
        setLoading(false);
        return;
      }

      try {
        // Get user info first
        const userResponse = await fetch(`http://localhost:8081/home/infoToken?token=${token}`);
        if (!userResponse.ok) {
          throw new Error("Không thể lấy thông tin người dùng");
        }
        const userData = await userResponse.json();
        
        // Get shop info using user's shop
        if (userData.shops && userData.shops.length > 0) {
          const shop = userData.shops[0];
          setShopId(shop.id);
          setFormData({
            name: shop.name || "",
            address: shop.address || "",
            type: shop.type || "",
          });
        } else {
          setMessage("Bạn chưa có shop nào để chỉnh sửa");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Có lỗi xảy ra khi lấy thông tin shop");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndShopData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async () => {
    if (!shopId) {
      setMessage("Không tìm thấy thông tin shop");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/manager/editShop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, shopId }),
      });

      const result = await response.text();
      if (response.ok) {
        setMessage("Cập nhật shop thành công!");
      } else {
        setMessage("Cập nhật thất bại: " + result);
      }
    } catch (error) {
      console.error("Error editing shop:", error);
      setMessage("Có lỗi xảy ra khi cập nhật shop");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!shopId) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-600 text-center">{message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Shop</h2>
        <button
          onClick={() => navigate('/about')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200"
        >
          Quay lại
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="name"
            placeholder="Tên shop"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="type"
            placeholder="Loại shop"
            value={formData.type}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={handleEdit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật Shop"}
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default EditShop;
