import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', label = 'Loading…', fullPage = false }) {
  const spinner = (
    <div className={`spinner spinner--${size}`} role="status" aria-label={label}>
      <div className="spinner-ring" />
    </div>
  );

  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        {spinner}
        <span className="spinner-label">{label}</span>
      </div>
    );
  }

  return spinner;
}
