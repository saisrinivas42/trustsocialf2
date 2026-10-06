// ================================================
// TrustSocial – Post Service
// Future endpoints:
//   GET    /api/posts
//   POST   /api/posts
//   DELETE /api/posts/:id
//   POST   /api/posts/:id/like
//   POST   /api/posts/:id/save
//   GET    /api/posts/:id/comments
//   POST   /api/posts/:id/comments
// ================================================

import { MOCK_POSTS, MOCK_COMMENTS } from '../data/mockData';
import { generateId } from '../utils/helpers';

// In-memory store (replaces backend during demo)
let posts = [...MOCK_POSTS];
let comments = { ...MOCK_COMMENTS };

export async function getPosts() {
  await new Promise((r) => setTimeout(r, 400));
  return [...posts];
}

export async function createPost(postData) {
  await new Promise((r) => setTimeout(r, 600));
  const newPost = {
    id: Date.now(),
    userId: postData.userId,
    author: postData.author,
    content: postData.content,
    image: postData.image || null,
    topics: postData.topics || [],
    likes: 0,
    comments: 0,
    shares: 0,
    saved: false,
    liked: false,
    timestamp: new Date().toISOString(),
    recommended: false,
    recommendationScore: 0,
    recommendationReasons: [],
  };
  posts = [newPost, ...posts];
  return newPost;
}

export async function likePost(postId) {
  await new Promise((r) => setTimeout(r, 200));
  posts = posts.map((p) => {
    if (p.id === postId) {
      return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
    }
    return p;
  });
  return posts.find((p) => p.id === postId);
}

export async function savePost(postId) {
  await new Promise((r) => setTimeout(r, 200));
  posts = posts.map((p) => {
    if (p.id === postId) {
      return { ...p, saved: !p.saved };
    }
    return p;
  });
  return posts.find((p) => p.id === postId);
}

export async function deletePost(postId) {
  await new Promise((r) => setTimeout(r, 300));
  posts = posts.filter((p) => p.id !== postId);
  return true;
}

export async function getComments(postId) {
  await new Promise((r) => setTimeout(r, 300));
  return comments[postId] || [];
}

export async function addComment(postId, content, author) {
  await new Promise((r) => setTimeout(r, 400));
  const newComment = {
    id: Date.now(),
    postId,
    author,
    content,
    likes: 0,
    liked: false,
    timestamp: new Date().toISOString(),
    flagged: false,
  };
  if (!comments[postId]) comments[postId] = [];
  comments[postId] = [newComment, ...comments[postId]];
  posts = posts.map((p) => p.id === postId ? { ...p, comments: p.comments + 1 } : p);
  return newComment;
}

export async function likeComment(postId, commentId) {
  await new Promise((r) => setTimeout(r, 150));
  if (comments[postId]) {
    comments[postId] = comments[postId].map((c) => {
      if (c.id === commentId) {
        return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 };
      }
      return c;
    });
  }
  return true;
}
