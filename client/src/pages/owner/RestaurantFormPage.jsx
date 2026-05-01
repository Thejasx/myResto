import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getOwnerRestaurant, 
  createRestaurant, 
  updateRestaurant, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2, FiInfo, FiLayers, FiImage, FiClock } from 'react-icons/fi';

const categories = ['Main Course', 'Starters', 'Desserts', 'Beverages', 'Breads', 'Rice', 'Breakfast', 'Snacks'];
const cuisines = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Mughlai', 'Continental', 'Seafood', 'Street Food'];

export default function RestaurantFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [restaurant, setRestaurant] = useState({
    name: '',
    location: '',
    city: '',
    address: '',
    description: '',
    cuisines: [],
    openingTime: '10:00',
    closingTime: '22:00',
    seatingCapacity: 50,
    totalTables: 10,
    priceRange: 'moderate',
    priceForTwo: 500,
    phone: '',
    images: ['']
  });

  const [menu, setMenu] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'Main Course',
    description: '',
    quantity: '1 serving',
    priceInr: '',
    isVeg: true,
    isAvailable: true,
    image: ''
  });

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      getOwnerRestaurant()
        .then(({ data }) => {
          setRestaurant(data.restaurant);
          setMenu(data.menu);
        })
        .catch(() => toast.error('Failed to load restaurant data'))
        .finally(() => setLoading(false));
    }
  }, [isEdit]);

  const handleRestoChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(p => ({ ...p, [name]: value }));
  };

  const handleCuisineToggle = (c) => {
    setRestaurant(p => {
      const exists = p.cuisines.includes(c);
      return {
        ...p,
        cuisines: exists ? p.cuisines.filter(item => item !== c) : [...p.cuisines, c]
      };
    });
  };

  const handleSaveRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateRestaurant(id, restaurant);
        toast.success('Restaurant updated successfully');
      } else {
        await createRestaurant(restaurant);
        toast.success('Restaurant registered! Now add your menu.');
        setActiveStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { data } = await updateMenuItem(editingItem._id, itemForm);
        setMenu(m => m.map(i => i._id === data._id ? data : i));
        toast.success('Item updated');
      } else {
        const { data } = await addMenuItem(itemForm);
        setMenu(m => [...m, data]);
        toast.success('Item added to menu');
      }
      setShowItemModal(false);
      setEditingItem(null);
      setItemForm({ name: '', category: 'Main Course', description: '', quantity: '1 serving', priceInr: '', isVeg: true, isAvailable: true, image: '' });
    } catch (err) {
      toast.error('Failed to save menu item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteMenuItem(itemId);
      setMenu(m => m.filter(i => i._id !== itemId));
      toast.success('Item removed');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading && isEdit) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="owner-page" style={{ paddingTop: 100 }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: 32 }}>
          <h1>{isEdit ? 'Edit Restaurant' : 'Add Your Restaurant'}</h1>
          <p>Provide details about your restaurant and manage your menu</p>
        </div>

        <div className="owner-tabs" style={{ marginBottom: 32 }}>
          <button className={`tab-btn ${activeStep === 1 ? 'active' : ''}`} onClick={() => setActiveStep(1)}>1. Basic Info</button>
          <button className={`tab-btn ${activeStep === 2 ? 'active' : ''}`} onClick={() => setActiveStep(2)} disabled={!isEdit && activeStep < 2}>2. Menu Items</button>
        </div>

        {activeStep === 1 ? (
          <div className="card" style={{ padding: 32 }}>
            <form onSubmit={handleSaveRestaurant} className="auth-form">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Restaurant Name</label>
                  <input className="form-input" name="name" value={restaurant.name} onChange={handleRestoChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" name="city" value={restaurant.city} onChange={handleRestoChange} placeholder="e.g. Mumbai" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location / Area</label>
                  <input className="form-input" name="location" value={restaurant.location} onChange={handleRestoChange} placeholder="e.g. Bandra West" required />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" name="phone" value={restaurant.phone} onChange={handleRestoChange} placeholder="e.g. +91 98765 43210" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Address</label>
                  <input className="form-input" name="address" value={restaurant.address} onChange={handleRestoChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" name="description" value={restaurant.description} onChange={handleRestoChange} rows={3} required />
              </div>

              <div className="form-group">
                <label className="form-label">Cuisines (Select multiple)</label>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  {cuisines.map(c => (
                    <button 
                      key={c} type="button" 
                      className={`btn btn-sm ${restaurant.cuisines.includes(c) ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleCuisineToggle(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Opening Time</label>
                  <input className="form-input" type="time" name="openingTime" value={restaurant.openingTime} onChange={handleRestoChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Closing Time</label>
                  <input className="form-input" type="time" name="closingTime" value={restaurant.closingTime} onChange={handleRestoChange} required />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Price for Two (INR)</label>
                  <input className="form-input" type="number" name="priceForTwo" value={restaurant.priceForTwo} onChange={handleRestoChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Seating Capacity</label>
                  <input className="form-input" type="number" name="seatingCapacity" value={restaurant.seatingCapacity} onChange={handleRestoChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" name="images" value={restaurant.images[0]} onChange={(e) => setRestaurant(p => ({...p, images: [e.target.value]}))} placeholder="Paste a high-quality image URL" />
              </div>

              <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  <FiSave /> {isEdit ? 'Update Restaurant' : 'Next: Manage Menu'}
                </button>
                <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate('/owner/dashboard')}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="menu-manage-section">
            <div className="flex-between" style={{ marginBottom: 24 }}>
              <h2>Menu Items ({menu.length})</h2>
              <button className="btn btn-primary" onClick={() => { setShowItemModal(true); setEditingItem(null); }}>
                <FiPlus /> Add Item
              </button>
            </div>

            {menu.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">🍽️</div>
                <h3>Your menu is empty</h3>
                <p>Add some delicious dishes to start receiving bookings</p>
              </div>
            ) : (
              <div className="grid-2">
                {menu.map(item => (
                  <div key={item._id} className="card flex" style={{ padding: 16, gap: 16 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                      {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="flex-center" style={{ height: '100%' }}>🍲</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="flex-between">
                        <h4 style={{ fontSize: '1rem' }}>{item.name}</h4>
                        <span className="price-tag">₹{item.priceInr}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px' }}>{item.category} · {item.quantity}</p>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-outline" onClick={() => { setEditingItem(item); setItemForm(item); setShowItemModal(true); }}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteItem(item._id)}><FiTrash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/owner/dashboard')}>Go to Dashboard</button>
            </div>
          </div>
        )}
      </div>

      {/* Menu Item Modal */}
      {showItemModal && (
        <div className="modal-overlay" onClick={() => setShowItemModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => setShowItemModal(false)} className="btn-icon">×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddItem} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Item Name</label>
                  <input className="form-input" value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (INR)</label>
                    <input className="form-input" type="number" value={itemForm.priceInr} onChange={e => setItemForm({...itemForm, priceInr: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} rows={2} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Veg / Non-Veg</label>
                    <div className="flex gap-4" style={{ marginTop: 8 }}>
                      <label className="flex-center gap-2"><input type="radio" checked={itemForm.isVeg} onChange={() => setItemForm({...itemForm, isVeg: true})} /> Veg</label>
                      <label className="flex-center gap-2"><input type="radio" checked={!itemForm.isVeg} onChange={() => setItemForm({...itemForm, isVeg: false})} /> Non-Veg</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Serving Size</label>
                    <input className="form-input" value={itemForm.quantity} onChange={e => setItemForm({...itemForm, quantity: e.target.value})} placeholder="e.g. 1 serving" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL (optional)</label>
                  <input className="form-input" value={itemForm.image} onChange={e => setItemForm({...itemForm, image: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12 }}>Save Item</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
