import { useState } from 'react';
import { Search, TrendingUp, Users, Hash } from 'lucide-react';
import PostCard from '../components/PostCard';
import UserAvatar from '../components/UserAvatar';
import { MOCK_POSTS, MOCK_TRENDING_TOPICS, SUGGESTED_USERS } from '../data/mockData';
import { searchContent } from '../utils/helpers';
import { useToast } from '../components/Toast';
import { ToastContainer } from '../components/Toast';
import './Explore.css';

export default function Explore() {
  const [query, setQuery] = useState('');
  const [following, setFollowing] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const results = query.length >= 2 ? searchContent(MOCK_POSTS, [], query) : null;
  const filteredPosts = results ? results.posts : MOCK_POSTS.filter((p) => p.recommended);

  const toggleFollow = (userId, name) => {
    setFollowing((prev) => {
      const next = { ...prev, [userId]: !prev[userId] };
      addToast(next[userId] ? `You are now following ${name}` : `Unfollowed ${name}`, 'success');
      return next;
    });
  };

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1 className="explore-title">Explore</h1>
        <div className="explore-search-wrapper">
          <Search size={16} className="explore-search-icon" />
          <input
            type="search"
            className="explore-search"
            placeholder="Search posts, people, topics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Explore search"
          />
        </div>
      </div>

      <div className="explore-grid">
        {/* Left: posts */}
        <div className="explore-feed">
          <div className="explore-section-title">
            {query ? `Results for "${query}"` : 'Recommended Posts'}
          </div>
          {filteredPosts.length === 0 ? (
            <div className="explore-empty">No posts found for this search.</div>
          ) : (
            filteredPosts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>

        {/* Right: trending + users */}
        <div className="explore-sidebar">
          {/* Trending topics */}
          <div className="card explore-card">
            <div className="explore-card-title">
              <TrendingUp size={15} /> Trending Topics
            </div>
            <ul className="trending-list">
              {MOCK_TRENDING_TOPICS.map((t, i) => (
                <li key={t.id} className="trending-item">
                  <div className="trending-rank">{i + 1}</div>
                  <div className="trending-info">
                    <div className="trending-name">
                      <Hash size={12} />{t.name}
                    </div>
                    <div className="trending-count">
                      {t.posts.toLocaleString()} posts
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested users */}
          <div className="card explore-card">
            <div className="explore-card-title">
              <Users size={15} /> People to Follow
            </div>
            <ul className="suggested-list">
              {SUGGESTED_USERS.map((u) => (
                <li key={u.id} className="suggested-item">
                  <UserAvatar user={u} size="md" />
                  <div className="suggested-info">
                    <div className="suggested-name">{u.fullName}</div>
                    <div className="suggested-handle">@{u.username}</div>
                    <div className="suggested-bio">{u.bio}</div>
                  </div>
                  <button
                    className={`btn btn-sm ${following[u.id] ? 'btn-ghost' : 'btn-primary'}`}
                    onClick={() => toggleFollow(u.id, u.fullName)}
                  >
                    {following[u.id] ? 'Following' : 'Follow'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
