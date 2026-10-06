import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Tag, X, Send, ArrowLeft } from 'lucide-react';
import { createPost } from '../services/postService';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from '../components/UserAvatar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { ToastContainer } from '../components/Toast';
import './CreatePostPage.css';

const TOPIC_OPTIONS = [
  'Technology','AI','Programming','Education','Sports',
  'Gaming','Entertainment','Art','Science','Lifestyle',
];

export default function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [content, setContent] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const MAX_CHARS = 500;

  const toggleTopic = (t) =>
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : prev.length < 3 ? [...prev, t] : prev
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createPost({
        userId: user.id,
        author: {
          id: user.id, fullName: user.fullName, username: user.username,
          avatar: user.avatar, avatarColor: user.avatarColor, verified: user.verified,
        },
        content: content.trim(),
        topics: selectedTopics,
      });
      addToast('Post published successfully!', 'success');
      setTimeout(() => navigate('/home'), 800);
    } finally {
      setLoading(false);
    }
  };

  const remaining = MAX_CHARS - content.length;

  return (
    <div className="cpp-page">
      <div className="cpp-header">
        <button className="cpp-back" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <h1 className="cpp-title">Create Post</h1>
      </div>

      <div className="card cpp-card">
        <div className="cpp-author">
          <UserAvatar user={user} size="lg" />
          <div>
            <div className="cpp-author-name">{user?.fullName}</div>
            <div className="cpp-author-handle">@{user?.username}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className="cpp-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            maxLength={MAX_CHARS + 50}
            aria-label="Post content"
            autoFocus
          />

          {/* Topics */}
          <div className="cpp-section">
            <div className="cpp-section-label">
              <Tag size={14} /> Select Topics (up to 3)
            </div>
            <div className="cpp-topics-grid">
              {TOPIC_OPTIONS.map((t) => (
                <button
                  key={t} type="button"
                  className={`cpp-topic-btn ${selectedTopics.includes(t) ? 'selected' : ''}`}
                  onClick={() => toggleTopic(t)}
                >
                  {t}
                  {selectedTopics.includes(t) && <X size={11} />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="cpp-footer">
            <div className={`cpp-char ${remaining < 50 ? (remaining < 0 ? 'over' : 'warn') : ''}`}>
              {remaining} characters remaining
            </div>
            <div className="cpp-footer-btns">
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!content.trim() || remaining < 0 || loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : <><Send size={14} /> Publish</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
