import { getDb } from "@/db";
import { users, vaultAccounts, type User, type NewUser, type VaultAccountRecord, type NewVaultAccountRecord } from "@/db/schema";
import { eq, or, and, desc } from "drizzle-orm";

// Fallback in-memory store for environments where Neon DATABASE_URL is not yet connected
const mockUsers: Map<string, User> = new Map();
const mockAccounts: Map<string, VaultAccountRecord> = new Map();

// Default demo user for instant preview
const DEMO_USER_ID = "demo-user-vaultx-id";
mockUsers.set(DEMO_USER_ID, {
  id: DEMO_USER_ID,
  username: "alexmercer",
  email: "demo@vaultx.app",
  passwordHash: "demo_hash",
  vaultSalt: "0gN0e7d5vK+z8d9p3L0a9g==",
  vaultVerifier: "VmVyaWZpZXJUZXN0VG9rZW4=",
  vaultVerifierIv: "SVZTYW1wbGVWYWx1ZTEx",
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Seed realistic accounts matching the categories requested
const initialSeedAccounts: Omit<VaultAccountRecord, "createdAt" | "updatedAt">[] = [
  // Social Media (8)
  {
    id: "acc-sm-1",
    userId: DEMO_USER_ID,
    accountName: "Instagram",
    category: "Social Media",
    email: "alex.mercer@gmail.com",
    username: "alexmercer_visuals",
    websiteUrl: "https://instagram.com",
    encryptedPassword: "ENC_PASS_INSTAGRAM",
    iv: "IV_1",
    encryptedNotes: "Two-factor backup codes in safety deposit",
    notesIv: "NIV_1",
  },
  {
    id: "acc-sm-2",
    userId: DEMO_USER_ID,
    accountName: "Twitter / X",
    category: "Social Media",
    email: "alex.mercer@gmail.com",
    username: "alex_builds",
    websiteUrl: "https://x.com",
    encryptedPassword: "ENC_PASS_TWITTER",
    iv: "IV_2",
    encryptedNotes: "Creator account verified",
    notesIv: "NIV_2",
  },
  {
    id: "acc-sm-3",
    userId: DEMO_USER_ID,
    accountName: "LinkedIn",
    category: "Social Media",
    email: "alex.mercer@gmail.com",
    username: "alex-mercer-dev",
    websiteUrl: "https://linkedin.com",
    encryptedPassword: "ENC_PASS_LINKEDIN",
    iv: "IV_3",
    encryptedNotes: "Professional profile",
    notesIv: "NIV_3",
  },
  {
    id: "acc-sm-4",
    userId: DEMO_USER_ID,
    accountName: "Reddit",
    category: "Social Media",
    email: "alex.mercer@gmail.com",
    username: "code_wanderer_99",
    websiteUrl: "https://reddit.com",
    encryptedPassword: "ENC_PASS_REDDIT",
    iv: "IV_4",
    encryptedNotes: "",
    notesIv: "",
  },
  {
    id: "acc-sm-5",
    userId: DEMO_USER_ID,
    accountName: "Threads",
    category: "Social Media",
    email: "alex.mercer@gmail.com",
    username: "alexmercer_visuals",
    websiteUrl: "https://threads.net",
    encryptedPassword: "ENC_PASS_THREADS",
    iv: "IV_5",
    encryptedNotes: "",
    notesIv: "",
  },
  {
    id: "acc-sm-6",
    userId: DEMO_USER_ID,
    accountName: "Pinterest",
    category: "Social Media",
    email: "alex.mercer@gmail.com",
    username: "mercer_designs",
    websiteUrl: "https://pinterest.com",
    encryptedPassword: "ENC_PASS_PINTEREST",
    iv: "IV_6",
    encryptedNotes: "Moodboards collection",
    notesIv: "NIV_6",
  },
  {
    id: "acc-sm-7",
    userId: DEMO_USER_ID,
    accountName: "Discord",
    category: "Social Media",
    email: "alex.mercer@gmail.com",
    username: "alex_mercer#1337",
    websiteUrl: "https://discord.com",
    encryptedPassword: "ENC_PASS_DISCORD",
    iv: "IV_7",
    encryptedNotes: "Developer community moderator",
    notesIv: "NIV_7",
  },
  {
    id: "acc-sm-8",
    userId: DEMO_USER_ID,
    accountName: "TikTok",
    category: "Social Media",
    email: "alex.mercer@gmail.com",
    username: "tech_with_alex",
    websiteUrl: "https://tiktok.com",
    encryptedPassword: "ENC_PASS_TIKTOK",
    iv: "IV_8",
    encryptedNotes: "",
    notesIv: "",
  },

  // Education (5)
  {
    id: "acc-edu-1",
    userId: DEMO_USER_ID,
    accountName: "Coursera",
    category: "Education",
    email: "alex.mercer@gmail.com",
    username: "alexmercer_edu",
    websiteUrl: "https://coursera.org",
    encryptedPassword: "ENC_PASS_COURSERA",
    iv: "IV_9",
    encryptedNotes: "Stanford Algorithms Specialization",
    notesIv: "NIV_9",
  },
  {
    id: "acc-edu-2",
    userId: DEMO_USER_ID,
    accountName: "Udemy",
    category: "Education",
    email: "alex.mercer@gmail.com",
    username: "alex.mercer.dev",
    websiteUrl: "https://udemy.com",
    encryptedPassword: "ENC_PASS_UDEMY",
    iv: "IV_10",
    encryptedNotes: "Next.js & Cloud Architecture courses",
    notesIv: "NIV_10",
  },
  {
    id: "acc-edu-3",
    userId: DEMO_USER_ID,
    accountName: "edX",
    category: "Education",
    email: "alex.mercer@gmail.com",
    username: "alex_edx_fellow",
    websiteUrl: "https://edx.org",
    encryptedPassword: "ENC_PASS_EDX",
    iv: "IV_11",
    encryptedNotes: "MITx MicroMasters",
    notesIv: "NIV_11",
  },
  {
    id: "acc-edu-4",
    userId: DEMO_USER_ID,
    accountName: "Duolingo",
    category: "Education",
    email: "alex.mercer@gmail.com",
    username: "alex_polyglot",
    websiteUrl: "https://duolingo.com",
    encryptedPassword: "ENC_PASS_DUOLINGO",
    iv: "IV_12",
    encryptedNotes: "Spanish and Japanese streaks",
    notesIv: "NIV_12",
  },
  {
    id: "acc-edu-5",
    userId: DEMO_USER_ID,
    accountName: "Khan Academy",
    category: "Education",
    email: "alex.mercer@gmail.com",
    username: "mercer_khan",
    websiteUrl: "https://khanacademy.org",
    encryptedPassword: "ENC_PASS_KHAN",
    iv: "IV_13",
    encryptedNotes: "Advanced Calculus refresher",
    notesIv: "NIV_13",
  },

  // Gaming (4)
  {
    id: "acc-game-1",
    userId: DEMO_USER_ID,
    accountName: "Steam",
    category: "Gaming",
    email: "alex.mercer@gmail.com",
    username: "CyberViperX",
    websiteUrl: "https://store.steampowered.com",
    encryptedPassword: "ENC_PASS_STEAM",
    iv: "IV_14",
    encryptedNotes: "Steam Guard enabled on primary phone",
    notesIv: "NIV_14",
  },
  {
    id: "acc-game-2",
    userId: DEMO_USER_ID,
    accountName: "Epic Games",
    category: "Gaming",
    email: "alex.mercer@gmail.com",
    username: "CyberViperX",
    websiteUrl: "https://epicgames.com",
    encryptedPassword: "ENC_PASS_EPIC",
    iv: "IV_15",
    encryptedNotes: "Unreal Engine developer library",
    notesIv: "NIV_15",
  },
  {
    id: "acc-game-3",
    userId: DEMO_USER_ID,
    accountName: "PlayStation Network",
    category: "Gaming",
    email: "alex.mercer@gmail.com",
    username: "ApexGhost99",
    websiteUrl: "https://playstation.com",
    encryptedPassword: "ENC_PASS_PSN",
    iv: "IV_16",
    encryptedNotes: "PS5 Primary console",
    notesIv: "NIV_16",
  },
  {
    id: "acc-game-4",
    userId: DEMO_USER_ID,
    accountName: "Battle.net",
    category: "Gaming",
    email: "alex.mercer@gmail.com",
    username: "Viper#2190",
    websiteUrl: "https://battle.net",
    encryptedPassword: "ENC_PASS_BATTLENET",
    iv: "IV_17",
    encryptedNotes: "Blizzard Authenticator attached",
    notesIv: "NIV_17",
  },

  // Banking (2)
  {
    id: "acc-bank-1",
    userId: DEMO_USER_ID,
    accountName: "Chase Bank",
    category: "Banking",
    email: "alex.mercer@gmail.com",
    username: "alexmercer_chase",
    websiteUrl: "https://chase.com",
    encryptedPassword: "ENC_PASS_CHASE",
    iv: "IV_18",
    encryptedNotes: "Checking and Sapphire Reserve",
    notesIv: "NIV_18",
  },
  {
    id: "acc-bank-2",
    userId: DEMO_USER_ID,
    accountName: "Vanguard",
    category: "Banking",
    email: "alex.mercer@gmail.com",
    username: "alex_invests_vg",
    websiteUrl: "https://vanguard.com",
    encryptedPassword: "ENC_PASS_VANGUARD",
    iv: "IV_19",
    encryptedNotes: "Index fund brokerage & Roth IRA",
    notesIv: "NIV_19",
  },

  // Shopping (3)
  {
    id: "acc-shop-1",
    userId: DEMO_USER_ID,
    accountName: "Amazon Prime",
    category: "Shopping",
    email: "alex.mercer@gmail.com",
    username: "alex.mercer",
    websiteUrl: "https://amazon.com",
    encryptedPassword: "ENC_PASS_AMAZON",
    iv: "IV_20",
    encryptedNotes: "Prime annual auto-renew",
    notesIv: "NIV_20",
  },
  {
    id: "acc-shop-2",
    userId: DEMO_USER_ID,
    accountName: "eBay",
    category: "Shopping",
    email: "alex.mercer@gmail.com",
    username: "alex_tech_vault",
    websiteUrl: "https://ebay.com",
    encryptedPassword: "ENC_PASS_EBAY",
    iv: "IV_21",
    encryptedNotes: "Vintage electronics trading",
    notesIv: "NIV_21",
  },
  {
    id: "acc-shop-3",
    userId: DEMO_USER_ID,
    accountName: "Apple Store",
    category: "Shopping",
    email: "alex.mercer@icloud.com",
    username: "alex.mercer@icloud.com",
    websiteUrl: "https://apple.com",
    encryptedPassword: "ENC_PASS_APPLE",
    iv: "IV_22",
    encryptedNotes: "Hardware care plans and Apple ID",
    notesIv: "NIV_22",
  },

  // Other (1)
  {
    id: "acc-other-1",
    userId: DEMO_USER_ID,
    accountName: "ProtonMail",
    category: "Other",
    email: "alex.mercer@proton.me",
    username: "alex.mercer",
    websiteUrl: "https://proton.me",
    encryptedPassword: "ENC_PASS_PROTON",
    iv: "IV_23",
    encryptedNotes: "Encrypted communications and recovery inbox",
    notesIv: "NIV_23",
  },

  // Work (2)
  {
    id: "acc-work-1",
    userId: DEMO_USER_ID,
    accountName: "GitHub Enterprise",
    category: "Work",
    email: "alex@company.tech",
    username: "alexmercer-eng",
    websiteUrl: "https://github.com",
    encryptedPassword: "ENC_PASS_GITHUB",
    iv: "IV_24",
    encryptedNotes: "YubiKey hardware key required",
    notesIv: "NIV_24",
  },
  {
    id: "acc-work-2",
    userId: DEMO_USER_ID,
    accountName: "Figma Team",
    category: "Work",
    email: "alex@company.tech",
    username: "alex_design_lead",
    websiteUrl: "https://figma.com",
    encryptedPassword: "ENC_PASS_FIGMA",
    iv: "IV_25",
    encryptedNotes: "Design systems workspace",
    notesIv: "NIV_25",
  },

  // Entertainment (2)
  {
    id: "acc-ent-1",
    userId: DEMO_USER_ID,
    accountName: "Netflix 4K",
    category: "Entertainment",
    email: "alex.mercer@gmail.com",
    username: "alex_mercer",
    websiteUrl: "https://netflix.com",
    encryptedPassword: "ENC_PASS_NETFLIX",
    iv: "IV_26",
    encryptedNotes: "Family profile PIN: 4892",
    notesIv: "NIV_26",
  },
  {
    id: "acc-ent-2",
    userId: DEMO_USER_ID,
    accountName: "Spotify Premium",
    category: "Entertainment",
    email: "alex.mercer@gmail.com",
    username: "alexmercer_music",
    websiteUrl: "https://spotify.com",
    encryptedPassword: "ENC_PASS_SPOTIFY",
    iv: "IV_27",
    encryptedNotes: "Hi-Fi streaming plan",
    notesIv: "NIV_27",
  },
];

// Initialize mock accounts
initialSeedAccounts.forEach((acc, index) => {
  const d = new Date(Date.now() - index * 3600000 * 4);
  mockAccounts.set(acc.id, {
    ...acc,
    createdAt: d,
    updatedAt: d,
  });
});

export const Storage = {
  async findUserByEmail(email: string): Promise<User | null> {
    const db = getDb();
    if (db) {
      try {
        const [found] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        return found || null;
      } catch (err) {
        console.warn("Neon query failed, using local store:", err);
      }
    }
    for (const u of Array.from(mockUsers.values())) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  },

  async findUserByUsername(username: string): Promise<User | null> {
    const db = getDb();
    if (db) {
      try {
        const [found] = await db.select().from(users).where(eq(users.username, username.toLowerCase())).limit(1);
        return found || null;
      } catch (err) {
        console.warn("Neon query failed, using local store:", err);
      }
    }
    for (const u of Array.from(mockUsers.values())) {
      if (u.username.toLowerCase() === username.toLowerCase()) return u;
    }
    return null;
  },

  async findUserByIdentifier(identifier: string): Promise<User | null> {
    const clean = identifier.toLowerCase().trim();
    const db = getDb();
    if (db) {
      try {
        const [found] = await db
          .select()
          .from(users)
          .where(or(eq(users.email, clean), eq(users.username, clean)))
          .limit(1);
        return found || null;
      } catch (err) {
        console.warn("Neon query failed, using local store:", err);
      }
    }
    for (const u of Array.from(mockUsers.values())) {
      if (u.email.toLowerCase() === clean || u.username.toLowerCase() === clean) {
        return u;
      }
    }
    return null;
  },

  async findUserById(id: string): Promise<User | null> {
    const db = getDb();
    if (db) {
      try {
        const [found] = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return found || null;
      } catch (err) {
        console.warn("Neon query failed, using local store:", err);
      }
    }
    return mockUsers.get(id) || null;
  },

  async createUser(data: NewUser): Promise<User> {
    const db = getDb();
    if (db) {
      try {
        const [created] = await db.insert(users).values(data).returning();
        return created;
      } catch (err) {
        console.warn("Neon insert failed, fallback to local store:", err);
      }
    }
    const record: User = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.set(record.id, record);
    return record;
  },

  async getUserAccounts(userId: string): Promise<VaultAccountRecord[]> {
    const db = getDb();
    if (db) {
      try {
        const rows = await db
          .select()
          .from(vaultAccounts)
          .where(eq(vaultAccounts.userId, userId))
          .orderBy(desc(vaultAccounts.createdAt));
        return rows;
      } catch (err) {
        console.warn("Neon query accounts failed, fallback to local store:", err);
      }
    }
    // Strict user isolation: only return accounts matching userId
    const res: VaultAccountRecord[] = [];
    for (const acc of Array.from(mockAccounts.values())) {
      if (acc.userId === userId) {
        res.push(acc);
      }
    }
    return res.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async createAccount(data: NewVaultAccountRecord): Promise<VaultAccountRecord> {
    const db = getDb();
    if (db) {
      try {
        const [created] = await db.insert(vaultAccounts).values(data).returning();
        return created;
      } catch (err) {
        console.warn("Neon create account failed, fallback to local store:", err);
      }
    }
    const record: VaultAccountRecord = {
      ...data,
      websiteUrl: data.websiteUrl || "",
      notesIv: data.notesIv || "",
      encryptedNotes: data.encryptedNotes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockAccounts.set(record.id, record);
    return record;
  },

  async updateAccount(
    id: string,
    userId: string,
    updates: Partial<NewVaultAccountRecord>
  ): Promise<VaultAccountRecord | null> {
    const db = getDb();
    if (db) {
      try {
        const [updated] = await db
          .update(vaultAccounts)
          .set({ ...updates, updatedAt: new Date() })
          .where(and(eq(vaultAccounts.id, id), eq(vaultAccounts.userId, userId)))
          .returning();
        return updated || null;
      } catch (err) {
        console.warn("Neon update account failed, fallback to local store:", err);
      }
    }
    const existing = mockAccounts.get(id);
    if (!existing || existing.userId !== userId) return null;
    const updated: VaultAccountRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    mockAccounts.set(id, updated);
    return updated;
  },

  async deleteAccount(id: string, userId: string): Promise<boolean> {
    const db = getDb();
    if (db) {
      try {
        const deleted = await db
          .delete(vaultAccounts)
          .where(and(eq(vaultAccounts.id, id), eq(vaultAccounts.userId, userId)))
          .returning();
        return deleted.length > 0;
      } catch (err) {
        console.warn("Neon delete failed, fallback to local store:", err);
      }
    }
    const existing = mockAccounts.get(id);
    if (!existing || existing.userId !== userId) {
      return false;
    }
    return mockAccounts.delete(id);
  },
};
