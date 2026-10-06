import { useState, useEffect } from 'react';
import { Heart, Send } from 'lucide-react';
import { getComments, addComment, likeComment } from '../services/postService';
import { checkContentSafety, timeAgo } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from './UserAvatar';
import ResponsibleContentWarning from './ResponsibleContentWarning';
import LoadingSpinner from './LoadingSpinner';
import './CommentSection.css';

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [contentWarning, setContentWarning] = useState(null);

  useEffect(() => {
    let active = true;
    getComments(postId).then((data) => {
      if (active) { setComments(data); setLoading(false); }
    });
    return () => { active = false; };
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const safety = checkContentSafety(text);
    if (!safety.safe && !contentWarning) {
      setContentWarning(safety.reason);
      return;
    }
    await doPost();
  };

  const doPost = async () => {
    setSubmitting(true);
    setContentWarning(null);
    try {
      const newComment = await addComment(postId, text, {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        avatarColor: user.avatarColor,
        verified: user.verified,
      });
      setComments((prev) => [newComment, ...prev]);
      setText('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    await likeComment(postId, commentId);
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">Comments</h3>

      {/* Input */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <UserAvatar user={user} size="sm" />
        <div className="comment-form-inner">
          <div className="comment-input-wrapper">
            <textarea
              className="comment-input"
              placeholder="Write a comment…"
              value={text}
              onChange={(e) => { setText(e.target.value); setContentWarning(null); }}
              rows={1}
              maxLength={500}
              aria-label="Write a comment"
            />
            <button
              type="submit"
              className="comment-submit"
              disabled={!text.trim() || submitting}
              aria-label="Post comment"
            >
              <Send size={15} />
            </button>
          </div>
          {contentWarning && (
            <ResponsibleContentWarning
              reason={contentWarning}
              onRewrite={() => setText('')}
              onEdit={() => {}}
              onPostAnyway={doPost}
            />
          )}
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="comment-loading"><LoadingSpinner size="sm" /></div>
      ) : comments.length === 0 ? (
        <p className="comment-empty">No comments yet. Be the first!</p>
      ) : (
        <ul className="comments-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <UserAvatar user={c.author} size="sm" />
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-author">{c.author.fullName}</span>
                  <span className="comment-handle">@{c.author.username}</span>
                  <span className="comment-time">{timeAgo(c.timestamp)}</span>
                </div>
                <p className="comment-text">{c.content}</p>
                <div className="comment-actions">
                  <button
                    className={`comment-like-btn ${c.liked ? 'liked' : ''}`}
                    onClick={() => handleLike(c.id)}
                    aria-label={c.liked ? 'Unlike comment' : 'Like comment'}
                  >
                    <Heart size={13} fill={c.liked ? 'currentColor' : 'none'} />
                    <span>{c.likes}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
