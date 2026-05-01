import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiClock, FiUsers, FiSearch } from 'react-icons/fi';
import './SearchBar.css';

const timeSlots = ['11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30',
  '19:00','19:30','20:00','20:30','21:00','21:30','22:00'];

const popularCities = ['Mumbai','Delhi','Bangalore','Chennai','Hyderabad','Pune','Kolkata','Goa'];

export default function SearchBar({ hero, initialValues = {} }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    city: initialValues.city || '',
    date: initialValues.date || today,
    time: initialValues.time || '19:00',
    people: initialValues.people || '2',
  });
  const [cityDropdown, setCityDropdown] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.city.trim()) return;
    const params = new URLSearchParams(form).toString();
    navigate(`/search-results?${params}`);
  };

  const selectCity = (c) => { set('city', c); setCityDropdown(false); };

  return (
    <form className={`search-bar ${hero ? 'search-bar-hero' : 'search-bar-compact'}`} onSubmit={handleSearch}>
      {hero && <h2 className="search-bar-title">Find Your Perfect Table</h2>}

      <div className="search-fields">
        {/* City */}
        <div className="search-field city-field" style={{ position: 'relative' }}>
          <label><FiMapPin size={14} /> Place / City</label>
          <input
            type="text" placeholder="e.g. Mumbai, Delhi, Goa..."
            value={form.city}
            onChange={e => { set('city', e.target.value); setCityDropdown(true); }}
            onFocus={() => setCityDropdown(true)}
            onBlur={() => setTimeout(() => setCityDropdown(false), 150)}
            required
          />
          {cityDropdown && form.city.length === 0 && (
            <div className="city-dropdown">
              {popularCities.map(c => (
                <button type="button" key={c} onMouseDown={() => selectCity(c)} className="city-option">
                  <FiMapPin size={12} /> {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="search-field">
          <label><FiCalendar size={14} /> Date</label>
          <input type="date" value={form.date} min={today} onChange={e => set('date', e.target.value)} />
        </div>

        {/* Time */}
        <div className="search-field">
          <label><FiClock size={14} /> Time</label>
          <select value={form.time} onChange={e => set('time', e.target.value)}>
            {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* People */}
        <div className="search-field">
          <label><FiUsers size={14} /> People</label>
          <select value={form.people} onChange={e => set('people', e.target.value)}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
          </select>
        </div>

        <button type="submit" className={`search-submit ${hero ? 'btn btn-secondary btn-lg' : 'btn btn-primary'}`}>
          <FiSearch size={18} /> {hero ? 'Search Restaurants' : 'Search'}
        </button>
      </div>
    </form>
  );
}
