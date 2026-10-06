import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, Bell, User } from 'lucide-react';
import './MobileNavigation.css';

const NAV_ITEMS = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/create', icon: PlusSquare, label: 'Create' },
  { path: '/notifications', icon: Bell, label: 'Alerts' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNavigation({ notificationCount = 0 }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`}
          aria-label={label}
        >
          <div className="mobile-nav-icon-wrap">
            <Icon size={22} />
            {label === 'Alerts' && notificationCount > 0 && (
              <span className="mobile-notif-dot">{notificationCount > 9 ? '9+' : notificationCount}</span>
            )}
          </div>
          <span className="mobile-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
