import React, { useState, useEffect } from "react";

const ChangePassword = () => {
  const [userId, setUserId] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetch(`http://localhost:8081/home/infoToken?token=${storedToken}`)
        .then((res) => res.json())
        .then((data) => setUserId(data.id))
        .catch((err) => console.error("Failed to get user ID", err));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    const payload = {
      userId,
      oldPassword,
      newPassword,
      confirmPassword,
    };

    try {
      const response = await fetch("http://localhost:8081/customer/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const message = await response.text();
        alert("Password changed successfully: " + message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await response.text();
        alert("Error: " + error);
      }
    } catch (error) {
      console.error("Password change failed", error);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
