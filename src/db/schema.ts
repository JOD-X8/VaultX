import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  vaultSalt: text("vault_salt").notNull(),
  vaultVerifier: text("vault_verifier").notNull(),
  vaultVerifierIv: text("vault_verifier_iv").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vaultAccounts = pgTable("vault_accounts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountName: varchar("account_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  websiteUrl: varchar("website_url", { length: 512 }).notNull().default(""),
  encryptedPassword: text("encrypted_password").notNull(),
  iv: text("iv").notNull(),
  encryptedNotes: text("encrypted_notes").default(""),
  notesIv: text("notes_iv").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type VaultAccountRecord = typeof vaultAccounts.$inferSelect;
export type NewVaultAccountRecord = typeof vaultAccounts.$inferInsert;
