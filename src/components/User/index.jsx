import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function User() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

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
        console.log(data)
        setUser(data);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Sex:</strong> {user.sex}</p>
        <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
      </div>

       {user.images && user.images.length > 0 && (
        <div>
          <h3>Images:</h3>
          {user.images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={`User image ${index + 1}`}
              width="200"
              style={{ marginBottom: "10px" }}
            />
          ))}
        </div>
      )}


      <Link
        to="/editprofile"
        state={{ user }}
      >
        Edit Profile
      </Link>

    </div>
  );
};

export default User;
