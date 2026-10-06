import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, CheckCircle, Trash2, Flag } from 'lucide-react';
import { likePost, savePost, deletePost } from '../services/postService';
import { timeAgo, formatCount } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from './UserAvatar';
import RecommendationReason from './RecommendationReason';
import CommentSection from './CommentSection';
import './PostCard.css';

export default function PostCard({ post, onDelete, onFeedback, showComments = false }) {
  const { user } = useAuth();
  const [postState, setPostState] = useState(post);
  const [commentsOpen, setCommentsOpen] = useState(showComments);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  const handleLike = async () => {
    const updated = await likePost(postState.id);
    setPostState((p) => ({ ...p, liked: updated.liked, likes: updated.likes }));
  };

  const handleSave = async () => {
    const updated = await savePost(postState.id);
    setPostState((p) => ({ ...p, saved: updated.saved }));
  };

  const handleShare = () => {
    setShared(true);
    setPostState((p) => ({ ...p, shares: p.shares + 1 }));
    setTimeout(() => setShared(false), 2000);
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    await deletePost(postState.id);
    setDeleted(true);
    if (onDelete) onDelete(postState.id);
  };

  const isOwnPost = user?.id === postState.userId;

  return (
    <article className="post-card card" aria-label={`Post by ${postState.author.fullName}`}>
      {/* Header */}
      <div className="post-header">
        <div className="post-author-info">
          <UserAvatar user={postState.author} size="md" />
          <div className="post-author-details">
            <div className="post-author-name-row">
              <span className="post-author-name">{postState.author.fullName}</span>
              {postState.author.verified && (
                <CheckCircle size={14} className="post-verified-icon" aria-label="Verified account" />
              )}
              <span className="post-author-handle">@{postState.author.username}</span>
            </div>
            <span className="post-time">{timeAgo(postState.timestamp)}</span>
          </div>
        </div>

        {/* More menu */}
        <div className="post-menu-wrapper">
          <button
            className="post-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Post options"
            aria-haspopup="true"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="post-dropdown">
              {isOwnPost && (
                <button className="post-dropdown-item post-dropdown-item--danger" onClick={handleDelete}>
                  <Trash2 size={14} /> Delete Post
                </button>
              )}
              <button className="post-dropdown-item" onClick={() => setMenuOpen(false)}>
                <Flag size={14} /> Report Post
              </button>
            </div>
          )}
          {menuOpen && <div className="post-menu-overlay" onClick={() => setMenuOpen(false)} />}
        </div>
      </div>

      {/* Content */}
      <div className="post-content">
        <p className="post-text">{postState.content}</p>
        {postState.image && (
          <div className="post-image">
            <img src={postState.image} alt="Post attachment" loading="lazy" />
          </div>
        )}
      </div>

      {/* Topics */}
      {postState.topics && postState.topics.length > 0 && (
        <div className="post-topics">
          {postState.topics.map((t) => (
            <span key={t} className="post-topic-tag">#{t}</span>
          ))}
        </div>
      )}

      {/* Actions bar */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button
            className={`post-action-btn ${postState.liked ? 'post-action-btn--liked' : ''}`}
            onClick={handleLike}
            aria-label={postState.liked ? 'Unlike post' : 'Like post'}
            aria-pressed={postState.liked}
          >
            <Heart size={17} fill={postState.liked ? 'currentColor' : 'none'} />
            <span>{formatCount(postState.likes)}</span>
          </button>

          <button
            className={`post-action-btn ${commentsOpen ? 'post-action-btn--active' : ''}`}
            onClick={() => setCommentsOpen((v) => !v)}
            aria-label="Toggle comments"
            aria-expanded={commentsOpen}
          >
            <MessageCircle size={17} />
            <span>{formatCount(postState.comments)}</span>
          </button>

          <button
            className={`post-action-btn ${shared ? 'post-action-btn--shared' : ''}`}
            onClick={handleShare}
            aria-label="Share post"
          >
            <Share2 size={17} />
            <span>{shared ? 'Shared!' : 'Share'}</span>
          </button>
        </div>

        <div className="post-actions-right">
          {postState.recommended && (
            <RecommendationReason post={postState} onFeedback={onFeedback} />
          )}
          <button
            className={`post-action-btn ${postState.saved ? 'post-action-btn--saved' : ''}`}
            onClick={handleSave}
            aria-label={postState.saved ? 'Unsave post' : 'Save post'}
            aria-pressed={postState.saved}
          >
            <Bookmark size={17} fill={postState.saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Comments */}
      {commentsOpen && <CommentSection postId={postState.id} />}
    </article>
  );
}
