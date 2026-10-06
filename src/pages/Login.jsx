import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Zap, BarChart2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
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
      await login(form.email, form.password);
      navigate('/home');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm((f) => ({ ...f, email: 'alex@example.com', password: 'demo1234' }));

  return (
    <div className="auth-page">
      {/* Left brand panel */}
      <div className="login-brand">
        <div className="login-brand-inner">
          <div className="login-logo">
            <div className="login-logo-icon">T</div>
            <span className="login-logo-text">TrustSocial</span>
          </div>
          <h1 className="login-tagline">Your feed. Your choices. Your control.</h1>
          <p className="login-description">
            An AI-powered social platform designed around transparency, personalization, privacy, and user control.
          </p>
          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-icon"><Zap size={16} /></div>
              <div>
                <div className="login-feature-title">Transparent Recommendations</div>
                <div className="login-feature-desc">Always know why you see what you see</div>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon"><Shield size={16} /></div>
              <div>
                <div className="login-feature-title">Privacy First</div>
                <div className="login-feature-desc">Full control over your data and AI profile</div>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon"><BarChart2 size={16} /></div>
              <div>
                <div className="login-feature-title">Feed Diversity</div>
                <div className="login-feature-desc">Stay informed, avoid filter bubbles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <div className="login-form-card">
          <div className="login-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your TrustSocial account</p>
          </div>

          {apiError && (
            <div className="auth-error-banner">
              <AlertCircle size={15} />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <span id="email-error" className="form-error"><AlertCircle size={12} />{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="password">Password</label>
                <button type="button" className="forgot-link" tabIndex={0}>Forgot password?</button>
              </div>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  aria-describedby={errors.password ? 'pass-error' : undefined}
                />
                <button
                  type="button"
                  className="input-suffix"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span id="pass-error" className="form-error"><AlertCircle size={12} />{errors.password}</span>}
            </div>

            <div className="form-group remember-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="checkbox-input"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <button className="btn btn-outline btn-full" onClick={fillDemo}>
            Use Demo Account
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

          <div className="demo-hint">
            <span>Demo: alex@example.com / demo1234</span>
          </div>
        </div>
      </div>
    </div>
  );
}
