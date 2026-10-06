import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, RefreshCw, BarChart2, Zap, Shield } from 'lucide-react';
import FeedDiversity from './FeedDiversity';
import { getFeedDiversity } from '../services/feedService';
import './RightPanel.css';

export default function RightPanel() {
  const [diversity, setDiversity] = useState(null);

  useEffect(() => {
    getFeedDiversity().then(setDiversity);
  }, []);

  return (
    <aside className="right-panel" aria-label="Feed insights">
      <div className="rp-section">
        <div className="rp-section-title">YOUR FEED</div>

        <div className="rp-insight-card card">
          <div className="rp-insight-row">
            <div className="rp-insight-icon rp-icon--blue">
              <BarChart2 size={14} />
            </div>
            <div className="rp-insight-info">
              <span className="rp-insight-label">Feed Diversity</span>
              <span className="rp-insight-value">62% Technology</span>
            </div>
          </div>

          <div className="rp-insight-row">
            <div className="rp-insight-icon rp-icon--green">
              <Zap size={14} />
            </div>
            <div className="rp-insight-info">
              <span className="rp-insight-label">Recommendation Health</span>
              <span className="rp-insight-value">78%</span>
            </div>
          </div>

          <div className="rp-insight-row">
            <div className="rp-insight-icon rp-icon--purple">
              <Shield size={14} />
            </div>
            <div className="rp-insight-info">
              <span className="rp-insight-label">Personalization</span>
              <span className="rp-insight-value rp-value--on">ON</span>
            </div>
          </div>
        </div>
      </div>

      {diversity && (
        <div className="rp-section">
          <FeedDiversity data={diversity} />
        </div>
      )}

      <div className="rp-section">
        <div className="rp-section-title">QUICK CONTROLS</div>
        <div className="rp-quick-controls">
          <Link to="/preferences" className="btn btn-outline btn-sm rp-ctrl-btn">
            <Settings size={13} /> Manage Interests
          </Link>
          <Link to="/preferences" className="btn btn-ghost btn-sm rp-ctrl-btn">
            <RefreshCw size={13} /> Reset Recommendations
          </Link>
        </div>
      </div>

      <div className="rp-trust-badge">
        <Shield size={14} className="rp-trust-icon" />
        <span>TrustSocial is built on transparency, user control, and privacy.</span>
      </div>
    </aside>
  );
}
