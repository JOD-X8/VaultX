"use client";

import React from "react";
import { Shield, Plus, Lock, Unlock, Key, Layers, LogIn, LogOut, User } from "lucide-react";
import { useVault } from "@/context/VaultContext";

export function MobileNavbar() {
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
  } = useVault();

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#FFD5DC] px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-[#FFD5DC] shadow-neon-sm flex-shrink-0">
            <img src="/logo.jpg" alt="VaultX Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-[#202020] block leading-none">
              Vault<span className="text-[#FF1744]">X</span>
            </span>
            {user ? (
              <span className="text-[10px] text-[#777777] font-semibold">@{user.username}</span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              {isVaultUnlocked ? (
                <button
                  onClick={lockVault}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#E6002E] bg-[#FFEAEF] border border-[#FFD5DC]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsUnlockModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock</span>
                </button>
              )}

              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 rounded-lg text-[#777777] hover:text-[#FF1744] bg-[#FFF5F6] border border-[#FFD5DC]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-8 h-8 rounded-lg bg-[#FF1744] text-white flex items-center justify-center shadow-neon-sm active:scale-95 transition-transform ml-1"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </header>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#FFD5DC] px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            selectedCategory === "All" ? "text-[#E6002E] font-bold" : "text-[#777777]"
          }`}
        >
          <Key className="w-5 h-5" />
          <span>All Accounts</span>
        </button>

        {user ? (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-[#E6002E] to-[#FF1744] text-white flex items-center justify-center shadow-neon-md active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={() => {
              setAuthMode("register");
              setIsAuthModalOpen(true);
            }}
            className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-[#E6002E] to-[#FF1744] text-white flex items-center justify-center shadow-neon-md active:scale-95 transition-transform"
          >
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        <button
          onClick={() => {
            const nextCat = selectedCategory === "All" ? "Social Media" : "All";
            setSelectedCategory(nextCat);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            selectedCategory !== "All" ? "text-[#E6002E] font-bold" : "text-[#777777]"
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>{selectedCategory === "All" ? "Categories" : selectedCategory}</span>
        </button>
      </nav>
    </>
  );
}
