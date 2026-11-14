"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Shield,
  Layers,
  Globe,
  Mail,
  User,
  Lock,
  FileText,
} from "lucide-react";
import { VaultAccount, AccountCategory, CATEGORIES } from "@/types";
import { useVault } from "@/context/VaultContext";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAccount?: VaultAccount | null;
}

export function AccountModal({ isOpen, onClose, editingAccount }: AccountModalProps) {
  const { saveAccount, generatePassword } = useVault();

  const [accountName, setAccountName] = useState("");
  const [category, setCategory] = useState<AccountCategory>("Social Media");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [generatorLength, setGeneratorLength] = useState(16);

  useEffect(() => {
    if (editingAccount) {
      setAccountName(editingAccount.accountName || "");
      setCategory(editingAccount.category || "Social Media");
      setEmail(editingAccount.email || "");
      setUsername(editingAccount.username || "");
      setPassword(editingAccount.password && !editingAccount.password.includes("••") ? editingAccount.password : "");
      setWebsiteUrl(editingAccount.websiteUrl || "");
      setNotes(editingAccount.notes || "");
    } else {
      setAccountName("");
      setCategory("Social Media");
      setEmail("");
      setUsername("");
      setPassword(generatePassword({ length: 16 }));
      setWebsiteUrl("");
      setNotes("");
    }
    setErrorMsg("");
  }, [editingAccount, isOpen, generatePassword]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const generated = generatePassword({ length: generatorLength });
    setPassword(generated);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim()) {
      setErrorMsg("Account name is required.");
      return;
    }
    if (!password) {
      setErrorMsg("Password is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const success = await saveAccount({
      id: editingAccount?.id,
      accountName: accountName.trim(),
      category,
      email: email.trim(),
      username: username.trim(),
      password,
      websiteUrl: websiteUrl.trim(),
      notes: notes.trim(),
    });

    setIsSubmitting(false);

    if (success) {
      onClose();
    } else {
      setErrorMsg("Failed to save account. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl border border-[#FFD5DC] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#FFD5DC] bg-[#FFF5F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E6002E] to-[#FF1744] flex items-center justify-center text-white shadow-neon-sm">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#202020]">
                {editingAccount ? "Edit Account" : "Add New Account"}
              </h2>
              <p className="text-xs text-[#777777]">
                {editingAccount
                  ? "Update existing credentials in your vault"
                  : "Save a new account with zero-knowledge cloud encryption"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#777777] hover:text-[#202020] hover:bg-white border border-transparent hover:border-[#FFD5DC] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {errorMsg}
            </div>
          )}

          {/* Account Name & Category in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1.5">
                Account Name <span className="text-[#FF1744]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Instagram, GitHub, Netflix"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1.5">
                Category <span className="text-[#FF1744]">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AccountCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-semibold appearance-none transition-all pr-8"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Layers className="w-4 h-4 text-[#777777] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Email & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FF1744]" /> Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF1744]" /> Username
              </label>
              <input
                type="text"
                placeholder="e.g. alex_mercer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all"
              />
            </div>
          </div>

          {/* Password with Generator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#202020] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FF1744]" /> Password <span className="text-[#FF1744]">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-xs font-bold text-[#E6002E] hover:text-[#FF1744] flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-[#FFEAEF] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Strong Password</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password or generate"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 font-mono text-sm text-[#202020] tracking-wider transition-all pr-20"
              />
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-lg text-[#777777] hover:text-[#202020] transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="p-1.5 rounded-lg text-[#FF1744] hover:bg-[#FFEAEF] transition-colors"
                  title="Regenerate password"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Generator Length Selector */}
            <div className="mt-2 flex items-center justify-between text-xs text-[#777777] px-1">
              <span>Length: {generatorLength} chars</span>
              <div className="flex items-center gap-1.5">
                {[12, 16, 20, 24].map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => {
                      setGeneratorLength(len);
                      setPassword(generatePassword({ length: len }));
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                      generatorLength === len
                        ? "bg-[#FF1744] text-white shadow-xs"
                        : "bg-[#FFF5F6] text-[#777777] border border-[#FFD5DC]"
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FF1744]" /> Website URL
            </label>
            <input
              type="text"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#FF1744]" /> Optional Notes / Recovery Codes
            </label>
            <textarea
              rows={2}
              placeholder="Add security answers, PIN codes, or backup information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-sm text-[#202020] font-medium transition-all resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#FFD5DC] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#777777] hover:text-[#202020] hover:bg-[#FFF5F6] border border-transparent transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-95 disabled:opacity-60"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? "Encrypting & Saving..." : editingAccount ? "Save Changes" : "Save Account"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
