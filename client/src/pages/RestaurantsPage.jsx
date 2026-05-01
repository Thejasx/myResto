import { useState, useEffect } from 'react';
import { getRestaurants } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import { FiSearch } from 'react-icons/fi';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    getRestaurants({ page, limit: 12 })
      .then(({ data }) => { setRestaurants(data.restaurants || []); setTotal(data.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = search ? restaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.city.toLowerCase().includes(search.toLowerCase())) : restaurants;

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 4 }}>All Restaurants</h1>
          <p style={{ color: 'var(--text-muted)' }}>{total} restaurants available</p>
        </div>
        <div className="input-icon-wrap" style={{ maxWidth: 300, width: '100%' }}>
          <FiSearch className="input-icon" />
          <input className="form-input" placeholder="Search by name or city..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
      </div>

      {loading ? (
        <div className="grid-auto">{[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 340 }} />)}</div>
      ) : filtered.length > 0 ? (
        <>
          <div className="grid-auto">{filtered.map(r => <RestaurantCard key={r._id} restaurant={r} />)}</div>
          {!search && total > 12 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40 }}>
              <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>Page {page}</span>
              <button className="btn btn-outline" disabled={restaurants.length < 12} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state"><div className="empty-icon">🍽️</div><h3>No restaurants found</h3><p>Try a different search term</p></div>
      )}
    </div>
  );
}
