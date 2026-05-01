import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './AuthPage.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const { data } = await login(form);
      authLogin(data);
      toast.success(`Welcome back, ${data.name}! 🎉`);
      navigate('/');
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
            <h1>Welcome Back</h1>
            <p>Sign in to continue your dining journey</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input className="form-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <div className="auth-demo-creds">
            <p>Demo credentials:</p>
            <div className="demo-grid">
              <button onClick={() => setForm({ email: 'customer@demo.com', password: 'password123' })} className="demo-btn">
                👤 Customer
              </button>
              <button onClick={() => navigate('/admin/login')} className="demo-btn">
                👑 Admin
              </button>
              <button onClick={() => navigate('/owner/login')} className="demo-btn">
                🏪 Owner
              </button>
            </div>
          </div>
          <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up free</Link></p>
        </div>
      </div>
    </div>
  );
}
