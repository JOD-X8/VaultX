import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { Storage } from "@/lib/storage";

export async function GET(req: Request) {
  try {
    const session = await getCurrentUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // Strictly fetch accounts for the authenticated session user
    const accounts = await Storage.getUserAccounts(session.userId);
    return NextResponse.json({ accounts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // Always use authenticated session userId - NEVER trust frontend userId
    const userId = session.userId;

    const body = await req.json();
    const {
      accountName,
      category,
      email,
      username,
      websiteUrl,
      encryptedPassword,
      iv,
      encryptedNotes,
      notesIv,
    } = body;

    if (!accountName || !category || !encryptedPassword || !iv) {
      return NextResponse.json(
        { error: "Account name, category, and encrypted password are required." },
        { status: 400 }
      );
    }

    const id = "acc_" + Math.random().toString(36).substring(2, 11);
    const newAccount = await Storage.createAccount({
      id,
      userId,
      accountName,
      category,
      email: email || "",
      username: username || "",
      websiteUrl: websiteUrl || "",
      encryptedPassword,
      iv,
      encryptedNotes: encryptedNotes || "",
      notesIv: notesIv || "",
    });

    return NextResponse.json({ account: newAccount }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create account" }, { status: 500 });
  }
}
