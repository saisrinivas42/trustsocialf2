import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail, validatePassword } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import './Register.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const passCheck = validatePassword(form.password);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.username.trim()) e.username = 'Username is required';
    else if (form.username.length < 3) e.username = 'Username must be at least 3 characters';
    else if (!/^[a-z0-9_]+$/i.test(form.username)) e.username = 'Only letters, numbers, and underscores';
    if (!form.email) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (!passCheck.allMet) e.password = 'Password does not meet requirements';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(form.fullName, form.username, form.email, form.password);
      navigate('/home');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="login-brand register-brand">
        <div className="login-brand-inner">
          <div className="login-logo">
            <div className="login-logo-icon">T</div>
            <span className="login-logo-text">TrustSocial</span>
          </div>
          <h1 className="login-tagline">Join a social platform that respects you.</h1>
          <p className="login-description">
            TrustSocial gives you full visibility and control over your personalized experience — no hidden algorithms, no dark patterns.
          </p>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-card">
          <div className="login-form-header">
            <h2>Create account</h2>
            <p>Join TrustSocial today — it's free</p>
          </div>

          {apiError && (
            <div className="auth-error-banner">
              <AlertCircle size={15} /><span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="register-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName" type="text"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Alex Morgan"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
                {errors.fullName && <span className="form-error"><AlertCircle size={12} />{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <input
                    id="username" type="text"
                    className={`form-input ${errors.username ? 'error' : ''}`}
                    placeholder="alexmorgan"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                  />
                  {form.username && <span className="input-suffix reg-at">@</span>}
                </div>
                {errors.username && <span className="form-error"><AlertCircle size={12} />{errors.username}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <input
                id="reg-email" type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <span className="form-error"><AlertCircle size={12} />{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-pass">Password</label>
              <div className="input-wrapper">
                <input
                  id="reg-pass"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" className="input-suffix" onClick={() => setShowPass(v => !v)} aria-label="Toggle password">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="pass-requirements">
                  {passCheck.requirements.map((r) => (
                    <div key={r.label} className={`pass-req ${r.met ? 'met' : ''}`}>
                      <CheckCircle size={11} />
                      <span>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {errors.password && <span className="form-error"><AlertCircle size={12} />{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm" type="password"
                className={`form-input ${errors.confirm ? 'error' : ''}`}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
              {errors.confirm && <span className="form-error"><AlertCircle size={12} />{errors.confirm}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
