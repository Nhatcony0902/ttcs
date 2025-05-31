import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch} from 'react-redux';
import { logoutUser } from '../action/authAction';
 
function Layouts() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const [trigger, setTrigger] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    checkLoginStatus(localStorage.getItem('token'));
  }, [trigger]);
  
  useEffect(() => {
    const handleLogin = () => {
      const newToken = localStorage.getItem('token');
      setToken(newToken);
      setTrigger(prev => !prev);
    };
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      setToken(null);
      setIsLoggedIn(false);
      setUser(null);
      setRoleName("");
      setTrigger(prev => !prev);
      navigate('/login');
    };
  
    window.addEventListener("LOGIN_SUCCESS", handleLogin);
    window.addEventListener("LOGOUT_SUCCESS", handleLogout);
  
    return () => {
      window.removeEventListener("LOGIN_SUCCESS", handleLogin);
      window.removeEventListener("LOGOUT_SUCCESS", handleLogout);
    };
  }, []);
  

  console.log(user);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-800">
      <style>
        {`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animated-gradient {
            background: linear-gradient(
              -45deg,
              #ee7752,
              #e73c7e,
              #23a6d5,
              #23d5ab
            );
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }

          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(-20px) rotate(20deg);
              opacity: 0;
            }
          }

          .menu-item {
            position: relative;
            overflow: hidden;
          }

          .menu-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }

          .menu-item:hover::before {
            animation: float 1s ease-out forwards;
          }

          .menu-item:hover::after {
            content: '🔥';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.5rem;
            pointer-events: none;
            animation: float 1s ease-out forwards;
          }

          .menu-item:nth-child(2):hover::after {
            content: '🔥';
          }

          .menu-item:nth-child(3):hover::after {
            content: '🔥';
          }

          .menu-item:nth-child(4):hover::after {
            content: '🔥';
          }
        `}
      </style>

      <nav className="animated-gradient shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <span className="text-white text-xl font-bold group-hover:text-purple-200 transition-colors duration-200">Shop</span>
              </Link>
              <div className="hidden md:block ml-10">
                <ul className="flex space-x-8">
                  <li className="menu-item">
                    <Link 
                      to="/" 
                      className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        location.pathname === '/' 
                          ? 'text-white' 
                          : 'text-gray-200 hover:text-white'
                      }`}
                    >
                      <span className="relative z-10">Home</span>
                      {location.pathname === '/' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-100 transition-transform duration-200"></span>
                      )}
                    </Link>
                  </li>

                  <li className="menu-item">
                    <Link
                      to="/about"
                      className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        location.pathname === '/about' 
                          ? 'text-white' 
                          : 'text-gray-200 hover:text-white'
                      }`}
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
                      <span className="relative z-10">About</span>
                      {location.pathname === '/about' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-100 transition-transform duration-200"></span>
                      )}
                    </Link>
                  </li>

                  <li className="menu-item">
                    <Link 
                      to="/cart" 
                      className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        location.pathname === '/cart' 
                          ? 'text-white' 
                          : 'text-gray-200 hover:text-white'
                      }`}
                      onClick={(e) => {
                        if (!localStorage.getItem("token")) {
                          e.preventDefault();
                          alert("Vui lòng đăng nhập để xem giỏ hàng.");
                        }
                      }}
                    >
                      <span className="relative z-10">Cart</span>
                      {location.pathname === '/cart' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-100 transition-transform duration-200"></span>
                      )}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center">
              {!isLoggedIn ? (
                <div className="flex space-x-4">
                  <Link 
                    to="/register" 
                    className="text-white hover:text-purple-200 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/10 menu-item"
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-lg menu-item"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <div
                    className="flex items-center space-x-3 cursor-pointer bg-purple-700 hover:bg-purple-800 px-3 py-2 rounded-md transition-all duration-200 hover:shadow-lg menu-item"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      {user?.images?.[0]?.url ? (
                        <img
                          src={user.images[0].url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-white text-sm font-medium">{user?.username || 'User'}</span>
                    <svg className={`w-4 h-4 text-white transition-transform duration-200 ${showDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all duration-200">
                      <Link
                        to="/editprofile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 menu-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        to="/changepassword"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 menu-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Change Password
                      </Link>
                      <button
                        onClick={() => {
                          dispatch(logoutUser());
                          window.dispatchEvent(new CustomEvent("LOGOUT_SUCCESS"));
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 menu-item"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layouts;
