import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-icon"><AlertCircle size={48} /></div>
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page not found</h2>
        <p className="notfound-desc">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/home" className="btn btn-primary btn-lg">
          <Home size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
