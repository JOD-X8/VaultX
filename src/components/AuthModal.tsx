"use client";

import React, { useState } from "react";
import {
  X,
  Shield,
  Lock,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useVault } from "@/context/VaultContext";

export function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    registerUser,
  } = useVault();

  // Registration fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useSeparateMasterKey, setUseSeparateMasterKey] = useState(false);
  const [customMasterPassword, setCustomMasterPassword] = useState("");

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify and re-enter.");
      return;
    }

    setIsLoading(true);
    const res = await registerUser(
      username.trim(),
      email.trim(),
      password,
      confirmPassword,
      useSeparateMasterKey ? customMasterPassword : password
    );
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Failed to create your account.");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMsg("Please enter your username/email and password.");
      return;
    }

    setIsLoading(true);
    const res = await login(loginIdentifier.trim(), loginPassword);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Invalid username/email or password.");
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");
    const res = await login("alexmercer", "VaultXDemo2026!");
    setIsLoading(false);
    if (!res.success) {
      // Fallback try with demo@vaultx.app
      await login("demo@vaultx.app", "VaultXDemo2026!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-[#FFD5DC] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Tabs */}
        <div className="p-5 sm:p-6 border-b border-[#FFD5DC] bg-[#FFF5F6] relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-xl text-[#777777] hover:text-[#202020] hover:bg-white border border-transparent hover:border-[#FFD5DC] transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E6002E] to-[#FF1744] flex items-center justify-center text-white shadow-neon-sm">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#202020] tracking-tight">
                Vault<span className="text-[#FF1744]">X</span> Cloud
              </h2>
              <p className="text-xs text-[#777777]">
                Multi-User Encrypted Password Management
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-white border border-[#FFD5DC] p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setErrorMsg("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === "login"
                  ? "bg-[#FF1744] text-white shadow-neon-sm"
                  : "text-[#777777] hover:text-[#202020]"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setErrorMsg("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === "register"
                  ? "bg-[#FF1744] text-white shadow-neon-sm"
                  : "text-[#777777] hover:text-[#202020]"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authMode === "register" ? (
            /* =================== REGISTRATION FORM =================== */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Unique Username */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF1744]" /> Unique Username <span className="text-[#FF1744]">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. alex_mercer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all"
                />
                <p className="text-[11px] text-[#777777] mt-1">
                  Letters, numbers, underscores and hyphens (3-30 chars).
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF1744]" /> Email Address <span className="text-[#FF1744]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF1744]" /> Login Password <span className="text-[#FF1744]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-[#777777] hover:text-[#202020]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#FF1744]" /> Confirm Password <span className="text-[#FF1744]">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all"
                />
              </div>

              {/* Architecture & Security Explanation Note */}
              <div className="p-3.5 rounded-2xl bg-[#FFF5F6] border border-[#FFD5DC] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E6002E]">
                  <HelpCircle className="w-4 h-4 text-[#FF1744]" />
                  <span>Account Password vs. Vault Key</span>
                </div>
                <p className="text-[11px] text-[#777777] leading-relaxed">
                  Your <strong>Login Password</strong> securely authenticates your user account to the cloud server using scrypt. Your <strong>Vault Master Key</strong> encrypts your saved credentials on your device using AES-256 so that nobody else can ever view them.
                </p>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-95 disabled:opacity-60"
              >
                {isLoading ? "Creating Account & Initializing Vault..." : "Register & Create Vault"}
              </button>
            </form>
          ) : (
            /* =================== LOGIN FORM =================== */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF1744]" /> Username or Email Address
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter your username or email"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF1744]" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-[#777777] hover:text-[#202020]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-95 disabled:opacity-60"
              >
                {isLoading ? "Authenticating..." : "Log In to Your Vault"}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#FFD5DC]" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-white px-2 text-[#777777] font-semibold">Or Quick Preview</span>
                </div>
              </div>

              {/* Demo Account Login button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-[#202020] bg-[#FFF5F6] border border-[#FFD5DC] hover:border-[#FF1744] hover:text-[#E6002E] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF1744]" />
                <span>Log In as Demo User (@alexmercer)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
