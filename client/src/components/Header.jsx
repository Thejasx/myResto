import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar, FiChevronDown, FiSearch } from 'react-icons/fi';
import './Header.css';

export default function Header({ transparent }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const isGlassy = transparent && !scrolled;

  return (
    <header className={`site-header ${isGlassy ? 'header-transparent' : 'header-solid'} ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container-wide header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">My<span>Resto</span></span>
        </Link>

        {/* Nav */}
        <nav className={`header-nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/restaurants" className="nav-link">Explore</Link>
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
          <Link to="/search-results" className="nav-link">Offers</Link>
          <Link to="/" className="nav-link">About</Link>
          <Link to="/" className="nav-link">Contact</Link>
        </nav>

        {/* Right actions */}
        <div className="header-actions">
          <button className="btn-icon-glass" onClick={() => navigate('/search-results')} title="Search">
            <FiSearch size={18} />
          </button>

          {user ? (
            <div className="user-dropdown" ref={dropRef}>
              <button className="user-btn" onClick={() => setDropOpen(!dropOpen)}>
                <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <FiChevronDown size={14} className={dropOpen ? 'rotated' : ''} />
              </button>
              {dropOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <span className={`badge badge-primary`}>{user.role}</span>
                  </div>
                  <div className="dropdown-divider" />
                  {user.role === 'customer' && (
                    <Link to="/my-bookings" className="dropdown-item"><FiCalendar size={15}/> My Bookings</Link>
                  )}
                  {user.role === 'owner' && (
                    <Link to="/owner/dashboard" className="dropdown-item"><FiUser size={15}/> Owner Dashboard</Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="dropdown-item"><FiUser size={15}/> Admin Panel</Link>
                  )}
                  <Link to="/profile" className="dropdown-item"><FiUser size={15}/> Profile</Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}><FiLogOut size={15}/> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          <Link to="/owner/signup" className="btn btn-secondary btn-sm add-resto-btn">
            + Add Restaurant
          </Link>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
