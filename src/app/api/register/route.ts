import { NextResponse } from "next/server";
// import sgMail from "@sendgrid/mail";  // ← uncomment when email subscription is renewed
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");  // ← uncomment when email subscription is renewed

// ── Helpers ────────────────────────────────────────────────

async function generateStudentId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `BRG-${year}-`;
  const snap = await getDocs(
    query(
      collection(db, "students"),
      where("studentId", ">=", prefix),
      where("studentId", "<", `BRG-${year + 1}-`)
    )
  );
  const next = snap.size + 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
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
  startPreference: string; startDate: string; students: StudentData[];
}

// ── Email Templates ────────────────────────────────────────

function credentialsEmail(
  studentName: string, studentId: string, email: string,
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
      <p>Your registration is confirmed. Here are your login credentials:</p>
      <div style="background:#f0f7ff;border:2px solid #00369b;padding:24px;margin:24px 0;text-align:center;">
        <h2 style="color:#00369b;margin:0 0 16px;">Your Login Credentials</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 12px;font-weight:600;color:#475569;text-align:left;width:140px;">Student ID</td>
              <td style="padding:8px 12px;font-family:monospace;font-size:16px;font-weight:700;color:#00369b;">${studentId}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#475569;text-align:left;">Email</td>
              <td style="padding:8px 12px;font-family:monospace;font-size:14px;color:#2c3e50;">${email}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#475569;text-align:left;">Password</td>
              <td style="padding:8px 12px;font-family:monospace;font-size:16px;font-weight:700;color:#00369b;letter-spacing:0.1em;">${password}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#475569;text-align:left;">Grade</td>
              <td style="padding:8px 12px;">Grade ${grade}</td></tr>
        </table>
      </div>
      <div style="background:#fff3cd;border-left:4px solid #f59e0b;padding:12px 16px;margin:16px 0;">
        <p style="margin:0;font-size:14px;color:#92400e;">
          <strong>Important:</strong> Please change your password after your first login. Keep these credentials safe.
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
  students: Array<{ name: string; studentId: string; grade: string; email: string }>
): string {
  const rows = students.map(s => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${s.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-family:monospace;color:#00369b;font-weight:700;">${s.studentId}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${s.email}</td>
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
      <p>Your registration has been processed. Each student has received their credentials by email.</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;">
        <thead><tr style="background:#f8fafc;">
          <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;">Name</th>
          <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;">Student ID</th>
          <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;">Email</th>
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

    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://bridgitus.com/portal/login"; // eslint-disable-line @typescript-eslint/no-unused-vars
    const fromEmail = process.env.EMAIL_FROM || "noreply@bridgitus.com"; // eslint-disable-line @typescript-eslint/no-unused-vars
    const adminEmail = process.env.ADMIN_EMAIL || "admin@bridgitus.com"; // eslint-disable-line @typescript-eslint/no-unused-vars

    const createdStudents: Array<{
      name: string; studentId: string; email: string;
      grade: string; password: string; firebaseUid: string;
    }> = [];

    for (const student of registerData.students) {
      console.log(`Processing student: ${student.firstName} ${student.lastName}`);
      const studentIndex = registerData.students.indexOf(student);

      // Derive a unique email per student
      const studentEmail = registerData.students.length === 1
        ? registerData.parentEmail
        : `${registerData.parentEmail.split("@")[0]}+student${studentIndex + 1}@${registerData.parentEmail.split("@")[1]}`;

      const studentId = await generateStudentId();
      const password = generatePassword();

      // Create Firebase Auth account using the client SDK
      let firebaseUid: string;
      try {
        const cred = await createUserWithEmailAndPassword(auth, studentEmail, password);
        firebaseUid = cred.user.uid;
      } catch (authError: unknown) {
        const code = (authError as { code?: string }).code;
        if (code === "auth/email-already-in-use") {
          // Try to sign in to get the UID of the existing user
          try {
            const existing = await signInWithEmailAndPassword(auth, studentEmail, password);
            firebaseUid = existing.user.uid;
          } catch {
            console.warn(`Student email ${studentEmail} already exists and password doesn't match.`);
            continue;
          }
        } else {
          throw authError;
        }
      }

      // Save student record to Firestore using client SDK
      await addDoc(collection(db, "students"), {
        uid: firebaseUid,
        studentId,
        email: studentEmail,
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
        parentEmail: registerData.parentEmail,
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
        status: "active",
        paymentStatus: "pending",
        credentialsSent: true,
        enrolledAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Send credentials email to student
      // await sgMail.send({
      //   to: studentEmail,
      //   from: fromEmail,
      //   subject: `🎓 Your Bridgitus Learning Portal Credentials — ${student.firstName}`,
      //   html: credentialsEmail(
      //     `${student.firstName} ${student.lastName}`,
      //     studentId, studentEmail, password, student.grade, portalUrl
      //   ),
      // });

      // CC parent if different
      // if (studentEmail !== registerData.parentEmail) {
      //   await sgMail.send({
      //     to: registerData.parentEmail,
      //     from: fromEmail,
      //     subject: `🎓 Bridgitus Credentials for ${student.firstName} ${student.lastName}`,
      //     html: credentialsEmail(
      //       `${student.firstName} ${student.lastName}`,
      //       studentId, studentEmail, password, student.grade, portalUrl
      //     ),
      //   });
      // }

      createdStudents.push({
        name: `${student.firstName} ${student.lastName}`,
        studentId, email: studentEmail, grade: student.grade,
        password, firebaseUid,
      });
      console.log(`Created student: ${student.firstName} ${student.lastName}, ID: ${studentId}, Email: ${studentEmail}`);
    }

    console.log("All createdStudents:", JSON.stringify(createdStudents, null, 2));

    // Parent confirmation
    // if (createdStudents.length > 0) {
    //   await sgMail.send({
    //     to: registerData.parentEmail,
    //     from: fromEmail,
    //     subject: `✅ Registration Confirmed — Bridgitus Learning`,
    //     html: parentConfirmationEmail(
    //       `${registerData.parentFirstName} ${registerData.parentLastName}`,
    //       createdStudents
    //     ),
    //   });

    //   // Admin notification
    //   await sgMail.send({
    //     to: adminEmail,
    //     from: fromEmail,
    //     subject: `🎓 New Registration — ${registerData.parentFirstName} ${registerData.parentLastName} (${createdStudents.length} student${createdStudents.length > 1 ? "s" : ""})`,
    //     html: `<p>New registration from <strong>${registerData.parentFirstName} ${registerData.parentLastName}</strong> (${registerData.parentEmail}).</p>
    //            <p>${createdStudents.length} student account${createdStudents.length > 1 ? "s" : ""} created.</p>
    //            <ul>${createdStudents.map(s => `<li>${s.name} — ${s.studentId} — Grade ${s.grade}</li>`).join("")}</ul>`,
    //   });
    // }

    return NextResponse.json(
      {
        message: "Registration successful",
        studentsCreated: createdStudents.length,
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
