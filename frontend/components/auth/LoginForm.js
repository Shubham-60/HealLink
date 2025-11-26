'use client';
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { authApi, tokenManager } from "@/lib/api";
import { UserIcon, LockIcon } from "../icons/HealthcareIcons";

export default function LoginForm({ onSwitchToSignup, onSuccess }) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", type: "" });

    try {
      const data = await authApi.login({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      tokenManager.set(data.token);
      setAlert({ message: "Login successful!", type: "success" });
      
      setTimeout(() => {
        if (onSuccess) onSuccess(data);
      }, 500);
    } catch (error) {
      setAlert({ 
        message: error.message || "Login failed. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to manage your healthcare journey</p>
      </div>

      {alert.message && (
        <Alert 
          message={alert.message} 
          type={alert.type} 
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          label="Email or Username"
          type="text"
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          icon={UserIcon}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          icon={LockIcon}
          showPasswordToggle
        />

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          loading={loading}
        >
          Log In
        </Button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{" "}
          <button 
            type="button" 
            onClick={onSwitchToSignup}
            className="auth-link"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
