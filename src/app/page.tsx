"use client";

import React, { useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNavbar } from "@/components/MobileNavbar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { AccountToolbar } from "@/components/AccountToolbar";
import { AccountCard } from "@/components/AccountCard";
import { AccountModal } from "@/components/AccountModal";
import { AccountDetailsModal } from "@/components/AccountDetailsModal";
import { UnlockVaultModal } from "@/components/UnlockVaultModal";
import { AuthModal } from "@/components/AuthModal";
import { useVault } from "@/context/VaultContext";
import { VaultAccount } from "@/types";
import { KeyRound, Plus, ShieldAlert, Shield, LogIn, UserPlus, Sparkles, Lock } from "lucide-react";

export default function DashboardPage() {
  const {
    user,
    accounts,
    searchQuery,
    selectedCategory,
    sortBy,
    isAddModalOpen,
    setIsAddModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    activeAccount,
    setActiveAccount,
    isVaultUnlocked,
    setIsUnlockModalOpen,
    setIsAuthModalOpen,
    setAuthMode,
    login,
  } = useVault();

  const [editingAccount, setEditingAccount] = useState<VaultAccount | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and sort accounts
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((acc) => {
        // Category filter
        if (selectedCategory !== "All" && acc.category !== selectedCategory) {
          return false;
        }

        // Search query filter (matches name, email, or username)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = acc.accountName.toLowerCase().includes(q);
          const matchEmail = (acc.email || "").toLowerCase().includes(q);
          const matchUsername = (acc.username || "").toLowerCase().includes(q);
          const matchUrl = (acc.websiteUrl || "").toLowerCase().includes(q);
          return matchName || matchEmail || matchUsername || matchUrl;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") {
          return a.accountName.localeCompare(b.accountName);
        }
        if (sortBy === "name-desc") {
          return b.accountName.localeCompare(a.accountName);
        }
        // "recent" sort
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [accounts, selectedCategory, searchQuery, sortBy]);

  const handleEdit = (account: VaultAccount) => {
    setEditingAccount(account);
    setIsAddModalOpen(true);
  };

  const handleViewDetails = (account: VaultAccount) => {
    setActiveAccount(account);
    setIsDetailsModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingAccount(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F6] flex flex-col lg:flex-row text-[#202020]">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Navigation Header */}
        <MobileNavbar />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24 lg:pb-12">
          {/* Top Authentication Banner if unauthenticated */}
          {!user ? (
            <div className="bg-white rounded-3xl border border-[#FFD5DC] p-6 sm:p-8 shadow-soft-card flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E6002E] to-[#FF1744] flex items-center justify-center text-white shadow-neon-sm flex-shrink-0">
                  <Shield className="w-7 h-7 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-[#202020] tracking-tight">
                      Public Multi-User Cloud Vault
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFEAEF] text-[#E6002E] border border-[#FFD5DC]">
                      Isolated Vaults
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#777777] mt-1 max-w-xl">
                    Register with your unique username and email to get your own private zero-knowledge vault. Your data is isolated and encrypted client-side with AES-256.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-[#202020] bg-[#FFF5F6] border border-[#FFD5DC] hover:border-[#FF1744] transition-all"
                >
                  <LogIn className="w-4 h-4 text-[#FF1744]" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => {
                    setAuthMode("register");
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Account</span>
                </button>

                <button
                  onClick={() => login("alexmercer", "VaultXDemo2026!")}
                  className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#777777] hover:text-[#E6002E] hover:underline transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF1744]" />
                  <span>Quick Demo Preview</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Top Dashboard Overview Stats and Category Live Counts */}
          <DashboardOverview />

          {/* Locked Vault Notice Banner if user logged in but vault locked */}
          {user && !isVaultUnlocked && (
            <div className="p-4 rounded-2xl bg-white border border-[#FFD5DC] shadow-soft-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF5F6] text-[#FF1744] flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#202020]">
                    Your Vault is Currently Locked
                  </h3>
                  <p className="text-xs text-[#777777]">
                    Passwords remain encrypted with AES-256 in memory until you unlock with your Master Password.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-95 flex-shrink-0"
              >
                Unlock Vault
              </button>
            </div>
          )}

          {/* Search, Category Filter, and Sort Toolbar */}
          <AccountToolbar viewMode={viewMode} setViewMode={setViewMode} />

          {/* Accounts Grid / List */}
          {filteredAccounts.length > 0 ? (
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredAccounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={handleEdit}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-[#FFD5DC] p-10 sm:p-14 text-center shadow-soft-card space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF5F6] text-[#FF1744] flex items-center justify-center mx-auto border border-[#FFD5DC] shadow-neon-sm">
                <KeyRound className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#202020]">
                  {searchQuery || selectedCategory !== "All"
                    ? "No Matching Accounts Found"
                    : user
                    ? `Welcome @${user.username}! Your Private Vault is Empty`
                    : "No Accounts Saved Yet"}
                </h3>
                <p className="text-xs text-[#777777] max-w-sm mx-auto mt-1">
                  {searchQuery || selectedCategory !== "All"
                    ? "Try adjusting your search criteria or category filter to find the credentials you are looking for."
                    : user
                    ? "Your private vault is ready. Add your first account below to store credentials with zero-knowledge cloud encryption."
                    : "Register or log in to start saving your passwords securely."}
                </p>
              </div>

              <div className="pt-2">
                {user ? (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Your First Account</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setIsAuthModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-95"
                  >
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create Your Vault Account</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Account Modal */}
      <AccountModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        editingAccount={editingAccount}
      />

      {/* Account Details Modal */}
      <AccountDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setActiveAccount(null);
        }}
        account={activeAccount}
        onEdit={(account) => {
          setIsDetailsModalOpen(false);
          handleEdit(account);
        }}
      />

      {/* Master Password Unlock Modal */}
      <UnlockVaultModal />

      {/* Multi-User Registration & Login Modal */}
      <AuthModal />
    </div>
  );
}
