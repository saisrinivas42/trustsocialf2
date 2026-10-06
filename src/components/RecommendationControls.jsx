import { useState } from 'react';
import { ThumbsUp, ThumbsDown, EyeOff, Ban, CheckCircle } from 'lucide-react';
import { submitFeedback } from '../services/feedService';
import './RecommendationControls.css';

export default function RecommendationControls({ postId, onFeedback }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await submitFeedback(postId, action);
      setDone(action);
      if (onFeedback) onFeedback(postId, action);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rec-controls-done">
        <CheckCircle size={14} />
        <span>Your recommendation preference has been updated.</span>
      </div>
    );
  }

  return (
    <div className="rec-controls">
      <button disabled={loading} className="rec-control-btn" onClick={() => handleAction('more')} title="Show more like this">
        <ThumbsUp size={13} /> More
      </button>
      <button disabled={loading} className="rec-control-btn" onClick={() => handleAction('less')} title="Show less like this">
        <ThumbsDown size={13} /> Less
      </button>
      <button disabled={loading} className="rec-control-btn" onClick={() => handleAction('not_interested')} title="Not interested">
        <EyeOff size={13} /> Not Interested
      </button>
      <button disabled={loading} className="rec-control-btn rec-control-btn--block" onClick={() => handleAction('block_topic')} title="Block topic">
        <Ban size={13} />
      </button>
    </div>
  );
}
