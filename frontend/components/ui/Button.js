'use client';

export default function Button({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary",
  disabled = false,
  fullWidth = false,
  loading = false,
  className = ""
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''} ${className}`}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          <span>Processing...</span>
        </>
      ) : children}
    </button>
  );
}
