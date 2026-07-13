import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <NavLink to="/">Creativity Competition</NavLink>
        </div>
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            首页
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            控制台
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
