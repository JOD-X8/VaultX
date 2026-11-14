import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { Storage } from "@/lib/storage";

export async function GET(req: Request) {
  try {
    const session = await getCurrentUser(req);
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await Storage.findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        vaultSalt: user.vaultSalt,
        vaultVerifier: user.vaultVerifier,
        vaultVerifierIv: user.vaultVerifierIv,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch session" }, { status: 500 });
  }
}
