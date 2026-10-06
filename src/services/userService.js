// ================================================
// TrustSocial – User Service
// Future endpoints:
//   GET    /api/users/:id
//   PUT    /api/users/:id
//   GET    /api/users/:id/posts
//   POST   /api/users/:id/follow
//   DELETE /api/users/:id/follow
//   GET    /api/users/suggestions
// ================================================

import { MOCK_USERS, SUGGESTED_USERS } from '../data/mockData';
import { MOCK_POSTS } from '../data/mockData';

export async function getUserById(userId) {
  await new Promise((r) => setTimeout(r, 300));
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');
  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

export async function getUserByUsername(username) {
  await new Promise((r) => setTimeout(r, 300));
  const user = MOCK_USERS.find((u) => u.username === username);
  if (!user) throw new Error('User not found');
  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

export async function updateProfile(userId, updates) {
  await new Promise((r) => setTimeout(r, 500));
  const stored = localStorage.getItem('trustsocial_user');
  if (stored) {
    const user = JSON.parse(stored);
    const updated = { ...user, ...updates };
    localStorage.setItem('trustsocial_user', JSON.stringify(updated));
    return updated;
  }
  throw new Error('User not found');
}

export async function getUserPosts(userId) {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_POSTS.filter((p) => p.userId === userId);
}

export async function getSuggestedUsers() {
  await new Promise((r) => setTimeout(r, 300));
  return [...SUGGESTED_USERS];
}

export async function followUser(userId) {
  await new Promise((r) => setTimeout(r, 300));
  return { success: true, following: true };
}

export async function unfollowUser(userId) {
  await new Promise((r) => setTimeout(r, 300));
  return { success: true, following: false };
}
