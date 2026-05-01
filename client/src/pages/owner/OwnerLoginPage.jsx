import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ownerLogin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import '../AuthPage.css';

export default function OwnerLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await ownerLogin(form);
      authLogin(data);
      toast.success(`Welcome back, ${data.name}! 🏪`);
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-gradient" /></div>
      <div className="auth-container">
        <div className="auth-card page-enter">
          <div className="auth-header">
            <Link to="/" className="auth-logo">🍽️ My<span>Resto</span></Link>
            <h1>Owner Login</h1>
            <p>Access your restaurant dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input className="form-input" type="email" placeholder="owner@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} required style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)} required style={{ paddingLeft: 40 }} />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="auth-demo-creds">
              <p>Demo owner credentials:</p>
              <button type="button" className="demo-btn" style={{ width: '100%' }}
                onClick={() => setForm({ email: 'owner1@myrestodemo.com', password: 'password123' })}>
                🏪 Use Demo Owner Account
              </button>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In as Owner'}
            </button>
          </form>
          <p className="auth-switch">New owner? <Link to="/owner/signup">Register your restaurant</Link></p>
        </div>
      </div>
    </div>
  );
}
