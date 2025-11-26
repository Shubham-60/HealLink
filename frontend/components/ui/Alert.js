'use client';

export default function Alert({ message, type = "info", onClose }) {
  if (!message) return null;

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠"
  };

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">{icons[type]}</span>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button onClick={onClose} className="alert-close">
          ×
        </button>
      )}
    </div>
  );
}
