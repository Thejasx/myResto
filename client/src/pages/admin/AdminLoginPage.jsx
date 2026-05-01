import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShield, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import '../AuthPage.css';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await adminLogin(form);
      authLogin(data);
      toast.success('Admin access granted 🛡️');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }} />
      <div className="auth-container">
        <div className="auth-card page-enter">
          <div className="auth-header">
            <Link to="/" className="auth-logo">🍽️ My<span>Resto</span></Link>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛡️</div>
            <h1>Admin Control</h1>
            <p>Enter administrative credentials</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input className="form-input" type="email" placeholder="admin@gmail.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Master Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="auth-demo-creds">
              <p>Master Credentials:</p>
              <button type="button" className="demo-btn" style={{ width: '100%' }}
                onClick={() => setForm({ email: 'admin@gmail.com', password: 'adminpassword' })}>
                🛡️ Use Master Admin
              </button>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', background: '#0f172a' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Panel'}
            </button>
          </form>
          <p className="auth-switch"><Link to="/">Back to MyResto</Link></p>
        </div>
      </div>
    </div>
  );
}
