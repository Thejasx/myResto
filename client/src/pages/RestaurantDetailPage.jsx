import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurant, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiClock, FiUsers, FiStar, FiCheck, FiX } from 'react-icons/fi';
import './RestaurantDetailPage.css';

const timeSlots = ['11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'];
const today = new Date().toISOString().split('T')[0];
const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ restaurant: null, menu: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedImg, setSelectedImg] = useState(0);
  const [booking, setBooking] = useState({ date: today, time: '19:00', people: '2', contactName: '', contactPhone: '', specialRequest: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRestaurant(id)
      .then(({ data: d }) => setData(d))
      .catch(() => toast.error('Restaurant not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const setB = (k, v) => setBooking(p => ({ ...p, [k]: v }));

  const toggleItem = (item) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.itemId === item._id);
      if (exists) return prev.filter(i => i.itemId !== item._id);
      return [...prev, { itemId: item._id, name: item.name, price: item.priceInr, quantity: 1 }];
    });
  };

  const updateItemQty = (id, q) => {
    setSelectedItems(prev => prev.map(i => i.itemId === id ? { ...i, quantity: Math.max(1, i.quantity + q) } : i));
  };

  const handleBook = async () => {
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    if (!booking.contactName || !booking.contactPhone) { toast.error('Please fill contact details'); return; }
    setBookingLoading(true);
    try {
      await createBooking({ 
        restaurantId: id, 
        bookingDate: booking.date,
        bookingTime: booking.time,
        peopleCount: parseInt(booking.people),
        contactName: booking.contactName,
        contactPhone: booking.contactPhone,
        specialRequest: booking.specialRequest,
        menuItems: selectedItems
      });
      toast.success('Table booked successfully! 🎉');
      setShowSummary(false);
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading-center" style={{ minHeight: '100vh' }}><div className="spinner" /></div>;
  if (!data.restaurant) return <div className="empty-state"><h3>Restaurant not found</h3></div>;

  const { restaurant, menu } = data;
  const categories = [...new Set(menu.map(m => m.category))];
  const imgs = restaurant.images?.length > 0 ? restaurant.images : ['https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800'];

  return (
    <div className="resto-detail-page">
      {/* Gallery */}
      <div className="detail-gallery">
        <div className="gallery-main">
          <img src={imgs[selectedImg]} alt={restaurant.name} />
          <div className="gallery-overlay">
            <div className="gallery-thumbs">
              {imgs.map((img, i) => (
                <button key={i} className={`thumb ${selectedImg === i ? 'active' : ''}`} onClick={() => setSelectedImg(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide detail-layout">
        {/* Main info */}
        <div className="detail-main">
          {/* Header */}
          <div className="detail-header card" style={{ padding: '28px' }}>
            <div className="detail-title-row">
              <div>
                <div className="detail-cuisines">
                  {restaurant.cuisines?.map(c => <span key={c} className="badge badge-primary">{c}</span>)}
                </div>
                <h1 className="detail-name">{restaurant.name}</h1>
                <div className="detail-meta-row">
                  <span><FiMapPin size={14} /> {restaurant.address}, {restaurant.city}</span>
                  <span><FiPhone size={14} /> {restaurant.phone}</span>
                  <span><FiMail size={14} /> {restaurant.email}</span>
                  <span><FiClock size={14} /> {restaurant.openingTime} – {restaurant.closingTime}</span>
                  <span><FiUsers size={14} /> {restaurant.seatingCapacity} seats</span>
                </div>
              </div>
              <div className="detail-rating-box">
                <div className="big-rating"><FiStar fill="currentColor" />{restaurant.averageRating?.toFixed(1) || '4.0'}</div>
                <span>{restaurant.totalReviews?.toLocaleString('en-IN') || 0} reviews</span>
                <span className="badge badge-success">Accepting Bookings</span>
              </div>
            </div>
            <p className="detail-desc">{restaurant.description}</p>
            {restaurant.features?.length > 0 && (
              <div className="detail-features">
                {restaurant.features.map(f => <span key={f} className="feature-tag"><FiCheck size={12} />{f}</span>)}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            {['menu', 'reviews', 'info'].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'menu' ? '🍽️ Menu' : tab === 'reviews' ? `⭐ Reviews (${data.reviews?.length || 0})` : '📍 Info'}
              </button>
            ))}
          </div>

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div className="menu-section">
              {menu.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">🍽️</div><h3>Menu coming soon</h3></div>
              ) : categories.map(cat => (
                <div key={cat} className="menu-category">
                  <h3 className="cat-title">{cat}</h3>
                  <div className="menu-grid">
                    {menu.filter(m => m.category === cat).map(item => (
                      <div key={item._id} className="menu-card">
                        <div className="menu-card-img">
                          {item.image ? <img src={item.image} alt={item.name} loading="lazy" /> : <div className="menu-img-placeholder">🍴</div>}
                        </div>
                        <div className="menu-card-body">
                          <div className="menu-top">
                            <div>
                              <div className="flex gap-2" style={{ marginBottom: 4 }}>
                                <span className={`veg-dot ${item.isVeg ? 'veg' : 'nonveg'}`} />
                                <h4>{item.name}</h4>
                              </div>
                              <p className="menu-desc">{item.description}</p>
                              <span className="menu-qty">{item.quantity}</span>
                            </div>
                            <div className="menu-price">{formatINR(item.priceInr)}</div>
                          </div>
                          {item.isPopular && <span className="badge badge-warning" style={{ marginTop: 8 }}>🔥 Popular</span>}
                          <button 
                            className={`btn btn-sm ${selectedItems.find(i => i.itemId === item._id) ? 'btn-primary' : 'btn-outline'}`}
                            style={{ marginTop: 12, width: '100%' }}
                            onClick={() => toggleItem(item)}
                          >
                            {selectedItems.find(i => i.itemId === item._id) ? '✓ Selected' : '+ Add to Booking'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="reviews-section">
              {data.reviews?.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">💬</div><h3>No reviews yet</h3><p>Be the first to share your experience!</p></div>
              ) : (
                <div className="reviews-list">
                  {data.reviews.map(r => (
                    <div key={r._id} className="review-card card" style={{ padding: 20, marginBottom: 16 }}>
                      <div className="flex-between" style={{ marginBottom: 12 }}>
                        <div className="flex gap-3">
                          <div className="t-avatar" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>{r.userName?.[0]}</div>
                          <div>
                            <strong style={{ fontSize: '0.95rem' }}>{r.userName}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="rating-badge" style={{ padding: '2px 8px', borderRadius: 4, background: '#fef08a', color: '#854d0e', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                          <FiStar size={10} fill="currentColor" /> {r.rating}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="info-section card" style={{ padding: 28 }}>
              <h3>Location &amp; Contact</h3>
              <div className="info-grid">
                <div className="info-item"><FiMapPin /><div><strong>Address</strong><span>{restaurant.address}</span></div></div>
                <div className="info-item"><FiPhone /><div><strong>Phone</strong><span>{restaurant.phone}</span></div></div>
                <div className="info-item"><FiMail /><div><strong>Email</strong><span>{restaurant.email}</span></div></div>
                <div className="info-item"><FiClock /><div><strong>Hours</strong><span>{restaurant.openingTime} – {restaurant.closingTime}</span></div></div>
              </div>
              <div className="map-placeholder">
                <span>📍 {restaurant.address}, {restaurant.city}</span>
                <p>Map view coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Booking Widget */}
        <aside className="booking-widget">
          <div className="booking-card card">
            <div className="booking-card-header">
              <h3>Reserve a Table</h3>
              <p>{formatINR(restaurant.priceForTwo)} for two</p>
            </div>
            <div className="booking-form">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" min={today} value={booking.date} onChange={e => setB('date', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <select className="form-input" value={booking.time} onChange={e => setB('time', e.target.value)}>
                  {timeSlots.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Guests</label>
                <select className="form-input" value={booking.people} onChange={e => setB('people', e.target.value)}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className="form-input" placeholder="Full name" value={booking.contactName} onChange={e => setB('contactName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 XXXXX XXXXX" value={booking.contactPhone} onChange={e => setB('contactPhone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Special Request (optional)</label>
                <textarea className="form-input" rows={2} placeholder="Window seat, high chair..." value={booking.specialRequest} onChange={e => setB('specialRequest', e.target.value)} />
              </div>

              {selectedItems.length > 0 && (
                <div className="selected-items-box">
                  <label className="form-label">Selected Items ({selectedItems.length})</label>
                  <div className="mini-item-list">
                    {selectedItems.map(item => (
                      <div key={item.itemId} className="mini-item">
                        <span>{item.name}</span>
                        <div className="mini-qty-controls">
                          <button type="button" onClick={() => updateItemQty(item.itemId, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateItemQty(item.itemId, 1)}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mini-total">
                    Total: {formatINR(selectedItems.reduce((s, i) => s + i.price * i.quantity, 0))}
                  </div>
                </div>
              )}

              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowSummary(true)}>
                Check Availability
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Booking Summary Modal */}
      {showSummary && (
        <div className="modal-overlay" onClick={() => setShowSummary(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Summary</h3>
              <button className="btn-icon" onClick={() => setShowSummary(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="summary-resto">
                <img src={imgs[0]} alt={restaurant.name} />
                <div><strong>{restaurant.name}</strong><span>{restaurant.city}</span></div>
              </div>
              <div className="summary-details">
                {[['Date', booking.date], ['Time', booking.time], ['Guests', `${booking.people} person(s)`], ['Name', booking.contactName], ['Phone', booking.contactPhone]].map(([k, v]) => (
                  <div key={k} className="summary-row"><span>{k}</span><strong>{v}</strong></div>
                ))}
                {selectedItems.length > 0 && (
                  <div className="summary-items-list">
                    <div className="summary-row" style={{ borderBottom: 'none' }}><span>Selected Items</span></div>
                    {selectedItems.map(i => (
                      <div key={i.itemId} className="summary-item-row">
                        <span>{i.name} x {i.quantity}</span>
                        <strong>{formatINR(i.price * i.quantity)}</strong>
                      </div>
                    ))}
                    <div className="summary-row" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed var(--border)' }}>
                      <span>Pre-order Total</span>
                      <strong>{formatINR(selectedItems.reduce((s, i) => s + i.price * i.quantity, 0))}</strong>
                    </div>
                  </div>
                )}
                {booking.specialRequest && <div className="summary-row"><span>Request</span><strong>{booking.specialRequest}</strong></div>}
              </div>
              <div className="summary-actions">
                <button className="btn btn-outline" onClick={() => setShowSummary(false)}>Edit</button>
                <button className="btn btn-primary btn-lg" onClick={handleBook} disabled={bookingLoading}>
                  {bookingLoading ? 'Booking...' : 'Confirm Booking 🎉'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
