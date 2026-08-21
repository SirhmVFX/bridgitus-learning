import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  adminDb,
  isFirebaseAdminConfigured,
} from "@/lib/firebaseAdmin";
import { sendEmail, brandedEmail, isEmailConfigured } from "@/lib/email";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function siteOrigin(request: Request): string {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_PORTAL_URL?.replace(/\/portal\/login\/?$/, "") ||
    "";
  if (env) return env.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  return "https://bridgitus.com";
}

/**
 * POST /api/students/forgot-password
 * Body: { studentId: string } // BRG-YYYY-NNNN
 *
 * Emails ONLY the parent/guardian a secure link to set a new portal password.
 * Student Auth uses a non-mailbox address (@students.bridgitus.local), so parents
 * complete the reset on behalf of / with the student.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw = String(body.studentId || "").trim().toUpperCase();
    if (!/^BRG-\d{4}-\d{4}$/.test(raw)) {
      return NextResponse.json(
        { error: "Enter a valid Student ID (e.g. BRG-2026-0001)." },
        { status: 400 }
      );
    }

    const generic = {
      success: true,
      message:
        "If this Student ID is registered, a password reset link has been sent to the parent/guardian email on file. Check that inbox (and spam) and follow the steps in the email.",
    };

    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json({
        success: true,
        message:
          "Password reset is temporarily unavailable. Please contact Bridgitus support.",
      });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json({
        success: true,
        message:
          "Password recovery email is temporarily unavailable. Please contact Bridgitus support.",
      });
    }

    const snap = await adminDb()
      .collection("students")
      .where("studentId", "==", raw)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json(generic);
    }

    const docSnap = snap.docs[0]!;
    const student = docSnap.data();
    const parentEmail = (
      (student.parentEmail as string) ||
      (student.email as string) ||
      ""
    ).trim();
    const firstName = (student.firstName as string) || "Student";
    const lastName = (student.lastName as string) || "";
    const uid = student.uid as string | undefined;

    if (!parentEmail || !uid) {
      // Still generic — do not leak account issues
      return NextResponse.json(generic);
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

    // Invalidate previous unused tokens for this student (no composite index needed)
    const old = await adminDb()
      .collection("passwordResets")
      .where("studentDocId", "==", docSnap.id)
      .get();
    const batch = adminDb().batch();
    old.docs.forEach((d) => {
      if (d.data().used) return;
      batch.update(d.ref, { used: true, invalidatedAt: FieldValue.serverTimestamp() });
    });
    const resetRef = adminDb().collection("passwordResets").doc();
    batch.set(resetRef, {
      tokenHash,
      studentDocId: docSnap.id,
      studentId: raw,
      parentEmail,
      used: false,
      expiresAt,
      createdAt: FieldValue.serverTimestamp(),
    });
    await batch.commit();

    const origin = siteOrigin(request);
    const resetUrl = `${origin}/portal/reset-password?token=${token}`;
    const portalUrl =
      process.env.NEXT_PUBLIC_PORTAL_URL || `${origin}/portal/login`;

    await sendEmail({
      to: parentEmail,
      subject: `Reset portal password for ${firstName} — Bridgitus Learning`,
      html: brandedEmail(
        "Reset student password",
        `
        <p style="margin:0 0 16px;">Hi,</p>
        <p style="margin:0 0 16px;">
          We received a request to reset the Bridgitus Learning portal password for
          <strong>${firstName} ${lastName}</strong>.
        </p>

        <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 18px;margin:0 0 20px;">
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Student details</p>
          <p style="margin:0 0 4px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p style="margin:0;"><strong>Student ID:</strong>
            <span style="font-family:ui-monospace,monospace;color:#00369b;font-size:16px;">${raw}</span>
          </p>
        </div>

        <p style="margin:0 0 8px;"><strong>How to set a new password</strong></p>
        <ol style="margin:0 0 20px;padding-left:20px;color:#334155;">
          <li style="margin-bottom:8px;">Open the secure link below (valid for <strong>24 hours</strong>).</li>
          <li style="margin-bottom:8px;">Choose a new password (at least 8 characters).</li>
          <li style="margin-bottom:8px;">Confirm the password and submit.</li>
          <li style="margin-bottom:8px;">Your child can then sign in at the portal with
            <strong>Student ID + the new password</strong> (not an email address).</li>
        </ol>

        <p style="margin:0 0 24px;text-align:center;">
          <a href="${resetUrl}"
             style="display:inline-block;background:#00369b;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:8px;font-size:15px;">
            Set new password
          </a>
        </p>

        <p style="margin:0 0 12px;font-size:13px;color:#64748b;word-break:break-all;">
          Or copy this link into your browser:<br/>
          <a href="${resetUrl}" style="color:#00369b;">${resetUrl}</a>
        </p>

        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;margin:20px 0;">
          <p style="margin:0;font-size:13px;color:#92400e;">
            <strong>Why this email went to you:</strong> Student accounts use a system login that cannot receive email.
            Password resets are always sent to the parent/guardian on file so you can help your child update their password safely.
          </p>
        </div>

        <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
          After resetting, log in here:
          <a href="${portalUrl}" style="color:#00369b;">${portalUrl}</a>
        </p>
        <p style="margin:16px 0 0;font-size:13px;color:#94a3b8;">
          If you did not request this, you can ignore this email — the link expires automatically and the current password stays unchanged.
        </p>
        <p style="margin:20px 0 0;">Best regards,<br/><strong>The Bridgitus Team</strong></p>
        `
      ),
    });

    return NextResponse.json(generic);
  } catch (err: unknown) {
    console.error("forgot-password error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 }
    );
  }
}
