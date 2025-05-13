import React, { useState } from "react";

const EditShop = () => {
  const [formData, setFormData] = useState({
    shopId: "",
    name: "",
    address: "",
    type: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const response = await fetch("http://localhost:8081/home/editShop", {
      method: "POST", // backend bạn dùng POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, userId }),
    });

    const message = await response.text();
    alert(message);
  };

  return (
    <div>
      <h2>Edit Shop</h2>
      <input name="shopId" placeholder="Shop ID" onChange={handleChange} />
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="type" placeholder="Type" onChange={handleChange} />
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default EditShop;
