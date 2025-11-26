'use client';
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../icons/HealthcareIcons';

export default function Input({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder,
  required = false,
  icon: Icon,
  showPasswordToggle = false
}) {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = showPasswordToggle 
    ? (showPassword ? "text" : "password")
    : type;

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon">
            <Icon size={20} />
          </div>
        )}
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field ${Icon ? 'with-icon' : ''} ${showPasswordToggle ? 'with-toggle' : ''}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
