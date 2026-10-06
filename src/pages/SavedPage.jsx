import { Bookmark } from 'lucide-react';
import PostCard from '../components/PostCard';
import { MOCK_POSTS } from '../data/mockData';

export default function SavedPage() {
  const saved = MOCK_POSTS.filter((p) => p.saved);
  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>Saved Posts</h1>
      {saved.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Bookmark size={24} /></div>
          <h3>No saved posts</h3>
          <p>Posts you save will appear here for easy access.</p>
        </div>
      ) : (
        saved.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
