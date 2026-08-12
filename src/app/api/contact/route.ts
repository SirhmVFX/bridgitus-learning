import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendEmail, isSesConfigured } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, message, phone } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Name, email and message are required." }, { status: 400 });
    }

    const formattedDate = new Date().toLocaleString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>New Contact Form Submission</title></head>
      <body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f8fafc;">
        <div style="max-width:600px;margin:0 auto;background:#fff;">
          <div style="background:#00369b;padding:25px 40px;color:white;">
            <h1 style="margin:0;font-size:22px;">New Contact Form Submission</h1>
            <p style="margin:5px 0 0;opacity:0.9;font-size:14px;">${formattedDate}</p>
          </div>
          <div style="padding:30px 40px;">
            <div style="margin-bottom:24px;background:#f0f7ff;padding:20px;border-left:4px solid #00369b;">
              <p style="margin:0;">${String(message).replace(/\n/g, "<br>")}</p>
            </div>
            <h2 style="color:#2c3e50;font-size:18px;margin:0 0 12px;">Contact Information</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            <div style="margin-top:28px;text-align:center;">
              <a href="mailto:${email}?subject=Re: Your Message to Bridgitus Learning"
                 style="display:inline-block;background:#00369b;color:#fff;text-decoration:none;padding:12px 25px;font-weight:600;">
                Reply to ${String(name).split(" ")[0]}
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>`;

    const textContent = `New Contact Form Submission

From: ${name} <${email}>
${phone ? `Phone: ${phone}\n` : ""}
Message:
${message}`;

    // Save to Firestore for admin panel
    await addDoc(collection(db, "contactMessages"), {
      name,
      email,
      message,
      phone: phone ?? null,
      read: false,
      createdAt: serverTimestamp(),
    });

    if (isSesConfigured()) {
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL || "admin@bridgitus.com",
          from: process.env.EMAIL_FROM || "noreply@bridgitus.com",
          subject: `New Contact Enquiry: ${name} - Bridgitus Learning`,
          text: textContent,
          html: htmlContent,
          replyTo: email,
        });
      } catch (mailErr) {
        console.error("SES contact email failed:", mailErr);
        // Still succeed — message is saved in Firestore
      }
    } else {
      console.warn("AWS SES not configured — contact message saved without email notification.");
    }

    return NextResponse.json(
      { message: "Your message has been received! We'll get back to you soon." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error handling contact form:", error);
    return NextResponse.json(
      {
        message: "Failed to send message. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
