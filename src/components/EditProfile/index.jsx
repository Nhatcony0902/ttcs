import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    } else {
      // Không có dữ liệu truyền sang, điều hướng lại hoặc hiển thị lỗi
      navigate("/user");
    }
  }, [userFromState, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: Array.from(e.target.files) }));
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
      const response = await fetch("http://localhost:8081/customer/editProfile", {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        const message = await response.text();
        alert("Profile updated: " + message);
        navigate("/profile"); // quay về profile sau khi cập nhật
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="firstName" value={formData.firstName} onChange={handleChange} />
        <input name="lastName" value={formData.lastName} onChange={handleChange} />
        <input name="age" type="number" value={formData.age} onChange={handleChange} />
        <input name="sex" value={formData.sex} onChange={handleChange} />
        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;
