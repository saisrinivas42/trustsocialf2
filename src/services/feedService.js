// ================================================
// TrustSocial – Feed Service
// Future endpoints:
//   GET  /api/feed           (personalized feed)
//   GET  /api/feed/following (following feed)
//   POST /api/feed/feedback  { postId, action }
// ================================================

import { MOCK_POSTS, MOCK_FEED_DIVERSITY } from '../data/mockData';

let feedDiversity = { ...MOCK_FEED_DIVERSITY };

export async function getPersonalizedFeed() {
  await new Promise((r) => setTimeout(r, 500));
  return [...MOCK_POSTS];
}

export async function getFollowingFeed() {
  await new Promise((r) => setTimeout(r, 500));
  // Return only posts from followed users (mock: first 3)
  return MOCK_POSTS.slice(0, 3);
}

export async function getFeedDiversity() {
  await new Promise((r) => setTimeout(r, 300));
  return { ...feedDiversity };
}

export async function diversifyFeed() {
  await new Promise((r) => setTimeout(r, 600));
  // Simulate feed diversification
  feedDiversity = {
    categories: [
      { name: 'Technology', percentage: 40, color: '#4F6EF7' },
      { name: 'Entertainment', percentage: 25, color: '#EC4899' },
      { name: 'Sports', percentage: 15, color: '#10B981' },
      { name: 'Art', percentage: 12, color: '#F59E0B' },
      { name: 'Other', percentage: 8, color: '#8B5CF6' },
    ],
    healthScore: 91,
    warning: null,
  };
  return { ...feedDiversity };
}

/**
 * Submit recommendation feedback
 * Future: POST /api/feed/feedback  { postId, action: 'more' | 'less' | 'not_interested' | 'block_topic' }
 */
export async function submitFeedback(postId, action) {
  await new Promise((r) => setTimeout(r, 400));
  return { success: true, postId, action };
}
