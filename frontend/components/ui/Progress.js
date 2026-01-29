import * as React from "react"

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={className || ''}
    style={{
      position: 'relative',
      height: '8px',
      width: '100%',
      overflow: 'hidden',
      borderRadius: '4px',
      backgroundColor: '#e5e7eb',
      ...props.style
    }}
    {...props}
  >
    <div
      style={{
        height: '100%',
        width: `${Math.min(100, Math.max(0, value))}%`,
        backgroundColor: '#2563eb',
        transition: 'width 0.3s ease',
        borderRadius: '4px'
      }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
