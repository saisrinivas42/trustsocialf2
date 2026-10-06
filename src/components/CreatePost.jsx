import { useState } from 'react';
import { Image, Tag, X, Send } from 'lucide-react';
import { createPost } from '../services/postService';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from './UserAvatar';
import LoadingSpinner from './LoadingSpinner';
import './CreatePost.css';

const TOPIC_OPTIONS = [
  'Technology', 'AI', 'Programming', 'Education', 'Sports',
  'Gaming', 'Entertainment', 'Art', 'Science', 'Lifestyle',
];

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [showTopics, setShowTopics] = useState(false);
  const [loading, setLoading] = useState(false);
  const MAX_CHARS = 500;

  const toggleTopic = (t) => {
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : prev.length < 3 ? [...prev, t] : prev
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      const newPost = await createPost({
        userId: user.id,
        author: {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          avatar: user.avatar,
          avatarColor: user.avatarColor,
          verified: user.verified,
        },
        content: content.trim(),
        topics: selectedTopics,
      });
      setContent('');
      setSelectedTopics([]);
      setShowTopics(false);
      if (onPostCreated) onPostCreated(newPost);
    } finally {
      setLoading(false);
    }
  };

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="create-post card">
      <div className="cp-inner">
        <UserAvatar user={user} size="md" />
        <form className="cp-form" onSubmit={handleSubmit}>
          <textarea
            className="cp-textarea"
            placeholder={`What's on your mind, ${user?.fullName?.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={content.length > 80 ? 4 : 2}
            aria-label="Create a post"
            maxLength={MAX_CHARS + 50}
          />

          {/* Topics */}
          {showTopics && (
            <div className="cp-topics">
              <div className="cp-topics-label">Select up to 3 topics:</div>
              <div className="cp-topics-grid">
                {TOPIC_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`cp-topic-btn ${selectedTopics.includes(t) ? 'cp-topic-btn--selected' : ''}`}
                    onClick={() => toggleTopic(t)}
                  >
                    {t}
                    {selectedTopics.includes(t) && <X size={11} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="cp-footer">
            <div className="cp-tools">
              <button type="button" className="cp-tool-btn" title="Add image (coming soon)" disabled>
                <Image size={17} />
              </button>
              <button
                type="button"
                className={`cp-tool-btn ${showTopics ? 'cp-tool-btn--active' : ''}`}
                title="Add topics"
                onClick={() => setShowTopics((v) => !v)}
              >
                <Tag size={17} />
                {selectedTopics.length > 0 && <span className="cp-topic-count">{selectedTopics.length}</span>}
              </button>
            </div>
            <div className="cp-footer-right">
              <span className={`cp-char-count ${remaining < 50 ? (isOverLimit ? 'over' : 'warn') : ''}`}>
                {remaining}
              </span>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!content.trim() || isOverLimit || loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : <><Send size={13} /> Post</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
