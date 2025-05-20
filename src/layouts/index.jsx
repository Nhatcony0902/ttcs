import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Layouts() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleName, setRoleName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      console.log(isLoggedIn);
      fetch(`http://localhost:8081/home/infoToken?token=${token}`)
        .then(res => res.json())
        .then(data => {
          setRoleName(data.roleName);
        })
        .catch(err => {
          console.error("Lỗi lấy role:", err);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <ul className="flex space-x-4 text-white">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>

          <li>
            <Link
              to="/about"
              className="hover:underline"
              onClick={async (e) => {
                const token = localStorage.getItem("token");
                if (!token) {
                  e.preventDefault();
                  alert("Vui lòng đăng nhập để truy cập trang này.");
                  return;
                }
                try {
                  const res = await fetch(`http://localhost:8081/home/infoToken?token=${token}`);
                  const data = await res.json();
                  if (data.roleName !== "MANAGER") {
                    e.preventDefault();
                    alert("Chỉ người quản lý (MANAGER) mới được vào trang này.");
                  }
                } catch (err) {
                  e.preventDefault();
                  alert("Không thể xác minh quyền truy cập.");
                }
              }}
            >
              About
            </Link>
          </li>

          <li>
            <Link to="/register" className="hover:underline">Register</Link>
          </li>

          <li>
            <Link to="/login" className="hover:underline">Login</Link>
          </li>

          <li>
            <Link to="/logout" className="hover:underline">Log out</Link>
          </li>

          <li>
            <Link
              to="/cart"
              className="hover:underline"
              onClick={(e) => {
                if (!localStorage.getItem("token")) {
                  e.preventDefault();
                  alert("Vui lòng đăng nhập để xem giỏ hàng.");
                }
              }}
            >
              Cart
            </Link>
          </li>

          <li>
            <Link
              to="/editprofile"
              className="hover:underline"
              onClick={(e) => {
                if (!localStorage.getItem("token")) {
                  e.preventDefault();
                  alert("Vui lòng đăng nhập để xem hồ sơ.");
                }
              }}
            >
              Profile
            </Link>
          </li>

          <li>
            <Link
              to="/changepassword"
              className="hover:underline"
              onClick={(e) => {
                if (!localStorage.getItem("token")) {
                  e.preventDefault();
                  alert("Vui lòng đăng nhập để đổi mật khẩu.");
                }
              }}
            >
              Change Pass
            </Link>
          </li>
        </ul>

      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layouts;
