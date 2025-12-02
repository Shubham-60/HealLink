'use client';
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { authApi, tokenManager } from "@/lib/api";
import { UserIcon, AtSignIcon, MailIcon, LockIcon } from "../icons/HealthcareIcons";

export default function SignupForm({ onSwitchToLogin, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
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
      const data = await authApi.signup({
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        // Send optional DOB to backend to set on Self family member
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : undefined,
      });

      tokenManager.set(data.token);
      setAlert({ message: "Account created successfully!", type: "success" });
      
      setTimeout(() => {
        if (onSuccess) onSuccess(data);
      }, 500);
    } catch (error) {
      setAlert({ 
        message: error.message || "Signup failed. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join HealLink for better healthcare management</p>
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
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
          icon={UserIcon}
        />

        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe"
          required
          icon={AtSignIcon}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          icon={MailIcon}
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

        <Input
          label="Date of Birth (optional)"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          placeholder=""
        />

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          loading={loading}
        >
          Sign Up
        </Button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{" "}
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            className="auth-link"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
