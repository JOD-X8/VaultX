import { NextResponse } from "next/server";
import { Storage } from "@/lib/storage";
import { verifyPassword, createSessionToken, setSessionCookieOnResponse } from "@/lib/server-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, email, username, password, isDemoLogin } = body;

    // Optional demo login convenience button
    if (isDemoLogin) {
      const demoUser = await Storage.findUserById("demo-user-vaultx-id");
      if (demoUser) {
        const token = createSessionToken(demoUser.id, demoUser.email, demoUser.username);
        const response = NextResponse.json({
          user: {
            id: demoUser.id,
            username: demoUser.username,
            email: demoUser.email,
            vaultSalt: demoUser.vaultSalt,
            vaultVerifier: demoUser.vaultVerifier,
            vaultVerifierIv: demoUser.vaultVerifierIv,
          },
          token,
        });
        setSessionCookieOnResponse(response, token);
        return response;
      }
    }

    const loginIdentifier = (identifier || username || email || "").trim();

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { error: "Username or email and password are required." },
        { status: 400 }
      );
    }

    // Lookup user by either unique username or email
    const user = await Storage.findUserByIdentifier(loginIdentifier);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username/email or password credentials." },
        { status: 401 }
      );
    }

    // Verify hashed password securely
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid username/email or password credentials." },
        { status: 401 }
      );
    }

    // Issue secure signed session cookie & token
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
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message || "Login failed." }, { status: 500 });
  }
}
