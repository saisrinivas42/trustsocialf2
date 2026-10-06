import { getInitials } from '../utils/helpers';
import './UserAvatar.css';

export default function UserAvatar({ user, size = 'md', className = '' }) {
  const sizeMap = { xs: 28, sm: 32, md: 40, lg: 48, xl: 64, '2xl': 80 };
  const px = sizeMap[size] || sizeMap.md;

  const initials = getInitials(user?.fullName || user?.username || '?');
  const color = user?.avatarColor || '#4F6EF7';

  return (
    <div
      className={`user-avatar user-avatar--${size} ${className}`}
      style={{
        width: px,
        height: px,
        minWidth: px,
        backgroundColor: color,
        fontSize: px * 0.38,
      }}
      aria-label={`${user?.fullName || user?.username}'s avatar`}
      role="img"
    >
      {user?.avatar ? (
        <img src={user.avatar} alt={user.fullName || user.username} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
