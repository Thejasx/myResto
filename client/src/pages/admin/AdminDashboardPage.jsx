import { useState, useEffect } from 'react';
import { 
  getAdminStats, 
  getAllRestaurantsAdmin, 
  getAllUsers, 
  getAllOwners, 
  getAllBookingsAdmin,
  approveRestaurant,
  rejectRestaurant,
  deleteRestaurantAdmin,
  deleteUser,
  toggleUserStatus
} from '../../services/api';
import toast from 'react-hot-toast';
import { FiGrid, FiUsers, FiShoppingBag, FiCheck, FiX, FiTrash2, FiActivity, FiSearch } from 'react-icons/fi';
import './AdminDashboard.css';

const statusColor = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger', completed: 'badge-info' };
const approvalColor = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger' };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadStats();
    loadTab('overview');
  }, []);

  const loadStats = () => {
    getAdminStats().then(({ data }) => setStats(data)).catch(() => {});
  };

  const loadTab = (tab) => {
    setActiveTab(tab);
    setLoading(true);
    setSearch('');
    
    let promise;
    if (tab === 'restaurants') promise = getAllRestaurantsAdmin();
    else if (tab === 'users') promise = getAllUsers();
    else if (tab === 'owners') promise = getAllOwners();
    else if (tab === 'bookings') promise = getAllBookingsAdmin();
    else { setLoading(false); return; }

    promise
      .then(({ data }) => setData(data))
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  };

  const handleAction = async (action, id) => {
    try {
      if (action === 'approve') await approveRestaurant(id);
      else if (action === 'reject') await rejectRestaurant(id);
      else if (action === 'deleteResto') await deleteRestaurantAdmin(id);
      else if (action === 'deleteUser') await deleteUser(id);
      else if (action === 'toggleUser') await toggleUserStatus(id);

      toast.success('Action successful');
      loadStats();
      loadTab(activeTab);
    } catch { toast.error('Action failed'); }
  };

  const filteredData = search ? data.filter(item => {
    const val = (item.name || item.contactName || item.email || '').toLowerCase();
    return val.includes(search.toLowerCase());
  }) : data;

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span style={{ fontSize: '1.5rem' }}>🛡️</span>
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: 'overview', icon: <FiGrid />, label: 'Overview' },
            { id: 'restaurants', icon: <FiShoppingBag />, label: 'Restaurants' },
            { id: 'owners', icon: <FiUsers />, label: 'Owners' },
            { id: 'users', icon: <FiUsers />, label: 'Customers' },
            { id: 'bookings', icon: <FiActivity />, label: 'All Bookings' },
          ].map(item => (
            <button key={item.id} className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`} onClick={() => loadTab(item.id)}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="container-wide flex-between">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <div className="admin-user-info">
              <span>Admin System</span>
              <div className="user-avatar">A</div>
            </div>
          </div>
        </header>

        <div className="admin-content container-wide">
          {activeTab === 'overview' && stats && (
            <>
              <div className="stats-grid">
                {[
                  { label: 'Total Bookings', value: stats.totalBookings, color: '#0d9488', icon: '📅' },
                  { label: 'Approved Restos', value: stats.approvedRestaurants, color: '#16a34a', icon: '✅' },
                  { label: 'Pending Approval', value: stats.pendingRestaurants, color: '#d97706', icon: '⏳' },
                  { label: 'Total Users', value: stats.totalUsers + stats.totalOwners, color: '#6366f1', icon: '👥' },
                ].map(s => (
                  <div key={s.label} className="stat-card card">
                    <div className="stat-info">
                      <span>{s.label}</span>
                      <strong>{s.value}</strong>
                    </div>
                    <div className="stat-icon-bg" style={{ background: s.color + '15', color: s.color }}>{s.icon}</div>
                  </div>
                ))}
              </div>
              
              <div className="card" style={{ marginTop: 32, padding: 24 }}>
                <h3>Quick Stats Breakdown</h3>
                <div className="divider" />
                <div className="grid-4" style={{ textAlign: 'center' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Total Restaurants</span><h4 style={{ fontSize: '1.5rem' }}>{stats.totalRestaurants}</h4></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Customers</span><h4 style={{ fontSize: '1.5rem' }}>{stats.totalUsers}</h4></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Owners</span><h4 style={{ fontSize: '1.5rem' }}>{stats.totalOwners}</h4></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Rejected</span><h4 style={{ fontSize: '1.5rem' }}>{stats.rejectedRestaurants}</h4></div>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'overview' && (
            <div className="card">
              <div className="card-header flex-between" style={{ padding: '20px 24px' }}>
                <div className="input-icon-wrap" style={{ maxWidth: 300 }}>
                  <FiSearch className="input-icon" />
                  <input className="form-input" placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  {loading ? (
                    <tbody><tr><td colSpan="6" style={{ textAlign: 'center', padding: 50 }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr></tbody>
                  ) : filteredData.length === 0 ? (
                    <tbody><tr><td colSpan="6" style={{ textAlign: 'center', padding: 50 }}>No records found</td></tr></tbody>
                  ) : (
                    <>
                      {activeTab === 'restaurants' && (
                        <>
                          <thead><tr><th>Restaurant</th><th>Owner</th><th>City</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                          <tbody>
                            {filteredData.map(r => (
                              <tr key={r._id}>
                                <td><strong>{r.name}</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.cuisines?.join(', ')}</div></td>
                                <td>{r.ownerName}<div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.email}</div></td>
                                <td>{r.city}</td>
                                <td>⭐ {r.averageRating?.toFixed(1)}</td>
                                <td><span className={`badge ${approvalColor[r.approvalStatus]}`}>{r.approvalStatus}</span></td>
                                <td>
                                  <div className="flex gap-2">
                                    {r.approvalStatus === 'pending' && <button className="btn btn-icon" title="Approve" style={{ background: '#dcfce7', color: '#16a34a' }} onClick={() => handleAction('approve', r._id)}><FiCheck /></button>}
                                    {r.approvalStatus !== 'rejected' && <button className="btn btn-icon" title="Reject" style={{ background: '#fee2e2', color: '#dc2626' }} onClick={() => handleAction('reject', r._id)}><FiX /></button>}
                                    <button className="btn btn-icon btn-danger" title="Delete" onClick={() => handleAction('deleteResto', r._id)}><FiTrash2 /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </>
                      )}

                      {(activeTab === 'users' || activeTab === 'owners') && (
                        <>
                          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                          <tbody>
                            {filteredData.map(u => (
                              <tr key={u._id}>
                                <td><strong>{u.name}</strong></td>
                                <td>{u.email}</td>
                                <td>{u.phone || '—'}</td>
                                <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Banned'}</span></td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <div className="flex gap-2">
                                    <button className="btn btn-sm btn-outline" onClick={() => handleAction('toggleUser', u._id)}>{u.isActive ? 'Suspend' : 'Activate'}</button>
                                    <button className="btn btn-icon btn-danger" onClick={() => handleAction('deleteUser', u._id)}><FiTrash2 /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </>
                      )}

                      {activeTab === 'bookings' && (
                        <>
                          <thead><tr><th>ID</th><th>Guest</th><th>Restaurant</th><th>Date</th><th>Status</th></tr></thead>
                          <tbody>
                            {filteredData.map(b => (
                              <tr key={b._id}>
                                <td><span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{b.bookingRef}</span></td>
                                <td><strong>{b.contactName}</strong></td>
                                <td>{b.restaurantId?.name}</td>
                                <td>{b.bookingDate} · {b.bookingTime}</td>
                                <td><span className={`badge ${statusColor[b.status]}`}>{b.status}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </>
                      )}
                    </>
                  )}
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
