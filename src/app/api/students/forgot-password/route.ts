import { NextResponse } from "next/server";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendEmail, isSesConfigured } from "@/lib/email";

/**
 * POST /api/students/forgot-password
 * Body: { studentId: string } // BRG-YYYY-NNNN
 *
 * If issuedPassword is on file, email it to the parent.
 * Otherwise notify admin that a manual reset is needed.
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

    const snap = await getDocs(
      query(collection(db, "students"), where("studentId", "==", raw), limit(1))
    );
    // Always return a generic success message to avoid leaking whether an ID exists
    const generic = {
      success: true,
      message:
        "If this Student ID is registered, login details will be sent to the parent email on file. An admin can also reset the password from the Bridgitus admin portal.",
    };

    if (snap.empty) {
      return NextResponse.json(generic);
    }

    const docSnap = snap.docs[0]!;
    const student = docSnap.data();
    const parentEmail = ((student.parentEmail as string) || (student.email as string) || "").trim();
    const firstName = (student.firstName as string) || "Student";
    const issuedPassword = (student.issuedPassword as string) || "";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@bridgitus.com";
    const portalUrl =
      process.env.NEXT_PUBLIC_PORTAL_URL || "https://bridgitus.com/portal/login";
    const fromEmail = process.env.EMAIL_FROM || "noreply@bridgitus.com";

    if (!isSesConfigured()) {
      return NextResponse.json({
        success: true,
        message:
          "Password recovery email is temporarily unavailable. Please contact Bridgitus admin or your parent to reset the password.",
      });
    }

    if (parentEmail && issuedPassword) {
      await sendEmail({
        to: parentEmail,
        from: fromEmail,
        subject: `Bridgitus Learning — login reminder for ${firstName}`,
        html: `<!DOCTYPE html><html><body style="font-family:sans-serif;">
          <h2>Portal login reminder</h2>
          <p>Hi,</p>
          <p>A password reminder was requested for <strong>${firstName}</strong>.</p>
          <p><strong>Student ID:</strong> ${raw}<br/>
          <strong>Password:</strong> ${issuedPassword}</p>
          <p>Log in at <a href="${portalUrl}">${portalUrl}</a> using Student ID + password.</p>
        </body></html>`,
      });
    } else {
      await sendEmail({
        to: adminEmail,
        from: fromEmail,
        subject: `Password reset needed — ${raw}`,
        html: `<p>Student <strong>${raw}</strong> (${firstName}) requested a password reminder.
          ${issuedPassword ? "" : "No issuedPassword on file — please reset from Admin → Students."}
          Parent email: ${parentEmail || "(none)"}</p>`,
      });
      if (parentEmail) {
        await sendEmail({
          to: parentEmail,
          from: fromEmail,
          subject: `Bridgitus Learning — password help for ${firstName}`,
          html: `<p>Hi,</p><p>We received a password help request for <strong>${firstName}</strong> (Student ID ${raw}).
            Our team will reset the password shortly, or you can contact Bridgitus support.</p>
            <p>Portal: <a href="${portalUrl}">${portalUrl}</a></p>`,
        });
      }
    }

    return NextResponse.json(generic);
  } catch (err: unknown) {
    console.error("forgot-password error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 }
    );
  }
}
