import { useState, useEffect } from 'react';
import { MapPin, Link as LinkIcon, Calendar, Edit2, CheckCircle } from 'lucide-react';
import PostCard from '../components/PostCard';
import UserAvatar from '../components/UserAvatar';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import { getUserPosts } from '../services/userService';
import { updateProfile } from '../services/userService';
import { formatCount } from '../utils/helpers';
import { useToast } from '../components/Toast';
import { ToastContainer } from '../components/Toast';
import './Profile.css';

const TABS = ['Posts', 'Saved', 'Activity'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', bio: '', location: '', website: '' });
  const [saving, setSaving] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (user) {
      setEditForm({ fullName: user.fullName || '', bio: user.bio || '', location: user.location || '', website: user.website || '' });
      getUserPosts(user.id).then((p) => { setPosts(p); setLoading(false); });
    }
  }, [user]);

  const savedPosts = posts.filter((p) => p.saved);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, editForm);
      updateUser(updated);
      setEditOpen(false);
      addToast('Profile updated successfully!', 'success');
    } finally {
      setSaving(false);
    }
  };

  const displayedPosts = activeTab === 'Posts' ? posts : activeTab === 'Saved' ? savedPosts : [];

  return (
    <div className="profile-page">
      {/* Cover + avatar */}
      <div className="profile-cover card">
        <div className="profile-cover-bg" />
        <div className="profile-cover-content">
          <div className="profile-avatar-wrap">
            <UserAvatar user={user} size="2xl" />
            {user?.verified && <CheckCircle size={20} className="profile-verified" />}
          </div>
          <button className="btn btn-outline btn-sm profile-edit-btn" onClick={() => setEditOpen(true)}>
            <Edit2 size={13} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="card profile-info">
        <div className="profile-names">
          <h1 className="profile-fullname">{user?.fullName}</h1>
          <span className="profile-handle">@{user?.username}</span>
        </div>
        {user?.bio && <p className="profile-bio">{user.bio}</p>}
        <div className="profile-meta">
          {user?.location && <span className="profile-meta-item"><MapPin size={13} />{user.location}</span>}
          {user?.website && <span className="profile-meta-item"><LinkIcon size={13} />{user.website}</span>}
          {user?.joinedDate && <span className="profile-meta-item"><Calendar size={13} />Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>}
        </div>
        <div className="profile-stats">
          <div className="profile-stat"><span className="stat-value">{formatCount(user?.posts || posts.length)}</span><span className="stat-label">Posts</span></div>
          <div className="profile-stat"><span className="stat-value">{formatCount(user?.followers || 0)}</span><span className="stat-label">Followers</span></div>
          <div className="profile-stat"><span className="stat-value">{formatCount(user?.following || 0)}</span><span className="stat-label">Following</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {TABS.map((t) => (
          <button key={t} className={`profile-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : activeTab === 'Activity' ? (
        <div className="card profile-activity">
          <p className="activity-note">Activity history will be available soon.</p>
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Edit2 size={22} /></div>
          <h3>{activeTab === 'Saved' ? 'No saved posts' : 'No posts yet'}</h3>
          <p>{activeTab === 'Saved' ? 'Posts you save will appear here.' : 'Share something with the world!'}</p>
        </div>
      ) : (
        <div className="feed-list">
          {displayedPosts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}

      {/* Edit modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div className="edit-profile-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-input edit-bio" rows={3} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Tell people about yourself" />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="City, Country" />
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <input className="form-input" value={editForm.website} onChange={(e) => setEditForm({ ...editForm, website: e.target.value })} placeholder="yoursite.com" />
          </div>
          <div className="edit-profile-footer">
            <button className="btn btn-ghost" onClick={() => setEditOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
              {saving ? <LoadingSpinner size="sm" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
