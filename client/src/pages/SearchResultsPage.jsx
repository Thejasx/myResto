import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchRestaurants } from '../services/api';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';
import { FiFilter, FiX, FiSliders } from 'react-icons/fi';
import './SearchResultsPage.css';

const cuisineOptions = ['North Indian','South Indian','Chinese','Italian','Mughlai','Continental','Seafood','Street Food'];
const priceOptions = [{ val: 'budget', label: '₹ Budget' },{ val: 'moderate', label: '₹₹ Moderate' },{ val: 'premium', label: '₹₹₹ Premium' },{ val: 'luxury', label: '₹₹₹₹ Luxury' }];
const sortOptions = [{ val: 'rating', label: '⭐ Rating' },{ val: 'price_low', label: '↑ Price Low' },{ val: 'price_high', label: '↓ Price High' }];

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ cuisine: '', priceRange: '', rating: '', sort: 'rating' });

  const city = params.get('city') || '';
  const date = params.get('date') || '';
  const time = params.get('time') || '';
  const people = params.get('people') || '';
  const cuisine = params.get('cuisine') || '';

  useEffect(() => {
    if (cuisine && !filters.cuisine) setFilters(f => ({ ...f, cuisine }));
  }, [cuisine]);

  useEffect(() => {
    setLoading(true);
    searchRestaurants({ city, date, time, people, ...filters })
      .then(({ data }) => setResults(data.restaurants || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [city, date, time, people, filters]);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: f[k] === v ? '' : v }));
  const clearFilters = () => setFilters({ cuisine: '', priceRange: '', rating: '', sort: 'rating' });
  const activeFilters = Object.values(filters).filter(Boolean).length;

  return (
    <div className="search-results-page">
      {/* Search bar strip */}
      <div className="search-strip">
        <div className="container-wide">
          <SearchBar initialValues={{ city, date, time, people }} />
        </div>
      </div>

      <div className="container-wide results-layout">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${showFilters ? 'filters-open' : ''}`}>
          <div className="filters-header">
            <h3><FiSliders /> Filters {activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}</h3>
            {activeFilters > 0 && <button className="btn btn-sm" onClick={clearFilters}><FiX /> Clear</button>}
          </div>

          <div className="filter-group">
            <h4>Sort By</h4>
            {sortOptions.map(o => (
              <label key={o.val} className="filter-radio">
                <input type="radio" name="sort" value={o.val} checked={filters.sort === o.val}
                  onChange={() => setFilters(f => ({ ...f, sort: o.val }))} />
                {o.label}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Cuisine</h4>
            {cuisineOptions.map(c => (
              <label key={c} className="filter-check">
                <input type="checkbox" checked={filters.cuisine === c} onChange={() => setFilter('cuisine', c)} />
                {c}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            {priceOptions.map(o => (
              <label key={o.val} className="filter-check">
                <input type="checkbox" checked={filters.priceRange === o.val} onChange={() => setFilter('priceRange', o.val)} />
                {o.label}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Min Rating</h4>
            {[4.5, 4.0, 3.5, 3.0].map(r => (
              <label key={r} className="filter-check">
                <input type="checkbox" checked={filters.rating === String(r)} onChange={() => setFilter('rating', String(r))} />
                ⭐ {r}+
              </label>
            ))}
          </div>
        </aside>

        {/* Results */}
        <main className="results-main">
          <div className="results-header">
            <div>
              <h1 className="results-title">
                {city ? `Restaurants in ${city.charAt(0).toUpperCase() + city.slice(1)}` : cuisine ? `${cuisine} Restaurants` : 'All Restaurants'}
              </h1>
              <p className="results-sub">
                {loading ? 'Searching...' : `${results.length} restaurant${results.length !== 1 ? 's' : ''} found`}
                {date && ` · ${date}`} {people && ` · ${people} guests`}
              </p>
            </div>
            <button className="btn btn-outline btn-sm filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
              <FiFilter /> Filters {activeFilters > 0 && `(${activeFilters})`}
            </button>
          </div>

          {loading ? (
            <div className="grid-auto">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 340 }} />)}
            </div>
          ) : results.length > 0 ? (
            <div className="grid-auto">
              {results.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No restaurants found</h3>
              <p>Try adjusting your filters or search a different city</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
