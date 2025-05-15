import { Link } from "react-router-dom";
import CreateShop from "../../components/CreateShop";

function About() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-blue-600">About Us</h1>
      <p className="mt-4 text-lg text-gray-700">Learn more about our mission and team.</p>
       <Link to="/createShop">Create shop</Link>
       <Link to="/editShop">Edit Shop</Link>
       <Link to="/deleteShop">Delete SHop</Link>
       <Link to="/infoShop">InfoShop</Link>
    </div>


  );
}

export default About;