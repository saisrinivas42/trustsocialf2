import { useState } from 'react';
import { Shield, ToggleLeft, ToggleRight, Trash2, RefreshCw, Download, AlertTriangle, Lock } from 'lucide-react';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { MOCK_PRIVACY } from '../data/mockData';
import { useToast } from '../components/Toast';
import { ToastContainer } from '../components/Toast';
import './PrivacyCenter.css';

const PRIVACY_SETTINGS = [
  { key: 'personalization', label: 'Personalization', desc: 'Allow TrustSocial to personalize your feed based on your interests and activity.' },
  { key: 'activityTracking', label: 'Activity Tracking', desc: 'Track your likes, comments, and views to improve recommendations.' },
  { key: 'locationBased', label: 'Location-Based Recommendations', desc: 'Use your location to suggest local content and trending topics nearby.' },
  { key: 'recommendationHistory', label: 'Recommendation History', desc: 'Keep a history of your recommendation feedback to improve future suggestions.' },
];

const ACTIONS = [
  { id: 'clearHistory', label: 'Clear Recommendation History', icon: Trash2, danger: false,
    desc: 'Remove your recommendation feedback history. This won\'t affect your interests.',
    confirm: 'Clear your recommendation history? This action cannot be undone.' },
  { id: 'resetAI', label: 'Reset AI Profile', icon: RefreshCw, danger: true,
    desc: 'Remove all AI-generated preferences and start fresh. Your posts and follows are unaffected.',
    confirm: 'Resetting your AI profile will remove all current recommendation preferences. Your feed will become generic until it re-learns your interests.' },
  { id: 'downloadData', label: 'Download My Data', icon: Download, danger: false,
    desc: 'Get a copy of all your TrustSocial data including posts, preferences, and activity.',
    confirm: null },
  { id: 'deleteAccount', label: 'Delete Account', icon: Trash2, danger: true,
    desc: 'Permanently delete your account and all associated data. This cannot be undone.',
    confirm: 'Permanently delete your account and ALL data? This action is irreversible and cannot be undone.' },
];

export default function PrivacyCenter() {
  const [settings, setSettings] = useState({ ...MOCK_PRIVACY });
  const [confirmModal, setConfirmModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    addToast('Privacy setting updated.', 'success');
  };

  const handleAction = (action) => {
    if (action.confirm) {
      setConfirmModal(action);
    } else {
      executeAction(action.id);
    }
  };

  const executeAction = async (id) => {
    setConfirmModal(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    const messages = {
      clearHistory: 'Recommendation history cleared.',
      resetAI: 'AI profile has been reset. Your feed will re-personalise over time.',
      downloadData: 'Your data export has been prepared. (Mock — no download in demo)',
      deleteAccount: 'Account deletion requested. (Mock — no deletion in demo)',
    };
    addToast(messages[id] || 'Action completed.', id === 'deleteAccount' ? 'warning' : 'success');
  };

  return (
    <div className="privacy-page">
      <div className="privacy-header">
        <div className="privacy-header-icon"><Lock size={22} /></div>
        <div>
          <h1 className="privacy-title">Privacy Center</h1>
          <p className="privacy-subtitle">Control your data, AI profile, and personalization settings.</p>
        </div>
      </div>

      {/* Privacy toggles */}
      <div className="card privacy-section">
        <h2 className="privacy-section-title">
          <Shield size={16} /> Personalization & Tracking
        </h2>
        <div className="privacy-settings">
          {PRIVACY_SETTINGS.map(({ key, label, desc }) => (
            <div key={key} className="privacy-setting-row">
              <div className="privacy-setting-info">
                <span className="privacy-setting-label">{label}</span>
                <span className="privacy-setting-desc">{desc}</span>
              </div>
              <button
                className={`pref-toggle-btn ${settings[key] ? 'on' : 'off'}`}
                onClick={() => toggleSetting(key)}
                aria-label={`Toggle ${label}`}
                aria-pressed={settings[key]}
              >
                {settings[key]
                  ? <><ToggleRight size={28} /><span>ON</span></>
                  : <><ToggleLeft size={28} /><span>OFF</span></>
                }
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="card privacy-section">
        <h2 className="privacy-section-title">
          <Shield size={16} /> Data Management
        </h2>
        <div className="privacy-actions-list">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.id} className={`privacy-action-row ${action.danger ? 'privacy-action-row--danger' : ''}`}>
                <div className="privacy-action-info">
                  <div className="privacy-action-label">
                    <Icon size={15} />
                    {action.label}
                  </div>
                  <p className="privacy-action-desc">{action.desc}</p>
                </div>
                <button
                  className={`btn btn-sm ${action.danger ? 'btn-danger-outline' : 'btn-outline'}`}
                  onClick={() => handleAction(action)}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : action.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm modal */}
      <Modal isOpen={!!confirmModal} onClose={() => setConfirmModal(null)} title="Are you sure?" size="sm">
        {confirmModal && (
          <div className="privacy-confirm">
            <div className="privacy-confirm-icon">
              <AlertTriangle size={24} />
            </div>
            <p className="privacy-confirm-text">{confirmModal.confirm}</p>
            <div className="privacy-confirm-btns">
              <button className="btn btn-ghost" onClick={() => setConfirmModal(null)}>Cancel</button>
              <button
                className={`btn ${confirmModal.danger ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => executeAction(confirmModal.id)}
              >
                {confirmModal.danger ? 'Yes, Proceed' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
