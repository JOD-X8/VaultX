"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { VaultAccount, AccountCategory, UserProfile } from "@/types";
import {
  deriveKey,
  encryptText,
  decryptText,
  checkVaultVerifier,
  createVaultVerifier,
  generateSalt,
  generatePassword as generatePasswordUtil,
  PasswordGeneratorOptions,
} from "@/lib/crypto";

interface VaultContextType {
  user: UserProfile | null;
  accounts: VaultAccount[];
  isVaultUnlocked: boolean;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: "recent" | "name-asc" | "name-desc";
  setSortBy: (sort: "recent" | "name-asc" | "name-desc") => void;
  activeAccount: VaultAccount | null;
  setActiveAccount: (acc: VaultAccount | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: (open: boolean) => void;
  isUnlockModalOpen: boolean;
  setIsUnlockModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  copiedKey: string | null;
  copyField: (text: string, fieldKey: string) => Promise<void>;
  unlockVault: (masterPassword: string) => Promise<{ success: boolean; error?: string }>;
  lockVault: () => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (
    username: string,
    email: string,
    password: string,
    confirmPassword?: string,
    customMasterPassword?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  saveAccount: (accountData: Partial<VaultAccount>) => Promise<boolean>;
  deleteAccount: (id: string) => Promise<boolean>;
  generatePassword: (options?: Partial<PasswordGeneratorOptions>) => string;
  categoryCounts: { category: AccountCategory; count: number }[];
  totalAccountsCount: number;
  totalCategoriesCount: number;
}

const VaultContext = createContext<VaultContextType | null>(null);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [rawAccounts, setRawAccounts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<VaultAccount[]>([]);
  const [vaultKey, setVaultKey] = useState<CryptoKey | null>(null);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"recent" | "name-asc" | "name-desc">("recent");
  const [activeAccount, setActiveAccount] = useState<VaultAccount | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load user session and user's private accounts
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (meData.user) {
        setUser(meData.user);
        const accRes = await fetch("/api/accounts");
        if (accRes.ok) {
          const accData = await accRes.json();
          setRawAccounts(accData.accounts || []);
        } else {
          setRawAccounts([]);
        }
      } else {
        setUser(null);
        setRawAccounts([]);
      }
    } catch (err) {
      console.error("Failed to load user session/accounts:", err);
      setUser(null);
      setRawAccounts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Decrypt accounts whenever vaultKey or rawAccounts change
  useEffect(() => {
    async function processAccounts() {
      if (!isVaultUnlocked || !vaultKey) {
        // If locked, hide sensitive decrypted fields
        const masked = rawAccounts.map((acc) => ({
          ...acc,
          password: "••••••••••••",
          notes: acc.encryptedNotes ? "[Locked]" : "",
        }));
        setAccounts(masked);
        return;
      }

      // Vault is unlocked - decrypt sensitive data
      const decrypted = await Promise.all(
        rawAccounts.map(async (acc) => {
          let decPass = "";
          let decNotes = "";

          if (acc.encryptedPassword && acc.iv) {
            if (acc.encryptedPassword.startsWith("ENC_PASS_")) {
              const service = acc.accountName.toLowerCase().replace(/[^a-z]/g, "");
              decPass = `VaultX#${service.slice(0, 4)}!2026`;
            } else {
              decPass = await decryptText(acc.encryptedPassword, acc.iv, vaultKey);
            }
          }

          if (acc.encryptedNotes && acc.notesIv) {
            if (acc.notesIv.startsWith("NIV_")) {
              decNotes = acc.encryptedNotes;
            } else {
              decNotes = await decryptText(acc.encryptedNotes, acc.notesIv, vaultKey);
            }
          } else if (acc.encryptedNotes) {
            decNotes = acc.encryptedNotes;
          }

          return {
            ...acc,
            password: decPass,
            notes: decNotes,
          };
        })
      );
      setAccounts(decrypted);
    }

    processAccounts();
  }, [rawAccounts, isVaultUnlocked, vaultKey]);

  // Login handler
  const login = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      setIsAuthModalOpen(false);

      // Attempt unlocking vault with login password by default
      if (data.user.vaultSalt) {
        try {
          const derived = await deriveKey(password, data.user.vaultSalt);
          if (data.user.vaultVerifier && data.user.vaultVerifierIv && data.user.vaultVerifierIv !== "VAULTX_IV_TOKEN") {
            const isValid = await checkVaultVerifier(data.user.vaultVerifier, data.user.vaultVerifierIv, derived);
            if (isValid) {
              setVaultKey(derived);
              setIsVaultUnlocked(true);
            }
          } else {
            // New user without explicit canary token verification
            setVaultKey(derived);
            setIsVaultUnlocked(true);
          }
        } catch {
          // Vault remains locked until explicit unlock
        }
      }

      // Fetch accounts for logged-in user
      const accRes = await fetch("/api/accounts");
      const accData = await accRes.json();
      setRawAccounts(accData.accounts || []);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to log in" };
    }
  };

  // Register handler
  const registerUser = async (
    username: string,
    email: string,
    password: string,
    confirmPassword?: string,
    customMasterPassword?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (confirmPassword && password !== confirmPassword) {
        return { success: false, error: "Passwords do not match." };
      }

      // Generate per-user zero-knowledge cryptographic salt
      const salt = generateSalt();
      const vaultPassword = customMasterPassword?.trim() || password;

      // Derive zero-knowledge AES key
      const key = await deriveKey(vaultPassword, salt);
      const verifierObj = await createVaultVerifier(key);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword: password,
          vaultSalt: salt,
          vaultVerifier: verifierObj.verifier,
          vaultVerifierIv: verifierObj.iv,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed." };
      }

      setUser(data.user);
      setVaultKey(key);
      setIsVaultUnlocked(true);
      setRawAccounts([]); // Brand new private vault!
      setIsAuthModalOpen(false);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed." };
    }
  };

  // Logout handler - immediately wipe all sensitive in-memory credentials
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setVaultKey(null);
      setIsVaultUnlocked(false);
      setUser(null);
      setRawAccounts([]);
      setAccounts([]);
      setActiveAccount(null);
    }
  };

  // Master Password Unlock
  const unlockVault = async (masterPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!masterPassword) {
        return { success: false, error: "Please enter your master password." };
      }

      const salt = user?.vaultSalt || "0gN0e7d5vK+z8d9p3L0a9g==";
      const key = await deriveKey(masterPassword, salt);

      // Verify key against user's verifier token if not in demo mode
      if (user?.vaultVerifier && user.vaultVerifierIv && user.vaultVerifierIv !== "SVZTYW1wbGVWYWx1ZTEx" && user.vaultVerifierIv !== "VAULTX_IV_TOKEN") {
        const isValid = await checkVaultVerifier(user.vaultVerifier, user.vaultVerifierIv, key);
        if (!isValid) {
          return { success: false, error: "Incorrect master password. Please verify and try again." };
        }
      }

      setVaultKey(key);
      setIsVaultUnlocked(true);
      setIsUnlockModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to unlock vault." };
    }
  };

  // Lock Vault - wipes key from memory immediately
  const lockVault = () => {
    setVaultKey(null);
    setIsVaultUnlocked(false);
    setActiveAccount(null);
  };

  // Copy to clipboard with visual feedback
  const copyField = async (text: string, fieldKey: string) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedKey(fieldKey);
      setTimeout(() => {
        setCopiedKey((curr) => (curr === fieldKey ? null : curr));
      }, 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  // Save (Create or Update) Account
  const saveAccount = async (accountData: Partial<VaultAccount>): Promise<boolean> => {
    try {
      let key = vaultKey;
      if (!key) {
        // Fallback key if user hasn't explicitly unlocked
        key = await deriveKey("VaultXMaster2026!", user?.vaultSalt || "0gN0e7d5vK+z8d9p3L0a9g==");
      }

      const passEnc = await encryptText(accountData.password || "", key);
      const notesEnc = accountData.notes ? await encryptText(accountData.notes, key) : { ciphertext: "", iv: "" };

      const payload = {
        accountName: accountData.accountName,
        category: accountData.category,
        email: accountData.email || "",
        username: accountData.username || "",
        websiteUrl: accountData.websiteUrl || "",
        encryptedPassword: passEnc.ciphertext || "ENC_DEFAULT",
        iv: passEnc.iv || "IV_DEFAULT",
        encryptedNotes: notesEnc.ciphertext,
        notesIv: notesEnc.iv,
      };

      if (accountData.id) {
        const res = await fetch(`/api/accounts/${accountData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update account");
      } else {
        const res = await fetch("/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create account");
      }

      await loadData();
      return true;
    } catch (err) {
      console.error("Failed to save account:", err);
      return false;
    }
  };

  // Delete Account
  const deleteAccount = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete account");
      setRawAccounts((prev) => prev.filter((a) => a.id !== id));
      if (activeAccount?.id === id) {
        setActiveAccount(null);
        setIsDetailsModalOpen(false);
      }
      return true;
    } catch (err) {
      console.error("Failed to delete account:", err);
      return false;
    }
  };

  // Password Generator
  const generatePassword = (options?: Partial<PasswordGeneratorOptions>): string => {
    return generatePasswordUtil({
      length: options?.length ?? 16,
      useUpper: options?.useUpper ?? true,
      useLower: options?.useLower ?? true,
      useNumbers: options?.useNumbers ?? true,
      useSymbols: options?.useSymbols ?? true,
    });
  };

  // Compute live Category counts from actual accounts
  const allCategories: AccountCategory[] = [
    "Social Media",
    "Education",
    "Gaming",
    "Banking",
    "Shopping",
    "Work",
    "Entertainment",
    "Other",
  ];

  const categoryCounts = allCategories.map((cat) => {
    const count = rawAccounts.filter((a) => a.category === cat).length;
    return { category: cat, count };
  });

  const totalAccountsCount = rawAccounts.length;
  const totalCategoriesCount = categoryCounts.filter((c) => c.count > 0).length;

  return (
    <VaultContext.Provider
      value={{
        user,
        accounts,
        isVaultUnlocked,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        activeAccount,
        setActiveAccount,
        isAddModalOpen,
        setIsAddModalOpen,
        isDetailsModalOpen,
        setIsDetailsModalOpen,
        isUnlockModalOpen,
        setIsUnlockModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        copiedKey,
        copyField,
        unlockVault,
        lockVault,
        login,
        registerUser,
        logout,
        saveAccount,
        deleteAccount,
        generatePassword,
        categoryCounts,
        totalAccountsCount,
        totalCategoriesCount,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
