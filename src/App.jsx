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
import CartItem from './pages/CardItem';


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
          <Route path="cartItem" element={<CartItem/>}/>
      </Route>
    </Routes>
    </div>
  );
}

export default App;