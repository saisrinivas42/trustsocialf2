import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNavigation from './components/MobileNavigation';
import RightPanel from './components/RightPanel';
import LoadingSpinner from './components/LoadingSpinner';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Explore from './pages/Explore';
import CreatePostPage from './pages/CreatePostPage';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Preferences from './pages/Preferences';
import PrivacyCenter from './pages/PrivacyCenter';
import SavedPage from './pages/SavedPage';
import NotFound from './pages/NotFound';

import { MOCK_NOTIFICATIONS } from './data/mockData';

const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />;
}

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage label="Loading TrustSocial…" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Navbar notificationCount={unreadCount} />
      <div className="app-body">
        <div className="app-sidebar">
          <Sidebar notificationCount={unreadCount} />
        </div>
        <main className="app-main">
          <Outlet />
        </main>
        <div className="app-right-panel">
          <RightPanel />
        </div>
      </div>
      <MobileNavigation notificationCount={unreadCount} />
    </div>
  );
}

function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage label="Loading…" />;
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/privacy" element={<PrivacyCenter />} />
        <Route path="/saved" element={<SavedPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
