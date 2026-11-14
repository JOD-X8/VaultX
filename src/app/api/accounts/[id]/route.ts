import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { Storage } from "@/lib/storage";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    // Prevent tampering with userId
    delete body.userId;
    delete body.id;

    // Enforce server-side user-level authorization
    const updated = await Storage.updateAccount(id, session.userId, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Account not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ account: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update account" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { id } = params;

    // Enforce server-side user-level authorization
    const success = await Storage.deleteAccount(id, session.userId);
    if (!success) {
      return NextResponse.json(
        { error: "Account not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete account" }, { status: 500 });
  }
}
