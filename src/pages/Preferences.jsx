import { useState, useEffect } from 'react';
import { Settings, ToggleLeft, ToggleRight, Save, CheckCircle } from 'lucide-react';
import { getPreferences, savePreferences } from '../services/preferenceService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { ToastContainer } from '../components/Toast';
import './Preferences.css';

const INTEREST_COLORS = {
  Technology:'#4F6EF7', Sports:'#22C55E', Gaming:'#8B5CF6',
  Entertainment:'#EC4899', Art:'#F59E0B', Science:'#06B6D4',
  Education:'#10B981', Lifestyle:'#EF4444',
};

const TOGGLE_LABELS = {
  personalization: { label: 'Personalization', desc: 'Use your interests and activity to personalize your feed' },
  feedDiversity: { label: 'Feed Diversity', desc: 'Ensure your feed includes a variety of topics' },
  useInteractionHistory: { label: 'Use Interaction History', desc: 'Factor in your likes, comments, and views' },
  trendingContent: { label: 'Trending Content', desc: 'Include trending posts even outside your interests' },
};

export default function Preferences() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    getPreferences().then((p) => { setPrefs(p); setLoading(false); });
  }, []);

  const setInterest = (key, val) =>
    setPrefs((p) => ({ ...p, interests: { ...p.interests, [key]: val } }));

  const setToggle = (key) =>
    setPrefs((p) => ({ ...p, toggles: { ...p.toggles, [key]: !p.toggles[key] } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePreferences(prefs);
      setSaved(true);
      addToast('Your recommendation preferences have been updated.', 'success');
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}><LoadingSpinner size="lg" /></div>;

  return (
    <div className="pref-page">
      <div className="pref-header">
        <div className="pref-header-icon"><Settings size={20} /></div>
        <div>
          <h1 className="pref-title">Recommendation Preferences</h1>
          <p className="pref-subtitle">Control what influences your feed.</p>
        </div>
      </div>

      {/* Interest sliders */}
      <div className="card pref-section">
        <h2 className="pref-section-title">Your Interests</h2>
        <p className="pref-section-desc">Adjust how much each topic appears in your feed.</p>
        <div className="pref-interests">
          {Object.entries(prefs.interests).map(([key, val]) => (
            <div key={key} className="pref-interest-row">
              <div className="pref-interest-label">
                <span className="pref-interest-dot" style={{ background: INTEREST_COLORS[key] || '#4F6EF7' }} />
                <span className="pref-interest-name">{key}</span>
              </div>
              <div className="pref-slider-wrap">
                <span className="pref-slider-hint">Less</span>
                <input
                  type="range" min={0} max={100} value={val}
                  className="pref-slider"
                  style={{ '--thumb-color': INTEREST_COLORS[key] || '#4F6EF7' }}
                  onChange={(e) => setInterest(key, Number(e.target.value))}
                  aria-label={`${key} interest level`}
                />
                <span className="pref-slider-hint">More</span>
              </div>
              <span className="pref-interest-pct" style={{ color: INTEREST_COLORS[key] || '#4F6EF7' }}>
                {val}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle controls */}
      <div className="card pref-section">
        <h2 className="pref-section-title">Feed Controls</h2>
        <p className="pref-section-desc">Fine-tune how your recommendations are generated.</p>
        <div className="pref-toggles">
          {Object.entries(TOGGLE_LABELS).map(([key, { label, desc }]) => (
            <div key={key} className="pref-toggle-row">
              <div className="pref-toggle-info">
                <span className="pref-toggle-label">{label}</span>
                <span className="pref-toggle-desc">{desc}</span>
              </div>
              <button
                className={`pref-toggle-btn ${prefs.toggles[key] ? 'on' : 'off'}`}
                onClick={() => setToggle(key)}
                aria-label={`Toggle ${label}`}
                aria-pressed={prefs.toggles[key]}
              >
                {prefs.toggles[key]
                  ? <><ToggleRight size={28} /> <span>ON</span></>
                  : <><ToggleLeft size={28} /> <span>OFF</span></>
                }
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="pref-save-row">
        {saved && (
          <div className="pref-saved-msg">
            <CheckCircle size={16} /> Your preferences have been saved.
          </div>
        )}
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
          {saving ? <LoadingSpinner size="sm" /> : <><Save size={15} /> Save Preferences</>}
        </button>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
