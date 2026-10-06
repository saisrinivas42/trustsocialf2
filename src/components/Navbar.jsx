import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, Settings, Shield, LogOut, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from './UserAvatar';
import { searchContent } from '../utils/helpers';
import { MOCK_POSTS, MOCK_USERS } from '../data/mockData';
import './Navbar.css';

export default function Navbar({ notificationCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
        setSearchResults(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.length >= 2) {
      const results = searchContent(MOCK_POSTS, MOCK_USERS, q);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/home" className="navbar-logo" aria-label="TrustSocial home">
          <div className="logo-icon">T</div>
          <span className="logo-text">TrustSocial</span>
        </Link>

        {/* Search */}
        <div className="navbar-search" ref={searchRef}>
          <div className={`search-input-wrapper ${searchFocused ? 'focused' : ''}`}>
            <Search size={15} className="search-icon" />
            <input
              type="search"
              placeholder="Search posts, people, topics…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="search-input"
              aria-label="Search"
              autoComplete="off"
            />
            {searchQuery && (
              <button className="search-clear" onClick={clearSearch} aria-label="Clear search">
                <X size={13} />
              </button>
            )}
          </div>
          {searchFocused && searchResults && (
            <div className="search-dropdown">
              {searchResults.users.length > 0 && (
                <div className="search-section">
                  <div className="search-section-label">People</div>
                  {searchResults.users.map((u) => (
                    <button
                      key={u.id}
                      className="search-result"
                      onClick={() => { navigate('/profile'); setSearchFocused(false); clearSearch(); }}
                    >
                      <UserAvatar user={u} size="sm" />
                      <div>
                        <div className="search-result-name">{u.fullName}</div>
                        <div className="search-result-sub">@{u.username}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.posts.length > 0 && (
                <div className="search-section">
                  <div className="search-section-label">Posts</div>
                  {searchResults.posts.map((p) => (
                    <button
                      key={p.id}
                      className="search-result"
                      onClick={() => { navigate('/home'); setSearchFocused(false); clearSearch(); }}
                    >
                      <div className="search-result-post-icon"><Search size={14} /></div>
                      <div className="search-result-name search-result-post">{p.content.slice(0, 60)}…</div>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.topics.length > 0 && (
                <div className="search-section">
                  <div className="search-section-label">Topics</div>
                  {searchResults.topics.map((t) => (
                    <button
                      key={t}
                      className="search-result"
                      onClick={() => { navigate('/explore'); setSearchFocused(false); clearSearch(); }}
                    >
                      <div className="search-result-post-icon">#</div>
                      <div className="search-result-name">{t}</div>
                    </button>
                  ))}
                </div>
              )}
              {!searchResults.users.length && !searchResults.posts.length && !searchResults.topics.length && (
                <div className="search-empty">No results for "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          <Link to="/notifications" className="navbar-notif-btn" aria-label={`Notifications (${notificationCount} unread)`}>
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="notif-badge">{notificationCount > 9 ? '9+' : notificationCount}</span>
            )}
          </Link>

          {/* Profile menu */}
          <div className="profile-menu-wrapper" ref={menuRef}>
            <button
              className="profile-menu-trigger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="Profile menu"
            >
              <UserAvatar user={user} size="sm" />
              <span className="profile-name">{user?.fullName?.split(' ')[0]}</span>
              <ChevronDown size={14} className={`chevron ${menuOpen ? 'open' : ''}`} />
            </button>
            {menuOpen && (
              <div className="profile-dropdown" role="menu">
                <div className="profile-dropdown-header">
                  <UserAvatar user={user} size="md" />
                  <div>
                    <div className="dropdown-user-name">{user?.fullName}</div>
                    <div className="dropdown-user-handle">@{user?.username}</div>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)} role="menuitem">
                  <User size={15} /> Profile
                </Link>
                <Link to="/preferences" className="dropdown-item" onClick={() => setMenuOpen(false)} role="menuitem">
                  <Settings size={15} /> Preferences
                </Link>
                <Link to="/privacy" className="dropdown-item" onClick={() => setMenuOpen(false)} role="menuitem">
                  <Shield size={15} /> Privacy Center
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item dropdown-item--danger" onClick={handleLogout} role="menuitem">
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
