import { useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, BarChart2 } from 'lucide-react';
import { diversifyFeed } from '../services/feedService';
import './FeedDiversity.css';

export default function FeedDiversity({ data, onDiversify }) {
  const [loading, setLoading] = useState(false);
  const [diversified, setDiversified] = useState(false);
  const [currentData, setCurrentData] = useState(data);

  const handleDiversify = async () => {
    setLoading(true);
    try {
      const updated = await diversifyFeed();
      setCurrentData(updated);
      setDiversified(true);
      if (onDiversify) onDiversify(updated);
    } finally {
      setLoading(false);
    }
  };

  if (!currentData) return null;

  return (
    <div className="feed-diversity card">
      <div className="fd-header">
        <div className="fd-header-left">
          <BarChart2 size={16} className="fd-icon" />
          <h3 className="fd-title">Your Feed Diversity</h3>
        </div>
        <span className={`fd-health ${currentData.healthScore >= 85 ? 'fd-health--good' : currentData.healthScore >= 70 ? 'fd-health--ok' : 'fd-health--low'}`}>
          {currentData.healthScore}% healthy
        </span>
      </div>

      <div className="fd-bars">
        {currentData.categories.map((cat) => (
          <div key={cat.name} className="fd-bar-row">
            <div className="fd-bar-label">
              <span className="fd-cat-dot" style={{ backgroundColor: cat.color }} />
              <span className="fd-cat-name">{cat.name}</span>
            </div>
            <div className="fd-bar-track">
              <div
                className="fd-bar-fill"
                style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
              />
            </div>
            <span className="fd-bar-pct">{cat.percentage}%</span>
          </div>
        ))}
      </div>

      {currentData.warning && !diversified && (
        <div className="fd-warning">
          <AlertTriangle size={14} />
          <span>{currentData.warning}</span>
        </div>
      )}

      {diversified ? (
        <div className="fd-success">
          <CheckCircle size={15} />
          <span>Your feed will now include more content from your other interests.</span>
        </div>
      ) : (
        <button
          className="btn btn-secondary btn-sm fd-btn"
          onClick={handleDiversify}
          disabled={loading}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} />
          {loading ? 'Diversifying…' : 'Diversify My Feed'}
        </button>
      )}
    </div>
  );
}
