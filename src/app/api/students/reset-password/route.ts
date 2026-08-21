import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  adminAuth,
  adminDb,
  isFirebaseAdminConfigured,
} from "@/lib/firebaseAdmin";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * GET /api/students/reset-password?token=...
 * Validates a reset token (for the reset page).
 *
 * POST /api/students/reset-password
 * Body: { token: string, password: string }
 * Sets a new Firebase Auth password + stores issuedPassword on the student.
 */
export async function GET(request: Request) {
  try {
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json({ error: "Reset is temporarily unavailable." }, { status: 503 });
    }

    const token = new URL(request.url).searchParams.get("token")?.trim() || "";
    if (!token || token.length < 32) {
      return NextResponse.json({ error: "Invalid or missing reset link." }, { status: 400 });
    }

    const info = await lookupToken(token);
    if (!info.ok) {
      return NextResponse.json({ error: info.error }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      studentId: info.studentId,
      firstName: info.firstName,
    });
  } catch (err: unknown) {
    console.error("reset-password GET error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Validation failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json({ error: "Reset is temporarily unavailable." }, { status: 503 });
    }

    const body = await request.json();
    const token = String(body.token || "").trim();
    const password = String(body.password || "");

    if (!token || token.length < 32) {
      return NextResponse.json({ error: "Invalid or missing reset link." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    if (password.length > 72) {
      return NextResponse.json({ error: "Password is too long." }, { status: 400 });
    }

    const info = await lookupToken(token);
    if (!info.ok) {
      return NextResponse.json({ error: info.error }, { status: 400 });
    }

    await adminAuth().updateUser(info.uid, { password });
    await adminDb().collection("students").doc(info.studentDocId).update({
      issuedPassword: password,
      passwordResetAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    await adminDb().collection("passwordResets").doc(info.resetDocId).update({
      used: true,
      usedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      studentId: info.studentId,
      message: "Password updated. You can now sign in with Student ID and the new password.",
    });
  } catch (err: unknown) {
    console.error("reset-password POST error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Reset failed" },
      { status: 500 }
    );
  }
}

async function lookupToken(token: string): Promise<
  | {
      ok: true;
      resetDocId: string;
      studentDocId: string;
      studentId: string;
      firstName: string;
      uid: string;
    }
  | { ok: false; error: string }
> {
  const tokenHash = hashToken(token);
  const snap = await adminDb()
    .collection("passwordResets")
    .where("tokenHash", "==", tokenHash)
    .limit(1)
    .get();

  if (snap.empty) {
    return { ok: false, error: "This reset link is invalid or has already been used." };
  }

  const resetDoc = snap.docs[0]!;
  const data = resetDoc.data();
  if (data.used) {
    return { ok: false, error: "This reset link has already been used. Request a new one from the login page." };
  }

  const expiresAt = data.expiresAt as Timestamp | undefined;
  if (expiresAt && expiresAt.toMillis() < Date.now()) {
    return { ok: false, error: "This reset link has expired. Request a new one from the login page." };
  }

  const studentDocId = data.studentDocId as string;
  const studentSnap = await adminDb().collection("students").doc(studentDocId).get();
  if (!studentSnap.exists) {
    return { ok: false, error: "Student account not found." };
  }

  const student = studentSnap.data()!;
  const uid = student.uid as string | undefined;
  if (!uid) {
    return { ok: false, error: "This student account cannot be reset. Contact Bridgitus support." };
  }

  return {
    ok: true,
    resetDocId: resetDoc.id,
    studentDocId,
    studentId: (student.studentId as string) || (data.studentId as string) || "",
    firstName: (student.firstName as string) || "Student",
    uid,
  };
}
