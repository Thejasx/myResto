import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOwnerRestaurant, getRestaurantBookings, deleteMenuItem, updateBookingStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiUsers, FiClock, FiStar, FiMenu } from 'react-icons/fi';
import './OwnerDashboard.css';

const statusColor = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger', completed: 'badge-info' };
const approvalColor = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger' };
const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ restaurant: null, menu: [] });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [noRestaurant, setNoRestaurant] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOwnerRestaurant()
      .then(({ data: d }) => {
        setData(d);
        return getRestaurantBookings();
      })
      .then(({ data: b }) => setBookings(b))
      .catch((err) => {
        if (err.response?.status === 404) setNoRestaurant(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      toast.success('Menu item deleted');
      setData(d => ({ ...d, menu: d.menu.filter(m => m._id !== id) }));
    } catch { toast.error('Delete failed'); }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      setBookings(b => b.map(bk => bk._id === id ? { ...bk, status } : bk));
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="loading-center" style={{ minHeight: '100vh' }}><div className="spinner" /></div>;

  if (noRestaurant) return (
    <div className="owner-page">
      <div className="container" style={{ paddingTop: 120, textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-icon">🏪</div>
          <h2>No Restaurant Yet</h2>
          <p>You haven't added your restaurant. Get started by adding it now!</p>
          <Link to="/owner/restaurant/new" className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>
            <FiPlus /> Add Your Restaurant
          </Link>
        </div>
      </div>
    </div>
  );

  const { restaurant, menu } = data;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const categories = [...new Set(menu.map(m => m.category))];

  return (
    <div className="owner-page">
      {/* Header */}
      <div className="owner-header">
        <div className="container-wide owner-header-inner">
          <div>
            <h1>Owner Dashboard</h1>
            <p>Welcome back, <strong>{user?.name}</strong> · {restaurant?.name}</p>
          </div>
          <div className="owner-header-actions">
            <span className={`badge ${approvalColor[restaurant?.approvalStatus]}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              {restaurant?.approvalStatus === 'approved' ? '✅' : restaurant?.approvalStatus === 'pending' ? '⏳' : '❌'} {restaurant?.approvalStatus}
            </span>
            <Link to={`/owner/restaurant/edit/${restaurant?._id}`} className="btn btn-outline btn-sm"><FiEdit /> Edit Restaurant</Link>
            <Link to="/owner/restaurant/new" className="btn btn-primary btn-sm"><FiPlus /> Add New</Link>
          </div>
        </div>
      </div>

      <div className="container-wide owner-content">
        {/* Stat Cards */}
        <div className="owner-stats">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: '📅', color: '#0d9488' },
            { label: 'Confirmed', value: confirmedBookings, icon: '✅', color: '#16a34a' },
            { label: 'Pending', value: pendingBookings, icon: '⏳', color: '#d97706' },
            { label: 'Menu Items', value: menu.length, icon: '🍽️', color: '#6366f1' },
            { label: 'Seating', value: restaurant?.seatingCapacity || 0, icon: '💺', color: '#ec4899' },
            { label: 'Avg Rating', value: restaurant?.averageRating?.toFixed(1) || '—', icon: '⭐', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="owner-stat-card">
              <div className="stat-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div><strong>{s.value}</strong><span>{s.label}</span></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="owner-tabs">
          {[{ id: 'overview', label: '📊 Overview' }, { id: 'menu', label: '🍽️ Menu' }, { id: 'bookings', label: `📅 Bookings (${bookings.length})` }].map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {restaurant?.images?.[0] && <img src={restaurant.images[0]} alt={restaurant.name} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 'var(--radius)' }} />}
                <div>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>{restaurant?.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>{restaurant?.description?.substring(0, 150)}...</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {restaurant?.cuisines?.map(c => <span key={c} className="badge badge-primary">{c}</span>)}
                  </div>
                </div>
              </div>
              <div className="divider" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {[
                  ['📍 Location', restaurant?.location],
                  ['🕐 Hours', `${restaurant?.openingTime} – ${restaurant?.closingTime}`],
                  ['💰 Price', formatINR(restaurant?.priceForTwo) + ' for 2'],
                  ['💺 Capacity', `${restaurant?.seatingCapacity} seats`],
                  ['🪑 Tables', `${restaurant?.totalTables} tables`],
                  ['📞 Phone', restaurant?.phone],
                ].map(([k, v]) => (
                  <div key={k} style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-muted)', display: 'block' }}>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16 }}>Recent Bookings</h3>
              {bookings.slice(0, 5).map(b => (
                <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                  <div>
                    <strong>{b.contactName}</strong>
                    <div style={{ color: 'var(--text-muted)' }}>{b.bookingDate} · {b.bookingTime} · {b.peopleCount} guests</div>
                  </div>
                  <span className={`badge ${statusColor[b.status]}`}>{b.status}</span>
                </div>
              ))}
              {bookings.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No bookings yet</p>}
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2>Menu Management</h2>
              <Link to="/owner/restaurant/new" className="btn btn-primary btn-sm"><FiPlus /> Add Item</Link>
            </div>
            {menu.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🍽️</div><h3>No menu items yet</h3></div>
            ) : categories.map(cat => (
              <div key={cat} style={{ marginBottom: 28 }}>
                <h3 style={{ marginBottom: 12, color: 'var(--primary-dark)' }}>{cat}</h3>
                <div className="table-wrap card">
                  <table className="data-table">
                    <thead><tr><th>Item</th><th>Description</th><th>Qty</th><th>Price</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {menu.filter(m => m.category === cat).map(item => (
                        <tr key={item._id}>
                          <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {item.image && <img src={item.image} alt="" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />}
                            <strong>{item.name}</strong>
                          </div></td>
                          <td style={{ maxWidth: 200, color: 'var(--text-muted)', fontSize: '0.82rem' }}>{item.description?.substring(0, 60)}</td>
                          <td>{item.quantity}</td>
                          <td className="price-tag">{formatINR(item.priceInr)}</td>
                          <td><span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>{item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</span></td>
                          <td><span className={`badge ${item.isAvailable ? 'badge-success' : 'badge-danger'}`}>{item.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDeleteMenuItem(item._id)}><FiTrash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 style={{ marginBottom: 20 }}>All Bookings</h2>
            {bookings.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📅</div><h3>No bookings yet</h3></div>
            ) : (
              <div className="table-wrap card">
                <table className="data-table">
                  <thead><tr><th>Guest</th><th>Date & Time</th><th>People</th><th>Contact</th><th>Request</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td><strong>{b.contactName}</strong><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.userId?.email}</div></td>
                        <td>{b.bookingDate} · {b.bookingTime}</td>
                        <td><FiUsers size={13} style={{ marginRight: 4 }} />{b.peopleCount}</td>
                        <td>{b.contactPhone}</td>
                        <td style={{ maxWidth: 160, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{b.specialRequest || '—'}</td>
                        <td><span className={`badge ${statusColor[b.status]}`}>{b.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {b.status === 'pending' && <button className="btn btn-sm" style={{ background: '#dcfce7', color: '#15803d' }} onClick={() => handleBookingStatus(b._id, 'confirmed')}>Confirm</button>}
                            {b.status !== 'cancelled' && b.status !== 'completed' && <button className="btn btn-danger btn-sm" onClick={() => handleBookingStatus(b._id, 'cancelled')}>Cancel</button>}
                            {b.status === 'confirmed' && <button className="btn btn-sm" style={{ background: '#dbeafe', color: '#1d4ed8' }} onClick={() => handleBookingStatus(b._id, 'completed')}>Done</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
