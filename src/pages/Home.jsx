import { useState, useEffect } from 'react';
import { Sparkles, Users, RefreshCw } from 'lucide-react';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPersonalizedFeed, getFollowingFeed, submitFeedback } from '../services/feedService';
import { useToast } from '../components/Toast';
import { ToastContainer } from '../components/Toast';
import './Home.css';

const TABS = [
  { id: 'foryou', label: 'For You', icon: Sparkles },
  { id: 'following', label: 'Following', icon: Users },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('foryou');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const loadFeed = async (tab) => {
    setLoading(true);
    try {
      const data = tab === 'foryou' ? await getPersonalizedFeed() : await getFollowingFeed();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFeed(activeTab); }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeed(activeTab);
    setRefreshing(false);
    addToast('Feed refreshed', 'success', 2000);
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    addToast('Your post has been shared!', 'success');
  };

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    addToast('Post deleted.', 'info');
  };

  const handleFeedback = async (postId, action) => {
    await submitFeedback(postId, action);
    const messages = {
      more: '✓ We\'ll show you more content like this.',
      less: '✓ We\'ll show less of this type.',
      not_interested: '✓ Recommendation preference updated.',
      block_topic: '✓ Topic blocked from your feed.',
    };
    addToast(messages[action] || 'Preference updated.', 'success');
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">For You</h1>
        <button className="home-refresh-btn" onClick={handleRefresh} aria-label="Refresh feed" disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="feed-tabs" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            className={`feed-tab ${activeTab === id ? 'feed-tab--active' : ''}`}
            onClick={() => handleTabChange(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Create post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Feed */}
      {loading ? (
        <div className="home-loading">
          <LoadingSpinner size="lg" label="Loading your feed…" />
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Sparkles size={24} /></div>
          <h3>Your feed is empty</h3>
          <p>Follow people and topics to see posts here.</p>
        </div>
      ) : (
        <div className="feed-list" role="feed" aria-label="Posts feed">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onFeedback={handleFeedback}
            />
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
