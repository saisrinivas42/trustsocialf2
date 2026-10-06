// ================================================
// TrustSocial – Helper Utilities
// ================================================

/**
 * Format a timestamp to a relative "time ago" string
 */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format large numbers (e.g. 1200 -> 1.2K)
 */
export function formatCount(num) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

/**
 * Get initials from a full name
 */
export function getInitials(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
  ];
  const allMet = requirements.every((r) => r.met);
  return { requirements, allMet };
}

/**
 * Truncate text to a given length
 */
export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Debounce a function
 */
export function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a random ID
 */
export function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Check if content might be potentially sensitive (mock version)
 * In production this would call the Python AI service
 */
export function checkContentSafety(text) {
  const flaggedWords = ['hate', 'stupid', 'idiot', 'terrible', 'awful'];
  const lower = text.toLowerCase();
  const hasFlagged = flaggedWords.some((w) => lower.includes(w));
  return {
    safe: !hasFlagged,
    reason: hasFlagged ? 'This comment may contain potentially offensive language.' : null,
  };
}

/**
 * Sort posts by timestamp (newest first)
 */
export function sortByNewest(posts) {
  return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Filter posts by topic
 */
export function filterByTopic(posts, topic) {
  if (!topic) return posts;
  return posts.filter((p) => p.topics && p.topics.includes(topic));
}

/**
 * Search posts/users by query
 */
export function searchContent(posts, users, query) {
  if (!query || query.trim().length < 2) return { posts: [], users: [], topics: [] };
  const q = query.toLowerCase().trim();
  const matchedPosts = posts.filter(
    (p) =>
      p.content.toLowerCase().includes(q) ||
      p.author.fullName.toLowerCase().includes(q) ||
      p.topics.some((t) => t.toLowerCase().includes(q))
  );
  const matchedUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.bio && u.bio.toLowerCase().includes(q))
  );
  const topicKeywords = ['ai', 'technology', 'programming', 'sports', 'gaming', 'education', 'science', 'art', 'lifestyle'];
  const matchedTopics = topicKeywords.filter((t) => t.includes(q));
  return { posts: matchedPosts.slice(0, 5), users: matchedUsers.slice(0, 4), topics: matchedTopics.slice(0, 3) };
}
