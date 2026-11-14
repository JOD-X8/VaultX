# VaultX — Multi-User Cloud Password Manager

VaultX is a modern, public multi-user cloud password manager engineered with a **Neon Red + White** visual design identity, **Scrypt Server-Side Authentication**, **Server-Enforced User Isolation**, and client-side **Zero-Knowledge AES-256 Encryption**.

---

## 1. Multi-User Authentication & User Isolation

VaultX is built from the ground up as a multi-user cloud application:
- **Registration:** Users sign up with a unique username (3-30 chars), email address, login password (min 8 chars), and confirmation password.
- **Login:** Users authenticate using their **Username OR Email** and login password.
- **User Isolation:**
  - Every registered user gets their own private vault. User A can never access or see User B's accounts.
  - Authorization is enforced strictly on the server via verified session tokens; user IDs supplied by the frontend are never trusted.
  - Cross-user updates or deletes return a 404 / Access Denied.
- **Authentication Security:**
  - Login passwords are encrypted using **Node.js `crypto.scrypt`** with unique per-user cryptographic salts.
  - Login passwords are never stored in plaintext.
  - Sessions are protected via HMAC-SHA256 signed tamper-proof tokens stored in secure, `httpOnly`, `sameSite: lax` cookies with a 7-day expiration.
  - Instant logout immediately revokes the session and clears in-memory keys.

### Important Distinction: Login Password vs. Vault Master Key
- **VaultX Login Password:** Authenticates your account on the server using hardware-resistant scrypt hashing.
- **Vault Master Key:** Used in the browser via Web Crypto (`AES-GCM-256`) to encrypt and decrypt your stored credentials locally. Plaintext passwords never touch the server or database.

---

## 2. Neon Red + White Visual Identity

The interface adheres to the requested color system:
- **Neon Red Accent (`#FF1744`)**: Highlights, active navigation states, interactive buttons, and glowing focus rings.
- **Primary Red (`#E6002E`)**: Gradients, primary button states, and badge accents.
- **Deep Red (`#A50021`)**: Subtle contrast accents.
- **Pure White (`#FFFFFF`)**: Primary account cards, dialogs, and elevated panels.
- **Soft Red Background (`#FFF5F6`)**: Light, welcoming page background (no dark theme).
- **Light Rose Border (`#FFD5DC`)**: Crisp borders on cards, inputs, and chips.
- **Main Text (`#202020`) & Secondary Text (`#777777`)**: Clear, readable typography.

---

## 3. Core Experience & One-Click Field Copying

Every saved account displays:
- **Account Name** (e.g. Instagram, GitHub, Netflix)
- **Category Badge** (Social Media, Education, Gaming, Banking, Shopping, Work, Entertainment, Other)
- **Email Address**
- **Username**
- **Password** (masked with instant Show / Hide toggle)
- **Website URL** (with direct launch icon)
- **Optional Secure Notes**

**Individual Field Copying:**
Every single field features its own copy button with animated, instant **"Copied!"** visual confirmation. Users never have to copy the whole record just to get a username or password.

---

## 4. Live Dashboard Overview
- **Live Stats Cards:** Total saved accounts, Number of categories used, Recently added count, and Zero-Knowledge health indicator.
- **Dynamic Category Overview:** Live counts computed directly from saved accounts (e.g., Social Media — 8, Education — 5, Gaming — 4, Banking — 2, Shopping — 3, Other — 1).
- **Interactive Filtering:** Click any category chip to filter cards instantly.
- **Live Search & Sort:** Search across Account Name, Email, and Username; sort by Recently Added or Alphabetical (A-Z / Z-A); toggle between Responsive Grid and Clean List layouts.
- **Password Generator:** Integrated generator with customizable length slider (12, 16, 20, 24 characters) and uppercase, lowercase, numbers, and symbols pools.

---

## 5. Cloud Architecture: Vercel + Neon PostgreSQL + Drizzle ORM

VaultX is configured for deployment on **Vercel** with a serverless **Neon PostgreSQL** database.

### Database Setup with Neon
1. Create a project on [Neon.tech](https://neon.tech).
2. Copy your **Pooled Connection String** from the Neon dashboard.
3. Create a `.env.local` file in your project root (or configure Environment Variables in your Vercel project):
   ```bash
   DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"
   DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require"
   SESSION_SECRET="your-32-character-random-session-secret-here"
   ```
4. Push database tables using Drizzle:
   ```bash
   npm run db:push
   ```

*Note: If `DATABASE_URL` is not yet configured, VaultX includes a built-in fallback store with 27 pre-seeded sample accounts for demo user `@alexmercer` so you can test all UI features and animations out of the box.*

---

## 6. Local Development & Build

### Install Dependencies
```bash
npm install
```

### Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```
