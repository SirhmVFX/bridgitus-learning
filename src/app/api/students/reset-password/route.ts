import { NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * GET /api/students/reset-password?token=...
 * POST /api/students/reset-password  Body: { token, password }
 */
export async function GET(request: Request) {
  try {
    const token = new URL(request.url).searchParams.get("token")?.trim() || "";
    if (!token || token.length < 32) {
      return json({ error: "Invalid or missing reset link." }, 400);
    }

    const info = await lookupToken(token);
    if (!info.ok) {
      return json({ error: info.error }, 400);
    }

    return json({
      valid: true,
      studentId: info.studentId,
      firstName: info.firstName,
    });
  } catch (err: unknown) {
    console.error("reset-password GET error:", err);
    return json(
      { error: err instanceof Error ? err.message : "Validation failed" },
      500
    );
  }
}

export async function POST(request: Request) {
  try {
    let body: { token?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid request body." }, 400);
    }

    const token = String(body.token || "").trim();
    const password = String(body.password || "");

    if (!token || token.length < 32) {
      return json({ error: "Invalid or missing reset link." }, 400);
    }
    if (password.length < 8) {
      return json({ error: "Password must be at least 8 characters." }, 400);
    }
    if (password.length > 72) {
      return json({ error: "Password is too long." }, 400);
    }

    const info = await lookupToken(token);
    if (!info.ok) {
      return json({ error: info.error }, 400);
    }

    const { adminAuth, adminDb } = await import("@/lib/firebaseAdmin");
    const { FieldValue } = await import("firebase-admin/firestore");

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

    return json({
      success: true,
      studentId: info.studentId,
      message: "Password updated. You can now sign in with Student ID and the new password.",
    });
  } catch (err: unknown) {
    console.error("reset-password POST error:", err);
    return json(
      { error: err instanceof Error ? err.message : "Reset failed" },
      500
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
  const admin = await import("@/lib/firebaseAdmin");
  if (!admin.isFirebaseAdminConfigured()) {
    return { ok: false, error: "Reset is temporarily unavailable." };
  }

  try {
    admin.getAdminApp();
  } catch {
    return { ok: false, error: "Reset is temporarily unavailable." };
  }

  const tokenHash = hashToken(token);
  const snap = await admin
    .adminDb()
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
    return {
      ok: false,
      error: "This reset link has already been used. Request a new one from the login page.",
    };
  }

  const expiresAt = data.expiresAt as { toMillis?: () => number } | undefined;
  if (expiresAt?.toMillis && expiresAt.toMillis() < Date.now()) {
    return {
      ok: false,
      error: "This reset link has expired. Request a new one from the login page.",
    };
  }

  const studentDocId = data.studentDocId as string;
  const studentSnap = await admin.adminDb().collection("students").doc(studentDocId).get();
  if (!studentSnap.exists) {
    return { ok: false, error: "Student account not found." };
  }

  const student = studentSnap.data()!;
  const uid = student.uid as string | undefined;
  if (!uid) {
    return {
      ok: false,
      error: "This student account cannot be reset. Contact Bridgitus support.",
    };
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
