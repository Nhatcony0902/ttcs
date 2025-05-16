import { Outlet, Link } from 'react-router-dom';

function Layouts() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <ul className="flex space-x-4 text-white">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">About</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/logout">Log out</Link>
          </li>
        </ul>
      </nav>
      <div></div>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layouts;