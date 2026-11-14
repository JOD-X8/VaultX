import { NextResponse } from "next/server";
import crypto from "crypto";
import { Storage } from "@/lib/storage";
import { hashPassword, createSessionToken, setSessionCookieOnResponse } from "@/lib/server-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, confirmPassword, vaultSalt, vaultVerifier, vaultVerifierIv } = body;

    // Validate inputs
    if (!username || !username.trim()) {
      return NextResponse.json({ error: "Username is required." }, { status: 400 });
    }
    const cleanUsername = username.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters (letters, numbers, underscores, hyphens)." },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email address format." }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Login password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    // Check unique username
    const existingUser = await Storage.findUserByUsername(cleanUsername);
    if (existingUser) {
      return NextResponse.json(
        { error: "This username is already taken. Please choose another." },
        { status: 409 }
      );
    }

    // Check unique email
    const existingEmail = await Storage.findUserByEmail(cleanEmail);
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash login password with scrypt + cryptographically secure salt
    const passwordHash = await hashPassword(password);

    // Default salt if client didn't supply one yet
    const salt = vaultSalt || crypto.randomBytes(16).toString("base64");
    const verifier = vaultVerifier || "VAULTX_CANARY_TOKEN";
    const verifierIv = vaultVerifierIv || "VAULTX_IV_TOKEN";

    const id = "usr_" + Math.random().toString(36).substring(2, 11);
    const user = await Storage.createUser({
      id,
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      vaultSalt: salt,
      vaultVerifier: verifier,
      vaultVerifierIv: verifierIv,
    });

    // Create secure signed session
    const token = createSessionToken(user.id, user.email, user.username);
    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        vaultSalt: user.vaultSalt,
        vaultVerifier: user.vaultVerifier,
        vaultVerifierIv: user.vaultVerifierIv,
      },
      token,
    });

    setSessionCookieOnResponse(response, token);
    return response;
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: err.message || "Registration failed." }, { status: 500 });
  }
}
