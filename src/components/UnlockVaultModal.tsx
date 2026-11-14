"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, X, KeyRound, AlertCircle } from "lucide-react";
import { useVault } from "@/context/VaultContext";

export function UnlockVaultModal() {
  const { isUnlockModalOpen, setIsUnlockModalOpen, unlockVault } = useVault();
  const [masterPassword, setMasterPassword] = useState("VaultXMaster2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  if (!isUnlockModalOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocking(true);
    setErrorMsg("");

    const res = await unlockVault(masterPassword);
    setIsUnlocking(false);

    if (!res.success) {
      setErrorMsg(res.error || "Failed to unlock vault.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-[#FFD5DC] shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsUnlockModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#777777] hover:text-[#202020] hover:bg-[#FFF5F6] border border-transparent hover:border-[#FFD5DC] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF5F6] border border-[#FFD5DC] flex items-center justify-center text-[#FF1744] shadow-neon-sm mb-4">
            <Lock className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black text-[#202020] tracking-tight">Unlock Your Vault</h2>
          <p className="text-xs text-[#777777] mt-1.5 max-w-xs">
            Enter your Master Password to derive your AES-256 decryption key in memory.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#202020] mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                placeholder="Enter master password..."
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 font-mono text-sm text-[#202020] transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 p-1 rounded text-[#777777] hover:text-[#202020]"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#777777] mt-1.5 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-[#FF1744]" /> Default demo password is pre-filled
            </p>
          </div>

          <button
            type="submit"
            disabled={isUnlocking}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-95 disabled:opacity-60"
          >
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            <span>{isUnlocking ? "Deriving Key & Unlocking..." : "Unlock Vault"}</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#FFD5DC]/60 text-center text-[11px] text-[#777777]">
          <span>Zero-Knowledge Architecture: Keys never leave your device.</span>
        </div>
      </div>
    </div>
  );
}
