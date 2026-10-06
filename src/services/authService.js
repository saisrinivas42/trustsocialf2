// ================================================
// TrustSocial – Auth Service
// Uses mock data now; replace with Spring Boot API later
// Future endpoint: POST /api/auth/login, POST /api/auth/register
// ================================================

import { MOCK_USERS, DEMO_CREDENTIALS } from '../data/mockData';
import { generateId } from '../utils/helpers';

const USER_KEY = 'trustsocial_user';
const TOKEN_KEY = 'trustsocial_token';

/**
 * Mock login
 * Future: POST /api/auth/login  { email, password } -> { token, user }
 */
export async function login(email, password) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800));

  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password. Try alex@example.com / demo1234');
  }

  const { password: _pw, ...safeUser } = user;
  const mockToken = `mock_jwt_${generateId()}`;

  localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
  localStorage.setItem(TOKEN_KEY, mockToken);

  return { user: safeUser, token: mockToken };
}

/**
 * Mock register
 * Future: POST /api/auth/register  { fullName, username, email, password }
 */
export async function register(fullName, username, email, password) {
  await new Promise((r) => setTimeout(r, 1000));

  const exists = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase()
  );

  if (exists) {
    throw new Error('An account with this email or username already exists.');
  }

  const newUser = {
    id: Date.now(),
    fullName,
    username,
    email,
    avatar: null,
    avatarColor: '#4F6EF7',
    bio: '',
    location: '',
    website: '',
    posts: 0,
    followers: 0,
    following: 0,
    verified: false,
    joinedDate: new Date().toISOString().split('T')[0],
    interests: [],
  };

  const mockToken = `mock_jwt_${generateId()}`;
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  localStorage.setItem(TOKEN_KEY, mockToken);

  return { user: newUser, token: mockToken };
}

/**
 * Logout
 * Future: POST /api/auth/logout
 */
export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY) && !!getCurrentUser();
}
