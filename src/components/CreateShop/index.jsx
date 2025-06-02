import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateShop = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdShop, setCreatedShop] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      fetchUserInfo(storedToken);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`http://localhost:8081/home/infoToken?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserId(data.id);
      } else {
        throw new Error("Không thể lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      setMessage("Không thể lấy thông tin người dùng.");
    }
  };

  const handleCreateShop = async () => {
    if (!userId) {
      setMessage("Đang tải thông tin người dùng. Vui lòng thử lại sau.");
      return;
    }

    if (!shopName || !address || !type) {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const shopData = {
      name: shopName,
      userId: userId,
      address: address,
      type: type,
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/manager/createShop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
      });

      const responseText = await response.text();
      
      if (response.ok) {
        try {
          const shopData = JSON.parse(responseText);
          setCreatedShop(shopData);
          setMessage("Tạo shop thành công!");
        } catch (parseError) {
          setMessage(responseText);
        }
      } else {
        setMessage(responseText || "Tạo shop thất bại!");
      }
    } catch (error) {
      setMessage("Tạo shop thất bại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tạo Shop</h2>
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
            type="text"
            placeholder="Tên shop"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />
        </div>
        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Chọn loại shop</option>
            <option value="Tap_hoa">Tạp hóa</option>
            <option value="Thoi_trang">Thời trang</option>
            <option value="Vat_lieu">Vật liệu</option>
          </select>
        </div>
        <button 
          onClick={handleCreateShop} 
          disabled={loading || !userId}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang tạo..." : "Tạo Shop"}
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}

        {createdShop && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">Thông tin Shop đã tạo</h3>
            <p className="text-sm text-green-700">ID Shop: {createdShop.id}</p>
            <p className="text-sm text-green-700">Tên Shop: {createdShop.name}</p>
            <p className="text-sm text-green-700">Địa chỉ: {createdShop.address}</p>
            <p className="text-sm text-green-700">Loại shop: {createdShop.type}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateShop;
