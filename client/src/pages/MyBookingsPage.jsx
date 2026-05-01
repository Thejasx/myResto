import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiUsers, FiMapPin, FiX } from 'react-icons/fi';
import './MyBookingsPage.css';

const statusColor = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger', completed: 'badge-info' };
const formatINR = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    getMyBookings()
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="bookings-page">
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="bookings-header">
          <div>
            <h1>My Bookings</h1>
            <p>Manage all your restaurant reservations in one place</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="booking-tabs">
          {['all', 'confirmed', 'pending', 'cancelled'].map(t => (
            <button key={t} className={`tab-pill ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'all' ? ` (${bookings.length})` : ` (${bookings.filter(b => b.status === t).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings found</h3>
            <p>{filter === 'all' ? "You haven't made any reservations yet" : `No ${filter} bookings`}</p>
            <Link to="/restaurants" className="btn btn-primary">Explore Restaurants</Link>
          </div>
        ) : (
          <div className="bookings-grid">
            {filtered.map(b => {
              const resto = b.restaurantId;
              const img = resto?.images?.[0] || 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=300';
              return (
                <div key={b._id} className="booking-card">
                  <div className="booking-card-img">
                    <img src={img} alt={resto?.name} />
                  </div>
                  <div className="booking-card-body">
                    <div className="booking-card-top">
                      <div>
                        <h3>{resto?.name || 'Restaurant'}</h3>
                        <div className="booking-location"><FiMapPin size={12} /> {resto?.city}</div>
                      </div>
                      <span className={`badge ${statusColor[b.status] || 'badge-info'}`}>{b.status}</span>
                    </div>

                    <div className="booking-meta">
                      <span><FiCalendar size={13} /> {b.bookingDate}</span>
                      <span><FiClock size={13} /> {b.bookingTime}</span>
                      <span><FiUsers size={13} /> {b.peopleCount} guests</span>
                    </div>

                    <div className="booking-ref">Ref: <strong>{b.bookingRef}</strong></div>
                    {b.specialRequest && <p className="booking-note">📝 {b.specialRequest}</p>}

                    <div className="booking-card-actions">
                      <Link to={`/restaurants/${resto?._id}`} className="btn btn-outline btn-sm">View Restaurant</Link>
                      {(b.status === 'confirmed' || b.status === 'pending') && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b._id)}>
                          <FiX size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
