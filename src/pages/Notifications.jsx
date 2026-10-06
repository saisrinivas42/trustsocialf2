import { useState } from 'react';
import { Heart, MessageCircle, UserPlus, AtSign, Bell, CheckCheck } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { timeAgo } from '../utils/helpers';
import './Notifications.css';

const ICON_MAP = {
  like: { icon: Heart, color: '#EF4444', bg: '#FEF2F2' },
  comment: { icon: MessageCircle, color: '#4F6EF7', bg: '#EEF1FE' },
  follow: { icon: UserPlus, color: '#22C55E', bg: '#F0FDF4' },
  mention: { icon: AtSign, color: '#F59E0B', bg: '#FFFBEB' },
  system: { icon: Bell, color: '#8B5CF6', bg: '#F5F3FF' },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="notif-page">
      <div className="notif-header">
        <div>
          <h1 className="notif-title">Notifications</h1>
          {unreadCount > 0 && <span className="notif-unread-count">{unreadCount} unread</span>}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Bell size={24} /></div>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div className="notif-list card">
          {notifs.map((n) => {
            const config = ICON_MAP[n.type] || ICON_MAP.system;
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                onClick={() => markRead(n.id)}
              >
                <div className="notif-icon-wrap" style={{ background: config.bg }}>
                  <Icon size={15} style={{ color: config.color }} />
                </div>
                <div className="notif-content">
                  <div className="notif-row">
                    {n.actor && <UserAvatar user={n.actor} size="sm" />}
                    <div className="notif-text">
                      {n.actor && <span className="notif-actor">{n.actor.fullName} </span>}
                      <span className="notif-message">{n.message}</span>
                    </div>
                  </div>
                  <span className="notif-time">{timeAgo(n.timestamp)}</span>
                </div>
                {!n.read && <div className="notif-dot" aria-label="Unread" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
