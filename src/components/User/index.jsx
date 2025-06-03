import React, { useEffect, useState } from "react";
import { Link, Links, NavLink, useNavigate } from "react-router-dom";
function User() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-block"
        >
          Quay lại
        </Link>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
          <div className="flex flex-col items-center py-10 px-6">
            <div className="h-32 w-32 rounded-full bg-white p-1 shadow-lg mb-4">
              {user.images && user.images.length > 0 ? (
                <img
                  src={user.images[0].url}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <p className="text-blue-600 mt-1 font-semibold">
              {user.roleName === "MANAGER" ? 'Quản lý' : user.roleName === "CUSTOMER" ? 'Khách hàng' : 'Cửa hàng'}
            </p>
            <Link
              to="/editprofile"
              state={{ user }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow"
            >
              Chỉnh sửa thông tin
            </Link>
          </div>
          <div className="px-6 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 transform transition-all hover:shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                    <dd className="mt-1 text-lg text-gray-900">{user.firstName} {user.lastName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-lg text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                    <dd className="mt-1 text-lg text-gray-900">{user.phoneNumber || 'Chưa cập nhật'}</dd>
                  </div>
                </dl>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 transform transition-all hover:shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tuổi</dt>
                    <dd className="mt-1 text-lg text-gray-900">{user.age || 'Chưa cập nhật'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
                    <dd className="mt-1 text-lg text-gray-900">{user.sex || 'Chưa cập nhật'}</dd>
                  </div>
                </dl>
              </div>
            </div>
            {user.images && user.images.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ảnh khác</h3>
                <div className="flex flex-wrap gap-4">
                  {user.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`User image ${index + 1}`}
                      className="w-40 h-40 object-cover rounded-xl shadow"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
