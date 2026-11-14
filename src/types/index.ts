export type AccountCategory =
  | "Social Media"
  | "Education"
  | "Gaming"
  | "Banking"
  | "Shopping"
  | "Work"
  | "Entertainment"
  | "Other";

export const CATEGORIES: AccountCategory[] = [
  "Social Media",
  "Education",
  "Gaming",
  "Banking",
  "Shopping",
  "Work",
  "Entertainment",
  "Other",
];

export interface VaultAccount {
  id: string;
  userId?: string;
  accountName: string;
  category: AccountCategory;
  email: string;
  username: string;
  password?: string; // Decrypted in-memory on client
  encryptedPassword?: string;
  iv?: string;
  websiteUrl: string;
  notes?: string; // Decrypted in-memory on client
  encryptedNotes?: string;
  notesIv?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCount {
  category: AccountCategory;
  count: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  vaultSalt: string;
  vaultVerifier: string;
  vaultVerifierIv?: string;
  createdAt?: string;
}
