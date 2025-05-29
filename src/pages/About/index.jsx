import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function About() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:8081/home/infoToken?token=${token}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy thông tin user", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.roleName !== "MANAGER") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Không có quyền truy cập</h2>
          <p className="mt-2 text-gray-600">Trang này chỉ dành cho quản lý cửa hàng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Quản Lý Cửa Hàng</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/createShop"
                className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tạo Cửa Hàng</h3>
                <p className="text-sm text-gray-500 text-center">Tạo một cửa hàng mới trong hệ thống</p>
              </Link>

              <Link
                to="/editShop"
                className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-3 bg-yellow-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chỉnh Sửa Cửa Hàng</h3>
                <p className="text-sm text-gray-500 text-center">Cập nhật thông tin cửa hàng của bạn</p>
              </Link>

              <Link
                to="/infoShop"
                className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-3 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Thông Tin Cửa Hàng</h3>
                <p className="text-sm text-gray-500 text-center">Xem thông tin chi tiết về cửa hàng</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;