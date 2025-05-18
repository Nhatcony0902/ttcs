import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Layouts from './layouts';
import Register from './pages/Register';
import Login from './pages/Login';
import Verify from './pages/Verify';
import CreateShop from './components/CreateShop';
import DeleteShop from './components/DeleteShop';
import EditShop from './components/EditShop';
import InfoShop from './components/InfoShop';
import EditProduct from './components/EditProduct';
import CreateProduct from './components/CreateProduct';
import DeleteProduct from './components/DeleteProduct';
import Logout from './pages/Logout';
import ForgotPassword from './components/ForgotPassword';

import User from './components/User';
import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import DetailProduct from './components/DetailProduct';
import Cart from './pages/Cart';
import AddToCart from './components/AddtoCart';
import CreateRating from './components/CreateRating';



function App() {
  return (
    <div className="min-h-screen bg-gray-100">
     <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="verify" element={<Verify/>}/>
         <Route path="logout" element={<Logout/>}/>
         <Route path="forgotpassword" element={<ForgotPassword/>}/>
        <Route path="createShop" element={<CreateShop/>}/>
        <Route path="deleteShop" element={<DeleteShop/>}/>
        <Route path="editShop" element={<EditShop/>}/>
        <Route path="infoShop" element={<InfoShop/>}/>
         <Route path="createProduct" element={<CreateProduct/>}/>
          <Route path="editProduct" element={<EditProduct/>}/>
          <Route path="deleteProduct" element={<DeleteProduct/>}/>
          <Route path="cart" element={<Cart/>}/>
          <Route path="user" element={<User/>}/>
           <Route path="editprofile" element={<EditProfile/>}/>
           <Route path="changepassword" element={<ChangePassword/>}/>
            <Route path="/product/:productId" element={<DetailProduct/>} />
             <Route path="/product/:productId/add-to-cart" element={<AddToCart />} />
             <Route path='/rating' element={<CreateRating/>}/>
      </Route>
    </Routes>
    </div>
  );
}

export default App;