import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedRestaurants, getPopularCities } from '../services/api';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';
import { FiArrowRight, FiCheck, FiMapPin } from 'react-icons/fi';
import './HomePage.css';

const cuisines = [
  { name: 'North Indian', emoji: '🍛', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300' },
  { name: 'South Indian', emoji: '🥘', img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300' },
  { name: 'Chinese', emoji: '🥡', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300' },
  { name: 'Italian', emoji: '🍕', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300' },
  { name: 'Seafood', emoji: '🦐', img: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=300' },
  { name: 'Mughlai', emoji: '🍖', img: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=300' },
  { name: 'Continental', emoji: '🥗', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300' },
  { name: 'Street Food', emoji: '🌮', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300' },
];

const testimonials = [
  { name: 'Priya Mehta', city: 'Mumbai', text: 'MyResto made our anniversary dinner perfect! Found a hidden gem in Bandra with the most romantic ambiance.', rating: 5, avatar: 'P' },
  { name: 'Arjun Nair', city: 'Bangalore', text: 'The booking process was seamless. We got an instant confirmation and the table was ready when we arrived.', rating: 5, avatar: 'A' },
  { name: 'Sneha Gupta', city: 'Delhi', text: 'Discovered so many amazing restaurants I never knew about. The filters make it easy to find what you want.', rating: 5, avatar: 'S' },
  { name: 'Rahul Kapoor', city: 'Hyderabad', text: 'Best restaurant discovery platform in India. Reviews are genuine and the booking flow is super smooth.', rating: 4, avatar: 'R' },
];

const whyUs = [
  { icon: '🔍', title: 'Smart Discovery', desc: 'Find restaurants by location, cuisine, price, and real-time availability across India.' },
  { icon: '⚡', title: 'Instant Booking', desc: 'Reserve your table in seconds with real-time availability checks and instant confirmation.' },
  { icon: '✅', title: 'Verified Listings', desc: 'Every restaurant is carefully reviewed by our team before going live on the platform.' },
  { icon: '💰', title: 'Best Deals', desc: 'Exclusive offers and discounts available only through MyResto for our loyal users.' },
  { icon: '📱', title: 'Easy Management', desc: 'Track and manage all your reservations in one intuitive dashboard.' },
  { icon: '⭐', title: 'Trusted Reviews', desc: 'Genuine reviews from verified diners to help you make the perfect choice.' },
];

function RevealDiv({ children, className, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className || ''}`} style={style}>{children}</div>;
}

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getFeaturedRestaurants(), getPopularCities()])
      .then(([fr, pc]) => { setFeatured(fr.data || []); setCities(pc.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const defaultCities = [
    {_id:'mumbai',count:245}, {_id:'delhi',count:312}, {_id:'bangalore',count:198},
    {_id:'hyderabad',count:167}, {_id:'chennai',count:143}, {_id:'pune',count:121},
    {_id:'kolkata',count:98}, {_id:'goa',count:76},
  ];
  const displayCities = cities.length > 0 ? cities : defaultCities;

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg"><div className="hero-gradient" /><div className="hero-pattern" /></div>
        <div className="container hero-content">
          <div className="hero-text page-enter">
            <div className="hero-eyebrow">🌟 India's #1 Restaurant Booking Platform</div>
            <h1 className="hero-headline font-display">
              Discover & Book the <span className="gradient-text">Perfect Dining</span> Experience
            </h1>
            <p className="hero-subtext">
              From cozy cafes to luxury rooftops — explore thousands of restaurants,
              check real-time availability, and reserve your table in seconds.
            </p>
            <div className="hero-stats">
              <div className="stat"><strong>10,000+</strong><span>Restaurants</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>500+</strong><span>Cities</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>2M+</strong><span>Happy Diners</span></div>
            </div>
          </div>
          <div className="hero-search page-enter"><SearchBar hero /></div>
        </div>
        <div className="hero-scroll-hint"><div className="scroll-dot" /></div>
      </section>

      {/* Popular Cities */}
      <section className="section cities-section">
        <div className="container">
          <RevealDiv className="section-header">
            <div className="tag">🗺️ Popular Destinations</div>
            <h2>Explore Top Food Cities</h2>
            <p>Find restaurants in the most vibrant cities of India</p>
          </RevealDiv>
          <div className="cities-grid">
            {displayCities.map((c, i) => (
              <RevealDiv key={c._id} style={{ animationDelay: `${i * 0.07}s` }}>
                <button className="city-card" onClick={() => navigate(`/search-results?city=${c._id}`)}>
                  <div className="city-img">
                    <img src={`https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400`} alt={c._id} loading="lazy" />
                    <div className="city-overlay" />
                  </div>
                  <div className="city-info">
                    <h3>{c._id.charAt(0).toUpperCase() + c._id.slice(1)}</h3>
                    <span>{c.count}+ Restaurants</span>
                  </div>
                </button>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="section featured-section">
        <div className="container">
          <RevealDiv className="section-header">
            <div className="tag">🍽️ Top Picks</div>
            <h2>Featured Restaurants</h2>
            <p>Handpicked dining experiences loved by thousands across India</p>
          </RevealDiv>
          {loading ? (
            <div className="grid-auto">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 340 }} />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid-auto">
              {featured.slice(0, 6).map(r => <RestaurantCard key={r._id} restaurant={r} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No restaurants yet</h3>
              <p>Be the first to add your restaurant!</p>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/restaurants" className="btn btn-outline btn-lg">View All Restaurants <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-section">
        <div className="container">
          <RevealDiv className="section-header">
            <div className="tag">💡 Why MyResto</div>
            <h2>The Smarter Way to Dine</h2>
            <p>Everything you need for a perfect dining experience, all in one place</p>
          </RevealDiv>
          <div className="grid-3 why-grid">
            {whyUs.map((w, i) => (
              <RevealDiv key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="why-card">
                  <div className="why-icon">{w.icon}</div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Top Cuisines */}
      <section className="section cuisine-section">
        <div className="container">
          <RevealDiv className="section-header">
            <div className="tag">🌍 Explore Flavors</div>
            <h2>Browse by Cuisine</h2>
            <p>Craving something specific? Explore restaurants by your favorite cuisine</p>
          </RevealDiv>
          <div className="cuisine-grid">
            {cuisines.map((c, i) => (
              <RevealDiv key={c.name} style={{ animationDelay: `${i * 0.06}s` }}>
                <button className="cuisine-card" onClick={() => navigate(`/search-results?cuisine=${c.name}`)}>
                  <div className="cuisine-img">
                    <img src={c.img} alt={c.name} loading="lazy" />
                    <div className="cuisine-overlay" />
                  </div>
                  <div className="cuisine-label">
                    <span className="cuisine-emoji">{c.emoji}</span>
                    <span>{c.name}</span>
                  </div>
                </button>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Banner */}
      <section className="section-sm offers-section">
        <div className="container">
          <RevealDiv>
            <div className="offers-card">
              <div className="offers-text">
                <div className="tag" style={{ display:'inline-block', marginBottom:12 }}>🎉 Limited Time</div>
                <h2>Up to 30% Off on Your First Booking!</h2>
                <p>Sign up today and get exclusive discounts at the finest restaurants near you.</p>
                <div className="offers-perks">
                  <span><FiCheck /> Free table reservation</span>
                  <span><FiCheck /> No cancellation fee</span>
                  <span><FiCheck /> Instant confirmation</span>
                </div>
                <Link to="/signup" className="btn btn-secondary btn-lg">Claim Your Offer →</Link>
              </div>
              <div className="offers-img">
                <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600" alt="Dining offer" />
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <RevealDiv className="section-header">
            <div className="tag">💬 Reviews</div>
            <h2>What Our Diners Say</h2>
            <p>Real experiences from real food lovers across India</p>
          </RevealDiv>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <RevealDiv key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="testimonial-card">
                  <div className="stars">{[...Array(t.rating)].map((_, j) => <span key={j}>⭐</span>)}</div>
                  <p>"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="t-avatar">{t.avatar}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <span><FiMapPin size={11} /> {t.city}</span>
                    </div>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section className="section-sm owner-cta">
        <div className="container">
          <RevealDiv>
            <div className="cta-card">
              <div className="cta-icon">🏪</div>
              <h2>Own a Restaurant?</h2>
              <p>List your restaurant on MyResto and reach thousands of hungry diners every day. Simple setup, powerful dashboard, zero commission.</p>
              <div className="cta-actions">
                <Link to="/owner/signup" className="btn btn-primary btn-lg">Add Your Restaurant</Link>
                <Link to="/owner/login" className="btn btn-ghost btn-lg">Owner Login</Link>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>
    </div>
  );
}
