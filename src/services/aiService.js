// ================================================
// TrustSocial – AI Service (Placeholder)
// Future: Python FastAPI service
// Endpoints:
//   POST /ai/recommend       { userId } -> recommended posts
//   POST /ai/explain         { postId, userId } -> explanation
//   POST /ai/moderation      { content } -> { safe, reason }
//   GET  /ai/diversity       { userId } -> feed diversity stats
// ================================================

/**
 * Get recommendation explanation for a post
 * Future: POST http://localhost:8000/ai/explain
 */
export async function getRecommendationExplanation(postId, userId) {
  await new Promise((r) => setTimeout(r, 300));
  // Mock explanation – real version will use ML model output
  return {
    postId,
    score: Math.floor(70 + Math.random() * 25),
    reasons: [
      'You follow this topic',
      'You liked similar content recently',
      'This matches your stated interests',
      'Trending in your network',
    ],
  };
}

/**
 * Check content for potential toxicity
 * Future: POST http://localhost:8000/ai/moderation
 */
export async function checkModeration(content) {
  await new Promise((r) => setTimeout(r, 200));
  const flaggedWords = ['hate', 'stupid', 'idiot', 'terrible', 'awful', 'dumb'];
  const lower = content.toLowerCase();
  const flagged = flaggedWords.filter((w) => lower.includes(w));
  return {
    safe: flagged.length === 0,
    confidence: flagged.length === 0 ? 0.97 : 0.84,
    reason:
      flagged.length > 0
        ? 'This comment may contain potentially offensive language.'
        : null,
  };
}

/**
 * Get feed diversity analysis
 * Future: GET http://localhost:8000/ai/diversity
 */
export async function analyzeFeedDiversity(userId) {
  await new Promise((r) => setTimeout(r, 400));
  return {
    healthScore: 78,
    dominantCategory: 'Technology',
    recommendation: 'Consider diversifying your feed by exploring Art and Sports content.',
  };
}

/**
 * Get personalized recommendations
 * Future: POST http://localhost:8000/ai/recommend
 */
export async function getRecommendations(userId, preferences) {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, message: 'Recommendations updated based on preferences.' };
}
