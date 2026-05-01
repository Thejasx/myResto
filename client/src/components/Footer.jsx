import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wave" />
      <div className="container-wide">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">🍽️ My<span>Resto</span></Link>
            <p>Discover and book the finest dining experiences across India. Your next favorite restaurant is just a search away.</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="YouTube"><FiYoutube /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/restaurants">All Restaurants</Link></li>
              <li><Link to="/search-results">Search</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div className="footer-col">
            <h4>For Owners</h4>
            <ul>
              <li><Link to="/owner/signup">Register Restaurant</Link></li>
              <li><Link to="/owner/login">Owner Login</Link></li>
              <li><Link to="/owner/dashboard">Dashboard</Link></li>
              <li><a href="#">Partner Program</a></li>
              <li><a href="#">Advertise</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="contact-list">
              <li><FiMapPin /> 42 MG Road, Bangalore, India 560001</li>
              <li><FiPhone /> +91 98765 43210</li>
              <li><FiMail /> hello@myresto.in</li>
            </ul>
            <div className="newsletter">
              <p>Get exclusive deals</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" />
                <button className="btn btn-primary btn-sm">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MyResto. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
