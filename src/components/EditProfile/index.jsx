import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function EditProfile ()  {
  const location = useLocation();
  const navigate = useNavigate();
  const userFromState = location.state?.user;

  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    sex: "",
    phoneNumber: "",
    images: []
  });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (userFromState) {
      setFormData({
        id: userFromState.id || "",
        firstName: userFromState.firstName || "",
        lastName: userFromState.lastName || "",
        age: userFromState.age || "",
        sex: userFromState.sex || "",
        phoneNumber: userFromState.phoneNumber || "",
        images: []
      });
      setPreviewImages(userFromState.images ? userFromState.images.map(img => img.url) : []);
    } else {
      navigate("/user");
    }
  }, [userFromState, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("id", formData.id);
    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("age", formData.age);
    payload.append("sex", formData.sex);
    payload.append("phoneNumber", formData.phoneNumber);
    formData.images.forEach((file) => {
      payload.append("images", file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8081/customer/editProfile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (response.ok) {
        const message = await response.text();
        alert("Profile updated: " + message);
        navigate("/");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Chỉnh sửa thông tin cá nhân</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div className="flex flex-col items-center mb-4">
            <div className="h-28 w-28 rounded-full bg-gray-100 shadow mb-2 flex items-center justify-center overflow-hidden">
              {previewImages && previewImages.length > 0 ? (
                <img src={previewImages[0]} alt="Avatar preview" className="h-full w-full object-cover rounded-full" />
              ) : (
                <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <input type="file" multiple onChange={handleFileChange} className="mt-2" />
            {previewImages.length > 1 && (
              <div className="flex gap-2 mt-2 flex-wrap justify-center">
                {previewImages.slice(1).map((img, idx) => (
                  <img key={idx} src={img} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
              <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <input name="sex" value={formData.sex} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
          </div>
          <div className="flex justify-between mt-6">
            <Link to="/editprofile">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium shadow"
            >
              Quay lại
            </button>
            </Link>
           
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
