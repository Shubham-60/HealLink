'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../ui/Card";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import BrandHeader from "../ui/BrandHeader";
import FeatureList from "../ui/FeatureList";

export default function AuthLayout() {
  const [mode, setMode] = useState("login");
  const router = useRouter();

  const handleSuccess = (data) => {
    console.log("Authentication successful:", data);
    router.push('/dashboard');
  };

  return (
    <div className="auth-layout">
      {/* Left Side - Branding */}
      <div className="auth-brand-section">
        <div className="brand-content">
          <BrandHeader />
          <FeatureList />
        </div>
        
        {/* Animated Background Elements */}
        <div className="bg-decoration decoration-1"></div>
        <div className="bg-decoration decoration-2"></div>
        <div className="bg-decoration decoration-3"></div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="auth-form-section">
        <Card className="auth-card">
          {mode === "login" ? (
            <LoginForm 
              onSwitchToSignup={() => setMode("signup")}
              onSuccess={handleSuccess}
            />
          ) : (
            <SignupForm 
              onSwitchToLogin={() => setMode("login")}
              onSuccess={handleSuccess}
            />
          )}
        </Card>
        
        <div className="auth-terms">
          <p>
            By continuing, you agree to our{" "}
            <a href="/terms" className="terms-link">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" className="terms-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
