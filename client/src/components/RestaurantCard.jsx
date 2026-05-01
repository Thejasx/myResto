import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiUsers, FiClock } from 'react-icons/fi';
import './RestaurantCard.css';

const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const priceLabels = { budget: '₹', moderate: '₹₹', premium: '₹₹₹', luxury: '₹₹₹₹' };

export default function RestaurantCard({ restaurant, featured }) {
  const { _id, name, city, location, cuisines, images, averageRating, totalReviews,
    priceRange, priceForTwo, seatingCapacity, availableTables, description, approvalStatus } = restaurant;

  const img = images?.[0] || `https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600`;

  return (
    <Link to={`/restaurants/${_id}`} className={`resto-card ${featured ? 'featured-card' : ''}`}>
      <div className="resto-card-img">
        <img src={img} alt={name} loading="lazy" />
        <div className="card-overlay" />
        {approvalStatus === 'approved' && <span className="card-badge-open">Open</span>}
        <div className="card-cuisine-tags">
          {cuisines?.slice(0, 2).map(c => <span key={c} className="cuisine-chip">{c}</span>)}
        </div>
      </div>
      <div className="resto-card-body">
        <div className="card-top">
          <div>
            <h3 className="resto-name">{name}</h3>
            <div className="resto-location"><FiMapPin size={13} /> {location || city}</div>
          </div>
          <div className="rating-badge">
            <FiStar size={12} fill="currentColor" />
            <span>{averageRating?.toFixed(1) || '4.0'}</span>
          </div>
        </div>

        <p className="resto-desc">{description?.substring(0, 90)}{description?.length > 90 ? '...' : ''}</p>

        <div className="card-meta">
          <span className="meta-item"><FiUsers size={13} /> {seatingCapacity} seats</span>
          <span className="meta-item"><FiClock size={13} /> {availableTables || 0} tables left</span>
          <span className="price-tag">{priceLabels[priceRange]} · {formatINR(priceForTwo)} for 2</span>
        </div>

        <div className="card-footer">
          <span className="reviews-text">{totalReviews?.toLocaleString('en-IN') || 0} reviews</span>
          <span className="book-btn">Book Now →</span>
        </div>
      </div>
    </Link>
  );
}
