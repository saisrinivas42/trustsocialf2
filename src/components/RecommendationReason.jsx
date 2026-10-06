import { useState } from 'react';
import { Info, CheckCircle, ThumbsUp, ThumbsDown, EyeOff, Ban, X } from 'lucide-react';
import Modal from './Modal';
import './RecommendationReason.css';

export default function RecommendationReason({ post, onFeedback }) {
  const [isOpen, setIsOpen] = useState(false);
  const [actionTaken, setActionTaken] = useState(null);

  const handleAction = (action) => {
    setActionTaken(action);
    if (onFeedback) onFeedback(post.id, action);
    setTimeout(() => setIsOpen(false), 1000);
  };

  const scoreColor =
    post.recommendationScore >= 85
      ? '#22C55E'
      : post.recommendationScore >= 70
      ? '#4F6EF7'
      : '#F59E0B';

  return (
    <>
      <button
        className="why-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Why am I seeing this post?"
        title="Why am I seeing this?"
      >
        <Info size={13} />
        <span>Why am I seeing this?</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Why am I seeing this?">
        <div className="why-modal">
          {/* Score */}
          <div className="why-score-section">
            <div className="why-score-ring" style={{ '--score-color': scoreColor }}>
              <svg viewBox="0 0 64 64" className="why-score-svg">
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-border)" strokeWidth="5" />
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="5"
                  strokeDasharray={`${(post.recommendationScore / 100) * 175.9} 175.9`}
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <div className="why-score-text">
                <span className="why-score-value" style={{ color: scoreColor }}>{post.recommendationScore}%</span>
                <span className="why-score-label">Match</span>
              </div>
            </div>
            <div className="why-score-info">
              <h4>Recommendation Score</h4>
              <p>This score indicates how closely this post matches your interests and activity. Higher scores mean a stronger match.</p>
            </div>
          </div>

          {/* Reasons */}
          <div className="why-reasons">
            <h4 className="why-reasons-title">Why you're seeing this</h4>
            <ul className="why-reasons-list">
              {post.recommendationReasons.map((reason, i) => (
                <li key={i} className="why-reason-item">
                  <CheckCircle size={15} className="why-reason-icon" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust notice */}
          <div className="why-trust-notice">
            <Info size={14} />
            <p>TrustSocial uses your interests, interactions, and follows to personalize your feed. You can change this in <a href="/preferences">Preferences</a>.</p>
          </div>

          {/* Controls */}
          {!actionTaken ? (
            <div className="why-controls">
              <h4 className="why-controls-title">How can we improve your feed?</h4>
              <div className="why-actions">
                <button className="why-action-btn why-action--more" onClick={() => handleAction('more')}>
                  <ThumbsUp size={15} /> Show More Like This
                </button>
                <button className="why-action-btn why-action--less" onClick={() => handleAction('less')}>
                  <ThumbsDown size={15} /> Show Less Like This
                </button>
                <button className="why-action-btn why-action--not-interested" onClick={() => handleAction('not_interested')}>
                  <EyeOff size={15} /> Not Interested
                </button>
                <button className="why-action-btn why-action--block" onClick={() => handleAction('block_topic')}>
                  <Ban size={15} /> Block Topic
                </button>
              </div>
            </div>
          ) : (
            <div className="why-action-confirm">
              <CheckCircle size={20} className="why-action-confirm-icon" />
              <span>
                {actionTaken === 'more' && 'Great! We\'ll show you more content like this.'}
                {actionTaken === 'less' && 'Noted! We\'ll show less of this type.'}
                {actionTaken === 'not_interested' && 'Understood. We\'ll reduce similar recommendations.'}
                {actionTaken === 'block_topic' && 'Topic blocked. You won\'t see this topic in your feed.'}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
