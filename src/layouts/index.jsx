import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Layouts() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token')); // state lưu token

  const navigate = useNavigate();

  const checkLoginStatus = async (currentToken) => {
    setIsLoading(true);
    if (currentToken) {
      setIsLoggedIn(true);

      try {
        const response = await fetch(`http://localhost:8081/home/infoToken?token=${currentToken}`);
        const data = await response.json();
        if (data) {
          setRoleName(data.roleName);
          setUser(data);
        } else {
          localStorage.removeItem('token');
          setToken(null);
          setIsLoggedIn(false);
          setUser(null);
          setRoleName("");
        }
      } catch (err) {
        console.error("Lỗi xác thực token:", err);
        localStorage.removeItem('token');
        setToken(null);
        setIsLoggedIn(false);
        setUser(null);
        setRoleName("");
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setRoleName("");
    }
    setIsLoading(false);
  };

  // Khi component mount, hoặc token thay đổi thì check lại
  useEffect(() => {
    checkLoginStatus(token);
  }, [token]);

  // Có thể thêm một listener để update token state nếu localStorage thay đổi (nhưng bạn có thể bỏ nếu không cần đa tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setToken(localStorage.getItem('token'));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
    setRoleName("");
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="flex justify-between items-center">
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
              <Link to="/cart" className="hover:underline"
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
          </ul>

          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/register" className="text-white hover:underline">Register</Link>
                <Link to="/login" className="text-white hover:underline">Login</Link>
              </>
            ) : (
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    {user?.images?.[0]?.url ? (
                      <img
                        src={user.images[0].url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-white">{user?.username || 'User'}</span>
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/editprofile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/changepassword"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layouts;
