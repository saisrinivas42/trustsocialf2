import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Search, PlusSquare, Bell, Bookmark, Settings, Shield, LogOut, User
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from './UserAvatar';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/create', icon: PlusSquare, label: 'Create' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/saved', icon: Bookmark, label: 'Saved' },
];

const BOTTOM_ITEMS = [
  { path: '/preferences', icon: Settings, label: 'Preferences' },
  { path: '/privacy', icon: Shield, label: 'Privacy Center' },
];

export default function Sidebar({ notificationCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item--active' : ''}`}
          >
            <div className="sidebar-item-icon">
              <Icon size={20} />
              {label === 'Notifications' && notificationCount > 0 && (
                <span className="sidebar-notif-dot">{notificationCount > 9 ? '9+' : notificationCount}</span>
              )}
            </div>
            <span className="sidebar-item-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        {BOTTOM_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-item sidebar-item--sm ${isActive ? 'sidebar-item--active' : ''}`}
          >
            <div className="sidebar-item-icon"><Icon size={18} /></div>
            <span className="sidebar-item-label">{label}</span>
          </NavLink>
        ))}
        <button className="sidebar-item sidebar-item--sm sidebar-item--logout" onClick={handleLogout}>
          <div className="sidebar-item-icon"><LogOut size={18} /></div>
          <span className="sidebar-item-label">Log Out</span>
        </button>

        <div className="sidebar-divider" />
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-profile ${isActive ? 'sidebar-profile--active' : ''}`}
        >
          <UserAvatar user={user} size="sm" />
          <div className="sidebar-profile-info">
            <span className="sidebar-profile-name">{user?.fullName}</span>
            <span className="sidebar-profile-handle">@{user?.username}</span>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
