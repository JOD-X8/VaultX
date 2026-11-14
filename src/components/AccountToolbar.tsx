"use client";

import React from "react";
import { Search, Filter, ArrowUpDown, X, LayoutGrid, List } from "lucide-react";
import { useVault } from "@/context/VaultContext";
import { CATEGORIES } from "@/types";

interface AccountToolbarProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function AccountToolbar({ viewMode, setViewMode }: AccountToolbarProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useVault();

  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#FFD5DC] shadow-soft-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6]/40 focus:bg-white focus:outline-none focus:border-[#FF1744] focus:ring-2 focus:ring-[#FF1744]/20 text-xs sm:text-sm text-[#202020] transition-all font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-3 p-0.5 rounded text-[#777777] hover:text-[#202020]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        {/* Category Filter Select */}
        <div className="relative flex-shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-8 pr-7 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6] text-xs font-bold text-[#202020] appearance-none focus:outline-none focus:border-[#FF1744] cursor-pointer hover:bg-white transition-colors"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-[#FF1744] absolute left-3 top-3 pointer-events-none" />
        </div>

        {/* Sort Select */}
        <div className="relative flex-shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="pl-8 pr-7 py-2.5 rounded-xl border border-[#FFD5DC] bg-[#FFF5F6] text-xs font-bold text-[#202020] appearance-none focus:outline-none focus:border-[#FF1744] cursor-pointer hover:bg-white transition-colors"
          >
            <option value="recent">Recently Added</option>
            <option value="name-asc">Alphabetical (A - Z)</option>
            <option value="name-desc">Alphabetical (Z - A)</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-[#FF1744] absolute left-3 top-3 pointer-events-none" />
        </div>

        {/* Grid / List toggle for desktop */}
        <div className="hidden sm:flex items-center rounded-xl border border-[#FFD5DC] bg-[#FFF5F6] p-0.5 flex-shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            title="Grid View"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-white text-[#E6002E] shadow-xs"
                : "text-[#777777] hover:text-[#202020]"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            title="List View"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-white text-[#E6002E] shadow-xs"
                : "text-[#777777] hover:text-[#202020]"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
