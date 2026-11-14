"use client";

import React from "react";
import { KeyRound, Layers, Clock, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { useVault } from "@/context/VaultContext";

export function DashboardOverview() {
  const {
    totalAccountsCount,
    totalCategoriesCount,
    categoryCounts,
    selectedCategory,
    setSelectedCategory,
    setIsAddModalOpen,
    accounts,
  } = useVault();

  // Find accounts added in the last 7 days or recently
  const recentCount = accounts.filter((a) => {
    if (!a.createdAt) return false;
    const diffDays = (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 3600 * 24);
    return diffDays <= 7;
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[#202020] tracking-tight">
              Vault Overview
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFEAEF] text-[#E6002E] border border-[#FFD5DC]">
              <Sparkles className="w-3 h-3 text-[#FF1744]" /> Cloud Synced
            </span>
          </div>
          <p className="text-sm text-[#777777]">
            Secure zero-knowledge storage for all your credentials and digital accounts.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 py-2.5 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Accounts */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FFD5DC] shadow-soft-card hover:border-[#FF1744]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#777777] uppercase tracking-wider">
              Total Accounts
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF5F6] text-[#FF1744] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#202020]">
            {totalAccountsCount}
          </div>
          <p className="text-[11px] text-[#777777] mt-1">Ready to view & copy</p>
        </div>

        {/* Categories Used */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FFD5DC] shadow-soft-card hover:border-[#FF1744]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#777777] uppercase tracking-wider">
              Categories
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF5F6] text-[#FF1744] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#202020]">
            {totalCategoriesCount}
          </div>
          <p className="text-[11px] text-[#777777] mt-1">Organized folders</p>
        </div>

        {/* Recently Added */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FFD5DC] shadow-soft-card hover:border-[#FF1744]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#777777] uppercase tracking-wider">
              Recently Added
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF5F6] text-[#FF1744] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#202020]">
            {recentCount}
          </div>
          <p className="text-[11px] text-[#777777] mt-1">Past 7 days</p>
        </div>

        {/* Security Health */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FFD5DC] shadow-soft-card hover:border-[#FF1744]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#777777] uppercase tracking-wider">
              Encryption
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF5F6] text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#202020]">
            AES-256
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Client Zero-Knowledge</p>
        </div>
      </div>

      {/* Category Overview with live counts */}
      <div className="bg-white rounded-2xl border border-[#FFD5DC] p-4 sm:p-5 shadow-soft-card">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#202020]">
              Category Breakdown
            </h2>
            <p className="text-xs text-[#777777]">
              Click any category pill to filter the account list below
            </p>
          </div>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-xs font-semibold text-[#FF1744] hover:underline"
            >
              Reset to All
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === "All"
                ? "bg-[#FF1744] text-white shadow-neon-sm"
                : "bg-[#FFF5F6] text-[#202020] border border-[#FFD5DC] hover:border-[#FF1744]"
            }`}
          >
            <span>All</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === "All" ? "bg-white/20 text-white" : "bg-white text-[#777777]"
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#FF1744] text-white font-bold shadow-neon-sm"
                    : "bg-[#FFF5F6] text-[#202020] border border-[#FFD5DC] hover:border-[#FF1744]"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : count > 0
                      ? "bg-white text-[#E6002E] border border-[#FFD5DC]"
                      : "bg-white text-[#777777]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
