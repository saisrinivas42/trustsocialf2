import { AlertTriangle, RefreshCw, Edit, Send } from 'lucide-react';
import './ResponsibleContentWarning.css';

export default function ResponsibleContentWarning({ reason, onRewrite, onEdit, onPostAnyway }) {
  return (
    <div className="rcw" role="alert">
      <div className="rcw-header">
        <AlertTriangle size={16} className="rcw-icon" />
        <span className="rcw-title">Potentially sensitive content</span>
      </div>
      <p className="rcw-reason">{reason}</p>
      <div className="rcw-actions">
        <button className="btn btn-secondary btn-sm" onClick={onRewrite}>
          <RefreshCw size={13} /> Rewrite
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onEdit}>
          <Edit size={13} /> Edit
        </button>
        <button className="btn btn-ghost btn-sm rcw-anyway-btn" onClick={onPostAnyway}>
          <Send size={13} /> Post Anyway
        </button>
      </div>
    </div>
  );
}
