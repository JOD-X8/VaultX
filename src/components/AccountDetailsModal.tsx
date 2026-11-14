"use client";

import React, { useState } from "react";
import {
  X,
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
  FileText,
  Calendar,
} from "lucide-react";
import { VaultAccount } from "@/types";
import { useVault } from "@/context/VaultContext";

interface AccountDetailsModalProps {
  account: VaultAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (account: VaultAccount) => void;
}

export function AccountDetailsModal({
  account,
  isOpen,
  onClose,
  onEdit,
}: AccountDetailsModalProps) {
  const { copyField, copiedKey, deleteAccount, isVaultUnlocked, setIsUnlockModalOpen } = useVault();
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !account) return null;

  const renderCopyButton = (text: string, fieldType: string, label: string) => {
    const key = `modal-${account.id}-${fieldType}`;
    const isCopied = copiedKey === key;

    return (
      <button
        type="button"
        onClick={() => copyField(text, key)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
          isCopied
            ? "bg-emerald-50 text-emerald-600 border-emerald-300 shadow-sm"
            : "bg-[#FFF5F6] text-[#202020] border-[#FFD5DC] hover:text-[#E6002E] hover:border-[#FF1744] hover:bg-white"
        }`}
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy {label}</span>
          </>
        )}
      </button>
    );
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${account.accountName}?`)) {
      await deleteAccount(account.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl border border-[#FFD5DC] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#FFD5DC] bg-[#FFF5F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#FFD5DC] flex items-center justify-center font-black text-lg text-[#E6002E] shadow-sm">
              {account.accountName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#202020]">{account.accountName}</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFEAEF] text-[#E6002E] border border-[#FFD5DC]">
                  {account.category}
                </span>
              </div>
              <p className="text-xs text-[#777777] mt-0.5">Account Details & Credentials</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#777777] hover:text-[#202020] hover:bg-white border border-transparent hover:border-[#FFD5DC] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Account Name Field */}
          <div className="p-3.5 rounded-2xl bg-[#FFF5F6]/70 border border-[#FFD5DC] flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block">
                Account Name
              </span>
              <span className="text-sm font-bold text-[#202020]">{account.accountName}</span>
            </div>
            {renderCopyButton(account.accountName, "name", "Name")}
          </div>

          {/* Email Field */}
          {account.email && (
            <div className="p-3.5 rounded-2xl bg-[#FFF5F6]/70 border border-[#FFD5DC] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF1744]" /> Email Address
                </span>
                <span className="text-sm font-medium text-[#202020] truncate block mt-0.5">
                  {account.email}
                </span>
              </div>
              {renderCopyButton(account.email, "email", "Email")}
            </div>
          )}

          {/* Username Field */}
          {account.username && (
            <div className="p-3.5 rounded-2xl bg-[#FFF5F6]/70 border border-[#FFD5DC] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF1744]" /> Username
                </span>
                <span className="text-sm font-medium text-[#202020] truncate block mt-0.5">
                  {account.username}
                </span>
              </div>
              {renderCopyButton(account.username, "username", "Username")}
            </div>
          )}

          {/* Password Field */}
          <div className="p-3.5 rounded-2xl bg-[#FFF5F6]/70 border border-[#FFD5DC] flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FF1744]" /> Password
              </span>
              <div className="font-mono text-sm font-semibold text-[#202020] mt-0.5 tracking-wider select-all">
                {showPassword && isVaultUnlocked
                  ? account.password || "••••••••••••"
                  : "••••••••••••••••"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!isVaultUnlocked) {
                    setIsUnlockModalOpen(true);
                    return;
                  }
                  setShowPassword(!showPassword);
                }}
                className="p-2 rounded-xl text-[#777777] bg-white border border-[#FFD5DC] hover:text-[#E6002E] hover:border-[#FF1744] transition-all"
                title={showPassword ? "Hide password" : "Reveal password"}
              >
                {showPassword && isVaultUnlocked ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              {renderCopyButton(account.password || "••••••••••••", "password", "Password")}
            </div>
          </div>

          {/* Website URL Field */}
          {account.websiteUrl && (
            <div className="p-3.5 rounded-2xl bg-[#FFF5F6]/70 border border-[#FFD5DC] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#FF1744]" /> Website URL
                </span>
                <a
                  href={
                    account.websiteUrl.startsWith("http")
                      ? account.websiteUrl
                      : `https://${account.websiteUrl}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-[#E6002E] hover:underline flex items-center gap-1 mt-0.5 truncate"
                >
                  <span className="truncate">{account.websiteUrl}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
              {renderCopyButton(account.websiteUrl, "url", "URL")}
            </div>
          )}

          {/* Optional Notes */}
          {account.notes && (
            <div className="p-3.5 rounded-2xl bg-[#FFF5F6]/70 border border-[#FFD5DC]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-[#FF1744]" /> Secure Notes
              </span>
              <p className="text-xs text-[#202020] whitespace-pre-wrap leading-relaxed">
                {account.notes}
              </p>
            </div>
          )}

          {/* Timestamp */}
          {account.createdAt && (
            <div className="text-[11px] text-[#777777] flex items-center gap-1 px-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Added: {new Date(account.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-[#FFD5DC] bg-white flex items-center justify-between gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(account);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#202020] bg-[#FFF5F6] border border-[#FFD5DC] hover:border-[#FF1744] hover:text-[#E6002E] transition-all"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Account</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E6002E] to-[#FF1744] shadow-neon-sm hover:shadow-neon-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
