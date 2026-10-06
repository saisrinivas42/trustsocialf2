# TrustSocial

> **Your feed. Your choices. Your control.**

An explainable, user-controlled social media platform built as a final-year project, focused on responsible AI, transparency, user control, privacy, and recommendation explainability.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Styling | Plain CSS with CSS Variables |

---

## ✨ Key Features

- **Transparent Recommendations** — Every recommended post shows a "Why am I seeing this?" explainer with a match score and plain-language reasons
- **Recommendation Controls** — Users can instantly say More / Less / Not Interested / Block Topic on any post
- **Feed Diversity Dashboard** — Visual breakdown of feed topic distribution with a one-click diversify button
- **Preferences Page** — Per-topic interest sliders and algorithm toggle controls
- **Privacy Center** — Full control over personalization, tracking, AI profile reset, and data download
- **Responsible Content Warning** — Mock toxicity detection on comments with Rewrite / Edit / Post Anyway flow

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── MobileNavigation.jsx
│   ├── PostCard.jsx
│   ├── CreatePost.jsx
│   ├── CommentSection.jsx
│   ├── RecommendationReason.jsx
│   ├── RecommendationControls.jsx
│   ├── FeedDiversity.jsx
│   ├── RightPanel.jsx
│   ├── UserAvatar.jsx
│   ├── Modal.jsx
│   ├── Toast.jsx
│   ├── LoadingSpinner.jsx
│   └── ResponsibleContentWarning.jsx
├── pages/            # Route-level pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx
│   ├── Explore.jsx
│   ├── CreatePostPage.jsx
│   ├── Profile.jsx
│   ├── Notifications.jsx
│   ├── Preferences.jsx
│   ├── PrivacyCenter.jsx
│   └── NotFound.jsx
├── services/         # API service layer (mock → Spring Boot ready)
│   ├── api.js        # Axios instance + interceptors
│   ├── authService.js
│   ├── postService.js
│   ├── feedService.js
│   ├── userService.js
│   ├── preferenceService.js
│   └── aiService.js
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useAuth.js
├── data/
│   └── mockData.js
├── utils/
│   └── helpers.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

App runs at **http://localhost:5173**

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Email | `alex@example.com` |
| Password | `demo1234` |

---

## 🔌 Future Backend Integration

The frontend is pre-wired for a **Java Spring Boot** REST API:

- Base URL configured via `VITE_API_BASE_URL` in `.env`
- Axios instance with JWT Bearer token injection (`src/services/api.js`)
- All service files have comments marking future endpoints
- Auth flow ready for Spring Security + JWT replacement

**Planned endpoints:**
```
POST /api/auth/login
POST /api/auth/register
GET  /api/feed
POST /api/posts
GET  /api/posts/:id/comments
PUT  /api/preferences
GET  /api/privacy
```

## 🤖 Future AI Service Integration

A **Python FastAPI** service will handle:
```
POST /ai/recommend
POST /ai/explain
POST /ai/moderation
GET  /ai/diversity
```

Placeholder functions are in `src/services/aiService.js`.

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| 1440px+ | Three-column (sidebar + feed + right panel) |
| 1024–1200px | Two-column (sidebar + feed) |
| 768–900px | Single column + bottom nav |
| < 480px | Mobile optimised |

---

*Built with React + Vite · Final Year Project · TrustSocial*
