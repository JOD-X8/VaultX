import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "vaultx_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "vaultx-production-hmac-secret-key-32chars-fallback";

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    if (!storedHash.includes(":")) {
      return password === storedHash;
    }
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;

    return new Promise((resolve) => {
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        try {
          const keyBuffer = Buffer.from(key, "hex");
          resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
        } catch {
          resolve(false);
        }
      });
    });
  } catch {
    return false;
  }
}

export function createSessionToken(userId: string, email: string, username: string): string {
  const payload = JSON.stringify({
    userId,
    email,
    username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  const data = Buffer.from(payload).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; email: string; username: string } | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
    if (signature !== expectedSig) {
      return null;
    }

    const json = Buffer.from(data, "base64url").toString("utf-8");
    const payload = JSON.parse(json);

    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      username: payload.username || payload.email.split("@")[0],
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(req?: Request) {
  // 1. Check Authorization Bearer header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.substring(7).trim();
      const verified = verifySessionToken(bearerToken);
      if (verified) return verified;
    }
  }

  // 2. Check Cookie
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      return verifySessionToken(token);
    }
  } catch {
    // In environments where cookies() throws
  }

  return null;
}

export function setSessionCookie(token: string) {
  const isHttps = process.env.NODE_ENV === "production" && (process.env.NEXT_PUBLIC_APP_URL?.startsWith("https") ?? false);
  try {
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  } catch {
    // In route handlers, response.cookies.set will be used
  }
}

export function setSessionCookieOnResponse(response: NextResponse, token: string) {
  const isHttps = process.env.NODE_ENV === "production" && (process.env.NEXT_PUBLIC_APP_URL?.startsWith("https") ?? false);
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}

export function clearSessionCookie() {
  try {
    const cookieStore = cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {}
}
