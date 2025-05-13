import React, { useState } from "react";

const DeleteShop = () => {
  const [shopId, setShopId] = useState("");

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:8081/home/deleteShop/${shopId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const message = await response.text();
    alert(message);
  };

  return (
    <div>
      <h2>Delete Shop</h2>
      <input
        placeholder="Shop ID"
        value={shopId}
        onChange={(e) => setShopId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteShop;
