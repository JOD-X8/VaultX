"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Edit2,
  Trash2,
  Globe,
  Mail,
  User,
  Lock,
  Sparkles,
} from "lucide-react";
import { VaultAccount } from "@/types";
import { useVault } from "@/context/VaultContext";

interface AccountCardProps {
  account: VaultAccount;
  onEdit: (account: VaultAccount) => void;
  onViewDetails: (account: VaultAccount) => void;
}

export function AccountCard({ account, onEdit, onViewDetails }: AccountCardProps) {
  const { copyField, copiedKey, deleteAccount, isVaultUnlocked, setIsUnlockModalOpen } = useVault();
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDomainFromUrl = (url: string) => {
    try {
      if (!url) return "";
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const domain = getDomainFromUrl(account.websiteUrl);

  const handlePasswordToggle = () => {
    if (!isVaultUnlocked) {
      setIsUnlockModalOpen(true);
      return;
    }
    setShowPassword((prev) => !prev);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${account.accountName}?`)) {
      setIsDeleting(true);
      await deleteAccount(account.id);
    }
  };

  const renderCopyButton = (text: string, fieldType: string, label: string) => {
    const key = `${account.id}-${fieldType}`;
    const isCopied = copiedKey === key;

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          copyField(text, key);
        }}
        title={`Copy ${label}`}
        aria-label={`Copy ${label}`}
        className={`relative flex items-center justify-center p-1.5 rounded-lg border transition-all text-xs font-medium select-none ${
          isCopied
            ? "bg-emerald-50 text-emerald-600 border-emerald-300 shadow-sm"
            : "bg-[#FFF5F6] text-[#777777] border-[#FFD5DC] hover:text-[#E6002E] hover:border-[#FF1744] hover:bg-white"
        }`}
      >
        {isCopied ? (
          <span className="flex items-center gap-1 font-bold text-emerald-600 px-1">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="text-[10px]">Copied!</span>
          </span>
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    );
  };

  return (
    <div
      onClick={() => onViewDetails(account)}
      className="group relative bg-white rounded-2xl border border-[#FFD5DC] p-4 sm:p-5 shadow-soft-card hover:shadow-soft-hover hover:border-[#FF1744]/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Bar: Icon, Name, Category & Actions */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-3">
            {/* Account Icon */}
            <div className="relative w-11 h-11 rounded-xl bg-[#FFF5F6] border border-[#FFD5DC] flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-[#FF1744]/40 transition-colors">
              {domain ? (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                  alt=""
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : null}
              <div
                className="absolute inset-0 flex items-center justify-center font-black text-sm text-[#E6002E] bg-[#FFF5F6]"
                style={{ zIndex: domain ? -1 : 1 }}
              >
                {account.accountName.slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Name + Copy Name */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-[#202020] truncate group-hover:text-[#E6002E] transition-colors">
                  {account.accountName}
                </h3>
                {renderCopyButton(account.accountName, "name", "Account Name")}
              </div>
              <span className="inline-block mt-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFEAEF] text-[#E6002E] border border-[#FFD5DC]">
                {account.category}
              </span>
            </div>
          </div>

          {/* Edit / Delete quick controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(account);
              }}
              title="Edit Account"
              className="p-1.5 rounded-lg text-[#777777] hover:text-[#E6002E] hover:bg-[#FFEAEF] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Account"
              className="p-1.5 rounded-lg text-[#777777] hover:text-[#FF1744] hover:bg-[#FFEAEF] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Credentials Rows */}
        <div className="space-y-2.5 pt-1">
          {/* Email Row */}
          {account.email && (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FFF5F6]/60 border border-[#FFD5DC]/60 hover:bg-[#FFF5F6] transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-3.5 h-3.5 text-[#FF1744] flex-shrink-0" />
                <span className="text-xs text-[#202020] font-medium truncate">
                  {account.email}
                </span>
              </div>
              {renderCopyButton(account.email, "email", "Email")}
            </div>
          )}

          {/* Username Row */}
          {account.username && (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FFF5F6]/60 border border-[#FFD5DC]/60 hover:bg-[#FFF5F6] transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <User className="w-3.5 h-3.5 text-[#FF1744] flex-shrink-0" />
                <span className="text-xs text-[#202020] font-medium truncate">
                  {account.username}
                </span>
              </div>
              {renderCopyButton(account.username, "username", "Username")}
            </div>
          )}

          {/* Password Row */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FFF5F6]/60 border border-[#FFD5DC]/60 hover:bg-[#FFF5F6] transition-colors">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Lock className="w-3.5 h-3.5 text-[#FF1744] flex-shrink-0" />
              <div className="font-mono text-xs text-[#202020] truncate select-none">
                {showPassword && isVaultUnlocked
                  ? account.password || "••••••••••••"
                  : "••••••••••••"}
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePasswordToggle();
                }}
                title={showPassword ? "Hide password" : "Show password"}
                className="p-1.5 rounded-lg text-[#777777] hover:text-[#E6002E] hover:bg-white border border-transparent hover:border-[#FFD5DC] transition-all"
              >
                {showPassword && isVaultUnlocked ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>

              {renderCopyButton(
                account.password || "••••••••••••",
                "password",
                "Password"
              )}
            </div>
          </div>

          {/* Website URL Row (when provided) */}
          {account.websiteUrl && (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FFF5F6]/60 border border-[#FFD5DC]/60 hover:bg-[#FFF5F6] transition-colors">
              <a
                href={
                  account.websiteUrl.startsWith("http")
                    ? account.websiteUrl
                    : `https://${account.websiteUrl}`
                }
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 min-w-0 text-xs text-[#777777] hover:text-[#E6002E] truncate group/link"
              >
                <Globe className="w-3.5 h-3.5 text-[#FF1744] flex-shrink-0" />
                <span className="truncate">{domain || account.websiteUrl}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
              {renderCopyButton(account.websiteUrl, "url", "Website URL")}
            </div>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-3.5 pt-2.5 border-t border-[#FFD5DC]/40 flex items-center justify-between text-[11px] text-[#777777]">
        <span>Tap card for details</span>
        <span className="font-medium text-[#E6002E]">View Full Details &rarr;</span>
      </div>
    </div>
  );
}
