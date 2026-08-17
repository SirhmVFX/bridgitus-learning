import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { sendEmail, isSesConfigured } from "@/lib/email";
import { maxStudentsForPlan } from "@/lib/pricingPlans";

// ── Helpers ────────────────────────────────────────────────

async function nextStudentIdCounter(): Promise<{ year: number; next: number }> {
  const year = new Date().getFullYear();
  const prefix = `BRG-${year}-`;
  const snap = await getDocs(
    query(
      collection(db, "students"),
      where("studentId", ">=", prefix),
      where("studentId", "<", `BRG-${year + 1}-`)
    )
  );
  return { year, next: snap.size + 1 };
}

function formatStudentId(year: number, n: number): string {
  return `BRG-${year}-${String(n).padStart(4, "0")}`;
}

/** Unique Firebase Auth email — students never type this; they log in with Student ID. */
function authEmailForStudentId(studentId: string): string {
  return `${studentId.toLowerCase()}@students.bridgitus.local`;
}

function generatePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "@#$!";
  const all = upper + lower + digits + symbols;
  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = 4; i < 10; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
}

// ── Types ──────────────────────────────────────────────────

interface TimeSlot { date: string; time: string; }

interface StudentData {
  firstName: string; lastName: string; age: string; gender: string;
  school: string; grade: string; subjectHelpNeeded: string;
  expectingResult: string; helpComment: string; currentPerformance: string;
  schoolAttitude: string; mind: string; personality: string;
  favouriteThingsToDo: string; lessonType: string; location: string;
  startPreference: string; startDate: string;
  selectedTimeSlots: TimeSlot[];
}

interface RegisterData {
  organizingFor: string; parentFirstName: string; parentLastName: string;
  parentEmail: string; parentPhone: string; parentPostcode: string;
  parentReferredBy: string; noOfStudents: string;
  planId?: string; planTitle?: string;
  planAmountCents?: number; planDurationDays?: number;
  startPreference: string; startDate: string; students: StudentData[];
}

// ── Email Templates ────────────────────────────────────────

function credentialsEmail(
  studentName: string, studentId: string, parentEmail: string,
  password: string, grade: string, portalUrl: string
): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f8fafc;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#00369b;padding:30px 40px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">Welcome to Bridgitus Learning Portal!</h1>
    </div>
    <div style="padding:40px;">
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Your registration is confirmed. Log in with your <strong>Student ID</strong> and password (not email):</p>
      <div style="background:#f0f7ff;border:2px solid #00369b;padding:24px;margin:24px 0;text-align:center;">
        <h2 style="color:#00369b;margin:0 0 16px;">Your Login Credentials</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 12px;font-weight:600;color:#475569;text-align:left;width:140px;">Student ID</td>
              <td style="padding:8px 12px;font-family:monospace;font-size:16px;font-weight:700;color:#00369b;">${studentId}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#475569;text-align:left;">Password</td>
              <td style="padding:8px 12px;font-family:monospace;font-size:16px;font-weight:700;color:#00369b;letter-spacing:0.1em;">${password}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#475569;text-align:left;">Grade</td>
              <td style="padding:8px 12px;">Grade ${grade}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#475569;text-align:left;">Parent email</td>
              <td style="padding:8px 12px;font-size:14px;color:#2c3e50;">${parentEmail}</td></tr>
        </table>
      </div>
      <div style="background:#fff3cd;border-left:4px solid #f59e0b;padding:12px 16px;margin:16px 0;">
        <p style="margin:0;font-size:14px;color:#92400e;">
          <strong>Important:</strong> Use your Student ID + password to log in. Change your password after first login.
        </p>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${portalUrl}" style="display:inline-block;background:#00369b;color:#fff;text-decoration:none;padding:14px 32px;font-weight:600;font-size:16px;">
          Access Learning Portal →
        </a>
      </div>
      <p>Best regards,<br><strong>The Bridgitus Team</strong></p>
    </div>
  </div>
</body></html>`;
}

function parentConfirmationEmail(
  parentName: string,
  students: Array<{ name: string; studentId: string; grade: string; password: string }>
): string {
  const rows = students.map(s => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${s.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-family:monospace;color:#00369b;font-weight:700;">${s.studentId}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-family:monospace;">${s.password}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">Grade ${s.grade}</td>
    </tr>`).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#00369b;padding:30px 40px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">Registration Confirmed — Bridgitus Learning</h1>
    </div>
    <div style="padding:40px;">
      <p>Dear <strong>${parentName}</strong>,</p>
      <p>Your registration has been processed. Each child logs in with their own <strong>Student ID</strong> and password:</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;">
        <thead><tr style="background:#f8fafc;">
          <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;">Name</th>
          <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;">Student ID</th>
          <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;">Password</th>
          <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;">Grade</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:24px;">Best regards,<br><strong>The Bridgitus Team</strong></p>
    </div>
  </div>
</body></html>`;
}

// ── POST Handler ───────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const { registerData }: { registerData: RegisterData } = await request.json();
    console.log("Registration data received:", JSON.stringify(registerData, null, 2));

    if (!registerData.planId || !registerData.planTitle) {
      return NextResponse.json(
        { success: false, message: "Please select a pricing plan before registering." },
        { status: 400 }
      );
    }

    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://bridgitus.com/portal/login";
    const fromEmail = process.env.EMAIL_FROM || "noreply@bridgitus.com";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@bridgitus.com";
    const emailReady = isSesConfigured();
    if (!emailReady) {
      console.warn("AWS SES is not fully configured — registration will continue without sending emails.");
    }

    const parentEmail = registerData.parentEmail.trim().toLowerCase();

    // Returning parent: same email can already have children — we still add more
    const existingSnap = await getDocs(
      query(collection(db, "students"), where("parentEmail", "==", parentEmail))
    );
    const existingCount = existingSnap.size;
    if (existingCount > 0) {
      console.log(`Parent ${parentEmail} already has ${existingCount} student(s) — adding more under the same email.`);
    }

    const isFamily = /family/i.test(registerData.planTitle || "") || maxStudentsForPlan({ title: registerData.planTitle, badge: "" }) > 1;
    const allowedMax = isFamily ? 3 : 1;
    if (!registerData.students?.length || registerData.students.length > allowedMax) {
      return NextResponse.json(
        {
          success: false,
          message: allowedMax === 1
            ? "This plan allows registration for one student only. Choose the Family Plan for up to three students."
            : `Family Plan allows up to ${allowedMax} students per registration.`,
        },
        { status: 400 }
      );
    }

    // Family plan: total children under this parent email cannot exceed 3
    if (isFamily && existingCount + registerData.students.length > 3) {
      const remaining = Math.max(0, 3 - existingCount);
      return NextResponse.json(
        {
          success: false,
          message: remaining === 0
            ? "This Family Plan already has 3 students registered. Contact Bridgitus admin if you need changes."
            : `This Family Plan already has ${existingCount} student(s). You can add ${remaining} more (maximum 3).`,
          existingCount,
          remaining,
        },
        { status: 400 }
      );
    }

    // Non-family: if parent already has a student, block extra registrations on non-family plans
    if (!isFamily && existingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This email already has a student registered. To add another child, register again with the Family Plan (up to 3), or contact Bridgitus admin.",
          existingCount,
        },
        { status: 400 }
      );
    }

    const createdStudents: Array<{
      name: string; studentId: string; email: string;
      grade: string; password: string; firebaseUid: string;
    }> = [];
    let emailsSent = 0;
    let emailsFailed = 0;

    const { year, next: startN } = await nextStudentIdCounter();
    let idCounter = startN;

    for (const student of registerData.students) {
      console.log(`Processing student: ${student.firstName} ${student.lastName}`);

      const studentId = formatStudentId(year, idCounter++);
      const password = generatePassword();
      // Unique Auth identity per child — parent contact email is shared and never used for Auth
      const authEmail = authEmailForStudentId(studentId);

      const cred = await createUserWithEmailAndPassword(auth, authEmail, password);
      const firebaseUid = cred.user.uid;

      const studentDocRef = await addDoc(collection(db, "students"), {
        uid: firebaseUid,
        studentId,
        email: parentEmail,
        authEmail,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.age,
        gender: student.gender,
        school: student.school,
        grade: student.grade,
        subjects: student.subjectHelpNeeded
          ? student.subjectHelpNeeded.split(",").filter(Boolean)
          : [],
        parentFirstName: registerData.parentFirstName,
        parentLastName: registerData.parentLastName,
        parentEmail,
        parentPhone: registerData.parentPhone,
        postcode: registerData.parentPostcode,
        organizingFor: registerData.organizingFor,
        expectingResult: student.expectingResult,
        helpComment: student.helpComment,
        currentPerformance: student.currentPerformance,
        schoolAttitude: student.schoolAttitude,
        mind: student.mind,
        personality: student.personality,
        favouriteThingsToDo: student.favouriteThingsToDo,
        lessonType: student.lessonType,
        location: student.location,
        startPreference: student.startPreference,
        startDate: student.startDate,
        selectedTimeSlots: student.selectedTimeSlots,
        planId: registerData.planId,
        planTitle: registerData.planTitle,
        issuedPassword: password,
        status: "active",
        paymentStatus: "pending",
        credentialsSent: false,
        enrolledAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      let studentMailOk = false;
      if (emailReady) {
        try {
          await sendEmail({
            to: parentEmail,
            from: fromEmail,
            subject: `Your Bridgitus Learning Portal Credentials — ${student.firstName}`,
            html: credentialsEmail(
              `${student.firstName} ${student.lastName}`,
              studentId, parentEmail, password, student.grade, portalUrl
            ),
          });
          studentMailOk = true;
          emailsSent++;
        } catch (mailErr) {
          emailsFailed++;
          console.error(`Failed to send credentials email for ${studentId}:`, mailErr);
        }
      }

      if (studentMailOk) {
        await updateDoc(studentDocRef, { credentialsSent: true, updatedAt: serverTimestamp() });
      }

      createdStudents.push({
        name: `${student.firstName} ${student.lastName}`,
        studentId,
        email: parentEmail,
        grade: student.grade,
        password,
        firebaseUid,
      });
      console.log(`Created student: ${student.firstName} ${student.lastName}, ID: ${studentId}, parentEmail=${parentEmail}`);
    }

    if (createdStudents.length === 0) {
      return NextResponse.json(
        { message: "Registration failed", error: "No student accounts were created." },
        { status: 500 }
      );
    }

    if (emailReady) {
      try {
        await sendEmail({
          to: parentEmail,
          from: fromEmail,
          subject: `Registration Confirmed — Bridgitus Learning`,
          html: parentConfirmationEmail(
            `${registerData.parentFirstName} ${registerData.parentLastName}`,
            createdStudents
          ),
        });
        emailsSent++;
      } catch (mailErr) {
        emailsFailed++;
        console.error("Failed to send parent confirmation email:", mailErr);
      }

      try {
        await sendEmail({
          to: adminEmail,
          from: fromEmail,
          subject: `New Registration — ${registerData.parentFirstName} ${registerData.parentLastName} (${createdStudents.length} student${createdStudents.length > 1 ? "s" : ""})`,
          html: `<p>New registration from <strong>${registerData.parentFirstName} ${registerData.parentLastName}</strong> (${parentEmail}).</p>
                 <p>${createdStudents.length} student account${createdStudents.length > 1 ? "s" : ""} created${existingCount ? ` (parent already had ${existingCount})` : ""}.</p>
                 <ul>${createdStudents.map(s => `<li>${s.name} — ${s.studentId} — Grade ${s.grade} — password: ${s.password}</li>`).join("")}</ul>`,
        });
        emailsSent++;
      } catch (mailErr) {
        emailsFailed++;
        console.error("Failed to send admin registration notification:", mailErr);
      }
    }

    const emailed = emailsSent > 0 && emailsFailed === 0;

    return NextResponse.json(
      {
        message: "Registration successful",
        studentsCreated: createdStudents.length,
        existingSiblings: existingCount,
        emailsSent,
        emailsFailed,
        emailed,
        students: createdStudents.map((s) => ({
          name: s.name,
          studentId: s.studentId,
          email: s.email,
          grade: s.grade,
          password: s.password,
        })),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        message: "Registration failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
