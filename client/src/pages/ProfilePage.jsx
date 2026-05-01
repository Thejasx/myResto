import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, login: authLogin } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const { data } = await updateProfile(payload);
      authLogin(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, margin: '0 auto 12px' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <h1 style={{ fontSize: '1.5rem' }}>{user?.name}</h1>
            <span className={`badge badge-primary`}>{user?.role}</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <FiUser className="input-icon" />
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email (read-only)</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input className="form-input" value={user?.email} readOnly style={{ paddingLeft: 40, opacity: 0.6 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <div className="input-icon-wrap">
                <FiPhone className="input-icon" />
                <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div className="divider" />
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Change Password (optional)</h4>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" placeholder="Leave blank to keep current" value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" placeholder="Repeat new password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
