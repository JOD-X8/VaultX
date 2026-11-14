"use client";

import React from "react";
import {
  Shield,
  Key,
  Lock,
  Unlock,
  Plus,
  FolderKanban,
  Sparkles,
  Database,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useVault } from "@/context/VaultContext";

export function Sidebar() {
  const {
    user,
    logout,
    setIsAuthModalOpen,
    setAuthMode,
    isVaultUnlocked,
    setIsUnlockModalOpen,
    lockVault,
    setIsAddModalOpen,
    selectedCategory,
    setSelectedCategory,
    categoryCounts,
    totalAccountsCount,
  } = useVault();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#FFD5DC] h-screen sticky top-0 px-5 py-6 select-none justify-between">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-[#FFD5DC] shadow-neon-sm flex-shrink-0">
            <img src="/logo.jpg" alt="VaultX Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#202020] flex items-center gap-1">
              Vault<span className="text-[#FF1744]">X</span>
            </span>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-[#777777]">
              Multi-User Cloud Vault
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        {user ? (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-[0.98] mb-5 group"
          >
            <Plus className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
            <span>Add Account</span>
          </button>
        ) : (
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => {
                setAuthMode("login");
                setIsAuthModalOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs text-[#202020] bg-[#FFF5F6] border border-[#FFD5DC] hover:border-[#FF1744] transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FF1744]" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => {
                setAuthMode("register");
                setIsAuthModalOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        )}

        {/* Vault Status Box */}
        {user && (
          <div className="mb-5 p-3 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3 h-3 rounded-full ${
                  isVaultUnlocked ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-[#FF1744] shadow-[0_0_8px_#FF1744]"
                }`}
              />
              <div>
                <p className="text-xs font-bold text-[#202020]">
                  Vault: {isVaultUnlocked ? "Unlocked" : "Locked"}
                </p>
                <p className="text-[11px] text-[#777777]">
                  {isVaultUnlocked ? "Decrypted in memory" : "AES-256 Protected"}
                </p>
              </div>
            </div>
            {isVaultUnlocked ? (
              <button
                onClick={lockVault}
                title="Lock Vault"
                className="p-1.5 rounded-lg text-[#777777] hover:text-[#FF1744] hover:bg-[#FFEAEF] transition-colors"
              >
                <Lock className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                title="Unlock Vault"
                className="p-1.5 rounded-lg text-[#FF1744] bg-white border border-[#FFD5DC] hover:border-[#FF1744] shadow-sm transition-colors"
              >
                <Unlock className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Navigation List */}
        <div className="space-y-1 pr-1 max-h-[38vh] overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 px-2">
            Categories
          </div>

          <button
            onClick={() => setSelectedCategory("All")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all ${
              selectedCategory === "All"
                ? "bg-[#FFEAEF] text-[#E6002E] font-bold shadow-sm border border-[#FFD5DC]"
                : "text-[#202020] hover:bg-[#FFF5F6] hover:text-[#E6002E]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-[#FF1744]" />
              <span>All Accounts</span>
            </div>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                selectedCategory === "All"
                  ? "bg-[#FF1744] text-white font-bold"
                  : "bg-[#FFF5F6] text-[#777777] border border-[#FFD5DC]"
              }`}
            >
              {totalAccountsCount}
            </span>
          </button>

          {categoryCounts.map(({ category, count }) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                  isSelected
                    ? "bg-[#FFEAEF] text-[#E6002E] font-bold border border-[#FFD5DC]"
                    : "text-[#202020] hover:bg-[#FFF5F6] hover:text-[#E6002E]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-3.5 h-3.5 text-[#FF1744]" />
                  <span className="truncate">{category}</span>
                </div>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-[#FF1744] text-white font-bold"
                      : count > 0
                      ? "bg-[#FFF5F6] text-[#202020] border border-[#FFD5DC]"
                      : "text-[#777777]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Session & Cloud Footer */}
      <div className="pt-4 border-t border-[#FFD5DC] space-y-3">
        {user ? (
          <div className="p-2.5 rounded-xl bg-[#FFF5F6] border border-[#FFD5DC] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#FFD5DC] flex items-center justify-center font-bold text-xs text-[#E6002E] flex-shrink-0">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#202020] truncate">
                  @{user.username}
                </p>
                <p className="text-[10px] text-[#777777] truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log Out"
              className="p-1.5 rounded-lg text-[#777777] hover:text-[#FF1744] hover:bg-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setAuthMode("login");
              setIsAuthModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-[#E6002E] bg-[#FFEAEF] border border-[#FFD5DC]"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Your Vault</span>
          </button>
        )}

        <div className="flex items-center justify-between text-[11px] text-[#777777]">
          <span className="flex items-center gap-1 font-medium">
            <Database className="w-3 h-3 text-[#FF1744]" /> Neon Cloud DB
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FFF5F6] text-[#E6002E] font-bold border border-[#FFD5DC]">
            Multi-User
          </span>
        </div>
      </div>
    </aside>
  );
}
