import React, { useState, useEffect } from "react";

const CreateShop = () => {
  const [userId, setUserId] = useState(null); // Lưu userId
  const [shopId, setShopId] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdShop, setCreatedShop] = useState(null);

  // Lấy thông tin user từ API
  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // Lấy token từ localStorage

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
        console.log(data)
        setUserId(data.id); // Lưu userId từ response trả về
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
      shopId: shopId,
      name: shopName,
      userId: userId, // Dùng userId đã lấy được
      address: address,
      type: type,
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/manager/createShop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shopData), // Gửi dữ liệu shop dưới dạng JSON
      });

      if (response.ok) {
        const message = await response.text(); // dùng text thay vì json
        setMessage(message);
      } else {
        throw new Error("Tạo shop thất bại!");
      }
    } catch (error) {
      setMessage("Tạo shop thất bại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Tạo Shop</h2>
      <div>
        <input
          type="text"
          placeholder="Id shop"
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Tên shop"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Loại shop"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
      <button onClick={handleCreateShop} disabled={loading || !userId}>
        {loading ? "Đang tạo..." : "Tạo Shop"}
      </button>
      {message && <p>{message}</p>}

      {/* Hiển thị thông tin shop đã tạo */}
      {createdShop && (
        <div>
          <h3>Thông tin Shop đã tạo</h3>
          <p>ID Shop: {createdShop.id}</p>
          <p>Tên Shop: {createdShop.name}</p>
          <p>Địa chỉ: {createdShop.address}</p>
          <p>Loại shop: {createdShop.type}</p>
          <p>Quản lý Shop: {createdShop.managerId}</p>
        </div>
      )}
    </div>
  );
};

export default CreateShop;
