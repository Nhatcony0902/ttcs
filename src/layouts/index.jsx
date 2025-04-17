import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav >
      <Link to="/">Trang chủ</Link>
      <Link to="/about">Giới thiệu</Link>
    </nav>
  )
}