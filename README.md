## Dự án web bán hàng 
## Cấu trúc source code
ttcs/
└── my-app/
    ├── public/                # Thư mục chứa các file tĩnh (favicon, ảnh, v.v.)
    ├── src/                   # Thư mục mã nguồn chính
    │   ├── assets/            # Tài nguyên tĩnh (ảnh, svg, ...)
    │   ├── components/        # Các component dùng chung và theo chức năng
    │   │   ├── ProductList.jsx
    │   │   ├── DeleteShop/
    │   │   ├── Logout/
    │   │   ├── CreateRating/
    │   │   ├── Order/
    │   │   ├── AddtoCart/
    │   │   ├── DetailProduct/
    │   │   ├── ChangePassword/
    │   │   ├── EditProfile/
    │   │   ├── User/
    │   │   ├── ForgotPassword/
    │   │   ├── EditProduct/
    │   │   ├── DeleteProduct/
    │   │   ├── CreateProduct/
    │   │   ├── InfoShop/
    │   │   ├── EditShop/
    │   │   └── CreateShop/
    │   ├── pages/             # Các trang chính của ứng dụng
    │   │   ├── Cart/
    │   │   ├── Login/
    │   │   ├── Verify/
    │   │   ├── Register/
    │   │   ├── NotFound/
    │   │   ├── About/
    │   │   └── Home/
    │   ├── utils/             # Các hàm tiện ích, xử lý logic chung
    │   │   ├── manager.jsx
    │   │   └── request.jsx
    │   ├── redux/             # Quản lý state với Redux
    │   │   ├── authReducer.jsx
    │   │   └── index.jsx
    │   ├── action/            # Các action cho Redux
    │   │   └── authAction.jsx
    │   ├── hooks/             # Custom React hooks
    │   │   ├── useDebounce.js
    │   │   ├── useToggle.js
    │   │   ├── useLocalStorage.js
    │   │   ├── useClickOutside.js
    │   │   └── useMediaQuery.js
    │   ├── layouts/           # Các layout tổng thể cho trang
    │   │   └── index.jsx
    │   ├── styles/            # Các file style (CSS, SCSS, ...)
    │   ├── App.jsx            # File App chính
    │   ├── App.css            # Style cho App
    │   ├── main.jsx           # Điểm vào của ứng dụng React
    │   └── index.css          # Style tổng thể
    ├── index.html             # File HTML gốc
    ├── package.json           # Thông tin và dependencies của dự án
    ├── package-lock.json      # Quản lý version dependencies
    ├── vite.config.js         # Cấu hình Vite
    ├── eslint.config.js       # Cấu hình ESLint
    └── .gitignore             # Các file/thư mục bị loại trừ khỏi git
    
