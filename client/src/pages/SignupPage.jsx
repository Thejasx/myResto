import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import './AuthPage.css';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await signup({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      authLogin(data);
      toast.success(`Welcome to MyResto, ${data.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
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
            <h1>Create Account</h1>
            <p>Join thousands of happy diners on MyResto</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <FiUser className="input-icon" />
                <input className="form-input" type="text" placeholder="Your full name"
                  value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input className="form-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <div className="input-icon-wrap">
                <FiPhone className="input-icon" />
                <input className="form-input" type="tel" placeholder="+91 98765 43210"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min 6 chars"
                    value={form.password} onChange={e => set('password', e.target.value)} required />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input className="form-input" type="password" placeholder="Repeat password"
                    value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          <p className="auth-switch" style={{ marginTop: 8 }}>
            Are you a restaurant owner? <Link to="/owner/signup">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
