import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const InfoShop = () => {
  const navigate = useNavigate();
  const [shopInfo, setShopInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchShopInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem thông tin shop");
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
          console.log(shop);
          // Fetch detailed shop info
          const shopResponse = await fetch(`http://localhost:8081/home/infoShop?shopId=${shop}`);
          if (!shopResponse.ok) {
            throw new Error("Không thể lấy thông tin chi tiết shop");
          }
          const detailedShopInfo = await shopResponse.json();
          setShopInfo(detailedShopInfo);
          console.log(detailedShopInfo);
        } else {
          setError("Bạn chưa có shop nào");
        }
      } catch (err) {
        console.error("Lỗi fetch shop:", err);
        setError("Lỗi khi gọi API.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopInfo();
  }, []);

  const handleDelete = async () => {
    if (!shopInfo) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8081/manager/deleteShop/${shopInfo.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.text();
      if (response.ok) {
        setError("Xóa shop thành công!");
        setShopInfo(null);
        navigate('/about');
      } else {
        setError("Xóa shop thất bại: " + result);
      }
    } catch (err) {
      console.error("Lỗi xóa shop:", err);
      setError("Có lỗi xảy ra khi xóa shop");
    }
    setDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !shopInfo) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">Thông tin Shop</h2>
            <button
              onClick={() => navigate('/about')}
              className="bg-white text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors duration-200 font-medium"
            >
              Quay lại
            </button>
          </div>
        </div>

        {shopInfo && (
          <div className="p-6 space-y-8">
            {/* Shop Overview */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
         
                  <p className="text-gray-600"><span className="font-medium">Tên:</span> {shopInfo.name}</p>
                  <p className="text-gray-600"><span className="font-medium">Loại:</span> {shopInfo.type}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600"><span className="font-medium">Đánh giá:</span> {shopInfo.rating || "Chưa có"}</p>
                  <p className="text-gray-600"><span className="font-medium">Follower:</span> {shopInfo.followers || 0}</p>
                  <p className="text-gray-600"><span className="font-medium">Địa chỉ:</span> {shopInfo.address}</p>
                </div>
              </div>
            </div>

            {/* Products Section */}
            {shopInfo.productResponses && shopInfo.productResponses.length > 0 ? (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Sản phẩm</h3>
                  <Link 
                    to="/createProduct" 
                    state={{ shopId: shopInfo.id }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Thêm sản phẩm
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shopInfo.productResponses.map((product, index) => (
                    <div key={index} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                      {product.imageResponses && product.imageResponses.length > 0 && (
                        <div className="relative h-48">
                          <img 
                            src={product.imageResponses[0].url} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                        <div className="space-y-1 mb-4">
                          <p className="text-gray-700"><span className="font-medium">Giá:</span> {product.price.toLocaleString('vi-VN')}đ</p>
                          <p className="text-gray-700"><span className="font-medium">Loại:</span> {product.category}</p>
                          <p className="text-gray-700"><span className="font-medium">Số lượng:</span> {product.quantity}</p>
                          <p className="text-gray-700"><span className="font-medium">Đánh giá:</span> {product.rating || "Chưa có"}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Link 
                            to="/editProduct" 
                            state={{ productId: product.id }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️ Sửa
                          </Link>
                          <Link 
                            to="/deleteProduct" 
                            state={{ productId: product.id }}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑 Xóa
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <p className="text-gray-500 mb-4">Chưa có sản phẩm nào.</p>
                <Link 
                  to="/createProduct" 
                  state={{ shopId: shopInfo.id }}
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Thêm sản phẩm đầu tiên
                </Link>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center bg-gray-50 rounded-xl p-6 shadow-sm">
              <Link 
                to="/editShop" 
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
              >
                Chỉnh sửa Shop
              </Link>

              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Xóa Shop
                </button>
              ) : (
                <div className="space-x-4">
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Xác nhận xóa
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoShop;
